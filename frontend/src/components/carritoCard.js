import React from 'react';
import { Button } from './ui/button';

const CarritoCard = () => {
    return (
        <div className='carrito-card'>
            <div className="carrito-card-info">
                <h2 className='text-white text-2xl'>Titulo</h2>
                <h3 className='text-white text-sm'>Duracion</h3>
            </div>
            <div className="carrito-card-right">
                <h2 className='text-white mb-3'>Precio</h2>
                <Button variant="agregarFav" size="elimCar" >Eliminar del Carrito</Button>
            </div>
        </div>
    );
}

export default CarritoCard;
