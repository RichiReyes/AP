import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import GridMovies from '../components/gridMovies';
import MovieDesc from '../components/movieDesc';



const Home = () => {
    const [gridMovies, setGridMovie] = useState(false);
    
    function limpiarPantalla() {
        setGridMovie(false);
    }
    
    return (
        <div>
            <Navbar/>
            {/* <GridMovies limpiarPantalla={limpiarPantalla}/> */}
            <MovieDesc/>
        </div>

    );
}

export default Home;
