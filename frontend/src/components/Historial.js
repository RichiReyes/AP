import React from 'react';
import { Button } from './ui/button';

const Historial = ({limpiarPantalla, setCarrito}) => {

    function handleVolver(){
        limpiarPantalla();
        setCarrito(true);
    }

    return (
        <div className='carrito-main'>
            <div className='flex p-4'>
            <Button onClick={handleVolver} variant="agregarFav">Volver</Button>
            </div>
            <div className="carrito-content">
                <h2 className='text-white text-2xl mt-8'>Historial de Compras</h2>
            </div>
            <div className="carrito-footer">
                <div className="footer-left">
                    
                </div>
            </div>
        </div>
    );
}

export default Historial;
