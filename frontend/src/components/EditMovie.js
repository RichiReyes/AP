import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useNavigate } from 'react-router-dom';

const EditMovie = ({ id, volver }) => {
    const user = useUser();
    const supabase = useSupabaseClient();
    const navigate = useNavigate();
    const [person, setPerson] = useState(null);
    const [title, setTitle] = useState('');
    const [duration, setDuration] = useState('');
    const [price, setPrice] = useState('');
    const [oldPrice, setOldPrice] = useState('');
    const [synopsis, setSynopsis] = useState('');
    const [year, setYear] = useState(new Date().getFullYear());
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
    const [active, setActive] = useState(null);

    const currentYear = new Date().getFullYear();
    const years = Array.from(new Array(currentYear - 1899), (val, index) => currentYear - index);

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

                const { data: movieData, error: movieError } = await supabase
                    .from('movie')
                    .select('title, duration, releasedate, sinopsis, price, active')
                    .eq('id', id);
                if (movieError) throw (movieError);
                if (movieData && movieData.length > 0) {
                    const movie = movieData[0];
                    setTitle(movie.title);
                    setDuration(movie.duration);
                    setSynopsis(movie.sinopsis);
                    setPrice(movie.price);
                    setOldPrice(movie.price); // Save the old price
                    setYear(movie.releasedate);
                    setActive(movie.active);
                    
                }

                const { data: selCategoryData, error: selCategoryError } = await supabase
                    .from('moviexcategory')
                    .select('idcategory')
                    .eq('idmovie', id);
                if (selCategoryError) throw (selCategoryError);
                setSelectedCategories(selCategoryData.map(item => item.idcategory));

                const { data: selPlatformData, error: selPlatformError } = await supabase
                    .from('moviexplatform')
                    .select('idplatform')
                    .eq('idmovie', id);
                if (selPlatformError) throw (selPlatformError);
                setSelectedPlatforms(selPlatformData.map(item => item.idplatform));

                const { data: selDirectorData, error: selDirectorError } = await supabase
                    .from('moviexactordirector')
                    .select('idactordirector')
                    .eq('idmovie', id)
                    .eq('type', 'director');
                if (selDirectorError) throw (selDirectorError);
                setSelectedDirectors(selDirectorData.map(item => item.idactordirector));

                const { data: selActorData, error: selActorError } = await supabase
                    .from('moviexactordirector')
                    .select('idactordirector')
                    .eq('idmovie', id)
                    .eq('type', 'actor');
                if (selActorError) throw (selActorError);
                setSelectedActors(selActorData.map(item => item.idactordirector));

            } catch (error) {
                console.log(error);
            }
        }

        fetchData();

    }, [id, supabase, user.id]);

    const handleDurationChange = (e) => {
        const value = e.target.value;
        if (value === '' || (Number(value) >= 0 && Number(value) <= 240)) {
            setDuration(value);
            setCambiosnormales(true);
        }
    };

    const handlePriceChange = (e) => {
        const value = e.target.value;
        if (value === '' || !isNaN(value)) {
            setPrice(value);
            setCambioPrecio(true);
        }
    };

    const handleYearChange = (e) => {
        setYear(parseInt(e.target.value, 10));
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
        } else {
            alert('Please select a JPEG or PNG image.');
        }
    };

    const handleCambiosNormales = async () => {
        try {
            const { data: updateData, error: updateError } = await supabase.rpc('update_movie', {
                p_id: id,
                p_releasedate: year,
                p_duration: duration,
                p_sinopsis: synopsis,
                p_title: title
            });
            if (updateError) throw (updateError);

            // Insert categories
            for (const categoryId of selectedCategories) {
                const { error: categoryError } = await supabase
                    .from('moviexcategory')
                    .insert({
                        idmovie: id,
                        idcategory: categoryId
                    });
                if (categoryError) throw categoryError;
            }

            // Insert platforms
            for (const platformId of selectedPlatforms) {
                const { error: platformError } = await supabase
                    .from('moviexplatform')
                    .insert({
                        idmovie: id,
                        idplatform: platformId
                    });
                if (platformError) throw platformError;
            }

            // Insert directors
            for (const directorId of selectedDirectors) {
                const { error: directorError } = await supabase
                    .from('moviexactordirector')
                    .insert({
                        idmovie: id,
                        idactordirector: directorId,
                        type: 'director'
                    });
                if (directorError) throw directorError;
            }

            // Insert actors
            for (const actorId of selectedActors) {
                const { error: actorError } = await supabase
                    .from('moviexactordirector')
                    .insert({
                        idmovie: id,
                        idactordirector: actorId,
                        type: 'actor'
                    });
                if (actorError) throw actorError;
            }

            setCambiosnormales(false);
            volver();
        } catch (error) {
            console.log(error)
        }
    }

    const handleCambioPrecio = async () => {
        try {
            const { data: logData, error: logError } = await supabase.rpc('log_price_change', {
                p_idmovie: id,
                p_oldprice: oldPrice,
                p_newprice: price
            });
            if (logError) throw logError;

            const { data: updateData, error: updateError } = await supabase
                .from('movie')
                .update({ price: price })
                .eq('id', id);
            if (updateError) throw updateError;

            setCambioPrecio(false);
            volver();
        } catch (error) {
            console.log(error);
        }
    }

    const handleDesHabilitar = async () => {
        try{

            const{data: habilitarData, error: habilitarError} = await supabase
            .from('movie')
            .update({active: false})
            .eq('id', id);
            if(habilitarError) throw(habilitarError);
            volver();


        } catch(error){
            console.log(error)
        }
    }
    const handleHabilitar = async () => {
        try{

            const{data: habilitarData, error: habilitarError} = await supabase
            .from('movie')
            .update({active: true})
            .eq('id', id);
            if(habilitarError) throw(habilitarError);
            volver();


        } catch(error){
            console.log(error)
        }
    }

    return (
        <div>
            <div className="w3/4 mt-10 mb-10 flex flex-col items-center justify-center min-h-screen bg-[#1E1E1E]">
                <button onClick={volver} className="mb-4 px-6 py-2 bg-[#FF6600] text-[#FFFFFF] rounded-lg hover:bg-[#FF4500] focus:outline-none focus:ring-2 focus:ring-[#FF6600]">
                    Volver
                </button>
                <div className="bg-[#2A2A2A] p-8 rounded-lg shadow-lg max-w-md">
                    <h2 className="text-3xl font-bold text-[#FFFFFF] text-center mb-8">Editar Película</h2>
                    {active && <button onClick={handleDesHabilitar} className="mb-4 px-6 py-2 bg-red-600 text-[#FFFFFF] rounded-lg  focus:outline-none focus:ring-2 focus:ring-[#FF6600]">
                    Deshabilitar
                    </button>}
                    {!active &&<button onClick={handleHabilitar} className="mb-4 px-6 py-2 bg-green-500 text-[#FFFFFF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6600]">
                    Habilitar
                    </button>}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-[#B0B0B0] mb-2" htmlFor="title">Título</label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => {setTitle(e.target.value); setCambiosnormales(true);}}
                                className="w-full px-4 py-2 bg-[#2C2C2C] text-[#FFFFFF] border border-[#3C3C3C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                            />
                        </div>
                        <div>
                            <label className="block text-[#B0B0B0] mb-2" htmlFor="duration">Duración (en min)</label>
                            <input
                                type="number"
                                id="duration"
                                value={duration}
                                onChange={handleDurationChange}
                                className="w-full px-4 py-2 bg-[#2C2C2C] text-[#FFFFFF] border border-[#3C3C3C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                                min="0"
                                max="240"
                            />
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
                            <label className="block text-[#B0B0B0] mb-2" htmlFor="synopsis">Sinopsis</label>
                            <textarea
                                id="synopsis"
                                value={synopsis}
                                onChange={(e) => {setSynopsis(e.target.value); setCambiosnormales(true);}}
                                className="w-full px-4 py-2 bg-[#2C2C2C] text-[#FFFFFF] border border-[#3C3C3C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                            />
                        </div>
                        <div>
                            <label className="block text-[#B0B0B0] mb-2" htmlFor="year">Año de Publicación</label>
                            <select
                                id="year"
                                value={year}
                                onChange={handleYearChange}
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
                                Editar Película
                            </button>}
                            {cambioPrecio && <button
                                onClick={handleCambioPrecio}
                                className="px-6 py-2 bg-[#FF6600] text-[#FFFFFF] rounded-lg hover:bg-[#FF4500] focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                            >
                                Editar Precio
                            </button>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditMovie;
