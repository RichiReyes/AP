import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useNavigate } from 'react-router-dom';

const AdminMenu = () => {

    const navigate = useNavigate();
    const user = useUser();
    const supabase = useSupabaseClient();

    const [person, setPerson] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (user) {
                try {
                    const { data, error } = await supabase.rpc('get_person_by_user_id', { p_user_id: user.id });

                    if (error) {
                        throw error;
                    }

                    if (data && data.length > 0) {
                        setPerson(data[0]);
                    }
                } catch (error) {
                    console.error('Error calling stored procedure:', error.message);
                }
            }
        };

        fetchData();
    }, [user, supabase]);

    if (!person) {
        return <div ><h2 className='text-white text-3xl'>Loading...</h2></div>;
    }

    if (!person.isadmin) {
        return <div>You do not have access to this page.</div>;
    }

    function goAddStaff(){
        navigate('/addStaff');
    }
    function goAddCategory(){
        navigate('/addCategory');
    }
    function goAddNationality(){
        navigate('/addNationality');
    }
    function goAddPlatform(){
        navigate('/addPlatform');
    }
    function goAddMovie(){
        navigate('/addMovie');
    }
    function goAddShow(){
        navigate('/addShow');
    }
    function goAdmiCategory(){
        navigate('/admiCategory');
    }
    function goAdmiNationality(){
        navigate('/admiNationality');
    }
    function goAdmiPlatform(){
        navigate('/admiPlatform');
    }
    function goAdmiMovie(){
        navigate('/admiMovie');
    }
    function goAdmiShow(){
        navigate('/admiShow');
    }
    function goAdmiActorsDirectors(){
        navigate('/admiActorsDirectors');
    }
    function goAddAdmin(){
        navigate('/addAdmin');
    }
    function goAdmiAdmin(){
        navigate('/admiAdmin');
    }
    function goTopItems(){
        navigate('/topVentas');
    }
    function goStatsProductos(){
        navigate('/statsProductos');
    }
    function goStatsUsuarios(){
        navigate('/statsUsuarios');
    }

    return (
        <div>
            <Navbar />
            <div className='grid grid-cols-3 grid-flow-row py-8 px-10 items-center'>
                <div onClick={goAddMovie} className='place-self-center bg-neutral-700 w-4/6 rounded-md p-8 h-4/6 flex items-center justify-center hover:shadow-[0_0_10px] hover:shadow-white cursor-pointer text-white text-xl'>
                    Agregar Película
                </div>
                <div onClick={goAddShow} className='place-self-center bg-neutral-700 w-4/6 rounded-md p-8 h-4/6 flex items-center justify-center hover:shadow-[0_0_10px] hover:shadow-white cursor-pointer text-white text-xl'>
                    Agregar Serie
                </div>
                <div onClick={goAddStaff} className='place-self-center bg-neutral-700 w-4/6 rounded-md p-8 h-4/6 flex items-center justify-center hover:shadow-[0_0_10px] hover:shadow-white cursor-pointer text-white text-xl'>
                    Agregar Actor/Director
                </div>
                <div onClick={goAddAdmin} className='place-self-center bg-neutral-700 w-4/6 rounded-md p-8 h-4/6 flex items-center justify-center hover:shadow-[0_0_10px] hover:shadow-white cursor-pointer text-white text-xl'>
                    Agregar Administrador
                </div>
                <div onClick={goAddCategory} className='place-self-center bg-neutral-700 w-4/6 rounded-md p-8 h-4/6 flex items-center justify-center hover:shadow-[0_0_10px] hover:shadow-white cursor-pointer text-white text-xl'>
                    Agregar Categoría
                </div>
                <div onClick={goAddNationality} className='place-self-center bg-neutral-700 w-4/6 rounded-md p-8 h-4/6 flex items-center justify-center hover:shadow-[0_0_10px] hover:shadow-white cursor-pointer text-white text-xl'>
                    Agregar Nacionalidad
                </div>
                <div onClick={goAddPlatform} className='place-self-center bg-neutral-700 w-4/6 rounded-md p-8 h-4/6 flex items-center justify-center hover:shadow-[0_0_10px] hover:shadow-white cursor-pointer text-white text-xl'>
                    Agregar Plataforma
                </div>
                <div onClick={goAdmiMovie} className='place-self-center bg-neutral-700 w-4/6 rounded-md p-8 h-4/6 flex items-center justify-center hover:shadow-[0_0_10px] hover:shadow-white cursor-pointer text-white text-xl'>
                    Administrar Películas
                </div>
                <div onClick={goAdmiShow} className='place-self-center bg-neutral-700 w-4/6 rounded-md p-8 h-4/6 flex items-center justify-center hover:shadow-[0_0_10px] hover:shadow-white cursor-pointer text-white text-xl'>
                    Administrar Series
                </div>
                <div onClick={goAdmiActorsDirectors} className='place-self-center bg-neutral-700 w-4/6 rounded-md p-8 h-4/6 flex items-center justify-center hover:shadow-[0_0_10px] hover:shadow-white cursor-pointer text-white text-xl'>
                    Administrar Actores/Directores
                </div>
                <div onClick={goAdmiCategory} className='place-self-center bg-neutral-700 w-4/6 rounded-md p-8 h-4/6 flex items-center justify-center hover:shadow-[0_0_10px] hover:shadow-white cursor-pointer text-white text-xl'>
                    Administrar Categorías
                </div>
                <div onClick={goAdmiAdmin} className='place-self-center bg-neutral-700 w-4/6 rounded-md p-8 h-4/6 flex items-center justify-center hover:shadow-[0_0_10px] hover:shadow-white cursor-pointer text-white text-xl'>
                    Administrar Usuarios Administradores
                </div>
                <div onClick={goAdmiNationality} className='place-self-center bg-neutral-700 w-4/6 rounded-md p-8 h-4/6 flex items-center justify-center hover:shadow-[0_0_10px] hover:shadow-white cursor-pointer text-white text-xl'>
                    Administrar Nacionalidades
                </div>
                <div onClick={goAdmiPlatform} className='place-self-center bg-neutral-700 w-4/6 rounded-md p-8 h-4/6 flex items-center justify-center hover:shadow-[0_0_10px] hover:shadow-white cursor-pointer text-white text-xl'>
                    Administrar Plataformas
                </div>
                <div onClick={goTopItems} className='place-self-center bg-neutral-700 w-4/6 rounded-md p-8 h-4/6 flex items-center justify-center hover:shadow-[0_0_10px] hover:shadow-white cursor-pointer text-white text-xl'>
                    Productos más vendidos
                </div>
                <div onClick={goStatsProductos} className='place-self-center bg-neutral-700 w-4/6 rounded-md p-8 h-4/6 flex items-center justify-center hover:shadow-[0_0_10px] hover:shadow-white cursor-pointer text-white text-xl'>
                    Estadísticas de productos
                </div>
                <div onClick={goStatsUsuarios} className='place-self-center bg-neutral-700 w-4/6 rounded-md p-8 h-4/6 flex items-center justify-center hover:shadow-[0_0_10px] hover:shadow-white cursor-pointer text-white text-xl'>
                    Estadísticas de usuarios
                </div>
                <div className='place-self-center bg-neutral-700 w-4/6 rounded-md p-8 h-4/6 flex items-center justify-center hover:shadow-[0_0_10px] hover:shadow-white cursor-pointer text-white text-xl'>
                    Bitácora de precios
                </div>
            </div>
        </div>
    );
}

export default AdminMenu;
