import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useNavigate } from 'react-router-dom';

const EditShow = ({ id, volver }) => {
    const user = useUser();
    const supabase = useSupabaseClient();
    const navigate = useNavigate();
    const [person, setPerson] = useState(null);
    const [name, setName] = useState('');
    const [sinopsis, setSinopsis] = useState('');
    const [price, setPrice] = useState('');
    const [oldPrice, setOldPrice] = useState('');
    const [releaseYear, setReleaseYear] = useState(new Date().getFullYear());
    const [active, setActive] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [platforms, setPlatforms] = useState([]);
    const [selectedPlatforms, setSelectedPlatforms] = useState([]);
    const [directors, setDirectors] = useState([]);
    const [selectedDirectors, setSelectedDirectors] = useState([]);
    const [selectedActors, setSelectedActors] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [cambiosNormales, setCambiosnormales] = useState(false);
    const [cambioPrecio, setCambioPrecio] = useState(false);
    const [cambioImagen, setCambioImagen] = useState(false);

    const [seasons, setSeasons] = useState([]);
    const [selectedSeason, setSelectedSeason] = useState(null);
    const [episodes, setEpisodes] = useState([]);
    const [newSeasonNumber, setNewSeasonNumber] = useState('');
    const [newEpisode, setNewEpisode] = useState({ name: '', sinopsis: '', duration: '' });

    const currentYear = new Date().getFullYear();
    const years = Array.from(new Array(currentYear - 1899), (val, index) => currentYear - index);

    const fetchSeasons = async () => {
        const { data: seasonsData, error: seasonsError } = await supabase
            .from('season')
            .select('*')
            .eq('idtvshow', id);
        if (seasonsError) throw seasonsError;
        setSeasons(seasonsData);
    };
    
    const fetchEpisodes = async (seasonId) => {
        const { data: episodesData, error: episodesError } = await supabase
            .from('episode')
            .select('*')
            .eq('idseason', seasonId);
        if (episodesError) throw episodesError;
        setEpisodes(episodesData);
    };
    
    const handleAddSeason = async () => {
        if(!newSeasonNumber){
            alert('Digite un numero de temporada')
            return;
        }

        const { data, error } = await supabase
            .from('season')
            .insert([{ idtvshow: id, numberofseason: newSeasonNumber }])
            .select();
        if (error) throw error;
        setNewSeasonNumber('');
        fetchSeasons();
    };
    
    const handleDeleteSeason = async (seasonId) => {
        try{
            const { error } = await supabase
            .from('season')
            .delete()
            .eq('id', seasonId);
            if (error) throw error;
            fetchSeasons();
        } catch(error){
            console.log(error);
            alert('Error borrando temporada')
        }
    };
    
    const handleAddEpisode = async () => {

        if(!newEpisode.duration || !newEpisode.name || !newEpisode.sinopsis){
            alert('Digite la información del episodio');
            return;
        }

        const { data, error } = await supabase
            .from('episode')
            .insert([{ ...newEpisode, idseason: selectedSeason }])
            .select();
        if (error) throw error;
        setNewEpisode({ name: '', sinopsis: '', duration: '' });
        fetchEpisodes(selectedSeason);
    };
    
    const handleDeleteEpisode = async (episodeId) => {
        try{
            const { error } = await supabase
            .from('episode')
            .delete()
            .eq('id', episodeId);
            if (error) throw error;
            fetchEpisodes(selectedSeason);
        } catch(error){
            console.log(error);
            alert('Error borrando episodio')
        }
    };
    
    useEffect(() => {
        if (id) fetchSeasons();
    }, [id]);
    
    useEffect(() => {
        if (selectedSeason) fetchEpisodes(selectedSeason);
    }, [selectedSeason]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: personData, error: personError } = await supabase.rpc('get_person_by_user_id', { p_user_id: user.id });
                if (personError) throw personError;
                if (personData && personData.length > 0) setPerson(personData[0]);

                const { data: categoryData, error: categoryError } = await supabase.from('category').select('id, nombre').order('nombre');
                if (categoryError) throw categoryError;
                setCategories(categoryData);

                const { data: platformData, error: platformError } = await supabase.from('platform').select('id, name').order('name');
                if (platformError) throw platformError;
                setPlatforms(platformData);

                const { data: directorData, error: directorError } = await supabase.rpc('get_directors');
                if (directorError) throw directorError;
                setDirectors(directorData);

                const { data: showData, error: showError } = await supabase
                    .from('show')
                    .select('name, sinopsis, price, releaseyear, active')
                    .eq('id', id);
                if (showError) throw showError;
                if (showData && showData.length > 0) {
                    const show = showData[0];
                    setName(show.name);
                    setSinopsis(show.sinopsis);
                    setPrice(show.price);
                    setOldPrice(show.price); // Save the old price
                    setReleaseYear(show.releaseyear);
                    setActive(show.active);
                }

                const { data: selCategoryData, error: selCategoryError } = await supabase
                    .from('showxcategory')
                    .select('idcategory')
                    .eq('idshow', id);
                if (selCategoryError) throw selCategoryError;
                setSelectedCategories(selCategoryData.map(item => item.idcategory));

                const { data: selPlatformData, error: selPlatformError } = await supabase
                    .from('showxplatform')
                    .select('idplatform')
                    .eq('idshow', id);
                if (selPlatformError) throw selPlatformError;
                setSelectedPlatforms(selPlatformData.map(item => item.idplatform));

                const { data: selDirectorData, error: selDirectorError } = await supabase
                    .from('showxactordirector')
                    .select('idactordirector')
                    .eq('idshow', id)
                    .eq('type', 'director');
                if (selDirectorError) throw selDirectorError;
                setSelectedDirectors(selDirectorData.map(item => item.idactordirector));

                const { data: selActorData, error: selActorError } = await supabase
                    .from('showxactordirector')
                    .select('idactordirector')
                    .eq('idshow', id)
                    .eq('type', 'actor');
                if (selActorError) throw selActorError;
                setSelectedActors(selActorData.map(item => item.idactordirector));

            } catch (error) {
                console.log(error);
            }
        }

        fetchData();

    }, [id, supabase, user.id]);

    const handleNameChange = (e) => {
        setName(e.target.value);
        setCambiosnormales(true);
    };

    const handleSinopsisChange = (e) => {
        setSinopsis(e.target.value);
        setCambiosnormales(true);
    };

    const handlePriceChange = (e) => {
        const value = e.target.value;
        if (value === '' || !isNaN(value)) {
            setPrice(value);
            setCambioPrecio(true);
        }
    };

    const handleReleaseYearChange = (e) => {
        setReleaseYear(parseInt(e.target.value, 10));
        setCambiosnormales(true);
    };

    const handleCategorySelect = (id) => {
        if (selectedCategories.includes(id)) {
            setSelectedCategories(selectedCategories.filter(categoryId => categoryId !== id));
            setCambiosnormales(true);
        } else {
            setSelectedCategories([...selectedCategories, id]);
            setCambiosnormales(true);
        }
    };

    const handlePlatformSelect = (id) => {
        if (selectedPlatforms.includes(id)) {
            setSelectedPlatforms(selectedPlatforms.filter(platformId => platformId !== id));
            setCambiosnormales(true);
        } else {
            setSelectedPlatforms([...selectedPlatforms, id]);
            setCambiosnormales(true);
        }
    };

    const handleDirectorSelect = (id) => {
        if (selectedDirectors.includes(id)) {
            setSelectedDirectors(selectedDirectors.filter(directorId => directorId !== id));
            setCambiosnormales(true);
        } else {
            setSelectedDirectors([...selectedDirectors, id]);
            setCambiosnormales(true);
        }
    };

    const handleActorSelect = (id) => {
        if (selectedActors.includes(id)) {
            setSelectedActors(selectedActors.filter(actorId => actorId !== id));
            setCambiosnormales(true);
        } else {
            setSelectedActors([...selectedActors, id]);
            setCambiosnormales(true);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
            setSelectedImage(file);
            setCambioImagen(true);
        } else {
            alert('Please select a JPEG or PNG image.');
        }
    };

    const updateImage = async () => {
        try{
            const {data: imageData, error: imageError} = await supabase
            .storage
            .from('imgs')
            .update('shows/'+id, selectedImage);

            if(imageError) throw(imageError);
            alert('Cambio exitoso.')
            setCambioImagen(false);
        } catch(error){
            console.log(error);
        }
    }

    const handleCambiosNormales = async () => {
        try {
            const { data: updateData, error: updateError } = await supabase.rpc('update_show', {
                p_id: id,
                p_name: name,
                p_releaseyear: releaseYear,
                p_sinopsis: sinopsis
            });
            if (updateError) throw updateError;
    
            // Insert new categories
            for (const categoryId of selectedCategories) {
                const { error: categoryError } = await supabase
                    .from('showxcategory')
                    .insert({
                        idshow: id,
                        idcategory: categoryId
                    });
                if (categoryError) throw categoryError;
            }
    
            // Insert new platforms
            for (const platformId of selectedPlatforms) {
                const { error: platformError } = await supabase
                    .from('showxplatform')
                    .insert({
                        idshow: id,
                        idplatform: platformId
                    });
                if (platformError) throw platformError;
            }
    
            // Insert new directors
            for (const directorId of selectedDirectors) {
                const { error: directorError } = await supabase
                    .from('showxactordirector')
                    .insert({
                        idshow: id,
                        idactordirector: directorId,
                        type: 'director'
                    });
                if (directorError) throw directorError;
            }
    
            // Insert new actors
            for (const actorId of selectedActors) {
                const { error: actorError } = await supabase
                    .from('showxactordirector')
                    .insert({
                        idshow: id,
                        idactordirector: actorId,
                        type: 'actor'
                    });
                if (actorError) throw actorError;
            }
    
            setCambiosnormales(false);
            volver();
        } catch (error) {
            console.log(error);
        }
    };

    const handleCambioPrecio = async () => {
        try {
            const { data: logData, error: logError } = await supabase.rpc('log_show_price_change', {
                p_idshow: id,
                p_oldprice: oldPrice,
                p_newprice: price
            });
            if (logError) throw logError;

            const { data: updateData, error: updateError } = await supabase
                .from('show')
                .update({ price: price })
                .eq('id', id);
            if (updateError) throw updateError;

            setCambioPrecio(false);
            volver();
        } catch (error) {
            console.log(error);
        }
    };

    const handleDesHabilitar = async () => {
        try {
            const { data: habilitarData, error: habilitarError } = await supabase
                .from('show')
                .update({ active: false })
                .eq('id', id);
            if (habilitarError) throw habilitarError;
            volver();
        } catch (error) {
            console.log(error);
        }
    };

    const handleHabilitar = async () => {
        try {
            const { data: habilitarData, error: habilitarError } = await supabase
                .from('show')
                .update({ active: true })
                .eq('id', id);
            if (habilitarError) throw habilitarError;
            volver();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='flex flex-row space-x-5'>
            <div className=" ml-10 w3/4 mt-10 mb-10 flex flex-col items-center justify-center min-h-screen bg-[#1E1E1E]">
                <button onClick={volver} className="mb-4 px-6 py-2 bg-[#FF6600] text-[#FFFFFF] rounded-lg hover:bg-[#FF4500] focus:outline-none focus:ring-2 focus:ring-[#FF6600]">
                    Volver
                </button>
                <div className="bg-[#2A2A2A] p-8 rounded-lg shadow-lg max-w-md">
                    <h2 className="text-3xl font-bold text-[#FFFFFF] text-center mb-8">Editar Show</h2>
                    {active && <button onClick={handleDesHabilitar} className="mb-4 px-6 py-2 bg-red-600 text-[#FFFFFF] rounded-lg  focus:outline-none focus:ring-2 focus:ring-[#FF6600]">
                        Deshabilitar
                    </button>}
                    {!active && <button onClick={handleHabilitar} className="mb-4 px-6 py-2 bg-green-500 text-[#FFFFFF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6600]">
                        Habilitar
                    </button>}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-[#B0B0B0] mb-2" htmlFor="name">Nombre</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={handleNameChange}
                                className="w-full px-4 py-2 bg-[#2C2C2C] text-[#FFFFFF] border border-[#3C3C3C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                            />
                        </div>
                        <div>
                            <label className="block text-[#B0B0B0] mb-2" htmlFor="releaseYear">Año de Publicación</label>
                            <select
                                id="releaseYear"
                                value={releaseYear}
                                onChange={handleReleaseYearChange}
                                className="block w-full px-4 py-2 bg-[#2C2C2C] text-[#FFFFFF] border border-[#3C3C3C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                            >
                                {years.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[#B0B0B0] mb-2" htmlFor="price">Precio (en $)</label>
                            <input
                                type="text"
                                id="price"
                                value={price}
                                onChange={handlePriceChange}
                                className="w-full px-4 py-2 bg-[#2C2C2C] text-[#FFFFFF] border border-[#3C3C3C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                            />
                        </div>
                        <div>
                            <label className="block text-[#B0B0B0] mb-2" htmlFor="sinopsis">Sinopsis</label>
                            <textarea
                                id="sinopsis"
                                value={sinopsis}
                                onChange={handleSinopsisChange}
                                className="w-full px-4 py-2 bg-[#2C2C2C] text-[#FFFFFF] border border-[#3C3C3C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                            />
                        </div>
                        <div>
                            <label className="block text-[#B0B0B0] mb-2">Categorías</label>
                            <div className="flex flex-wrap">
                                {categories.map((category) => (
                                    <div
                                        key={category.id}
                                        onClick={() => handleCategorySelect(category.id)}
                                        className={`px-4 py-2 m-1 cursor-pointer rounded-lg ${
                                            selectedCategories.includes(category.id) ? 'bg-[#FF6600]' : 'bg-[#2C2C2C]'
                                        } text-[#FFFFFF]`}
                                    >
                                        {category.nombre}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-[#B0B0B0] mb-2">Categorías Seleccionadas</label>
                            <div className="flex flex-wrap">
                                {selectedCategories.map((categoryId) => {
                                    const category = categories.find(c => c.id === categoryId);
                                    return (
                                        <div
                                            key={categoryId}
                                            onClick={() => handleCategorySelect(categoryId)}
                                            className="px-4 py-2 m-1 bg-[#FF6600] text-[#FFFFFF] rounded-lg cursor-pointer"
                                        >
                                            {category?.nombre}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div>
                            <label className="block text-[#B0B0B0] mb-2">Plataformas</label>
                            <div className="flex flex-wrap">
                                {platforms.map((platform) => (
                                    <div
                                        key={platform.id}
                                        onClick={() => handlePlatformSelect(platform.id)}
                                        className={`px-4 py-2 m-1 cursor-pointer rounded-lg ${
                                            selectedPlatforms.includes(platform.id) ? 'bg-[#FF6600]' : 'bg-[#2C2C2C]'
                                        } text-[#FFFFFF]`}
                                    >
                                        {platform.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-[#B0B0B0] mb-2">Plataformas Seleccionadas</label>
                            <div className="flex flex-wrap">
                                {selectedPlatforms.map((platformId) => {
                                    const platform = platforms.find(p => p.id === platformId);
                                    return (
                                        <div
                                            key={platformId}
                                            onClick={() => handlePlatformSelect(platformId)}
                                            className="px-4 py-2 m-1 bg-[#FF6600] text-[#FFFFFF] rounded-lg cursor-pointer"
                                        >
                                            {platform?.name}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div>
                            <label className="block text-[#B0B0B0] mb-2">Directores</label>
                            <div className="max-h-32 overflow-y-scroll bg-[#2C2C2C] rounded-lg p-2">
                                {directors.map((director) => (
                                    <div
                                        key={director.id}
                                        onClick={() => handleDirectorSelect(director.id)}
                                        className={`px-4 py-2 m-1 cursor-pointer rounded-lg ${
                                            selectedDirectors.includes(director.id) ? 'bg-[#FF6600]' : 'bg-[#2C2C2C]'
                                        } text-[#FFFFFF]`}
                                    >
                                        {director.name} {director.lastname}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-[#B0B0B0] mb-2">Directores Seleccionados</label>
                            <div className="flex flex-wrap">
                                {selectedDirectors.map((directorId) => {
                                    const director = directors.find(d => d.id === directorId);
                                    return (
                                        <div
                                            key={directorId}
                                            onClick={() => handleDirectorSelect(directorId)}
                                            className="px-4 py-2 m-1 bg-[#FF6600] text-[#FFFFFF] rounded-lg cursor-pointer"
                                        >
                                            {director?.name} {director?.lastname}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div>
                            <label className="block text-[#B0B0B0] mb-2">Actores</label>
                            <div className="max-h-32 overflow-y-scroll bg-[#2C2C2C] rounded-lg p-2">
                                {directors.map((actor) => (
                                    <div
                                        key={actor.id}
                                        onClick={() => handleActorSelect(actor.id)}
                                        className={`px-4 py-2 m-1 cursor-pointer rounded-lg ${
                                            selectedActors.includes(actor.id) ? 'bg-[#FF6600]' : 'bg-[#2C2C2C]'
                                        } text-[#FFFFFF]`}
                                    >
                                        {actor.name} {actor.lastname}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-[#B0B0B0] mb-2">Actores Seleccionados</label>
                            <div className="flex flex-wrap">
                                {selectedActors.map((actorId) => {
                                    const actor = directors.find(d => d.id === actorId);
                                    return (
                                        <div
                                            key={actorId}
                                            onClick={() => handleActorSelect(actorId)}
                                            className="px-4 py-2 m-1 bg-[#FF6600] text-[#FFFFFF] rounded-lg cursor-pointer"
                                        >
                                            {actor?.name} {actor?.lastname}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white text-center mt-5 mb-8">Foto</h2>
                            <input
                                type="file"
                                id="image"
                                accept="image/jpeg, image/png"
                                onChange={handleImageChange}
                                className="w-full px-4 py-2 bg-[#2C2C2C] text-[#FFFFFF] border border-[#3C3C3C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                            />
                        </div>
                        <div className="flex justify-center">
                            {cambiosNormales && <button
                                onClick={handleCambiosNormales}
                                className="px-6 py-2 bg-[#FF6600] text-[#FFFFFF] rounded-lg hover:bg-[#FF4500] focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                            >
                                Editar Show
                            </button>}
                            {cambioPrecio && <button
                                onClick={handleCambioPrecio}
                                className="px-6 py-2 bg-[#FF6600] text-[#FFFFFF] rounded-lg hover:bg-[#FF4500] focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                            >
                                Editar Precio
                            </button>}
                            {cambioImagen && <button
                                onClick={updateImage}
                                className="px-6 py-2 bg-[#FF6600] text-[#FFFFFF] rounded-lg hover:bg-[#FF4500] focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                            >
                                Cambiar Imagen
                            </button>}
                        </div>
                    </div>
                </div>
            </div>
            <div className="w3/4 flex flex-col items-center justify-center min-h-screen bg-[#1E1E1E]">
            <div className='bg-[#2A2A2A] p-8 rounded-lg shadow-lg max-w-md'>
                <h1 className="text-3xl font-bold text-[#FFFFFF] text-center mb-8">Temporadas</h1>
                <div>
                    <label className="block text-[#B0B0B0] mb-2" htmlFor="newSeason">Nueva Temporada</label>
                    <input
                        type="number"
                        id="newSeason"
                        value={newSeasonNumber}
                        onChange={(e) => setNewSeasonNumber(e.target.value)}
                        className="w-full px-4 py-2 bg-[#2C2C2C] text-[#FFFFFF] border border-[#3C3C3C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                    />
                    <button onClick={handleAddSeason} className="mt-4 px-6 py-2 bg-[#FF6600] text-[#FFFFFF] rounded-lg hover:bg-[#FF4500] focus:outline-none focus:ring-2 focus:ring-[#FF6600]">
                        Añadir Temporada
                    </button>
                </div>
                <div className="mt-8">
                    {seasons.map((season) => (
                        <div key={season.id} className="flex justify-between items-center mb-2">
                            <div
                                onClick={() => setSelectedSeason(season.id)}
                                className={`px-4 py-2 cursor-pointer rounded-lg ${selectedSeason === season.id ? 'bg-[#FF6600]' : 'bg-[#2C2C2C]'} text-[#FFFFFF]`}
                            >
                                Temporada {season.numberofseason}
                            </div>
                            <button onClick={() => handleDeleteSeason(season.id)} className="ml-4 px-4 py-2 bg-red-600 text-[#FFFFFF] rounded-lg hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-600">
                                Eliminar
                            </button>
                        </div>
                    ))}
                </div>
                {selectedSeason && (
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold text-[#FFFFFF] text-center mb-4">Episodios</h2>
                        <div>
                            {episodes.map((episode) => (
                                <div key={episode.id} className="flex justify-between items-center mb-2">
                                    <div className="px-4 py-2 bg-[#2C2C2C] text-[#FFFFFF] rounded-lg">
                                        {episode.name}
                                    </div>
                                    <button onClick={() => handleDeleteEpisode(episode.id)} className="ml-4 px-4 py-2 bg-red-600 text-[#FFFFFF] rounded-lg hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-600">
                                        Eliminar
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8">
                            <label className="block text-[#B0B0B0] mb-2" htmlFor="newEpisodeName">Nombre del Episodio</label>
                            <input
                                type="text"
                                id="newEpisodeName"
                                value={newEpisode.name}
                                onChange={(e) => setNewEpisode({ ...newEpisode, name: e.target.value })}
                                className="w-full px-4 py-2 bg-[#2C2C2C] text-[#FFFFFF] border border-[#3C3C3C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                            />
                            <label className="block text-[#B0B0B0] mb-2" htmlFor="newEpisodeSinopsis">Sinopsis del Episodio</label>
                            <textarea
                                id="newEpisodeSinopsis"
                                value={newEpisode.sinopsis}
                                onChange={(e) => setNewEpisode({ ...newEpisode, sinopsis: e.target.value })}
                                className="w-full px-4 py-2 bg-[#2C2C2C] text-[#FFFFFF] border border-[#3C3C3C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                            />
                            <label className="block text-[#B0B0B0] mb-2" htmlFor="newEpisodeDuration">Duración del Episodio (min)</label>
                            <input
                                type="number"
                                id="newEpisodeDuration"
                                value={newEpisode.duration}
                                onChange={(e) => setNewEpisode({ ...newEpisode, duration: e.target.value })}
                                className="w-full px-4 py-2 bg-[#2C2C2C] text-[#FFFFFF] border border-[#3C3C3C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                            />
                            <button onClick={handleAddEpisode} className="mt-4 px-6 py-2 bg-[#FF6600] text-[#FFFFFF] rounded-lg hover:bg-[#FF4500] focus:outline-none focus:ring-2 focus:ring-[#FF6600]">
                                Añadir Episodio
                            </button>
                        </div>
                    </div>
                )}
                </div>
            </div>
        </div>
    );
}

export default EditShow;
