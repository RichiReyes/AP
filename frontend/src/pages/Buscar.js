import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Button } from '../components/ui/button';
import GridMovies from '../components/gridMovies';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

const Buscar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState({ movies: [], shows: [] });
    const supabase = useSupabaseClient();

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearch = async () => {
        if (!searchQuery) return;

        try {
            const { data: movieData, error: movieError } = await supabase
                .from('movie')
                .select('*')
                .ilike('title', `%${searchQuery}%`);
            if (movieError) throw movieError;

            const { data: showData, error: showError } = await supabase
                .from('show')
                .select('*')
                .ilike('name', `%${searchQuery}%`);
            if (showError) throw showError;

            setSearchResults({ movies: movieData, shows: showData });
        } catch (error) {
            console.log('Error fetching search results:', error);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="buscar-container">
                <div className="flex w-full items-center space-x-2 p-9 h-full">
                    <input
                        className="input-buscar"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Buscar series o peliculas"
                    />
                    <Button onClick={handleSearch}>Buscar</Button>
                </div>
            </div>
            <GridMovies movies={searchResults.movies} shows={searchResults.shows} />
        </div>
    );
};

export default Buscar;
