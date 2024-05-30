import React from 'react';
import { useNavigate } from 'react-router-dom';

const MovieInfo = ({ movie, tipo }) => {
    const CDNURL = "https://jheqfwbznxusdwclwccv.supabase.co/storage/v1/object/public/imgs/";

    const navigate = useNavigate();

    const descMovie = () => {
        navigate('/movieDesc', {state:{movie: movie, tipo: tipo}});
    }

    const imageUrl = (tipo === 'movie' ? `${CDNURL}movies/${movie.id}` : `${CDNURL}shows/${movie.id}`) + `?timestamp=${new Date().getTime()}`;

    if (tipo === 'movie') return (
        <div onClick={descMovie} className='MovieCard'>
            <img src={imageUrl} alt="No se encontro esta imagen" className='movie-image' />
            <h4>{movie.title} ({movie.releasedate})</h4>
        </div>
    );

    if (tipo === 'show') return (
        <div onClick={descMovie} className='MovieCard'>
            <img src={imageUrl} alt="No se encontro esta imagen" className='movie-image' />
            <h4>{movie.name} ({movie.releaseyear})</h4>
        </div>
    );
}

export default MovieInfo;
