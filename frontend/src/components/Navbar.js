import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {

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

    return (
        <header className='headerNav'>
            <div className="headText">
                <h2>IMDb</h2>
            </div>
            <div className="botonesNav">
            <button onClick={handleHome} className='left-buttons'>Home</button> <button onClick={handleBuscar}className='left-buttons'>Buscar</button> <button className='left-buttons'>Vistos Recientemente</button>
            <button onClick={handleCarrito}className='right-buttons'>Carrito</button>
            </div>
        </header>
    );
}

export default Navbar;
