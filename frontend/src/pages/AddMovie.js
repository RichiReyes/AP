import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useNavigate } from 'react-router-dom';

const AddMovie = () => {
    const user = useUser();
    const supabase = useSupabaseClient();
    const navigate = useNavigate();
    const [person, setPerson] = useState(null);
    const [title, setTitle] = useState('');
    const [duration, setDuration] = useState('');
    const [price, setPrice] = useState('');
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

    const currentYear = new Date().getFullYear();
    const years = Array.from(new Array(currentYear - 1899), (val, index) => currentYear - index);

    useEffect(() => {
        const fetchData = async () => {
            if (user) {
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

                } catch (error) {
                    console.error('Error fetching data:', error.message);
                }
            }
        };

        fetchData();
    }, [user, supabase]);

    const handleDurationChange = (e) => {
        const value = e.target.value;
        if (value === '' || (Number(value) >= 0 && Number(value) <= 240)) {
            setDuration(value);
        }
    };

    const handlePriceChange = (e) => {
        const value = e.target.value;
        if (value === '' || !isNaN(value)) {
            setPrice(value);
        }
    };

    const handleYearChange = (e) => {
        setYear(parseInt(e.target.value, 10));
    };

    const handleCategorySelect = (id) => {
        if (selectedCategories.includes(id)) {
            setSelectedCategories(selectedCategories.filter(categoryId => categoryId !== id));
        } else {
            setSelectedCategories([...selectedCategories, id]);
        }
    };

    const handlePlatformSelect = (id) => {
        if (selectedPlatforms.includes(id)) {
            setSelectedPlatforms(selectedPlatforms.filter(platformId => platformId !== id));
        } else {
            setSelectedPlatforms([...selectedPlatforms, id]);
        }
    };

    const handleDirectorSelect = (id) => {
        if (selectedDirectors.includes(id)) {
            setSelectedDirectors(selectedDirectors.filter(directorId => directorId !== id));
        } else {
            setSelectedDirectors([...selectedDirectors, id]);
        }
    };

    const handleActorSelect = (id) => {
        if (selectedActors.includes(id)) {
            setSelectedActors(selectedActors.filter(actorId => actorId !== id));
        } else {
            setSelectedActors([...selectedActors, id]);
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

    const handleAddMovie = async (e) => {
        e.preventDefault();
        try {
            if(!title || !duration || !price || !synopsis || !selectedActors || !selectedCategories || !selectedPlatforms || !selectedDirectors || !selectedImage){
                alert('Rellene todos los campos.');
                return;
            }
            // Insert the movie into the movie table
            const { data: movieData, error: movieError } = await supabase
                .from('movie')
                .insert({
                    title,
                    releasedate: year,
                    duration: Number(duration),
                    price: parseFloat(price),
                    sinopsis: synopsis
                })
                .select()
                .single();

            if (movieError) throw movieError;
            const movieId = movieData.id;

            // Insert categories
            for (const categoryId of selectedCategories) {
                const { error: categoryError } = await supabase
                    .from('moviexcategory')
                    .insert({
                        idmovie: movieId,
                        idcategory: categoryId
                    });
                if (categoryError) throw categoryError;
            }

            // Insert platforms
            for (const platformId of selectedPlatforms) {
                const { error: platformError } = await supabase
                    .from('moviexplatform')
                    .insert({
                        idmovie: movieId,
                        idplatform: platformId
                    });
                if (platformError) throw platformError;
            }

            // Insert directors
            for (const directorId of selectedDirectors) {
                const { error: directorError } = await supabase
                    .from('moviexactordirector')
                    .insert({
                        idmovie: movieId,
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
                        idmovie: movieId,
                        idactordirector: actorId,
                        type: 'actor'
                    });
                if (actorError) throw actorError;
            }

            const {data: imageData, error: imageError} = await supabase
            .storage
            .from('imgs')
            .upload('movies/'+movieId, selectedImage);


            if(imageData){
                alert('Película agregada con éxito');
                navigate('/adminMenu');
            }

        } catch (error) {
            console.error('Error adding movie:', error.message);
        }
    };

    if (!person) return <div>Loading...</div>;
    if (!person.isadmin) return <div>You do not have access to this page.</div>;

    return (
        <div>
            <Navbar />
            <div className="w3/4 mt-10 mb-10 flex flex-col items-center justify-center min-h-screen bg-[#1E1E1E]">
                <div className="bg-[#2A2A2A] p-8 rounded-lg shadow-lg  max-w-md">
                    <h2 className="text-3xl font-bold text-[#FFFFFF] text-center mb-8">Agregar Película</h2>
                    <form className="space-y-6" onSubmit={handleAddMovie}>
                        <div>
                            <label className="block text-[#B0B0B0] mb-2" htmlFor="title">Título</label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
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
                                onChange={(e) => setSynopsis(e.target.value)}
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
                            <button
                                type="submit"
                                className="px-6 py-2 bg-[#FF6600] text-[#FFFFFF] rounded-lg hover:bg-[#FF4500] focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                            >
                                Agregar Película
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddMovie;
