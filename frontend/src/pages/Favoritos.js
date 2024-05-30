import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import FavoriteCard from '../components/FavoriteCard';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useNavigate } from 'react-router-dom';

const Favoritos = () => {
    const user = useUser();
    const supabase = useSupabaseClient();
    const navigate = useNavigate();

    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        if (user) {
            const fetchFavorites = async () => {
                try {
                    const { data: movieData, error: movieError } = await supabase
                        .from('userxfavoritemovie')
                        .select('idmovie, created_at')
                        .eq('iduser', user.id);
                    if (movieError) throw movieError;

                    const { data: showData, error: showError } = await supabase
                        .from('userxfavoriteshows')
                        .select('idshow, created_at')
                        .eq('iduser', user.id);
                    if (showError) throw showError;

                    const moviesWithDetails = movieData.map(favorite => ({ ...favorite, tipo: 'favorite_movie' }));
                    const showsWithDetails = showData.map(favorite => ({ ...favorite, tipo: 'favorite_show' }));

                    const mergedFavorites = [...moviesWithDetails, ...showsWithDetails];
                    setFavorites(mergedFavorites);
                } catch (error) {
                    console.error('Error fetching favorites:', error);
                }
            };

            fetchFavorites();
        } else {
            navigate('/login');
        }
    }, [user, supabase, navigate]);

    const handleDeleteFavorite = async (id, tipo) => {
        try {
            if (tipo === 'favorite_movie') {
                await supabase
                    .from('userxfavoritemovie')
                    .delete()
                    .eq('iduser', user.id)
                    .eq('idmovie', id);
            } else {
                await supabase
                    .from('userxfavoriteshows')
                    .delete()
                    .eq('iduser', user.id)
                    .eq('idshow', id);
            }
            setFavorites(favorites.filter(favorite => favorite.id !== id));
        } catch (error) {
            console.error('Error deleting favorite:', error);
        }
    };

    return (
        <div>
            <Navbar />
            <div className='flex flex-col items-center'>
                <h2 className='text-3xl text-white mt-7'>Favoritos</h2>
                <div className='flex-grow w-11/12 mt-5 flex-col space-y-4'>
                    {favorites.map((favorite) => (
                        <FavoriteCard
                            key={favorite.id}
                            item={favorite}
                            onDelete={(id) => handleDeleteFavorite(id, favorite.tipo)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Favoritos;
