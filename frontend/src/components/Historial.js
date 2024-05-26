import React from 'react';
import { Button } from './ui/button';
import CarritoCard from './carritoCard';

const Historial = ({limpiarPantalla, setCarrito}) => {

    function handleVolver(){
        limpiarPantalla();
        setCarrito(true);
    }

    return (
        <div className='carrito-main'>
            <div className='flex p-4'>
            <Button onClick={handleVolver}>Volver</Button>
            </div>
            <div className="carrito-content">
                <h2 className='text-white text-2xl mt-8'>Historial de Compras</h2>
                <CarritoCard tipo={'historial'}/>
            </div>
        </div>
    );
}

export default Historial;
