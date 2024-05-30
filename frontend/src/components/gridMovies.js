import React from 'react';
import MovieInfo from './movieInfo';

// Function to shuffle an array
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const GridMovies = ({ movies, shows }) => {

    const mergedList = shuffleArray([
        ...movies.filter(movie => movie.active).map(movie => ({ ...movie, tipo: 'movie' })),
        ...shows.filter(show => show.active).map(show => ({ ...show, tipo: 'show' }))
    ]);

    return (
        <div className="outer-gridMovie">
            <div className='gridMovies'>
                {mergedList.map((item) => (
                    <MovieInfo key={item.id} movie={item} tipo={item.tipo} />
                ))}
            </div>
        </div>
    );
}

export default GridMovies;
