import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useNavigate } from 'react-router-dom';
import ListCategory from '../components/ListCategory';
import EditCategory from '../components/EditCategory';
import { Button } from '../components/ui/button';

const AdmiCategory = () => {
    const user = useUser();
    const supabase = useSupabaseClient();
    const navigate = useNavigate();
    const [person, setPerson] = useState(null);

    const [categories, setCategories] = useState([]);

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

                    const { data: categoryData, error: categoryError } = await supabase.from('category').select('id, nombre').order('nombre');
                    if (categoryError) throw categoryError;
                    setCategories(categoryData);
                } catch (error) {
                    console.error('Error fetching data:', error.message);
                }
            }
        };

        fetchData();
    }, [user, supabase, cargar]);

    if (!person) return <div>Loading...</div>;
    if (!person.isadmin) return <div>You do not have access to this page.</div>;

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

    

    return (
        <div>
            <Navbar />
            {lista && <ListCategory categories={categories} onEditClick={handleEditClick} />}
            {editar && <EditCategory idEditar={idEditar} volver={volver} />}
            <Button onClick={volverUpdate} className='self-start m-10'>Regresar</Button>
        </div>
    );
}

export default AdmiCategory;