import React from 'react';
import Navbar from '../components/Navbar';

import { Button } from '../components/ui/button';
import GridMovies from '../components/gridMovies';

const Buscar = () => {

    function limpiarPantalla() {
        
    }

    return (
        <div>
            <Navbar/>
            <div className="buscar-container">
                <div className="flex w-full items-center space-x-2 p-9 h-full">
                    <input className='input-buscar'></input>
                    <Button>Buscar</Button>
                </div>
            </div>
            <GridMovies limpiarPantalla={limpiarPantalla}/>

        </div>
    );
}

export default Buscar;
