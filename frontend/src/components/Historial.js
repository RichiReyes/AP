import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import CarritoCard from './carritoCard';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';

const Historial = ({ limpiarPantalla, setCarrito }) => {
    const [historyItems, setHistoryItems] = useState([]);
    const user = useUser();
    const supabase = useSupabaseClient();

    function handleVolver() {
        limpiarPantalla();
        setCarrito(true);
    }

    const fetchHistoryItems = async () => {
        if (user) {
            try {
                // Fetch purchase history for movies
                const { data: historyMovies, error: movieHistoryError } = await supabase
                    .from('userxshoppinghistorymovie')
                    .select('idmovie, buydate, price')
                    .eq('iduser', user.id);
                if (movieHistoryError) throw movieHistoryError;

                const movieIds = historyMovies.map(item => item.idmovie);
                const { data: movies, error: moviesError } = await supabase
                    .from('movie')
                    .select('id, title, releasedate')
                    .in('id', movieIds);
                if (moviesError) throw moviesError;

                const movieItems = historyMovies.map(history => {
                    const movie = movies.find(m => m.id === history.idmovie);
                    return { ...movie, buydate: history.buydate, price: history.price, tipo: 'movie' };
                });

                // Fetch purchase history for shows
                const { data: historyShows, error: showHistoryError } = await supabase
                    .from('userxshoppinghistoryshow')
                    .select('idshow, buydate, price')
                    .eq('iduser', user.id);
                if (showHistoryError) throw showHistoryError;

                const showIds = historyShows.map(item => item.idshow);
                const { data: shows, error: showsError } = await supabase
                    .from('show')
                    .select('id, name, releaseyear')
                    .in('id', showIds);
                if (showsError) throw showsError;

                const showItems = historyShows.map(history => {
                    const show = shows.find(s => s.id === history.idshow);
                    return { ...show, buydate: history.buydate, price: history.price, tipo: 'show' };
                });

                // Merge and sort by buydate
                const allItems = [...movieItems, ...showItems].sort(
                    (a, b) => new Date(b.buydate) - new Date(a.buydate)
                );

                setHistoryItems(allItems);
            } catch (error) {
                console.log('Error fetching history items:', error);
            }
        }
    };

    useEffect(() => {
        fetchHistoryItems();
    }, [user]);

    return (
        <div className='carrito-main'>
            <div className='flex p-4'>
                <Button onClick={handleVolver}>Volver</Button>
            </div>
            <div className="carrito-content">
                <h2 className='text-white text-2xl mt-8'>Historial de Compras</h2>
                {historyItems.map(item => (
                    <div key={item.id} className='p-4 bg-gray-800 rounded-lg mb-4'>
                        <h3 className='text-white text-lg'>
                            {item.tipo === 'movie' ? item.title : item.name} ({item.tipo === 'movie' ? new Date(item.releasedate).getFullYear() : item.releaseyear})
                        </h3>
                        <p className='text-white'>Price: ${item.price}</p>
                        <p className='text-white'>Comprado el: {item.buydate}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Historial;
