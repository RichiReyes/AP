import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ListShow from '../components/ListShow';
import EditShow from '../components/EditShow';

const AdmiShow = () => {
    
    const user = useUser();
    const supabase = useSupabaseClient();
    const navigate = useNavigate();
    const [person, setPerson] = useState(null);

    const [shows, setShows] = useState([]);

    const [lista, setLista] = useState(true);
    const [editar, setEditar] = useState(false);
    const [idEditar, setIdEditar] = useState('');
    const [cargar,setCargar] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            if (user) {
                try {
                    const { data: personData, error: personError } = await supabase.rpc('get_person_by_user_id', { p_user_id: user.id });
                    if (personError) throw personError;
                    if (personData && personData.length > 0) setPerson(personData[0]);

                    const {data: showData, error: showError} = await supabase
                    .from('show')
                    .select('id, name, releaseyear')
                    .order('name', {ascending: true});
                    if(showError) throw(showError);
                    setShows(showData);


                    setCargar('');
                    
                } catch (error) {
                    console.error('Error fetching data:', error.message);
                }
            }
        };

        fetchData();
    }, [user, supabase, cargar]);


    const clickEdit = (id) => {
        setEditar(true);
        setLista(false);
        setIdEditar(id);
    }
    const volver = () => {
        setEditar(false);
        setLista(true);
        setCargar('carga');
    }
    const regresarMenu = () => {
        navigate('/adminMenu');
    }

    
    if (!person) return <div>Loading...</div>;
    if (!person.isadmin) return <div>You do not have access to this page.</div>;
    return (
        <div>
            <Navbar/>
            {lista && <ListShow shows={shows} clickEdit={clickEdit} regresarMenu={regresarMenu}/>}
            {editar && <EditShow id={idEditar} volver={volver}/>}
        </div>
    );
}

export default AdmiShow;
