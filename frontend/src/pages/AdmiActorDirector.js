import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import React, { act, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ListActorDirector from '../components/ListActorDirector';
import EditActorDirector from '../components/EditActorDirector';

const AdmiActorDirector = () => {

    const user = useUser();
    const supabase = useSupabaseClient();
    const navigate = useNavigate();
    const [person, setPerson] = useState(null);

    const [lista, setLista] = useState(true);
    const [editar, setEditar] = useState(false);
    const [idEditar, setIdEditar] = useState('');
    const [cargar,setCargar] = useState('');

    const[actors, setActors] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            if (user) {
                try {
                    const { data: personData, error: personError } = await supabase.rpc('get_person_by_user_id', { p_user_id: user.id });
                    if (personError) throw personError;
                    if (personData && personData.length > 0) setPerson(personData[0]);

                    const { data: actorsData, error: actorsError } = await supabase.rpc('get_directors');
                    if (actorsError) throw actorsError;
                    setActors(actorsData);

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
            {lista && <ListActorDirector actors={actors} clickEdit={clickEdit} regresarMenu={regresarMenu}/>}
            {editar && <EditActorDirector id={idEditar} volver={volver}/>}
        </div>
    );
}

export default AdmiActorDirector;
