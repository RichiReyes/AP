import React from 'react';
import Navbar from '../components/Navbar';
import CarritoCard from '../components/carritoCard';

const VistosReciente = () => {
    return (
        <div>
            <Navbar/>
            <div className='flex flex-col items-center'>
                <h2 className='text-3xl text-white mt-7'>Vistos Recientemente</h2>
                <div className='flex-grow w-11/12 mt-5 flex-col space-y-4'>
                    <CarritoCard tipo={'recientes'}/>
                </div>
            </div>
        </div>
    );
}

export default VistosReciente;
