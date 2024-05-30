import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import GridMovies from '../components/gridMovies';
import MovieDesc from '../components/movieDesc';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';

const Home = () => {
    const user = useUser();
    const supabase = useSupabaseClient();
    const [movies, setMovies] = useState([]);
    const [shows, setShows] = useState([]);

    useEffect(() => {
        const fetchData = async() => {
            try {
                const {data: movieData, error: movieError} = await supabase
                    .from('movie')
                    .select('*')
                    .order('title', {ascending: true});
                if (movieError) throw(movieError);
                setMovies(movieData);

                const {data: showData, error: showError} = await supabase
                    .from('show')
                    .select('*')
                    .order('name', {ascending: true});
                if (showError) throw(showError);
                setShows(showData);

            } catch(error) {
                console.log(error);
            }
        }

        fetchData();
    },[]);

    return (
        <div>
            <Navbar />
            <GridMovies movies={movies} shows={shows} />
            {/* <MovieDesc/> */}
        </div>
    );
}

export default Home;