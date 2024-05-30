import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

const FavoriteCard = ({ item, onDelete }) => {
    const [movie, setMovie] = useState(null);
    const navigate = useNavigate();
    const supabase = useSupabaseClient();

    useEffect(() => {
        const fetchMovie = async () => {
            if (item.tipo === 'favorite_movie') {
                const { data, error } = await supabase
                    .from('movie')
                    .select('*')
                    .eq('id', item.idmovie);
                if (data) {
                    setMovie(data[0]);
                }
                if (error) {
                    console.error(error);
                }
            } else {
                const { data, error } = await supabase
                    .from('show')
                    .select('*')
                    .eq('id', item.idshow);
                if (data) {
                    setMovie(data[0]);
                }
                if (error) {
                    console.error(error);
                }
            }
        };
        fetchMovie();
    }, [item, supabase]);

    const handleCardClick = () => {
        navigate('/moviedesc', { state: { movie: movie, tipo: item.tipo === 'favorite_movie' ? 'movie' : 'show' } });
    };

    if (!movie) {
        return <div>Loading...</div>;
    }

    return (
        <div className='favorite-card flex justify-between items-center bg-gray-800 p-4 rounded-lg shadow-md'>
            <div className="favorite-card-info cursor-pointer" onClick={handleCardClick}>
                <h2 className='text-white text-2xl'>{movie.title || movie.name || 'Unknown Title'}</h2>
                <h3 className='text-white text-sm'>{item.tipo === 'favorite_movie'? movie.releasedate : movie.releaseyear}</h3>
            </div>
            <div className="favorite-card-actions">
                <Button onClick={() => onDelete(item.id)}>Eliminar de Favoritos</Button>
            </div>
        </div>
    );
};

export default FavoriteCard;
