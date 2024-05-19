import React from 'react';
import MovieInfo from './movieInfo';

const GridMovies = ({limpiarPantalla}) => {
    return (
        <div class="outer-gridMovie">
            <div className='gridMovies'>
            <MovieInfo/>
            <MovieInfo/>
            <MovieInfo/>
            </div>
        </div>
        
    );
}

export default GridMovies;
