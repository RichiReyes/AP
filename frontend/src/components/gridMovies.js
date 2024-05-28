import React from 'react';
import MovieInfo from './movieInfo';

const GridMovies = ({ movies, shows }) => {
    return (
        <div className="outer-gridMovie">
            <div className='gridMovies'>
                {movies.map((movie) => (
                    <MovieInfo key={movie.id} movie={movie} tipo={'movie'} />
                ))}
                {shows.map((show) => (
                    <MovieInfo key={show.id} movie={show} tipo={'show'} />
                ))}
            </div>
        </div>
    );
}

export default GridMovies;
