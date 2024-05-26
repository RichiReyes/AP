import React from 'react';
import Navbar from '../components/Navbar';

const AdminMenu = () => {
    return (
        <div>
            <Navbar/>
            <div className='grid grid-cols-3 grid-flow-row py-8 px-10 items-center'>
                <div className='place-self-center bg-neutral-700 w-4/6 rounded-md p-8 h-4/6 flex items-center justify-center hover:shadow-[0_0_10px] hover:shadow-white cursor-pointer text-white text-xl'>
                    Agregar Película
                </div>
                <div className='place-self-center bg-neutral-700 w-4/6 rounded-md p-8 h-4/6 flex items-center justify-center hover:shadow-[0_0_10px] hover:shadow-white cursor-pointer text-white text-xl'>
                    Agregar Serie
                </div>
                <div className='place-self-center bg-neutral-700 w-4/6 rounded-md p-8 h-4/6 flex items-center justify-center hover:shadow-[0_0_10px] hover:shadow-white cursor-pointer text-white text-xl'>
                    Agregar Actor/Director
                </div>
                <div className='place-self-center bg-neutral-700 w-4/6 rounded-md p-8 h-4/6 flex items-center justify-center hover:shadow-[0_0_10px] hover:shadow-white cursor-pointer text-white text-xl'>
                    Agregar Administrador
                </div>
                <div className='place-self-center bg-neutral-700 w-4/6 rounded-md p-8 h-4/6 flex items-center justify-center hover:shadow-[0_0_10px] hover:shadow-white cursor-pointer text-white text-xl'>
                    Agregar Categoría
                </div>
                <div className='place-self-center bg-neutral-700 w-4/6 rounded-md p-8 h-4/6 flex items-center justify-center hover:shadow-[0_0_10px] hover:shadow-white cursor-pointer text-white text-xl'>
                    Agregar Nacionalidad
                </div>
                <div className='place-self-center bg-neutral-700 w-4/6 rounded-md p-8 h-4/6 flex items-center justify-center hover:shadow-[0_0_10px] hover:shadow-white cursor-pointer text-white text-xl'>
                    Administrar Películas
                </div>
                <div className='place-self-center bg-neutral-700 w-4/6 rounded-md p-8 h-4/6 flex items-center justify-center hover:shadow-[0_0_10px] hover:shadow-white cursor-pointer text-white text-xl'>
                    Administrar Series
                </div>
                <div className='place-self-center bg-neutral-700 w-4/6 rounded-md p-8 h-4/6 flex items-center justify-center hover:shadow-[0_0_10px] hover:shadow-white cursor-pointer text-white text-xl'>
                    Administrar Categorías
                </div>
                <div className='place-self-center bg-neutral-700 w-4/6 rounded-md p-8 h-4/6 flex items-center justify-center hover:shadow-[0_0_10px] hover:shadow-white cursor-pointer text-white text-xl'>
                    Administrar Usuarios Administradores
                </div>
                <div className='place-self-center bg-neutral-700 w-4/6 rounded-md p-8 h-4/6 flex items-center justify-center hover:shadow-[0_0_10px] hover:shadow-white cursor-pointer text-white text-xl'>
                    Administrar Nacionalidades
                </div>
                <div className='place-self-center bg-neutral-700 w-4/6 rounded-md p-8 h-4/6 flex items-center justify-center hover:shadow-[0_0_10px] hover:shadow-white cursor-pointer text-white text-xl'>
                    Productos más vendidos
                </div>
                <div className='place-self-center bg-neutral-700 w-4/6 rounded-md p-8 h-4/6 flex items-center justify-center hover:shadow-[0_0_10px] hover:shadow-white cursor-pointer text-white text-xl'>
                    Estadísticas de productos
                </div>
                <div className='place-self-center bg-neutral-700 w-4/6 rounded-md p-8 h-4/6 flex items-center justify-center hover:shadow-[0_0_10px] hover:shadow-white cursor-pointer text-white text-xl'>
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
