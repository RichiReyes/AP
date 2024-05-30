import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import Navbar from './Navbar';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import AddReview from '../components/AddReview'; 

const MovieDesc = () => {
    const location = useLocation();
    const { movie, tipo } = location.state || {};
    const user = useUser();
    const supabase = useSupabaseClient();
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [actorIds, setActorIds] = useState([]);
    const [actors, setActors] = useState([]);
    const [directorIds, setDirectorIds] = useState([]);
    const [directors, setDirectors] = useState([]);
    const [platforms, setPlatforms] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [seasons, setSeasons] = useState([]);
    const [episodes, setEpisodes] = useState([]);
    const [showAddReview, setShowAddReview] = useState(false);

    const CDNURL = "https://jheqfwbznxusdwclwccv.supabase.co/storage/v1/object/public/imgs/";
    
    const imageUrl = (tipo === 'movie' ? `${CDNURL}movies/${movie.id}` : `${CDNURL}shows/${movie.id}`) + `?timestamp=${new Date().getTime()}`;

    useEffect(() => {
        const fetchData = async () => {
            if (movie) {
                try {
                    
                    const { data: categoryData, error: categoryError } = await supabase
                        .from(tipo === 'movie' ? 'moviexcategory' : 'showxcategory')
                        .select('idcategory')
                        .eq(tipo === 'movie' ? 'idmovie' : 'idshow', movie.id);
                    if (categoryError) throw categoryError;

                    const categoryIds = categoryData.map(item => item.idcategory);
                    const { data: categoriesData, error: categoriesError } = await supabase
                        .from('category')
                        .select('id, nombre')
                        .in('id', categoryIds);
                    if (categoriesError) throw categoriesError;
                    setCategories(categoriesData);

                    
                    const { data: actorDirectorData, error: actorDirectorError } = await supabase
                        .from(tipo === 'movie' ? 'moviexactordirector' : 'showxactordirector')
                        .select('idactordirector, type')
                        .eq(tipo === 'movie' ? 'idmovie' : 'idshow', movie.id);
                    if (actorDirectorError) throw actorDirectorError;

                    const actorIds = actorDirectorData.filter(ad => ad.type === 'actor').map(ad => ad.idactordirector);
                    const directorIds = actorDirectorData.filter(ad => ad.type === 'director').map(ad => ad.idactordirector);

                    setActorIds(actorIds);
                    setDirectorIds(directorIds);

                    // Fetch platforms
                    const { data: platformData, error: platformError } = await supabase
                        .from(tipo === 'movie' ? 'moviexplatform' : 'showxplatform')
                        .select('idplatform')
                        .eq(tipo === 'movie' ? 'idmovie' : 'idshow', movie.id);
                    if (platformError) throw platformError;

                    const platformIds = platformData.map(item => item.idplatform);
                    const { data: platformsData, error: platformsError } = await supabase
                        .from('platform')
                        .select('id, name')
                        .in('id', platformIds);
                    if (platformsError) throw platformsError;
                    setPlatforms(platformsData);

                    // Fetch reviews
                    await fetchReviews();

                    if (tipo === 'show') {
                        // Fetch seasons
                        const { data: seasonsData, error: seasonsError } = await supabase
                            .from('season')
                            .select('id, numberofseason')
                            .eq('idtvshow', movie.id);
                        if (seasonsError) throw seasonsError;
                        setSeasons(seasonsData);

                        // Fetch episodes
                        const seasonIds = seasonsData.map(season => season.id);
                        const { data: episodesData, error: episodesError } = await supabase
                            .from('episode')
                            .select('id, idseason, name, sinopsis, duration')
                            .in('idseason', seasonIds);
                        if (episodesError) throw episodesError;
                        setEpisodes(episodesData);
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        };

        fetchData();
    }, [movie, supabase, tipo]);

    useEffect(() => {
        const fetchActorNames = async () => {
            if (actorIds.length > 0) {
                try {
                    const { data: actorsData, error: actorsError } = await supabase
                        .rpc('get_names_by_ids', { ids: actorIds });
                    if (actorsError) throw actorsError;
                    setActors(actorsData);
                } catch (error) {
                    console.log(error);
                }
            }
        };

        fetchActorNames();
    }, [actorIds, supabase]);

    useEffect(() => {
        const fetchDirectorNames = async () => {
            if (directorIds.length > 0) {
                try {
                    const { data: directorsData, error: directorsError } = await supabase
                        .rpc('get_names_by_ids', { ids: directorIds });
                    if (directorsError) throw directorsError;
                    setDirectors(directorsData);
                } catch (error) {
                    console.log(error);
                }
            }
        };

        fetchDirectorNames();
    }, [directorIds, supabase]);

    const fetchReviews = async () => {
        try {
            const { data: reviewData, error: reviewError } = await supabase
                .from(tipo === 'movie' ? 'moviexreview' : 'showxreview')
                .select('idreview')
                .eq(tipo === 'movie' ? 'idmovie' : 'idshow', movie.id);
            if (reviewError) throw reviewError;

            const reviewIds = reviewData.map(item => item.idreview);
            const { data: reviewsData, error: reviewsError } = await supabase
                .from('review')
                .select('id, stars, description')
                .in('id', reviewIds);
            if (reviewsError) throw reviewsError;
            setReviews(reviewsData);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const addRecentWatch = async () => {
            try {
                if (user) {
                    if (tipo === 'movie') {
                        const { data: existingData, error: existingError } = await supabase
                            .from('userxrecentlywatchmovie')
                            .select('iduser, idmovie')
                            .eq('iduser', user.id)
                            .eq('idmovie', movie.id);

                        if (existingError) throw existingError;

                        if (existingData.length > 0) {
                            await supabase
                                .from('userxrecentlywatchmovie')
                                .delete()
                                .eq('iduser', user.id)
                                .eq('idmovie', movie.id);
                        }

                        const { data: recentData, error: recentError } = await supabase
                            .from('userxrecentlywatchmovie')
                            .insert({
                                iduser: user.id,
                                idmovie: movie.id
                            });
                        if (recentError) throw recentError;
                        

                    } else if (tipo === 'show') {
                        const { data: existingData, error: existingError } = await supabase
                            .from('userxrecentlywatchshow')
                            .select('iduser, idshow')
                            .eq('iduser', user.id)
                            .eq('idshow', movie.id);

                        if (existingError) throw existingError;

                        if (existingData.length > 0) {
                            await supabase
                                .from('userxrecentlywatchshow')
                                .delete()
                                .eq('iduser', user.id)
                                .eq('idshow', movie.id);
                        }

                        const { data: recentData, error: recentError } = await supabase
                            .from('userxrecentlywatchshow')
                            .insert({
                                iduser: user.id,
                                idshow: movie.id
                            });
                        if (recentError) throw recentError;
                        console.log(recentData);
                    }
                }
            } catch (error) {
                console.log('Error:', error);
            }
        };

        addRecentWatch();
    }, [movie, tipo, user, supabase]);

    async function addFav(){
        if(user){
            try{
                if (tipo === 'movie'){
                    const {data: favData, error: favError} = await supabase
                    .from('userxfavoritemovie')
                    .insert({iduser: user.id, idmovie: movie.id});
                    if(favError) throw(favError);
                    alert('Agregado a favoritos');
                } else {
                    const {data: favData, error: favError} = await supabase
                    .from('userxfavoriteshows')
                    .insert({iduser: user.id, idshow: movie.id});
                    if(favError)throw(favError);
                    alert('Agregado a favoritos');
                }
            } catch(error){

            }
        } else{
            navigate('/login');
        }
    }

    async function addCarrito(){
        if(user){
            try{
                if(tipo ==='movie'){
                    const {data: carritoData, error: carritoError} = await supabase
                    .from('userxshoppingcartmovie')
                    .insert({iduser: user.id, idmovie: movie.id})
                    if(carritoError) throw(carritoError);
                    alert('Agregado al carrito')
                } else{
                    const {data: carritoData, error: carritoError} = await supabase
                    .from('userxshoppingcartshow')
                    .insert({iduser: user.id, idshow: movie.id})
                    if(carritoError) throw(carritoError);
                    alert('Agregado al carrito')
                }

            } catch(error){
                console.log(error);
            }

        } else{
            navigate('/login');
        }
    }

    function handleAddReview(){
        setShowAddReview(true);
    }

    function handleCloseReview(){
        setShowAddReview(false);
        fetchReviews();
    }

    const handleActorClick = (actorId) => {
        navigate(`/actor/${actorId}`);
    };

    const handleDirectorClick = (directorId) => {
        navigate(`/director/${directorId}`);
    };

    return (
        <div>
            <Navbar />
            <div className="outer-movieDesc bg-gray-100 p-6">
                <div className='movieDesc-container bg-white rounded-lg shadow-md p-6'>
                    {tipo === 'movie' ? (
                        <>
                            <div className="left-desc">
                                <h2 className="text-2xl font-bold mb-4">{movie.title}</h2>
                                <p className="text-lg mb-2 text-white"><strong>Sinopsis:</strong> {movie.sinopsis}</p>
                                <p className="text-lg mb-2 text-white"><strong>Duración:</strong> {movie.duration} min</p>
                                <p className="text-lg mb-2 text-white"><strong>Precio:</strong> ${movie.price}</p>
                                <div className="mb-4">
                                    <h3 className="text-xl font-semibold mb-2">Categorías:</h3>
                                    <ul className="list-disc list-inside">
                                        {categories.map((category) => (
                                            <li className='text-white' key={category.id}>{category.nombre}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="mb-4">
                                    <h3 className="text-xl font-semibold mb-2">Plataformas:</h3>
                                    <ul className="list-disc list-inside">
                                        {platforms.map((platform) => (
                                            <li className='text-white' key={platform.id}>{platform.name}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="mb-4">
                                    <h3 className="text-xl font-semibold mb-2">Actores:</h3>
                                    <ul className="list-disc list-inside">
                                        {actors.map((actor) => (
                                            <li key={actor.id} className='text-lime-400 hover:cursor-pointer' onClick={() => handleActorClick(actor.id)}>{actor.name}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="mb-4">
                                    <h3 className="text-xl font-semibold mb-2">Directores:</h3>
                                    <ul className="list-disc list-inside">
                                        {directors.map((director) => (
                                            <li key={director.id} className='text-lime-400 hover:cursor-pointer' onClick={() => handleDirectorClick(director.id)}>{director.name}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="mb-4">
                                    <h3 className="text-xl font-semibold mb-2">Reseñas:</h3>
                                    <ul className="list-disc list-inside">
                                        {reviews.map((review) => (
                                            <li className='text-white' key={review.id}>
                                                <p className='text-white'><strong>{review.stars} stars:</strong> {review.description}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="flex flex-col items-center space-y-4">
                                <img src={imageUrl} alt="No se encontró esta imagen" className='image-desc max-w-full max-h-[48rem] w-auto h-auto object-cover rounded-lg shadow-lg mb-4' />
                                <Button onClick={addFav}>Agregar a Favoritos</Button>
                                <Button onClick={addCarrito}>Agregar al carrito</Button>
                                <Button onClick={handleAddReview}>Agregar Review</Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="left-desc">
                                <h2 className="text-2xl font-bold mb-4">{movie.name}</h2>
                                <p className="text-lg mb-2 text-white"><strong>Sinopsis:</strong> {movie.sinopsis}</p>
                                <p className="text-lg mb-2 text-white"><strong>Precio:</strong> ${movie.price}</p>
                                <div className="mb-4">
                                    <h3 className="text-xl font-semibold mb-2">Categorías:</h3>
                                    <ul className="list-disc list-inside">
                                        {categories.map((category) => (
                                            <li className='text-white' key={category.id}>{category.nombre}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="mb-4">
                                    <h3 className="text-xl font-semibold mb-2">Plataformas:</h3>
                                    <ul className="list-disc list-inside">
                                        {platforms.map((platform) => (
                                            <li className='text-white' key={platform.id}>{platform.name}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="mb-4">
                                    <h3 className="text-xl font-semibold mb-2">Actores:</h3>
                                    <ul className="list-disc list-inside">
                                        {actors.map((actor) => (
                                            <li key={actor.id} className='text-lime-400 hover:cursor-pointer' onClick={() => handleActorClick(actor.id)}>{actor.name}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="mb-4">
                                    <h3 className="text-xl font-semibold mb-2">Directores:</h3>
                                    <ul className="list-disc list-inside">
                                        {directors.map((director) => (
                                            <li key={director.id} className='text-lime-400 hover:cursor-pointer' onClick={() => handleDirectorClick(director.id)}>{director.name}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="mb-4">
                                    <h3 className="text-xl font-semibold mb-2">Temporadas:</h3>
                                    <ul className="list-disc list-inside">
                                        {seasons.map((season) => (
                                            <li key={season.id}>
                                                <p className="font-semibold">Temporada {season.numberofseason}</p>
                                                <ul className="list-disc list-inside ml-6">
                                                    {episodes.filter(ep => ep.idseason === season.id).map((episode) => (
                                                        <li key={episode.id}>
                                                            <p className="font-medium">{episode.name} - {episode.duration} min</p>
                                                            <p>{episode.sinopsis}</p>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="mb-4">
                                    <h3 className="text-xl font-semibold mb-2">Reseñas:</h3>
                                    <ul className="list-disc list-inside">
                                        {reviews.map((review) => (
                                            <li key={review.id}>
                                                <p className='text-white'><strong>{review.stars} stars:</strong> {review.description}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="flex flex-col items-center space-y-4">
                                <img src={imageUrl} alt="No se encontró esta imagen" className='image-desc max-w-full max-h-[48rem] w-auto h-auto object-cover rounded-lg shadow-lg mb-4' />
                                <Button onClick={addFav}>Agregar a Favoritos</Button>
                                <Button onClick={addCarrito}>Agregar al carrito</Button>
                                <Button onClick={handleAddReview}>Agregar Review</Button>
                            </div>
                        </>
                    )}
                    {showAddReview && (
                        <AddReview 
                            tipo={tipo} 
                            movie={movie} 
                            onClose={handleCloseReview} 
                            fetchReviews={fetchReviews} 
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default MovieDesc;
