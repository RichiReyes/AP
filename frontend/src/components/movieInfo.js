import React from 'react';

const MovieInfo = ({ movie, tipo }) => {
    const CDNURL = "https://jheqfwbznxusdwclwccv.supabase.co/storage/v1/object/public/imgs/";
    console.log(CDNURL + 'movies/' + movie.id)

    if (tipo === 'movie') return (
        <div className='MovieCard'>
            <img src={CDNURL + 'movies/' + movie.id} alt="No se encontro esta imagen" className='movie-image' />
            <h4>{movie.title}</h4>
        </div>
    );

    if (tipo === 'show') return (
        <div className='MovieCard'>
            <img src={CDNURL + 'shows/' + movie.id} alt="No se encontro esta imagen" className='movie-image' />
            <h4>{movie.name}</h4>
        </div>
    );
}

export default MovieInfo;