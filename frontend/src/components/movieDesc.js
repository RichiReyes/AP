import React from 'react';
import { Button } from './ui/button';

const MovieDesc = () => {
    return (
        <div className="outer-movieDesc">
            <div className='movieDesc-container'>
                <div className="left-desc">
                    <ul className="left-list">
                        <li>
                            <h2>Titulo de peli</h2>
                            <h3>duracion</h3>
                        </li>
                    </ul>
                </div>
                <div className="right-desc">
                    <img src={require("./imgs/interestelar.jpg")} alt="No se encontro esta imagen" className='image-desc' />
                    <Button variant="agregarFav" size="agregarFav">Agregar a Favoritos</Button>
                </div>
            </div>    
        </div>
        
    );
}

export default MovieDesc;
