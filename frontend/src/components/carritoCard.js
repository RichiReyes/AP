import React from 'react';
import { Button } from './ui/button';

const CarritoCard = ({tipo}) => {






    if (tipo === 'carrito'){
        return (
            <div className='carrito-card'>
                <div className="carrito-card-info">
                    <h2 className='text-white text-2xl'>Titulo</h2>
                    <h3 className='text-white text-sm'>Duracion</h3>
                </div>
                <div className="carrito-card-right">
                    <h2 className='text-white mb-3'>Precio</h2>
                    <div className='pb-2'>
                        <Button >Eliminar del Carrito</Button>
                    </div>
                    
                </div>
            </div>
        );
    } else if(tipo === 'recientes'){
        return(
            <div className='carrito-card'>
                <div className="carrito-card-info">
                    <h2 className='text-white text-2xl'>Titulo</h2>
                    <h3 className='text-white text-sm'>Duracion</h3>
                </div>
                <div className="carrito-card-right">
                    
                    
                </div>
            </div>
        );
    } else if (tipo === 'historial'){
        return(
            <div className='carrito-card'>
                <div className="carrito-card-info">
                    <h2 className='text-white text-2xl'>Titulo</h2>
                    <h3 className='text-white text-sm'>Duracion</h3>
                </div>
                <div className="carrito-card-right">
                    <h2 className='text-white text-lg mb-3'>fecha compra</h2>
                    <h2 className='text-white text-lg mb-3'>precio</h2>
                    
                </div>
            </div>
        );
    }
}

export default CarritoCard;
