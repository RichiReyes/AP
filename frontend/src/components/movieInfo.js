import React from 'react';

const MovieInfo = () => {
    return (
        <div className='MovieCard'>
            <img src={require("./imgs/interestelar.jpg")} alt="No se encontro esta imagen" className='movie-image' />
            <h4>Interestellar</h4>
        </div>
    );
}

export default MovieInfo;
