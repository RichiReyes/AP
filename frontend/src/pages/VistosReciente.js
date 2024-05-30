import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import CarritoCard from '../components/carritoCard';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useNavigate } from 'react-router-dom';

const VistosReciente = () => {
    const user = useUser();
    const supabase = useSupabaseClient();
    const navigate = useNavigate();

    const [recentlyWatched, setRecentlyWatched] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (user) {
                try {
                    const { data: movieData, error: movieError } = await supabase
                        .from('userxrecentlywatchmovie')
                        .select('idmovie, created_at')
                        .eq('iduser', user.id);
                    if (movieError) throw movieError;

                    const movieIds = movieData.map(item => item.idmovie);
                    const { data: movies, error: moviesError } = await supabase
                        .from('movie')
                        .select('id, title, releasedate')
                        .in('id', movieIds);
                    if (moviesError) throw moviesError;

                    const { data: showData, error: showError } = await supabase
                        .from('userxrecentlywatchshow')
                        .select('idshow, created_at')
                        .eq('iduser', user.id);
                    if (showError) throw showError;

                    const showIds = showData.map(item => item.idshow);
                    const { data: shows, error: showsError } = await supabase
                        .from('show')
                        .select('id, name, releaseyear')
                        .in('id', showIds);
                    if (showsError) throw showsError;

                    const combinedData = [
                        ...movieData.map(item => ({
                            ...item,
                            title: movies.find(m => m.id === item.idmovie)?.title,
                            year: movies.find(m => m.id === item.idmovie)?.releasedate,
                            tipo: 'movie'
                        })),
                        ...showData.map(item => ({
                            ...item,
                            title: shows.find(s => s.id === item.idshow)?.name,
                            year: shows.find(s => s.id === item.idshow)?.releaseyear,
                            tipo: 'show'
                        }))
                    ];

                    combinedData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                    setRecentlyWatched(combinedData);
                } catch (error) {
                    console.error(error);
                }
            } else {
                navigate('/login');
            }
        };

        fetchData();
    }, [user, supabase, navigate]);

    return (
        <div>
            <Navbar />
            <div className='flex flex-col items-center'>
                <h2 className='text-3xl text-white mt-7'>Vistos Recientemente</h2>
                <div className='flex-grow w-11/12 mt-5 flex-col space-y-4'>
                    {recentlyWatched.map(item => (
                        <CarritoCard key={item.id} tipo={'recientes'} title={item.title} year={item.year} watchedAt={item.created_at} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default VistosReciente;
