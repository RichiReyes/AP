import React from 'react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

const ShoppingCartCard = ({ item, tipo, onDelete }) => {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate('/movieDesc', { state: { movie: item, tipo } });
    };

    return (
        <div className='bg-gray-800 p-4 rounded-lg flex justify-between items-center mb-4'>
            <div className="cursor-pointer" onClick={handleNavigate}>
                <h2 className='text-white text-2xl'>{item.title || item.name}</h2>
                <h3 className='text-gray-400 text-sm'>{item.releasedate || item.releaseyear}</h3>
            </div>
            <div className="flex items-center">
                <Button className='bg-red-500 text-white' onClick={() => onDelete(item.id, tipo)}>Eliminar</Button>
            </div>
        </div>
    );
};

export default ShoppingCartCard;
