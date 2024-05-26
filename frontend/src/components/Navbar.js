import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useUser } from '@supabase/auth-helpers-react';

const Navbar = () => {

    const user = useUser();

    const navigate = useNavigate();

    function handleHome() {
        navigate('/');
    }
    function handleBuscar() {
        navigate('/buscar');
    }
    function handleCarrito() {
        navigate('/carrito');
    }
    function handleRecientes(){
        navigate('/recientes');
    }
    function handlePerfil(){

        if(user === null){
            navigate('/login');
        } else {
            navigate('/perfil');
        }
    }

    return (
        <header className='headerNav'>
            <div className="headText">
                <h2>IMDb</h2>
            </div>
            <div className="botonesNav">
            <button onClick={handleHome} className='left-buttons'>Home</button> <button onClick={handleBuscar}className='left-buttons'>Buscar</button> <button onClick={handleRecientes} className='left-buttons'>Vistos Recientemente</button>
            <div className='flex ml-auto space-x-4'>
                <button onClick={handleCarrito}className='right-buttons'>Carrito</button>
                <Avatar onClick={handlePerfil}>
                    <AvatarImage src="" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </div>
            
            </div>
        </header>
    );
}

export default Navbar;
