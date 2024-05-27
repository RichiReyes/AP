import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Button } from '../components/ui/button';
import ListPlatform from '../components/ListPlatform';
import EditPlatform from '../components/EditPlatform';

const AdmiPlatform = () => {
    
    const user = useUser();
    const supabase = useSupabaseClient();
    const navigate = useNavigate();
    const [person, setPerson] = useState(null);

    const [platforms, setPlatforms] = useState([]);

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

                    const { data, error } = await supabase.from('platform').select('id, name').order('name');
                    if (error) throw error;
                    setPlatforms(data);
                } catch (error) {
                    console.error('Error fetching data:', error.message);
                }
            }
        };

        fetchData();
    }, [user, supabase, cargar]);

    const handleEditClick = (id) => {
        setIdEditar(id);
        setEditar(true);
        setLista(false);
        setCargar('fui');
    };

    const volver = () =>{
        setEditar(false);
        setLista(true);
        setCargar('volvi');
    }
    
    const volverUpdate = () => {
        navigate('/adminMenu');
    }
    if (!person) {
        return <div>Loading...</div>;
    }

    if (!person.isadmin) {
        return <div>You do not have access to this page.</div>;
    }
    
    return (
        <div>
            <Navbar/>
            <Button onClick={volverUpdate} className='self-start m-5 mb-0'>Regresar</Button>
            {lista && <ListPlatform platforms={platforms} handleEditClick={handleEditClick}/>}
            {editar && <EditPlatform idEditar={idEditar} volver={volver}/>}
            
        </div>
    );
}

export default AdmiPlatform;
