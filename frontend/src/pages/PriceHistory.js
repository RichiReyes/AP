import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

const PriceHistory = () => {
    const [moviePriceHistory, setMoviePriceHistory] = useState([]);
    const [showPriceHistory, setShowPriceHistory] = useState([]);
    const supabase = useSupabaseClient();

    const fetchPriceHistory = async () => {
        try {
            // Fetch movie price history
            const { data: movieHistory, error: movieError } = await supabase
                .from('pricemovie')
                .select('idmovie, oldprice, newprice, dateOfUpdate')
                .order('dateOfUpdate', { ascending: true });
            if (movieError) throw movieError;

            // Fetch show price history
            const { data: showHistory, error: showError } = await supabase
                .from('pricetvshow')
                .select('idtvshow, oldprice, newprice, dateOfUpdate')
                .order('dateOfUpdate', { ascending: true });
            if (showError) throw showError;

            // Fetch movie titles
            const movieIds = movieHistory.map(item => item.idmovie);
            const { data: movies, error: moviesError } = await supabase
                .from('movie')
                .select('id, title')
                .in('id', movieIds);
            if (moviesError) throw moviesError;

            // Fetch show titles
            const showIds = showHistory.map(item => item.idtvshow);
            const { data: shows, error: showsError } = await supabase
                .from('show')
                .select('id, name')
                .in('id', showIds);
            if (showsError) throw showsError;

            // Map movie titles to price history
            const movieHistoryWithTitles = movieHistory.map(item => {
                const movie = movies.find(m => m.id === item.idmovie);
                return { ...item, title: movie?.title };
            });

            // Map show titles to price history
            const showHistoryWithTitles = showHistory.map(item => {
                const show = shows.find(s => s.id === item.idtvshow);
                return { ...item, name: show?.name };
            });

            setMoviePriceHistory(movieHistoryWithTitles);
            setShowPriceHistory(showHistoryWithTitles);
        } catch (error) {
            console.log('Error fetching price history:', error);
        }
    };

    useEffect(() => {
        fetchPriceHistory();
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Navbar />
            <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h2 className="text-3xl mt-8">Movie Price History</h2>
                    <div className="mt-6">
                        {moviePriceHistory.map((item, index) => (
                            <div key={index} className="p-4 bg-gray-800 rounded-lg mb-4">
                                <h3 className="text-lg">{item.title}</h3>
                                <p>Old Price: ${item.oldprice.toFixed(2)}</p>
                                <p>New Price: ${item.newprice.toFixed(2)}</p>
                                <p>Date of Update: {new Date(item.dateOfUpdate).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h2 className="text-3xl mt-8">Show Price History</h2>
                    <div className="mt-6">
                        {showPriceHistory.map((item, index) => (
                            <div key={index} className="p-4 bg-gray-800 rounded-lg mb-4">
                                <h3 className="text-lg">{item.name}</h3>
                                <p>Old Price: ${item.oldprice.toFixed(2)}</p>
                                <p>New Price: ${item.newprice.toFixed(2)}</p>
                                <p>Date of Update: {new Date(item.dateOfUpdate).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PriceHistory;
