import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Button } from '../components/ui/button';
import Historial from '../components/Historial';
import ShoppingCartCard from '../components/ShoppingCartCard';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';

const Carrito = () => {
    const [carrito, setCarrito] = useState(true);
    const [historial, setHistorial] = useState(false);
    const [shoppingCartItems, setShoppingCartItems] = useState([]);

    const user = useUser();
    const supabase = useSupabaseClient();

    function limpiarPantalla() {
        setCarrito(false);
        setHistorial(false);
    }

    function handleHistorial() {
        limpiarPantalla();
        setHistorial(true);
    }

    const fetchShoppingCartItems = async () => {
        if (user) {
            try {
                // Fetch shopping cart movies
                const { data: cartMovies, error: movieError } = await supabase
                    .from('userxshoppingcartmovie')
                    .select('idmovie, created_at')
                    .eq('iduser', user.id);
                if (movieError) throw movieError;

                const movieIds = cartMovies.map(item => item.idmovie);
                const { data: movies, error: moviesError } = await supabase
                    .from('movie')
                    .select('id, title, releasedate')
                    .in('id', movieIds);
                if (moviesError) throw moviesError;

                const movieItems = cartMovies.map(cart => {
                    const movie = movies.find(m => m.id === cart.idmovie);
                    return { ...movie, tipo: 'movie', created_at: cart.created_at };
                });

                // Fetch shopping cart shows
                const { data: cartShows, error: showError } = await supabase
                    .from('userxshoppingcartshow')
                    .select('idshow, created_at')
                    .eq('iduser', user.id);
                if (showError) throw showError;

                const showIds = cartShows.map(item => item.idshow);
                const { data: shows, error: showsError } = await supabase
                    .from('show')
                    .select('id, name, releaseyear')
                    .in('id', showIds);
                if (showsError) throw showsError;

                const showItems = cartShows.map(cart => {
                    const show = shows.find(s => s.id === cart.idshow);
                    return { ...show, tipo: 'show', created_at: cart.created_at };
                });

                // Merge and sort by created_at
                const allItems = [...movieItems, ...showItems].sort(
                    (a, b) => new Date(b.created_at) - new Date(a.created_at)
                );

                setShoppingCartItems(allItems);
            } catch (error) {
                console.log('Error fetching shopping cart items:', error);
            }
        }
    };

    const handleDelete = async (id, tipo) => {
        try {
            if (tipo === 'movie') {
                await supabase
                    .from('userxshoppingcartmovie')
                    .delete()
                    .eq('iduser', user.id)
                    .eq('idmovie', id);
            } else if (tipo === 'show') {
                await supabase
                    .from('userxshoppingcartshow')
                    .delete()
                    .eq('iduser', user.id)
                    .eq('idshow', id);
            }
            fetchShoppingCartItems();
        } catch (error) {
            console.log('Error deleting item from shopping cart:', error);
        }
    };

    useEffect(() => {
        fetchShoppingCartItems();
    }, [user]);

    async function handleBorrarCarro() {
        try {
            const { data: borrarData, error: borrarError } = await supabase
                .from('userxshoppingcartmovie')
                .delete()
                .eq('iduser', user.id);
            if (borrarError) throw borrarError;
    
            const { data: borrarData2, error: borrarError2 } = await supabase
                .from('userxshoppingcartshow')
                .delete()
                .eq('iduser', user.id);
            if (borrarError2) throw borrarError2;
    
            fetchShoppingCartItems();
        } catch (error) {
            console.log('Error clearing the shopping cart:', error);
        }
    }

    async function pagar() {
        try {
            
            const { data: cartMovies, error: movieError } = await supabase
                .from('userxshoppingcartmovie')
                .select('*')
                .eq('iduser', user.id);
            if (movieError) throw movieError;
    
            const { data: cartShows, error: showError } = await supabase
                .from('userxshoppingcartshow')
                .select('*')
                .eq('iduser', user.id);
            if (showError) throw showError;
    
           
            for (const movie of cartMovies) {
                const { data: movieData, error: movieFetchError } = await supabase
                    .from('movie')
                    .select('purchasequantity')
                    .eq('id', movie.idmovie)
                    .single();
                if (movieFetchError) throw movieFetchError;
    
                const { error: movieUpdateError } = await supabase
                    .from('movie')
                    .update({ purchasequantity: movieData.purchasequantity + 1 })
                    .eq('id', movie.idmovie);
                if (movieUpdateError) throw movieUpdateError;
            }
    
         
            for (const show of cartShows) {
                const { data: showData, error: showFetchError } = await supabase
                    .from('show')
                    .select('purchasequantity')
                    .eq('id', show.idshow)
                    .single();
                if (showFetchError) throw showFetchError;
    
                const { error: showUpdateError } = await supabase
                    .from('show')
                    .update({ purchasequantity: showData.purchasequantity + 1 })
                    .eq('id', show.idshow);
                if (showUpdateError) throw showUpdateError;
            }
    
            
            for (const movie of cartMovies) {
                const { data: moviePriceData, error: moviePriceError } = await supabase
                    .from('movie')
                    .select('price')
                    .eq('id', movie.idmovie)
                    .single();
                if (moviePriceError) throw moviePriceError;
    
                const { error: insertMovieError } = await supabase
                    .from('userxshoppinghistorymovie')
                    .insert({
                        iduser: movie.iduser,
                        idmovie: movie.idmovie,
                        price: moviePriceData.price
                    });
                if (insertMovieError) {
                    console.error('Insert Movie Error:', insertMovieError);
                    throw insertMovieError;
                }
            }
    
            
            for (const show of cartShows) {
                const { data: showPriceData, error: showPriceError } = await supabase
                    .from('show')
                    .select('price')
                    .eq('id', show.idshow)
                    .single();
                if (showPriceError) throw showPriceError;

    
                const { error: insertShowError } = await supabase
                    .from('userxshoppinghistoryshow')
                    .insert({
                        iduser: show.iduser,
                        idshow: show.idshow,
                        price: showPriceData.price
                    });
                if (insertShowError) {
                    console.error('Insert Show Error:', insertShowError);
                    throw insertShowError;
                }
            }
    
          
            await supabase.from('userxshoppingcartmovie').delete().eq('iduser', user.id);
            await supabase.from('userxshoppingcartshow').delete().eq('iduser', user.id);
    
            
            fetchShoppingCartItems();
        } catch (error) {
            console.log('Error processing payment:', error);
            if (error instanceof Response) {
                console.error('Response error:', await error.json());
            }
        }
    }
    
    
    
    
    

    return (
        <div>
            <Navbar />
            {carrito && (
                <div className="p-6">
                    <div className="bg-neutral-700 p-6 rounded-lg">
                        <h2 className='text-white text-3xl mt-8'>Carrito</h2>
                        {shoppingCartItems.map(item => (
                            <ShoppingCartCard key={item.id} item={item} tipo={item.tipo} onDelete={handleDelete} />
                        ))}
                    </div>
                    <div className="mt-6 flex justify-between">
                        <div>
                            <Button onClick={pagar}className='bg-green-500 text-white mr-4'>Proceder al pago</Button>
                            <Button onClick={handleBorrarCarro} className='bg-red-500 text-white'>Borrar Carrito</Button>
                        </div>
                        <div>
                            <Button className='bg-blue-500 text-white' onClick={handleHistorial}>Historial de Compras</Button>
                        </div>
                    </div>
                </div>
            )}
            {historial && <Historial limpiarPantalla={limpiarPantalla} setCarrito={setCarrito} />}
        </div>
    );
};

export default Carrito;
