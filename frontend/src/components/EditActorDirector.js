import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';

const EditActorDirector = ({ id, volver }) => {
    const user = useUser();
    const supabase = useSupabaseClient();
    const navigate = useNavigate();

    const [person, setPerson] = useState(null);
    const [actorData, setActorData] = useState(null);
    const [name, setName] = useState('');
    const [secondName, setSecondName] = useState('');
    const [lastName, setLastName] = useState('');
    const [secondLastName, setSecondLastName] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [birthdate, setBirthdate] = useState('');
    const [nationalities, setNationalities] = useState([]);
    const [selectedNationality, setSelectedNationality] = useState('');
    const [birthplace, setBirthplace] = useState('');
    const [biography, setBiography] = useState('');
    const [trivia, setTrivia] = useState('');
    const [height, setHeight] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);

    const [parents, setParents] = useState([]);
    const [children, setChildren] = useState([]);
    const [partner, setPartner] = useState([]);
    const [siblings, setSiblings] = useState([]);

    const [parentName, setParentName] = useState('');
    const [childName, setChildName] = useState('');
    const [partnerName, setPartnerName] = useState('');
    const [siblingName, setSiblingName] = useState('');

    const[cambio, setCambio] = useState(false);
    const[cambioImagen, setCambioImagen] = useState(false);

    const addNameToList = (list, setList, name, setName) => {
        if (name.trim()) {
            setList([...list, name.trim()]);
            setName('');
            setCambio(true);
        }
    };

    const removeNameFromList = (list, setList, index) => {
        const newList = list.filter((_, i) => i !== index);
        setList(newList);
        setCambio(true);
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

    const updateImage = async() => {
        if(!selectedImage){
            alert('Seleccione una imagen');
            return;
        }
        try{
            if (selectedImage) {
                const { data: imageData, error: imageError } = await supabase
                    .storage
                    .from('imgs')
                    .update("staff/" + id, selectedImage);

                if (imageError) {
                    console.log(imageError);
                } else {
                    alert('Imagen actualizada.')
                }
            }
        } catch(error){
            console.log(error);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            if (user) {
                try {
                    const { data: personData, error: personError } = await supabase.rpc('get_person_by_user_id', { p_user_id: user.id });
                    if (personError) throw personError;
                    if (personData && personData.length > 0) setPerson(personData[0]);

                    const { data, error } = await supabase.rpc('get_actor_director_by_id', { p_id: id });

                    if (error) {
                        throw error;
                    }

                    if (data && data.length > 0) {
                        const actorDirector = data[0];
                        setName(actorDirector.name);
                        setSecondName(actorDirector.secondname);
                        setLastName(actorDirector.lastname);
                        setSecondLastName(actorDirector.secondlastname);
                        setBirthdate(actorDirector.birthdate);
                        setSelectedDate(new Date(actorDirector.birthdate));
                        setSelectedNationality(actorDirector.nationality);
                        setBirthplace(actorDirector.birthplace);
                        setHeight(actorDirector.height);
                        setTrivia(actorDirector.trivia);
                        setBiography(actorDirector.biography);
                    }
                    const { data: familyData, error: familyError } = await supabase
                        .from('familymember')
                        .select('*')
                        .eq('idactordirector', id);
                    if (familyError) throw familyError;

                    setParents(familyData.filter(member => member.type === 'father').map(member => member.name));
                    setChildren(familyData.filter(member => member.type === 'child').map(member => member.name));
                    setPartner(familyData.filter(member => member.type === 'pareja').map(member => member.name));
                    setSiblings(familyData.filter(member => member.type === 'sibling').map(member => member.name));

                    const { data: nationalitiesData, error: nationalitiesError } = await supabase
                        .from('nationality')
                        .select('id, name')
                        .order('name');
                    if (nationalitiesError) throw nationalitiesError;
                    setNationalities(nationalitiesData);

                } catch (error) {
                    console.error('Error fetching data:', error.message);
                }
            }
        };

        fetchData();
    }, [user, supabase, id]);

    const handleDateChange = (date) => {
        setSelectedDate(date);
        const formattedDate = date ? date.toISOString().split('T')[0] : '';
        setBirthdate(formattedDate);
        setCambio(true);
    };

    const handleNationalityChange = (e) => {
        setSelectedNationality(e.target.value);
        setCambio(true);
    };

    const handleUpdateStaff = async (e) => {
        e.preventDefault();
        if (!name || !lastName || !birthdate || !selectedNationality || !birthplace || !biography || !trivia || !height) {
            alert('Rellene todos los campos necesarios.');
            return;
        }
        try {
            const { data: updateStaffData, error: updateStaffError } = await supabase.rpc('update_actor_director', {
                p_id: id,
                p_name: name,
                p_secondname: secondName,
                p_lastname: lastName,
                p_secondlastname: secondLastName,
                p_birthdate: birthdate,
                p_nationality: selectedNationality,
                p_birthplace: birthplace,
                p_height: parseFloat(height),
                p_trivia: trivia,
                p_biography: biography,
            });
            if (updateStaffError) {
                console.error('UpdateStaff error:', updateStaffError);
                alert(updateStaffError.message);
                return;
            }

            const familyMembers = [
                ...parents.map((parent) => ({ name: parent, type: 'father' })),
                ...children.map((child) => ({ name: child, type: 'child' })),
                ...partner.map((part) => ({ name: part, type: 'pareja' })),
                ...siblings.map((sibling) => ({ name: sibling, type: 'sibling' })),
            ];
            for (const member of familyMembers) {
                const { error: insertFamilyMemberError } = await supabase.rpc('insert_family_member', {
                    p_idactor_director: id,
                    p_name: member.name,
                    p_type: member.type,
                });

                if (insertFamilyMemberError) {
                    console.error('InsertFamilyMember error:', insertFamilyMemberError);
                    alert(insertFamilyMemberError.message);
                    return;
                }
            }

            
            setCambio(false);
            alert('Actualizado con éxito');
            volver();
        } catch (error) {
            console.error('Error updating staff member:', error.message);
        }
    };

    if (!person) {
        return <div>Loading...</div>;
    }

    if (!person.isadmin) {
        return <div>You do not have access to this page.</div>;
    }

    return (
        <div>
            <div className='flex flex-row space-x-3'>
                
                <div className='w-3/6 bg-neutral-700 flex flex-col p-8 rounded-lg mx-auto my-10'>
                <button onClick={volver} className="mb-4 px-6 py-2 bg-[#FF6600] text-[#FFFFFF] rounded-lg hover:bg-[#FF4500] focus:outline-none focus:ring-2 focus:ring-[#FF6600]">
                    Volver
                </button>
                    <h2 className="text-3xl font-bold text-white text-center mb-8">Editar Actor/Director</h2>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-[#B0B0B0] mb-2" htmlFor="name">Nombre</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => {setName(e.target.value); setCambio(true)}}
                                className="w-full px-4 py-2 bg-[#2C2C2C] text-[#FFFFFF] border border-[#3C3C3C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                            />
                        </div>
                        <div>
                            <label className="block text-[#B0B0B0] mb-2" htmlFor="secondName">Segundo Nombre</label>
                            <input
                                type="text"
                                id="secondName"
                                value={secondName}
                                onChange={(e) => {setSecondName(e.target.value); setCambio(true);}}
                                className="w-full px-4 py-2 bg-[#2C2C2C] text-[#FFFFFF] border border-[#3C3C3C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                            />
                        </div>
                        <div>
                            <label className="block text-[#B0B0B0] mb-2" htmlFor="lastName">Primer Apellido</label>
                            <input
                                type="text"
                                id="lastName"
                                value={lastName}
                                onChange={(e) => {setLastName(e.target.value); setCambio(true);}}
                                className="w-full px-4 py-2 bg-[#2C2C2C] text-[#FFFFFF] border border-[#3C3C3C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                            />
                        </div>
                        <div>
                            <label className="block text-[#B0B0B0] mb-2" htmlFor="secondLastName">Segundo Apellido</label>
                            <input
                                type="text"
                                id="secondLastName"
                                value={secondLastName}
                                onChange={(e) => {setSecondLastName(e.target.value); setCambio(true);}}
                                className="w-full px-4 py-2 bg-[#2C2C2C] text-[#FFFFFF] border border-[#3C3C3C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                            />
                        </div>
                        <div>
                            <label className="block text-[#B0B0B0] mb-2" htmlFor="birthdate">Fecha de Nacimiento</label>
                            <DatePicker
                                selected={selectedDate}
                                onChange={handleDateChange}
                                className="w-full px-4 py-2 bg-white text-black border border-[#3C3C3C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                                dateFormat="yyyy-MM-dd"
                                showYearDropdown
                                yearDropdownItemNumber={70}
                                scrollableYearDropdown
                            />
                        </div>
                        <div>
                            <label className="block text-[#B0B0B0] mb-2" htmlFor="nationality">Nacionalidad</label>
                            <select
                                id="nationality"
                                value={selectedNationality}
                                onChange={handleNationalityChange}
                                className="block w-full pl-3 pr-10 py-2 bg-[#2C2C2C] text-[#FFFFFF] border border-[#3C3C3C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                            >
                                <option value="">Select Nationality</option>
                                {nationalities.map((nationality) => (
                                    <option key={nationality.id} value={nationality.id}>
                                        {nationality.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[#B0B0B0] mb-2" htmlFor="birthplace">Lugar de nacimiento</label>
                            <input
                                type="text"
                                id="birthplace"
                                value={birthplace}
                                onChange={(e) => {setBirthplace(e.target.value); setCambio(true);}}
                                className="w-full px-4 py-2 bg-[#2C2C2C] text-[#FFFFFF] border border-[#3C3C3C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                            />
                        </div>
                        <div>
                            <label className="block text-[#B0B0B0] mb-2" htmlFor="biography">Biografía</label>
                            <textarea
                                id="biography"
                                value={biography}
                                onChange={(e) => {setBiography(e.target.value); setCambio(true);}}
                                className="w-full px-4 py-2 bg-[#2C2C2C] text-[#FFFFFF] border border-[#3C3C3C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                            />
                        </div>
                        <div>
                            <label className="block text-[#B0B0B0] mb-2" htmlFor="trivia">Trivia</label>
                            <textarea
                                id="trivia"
                                value={trivia}
                                onChange={(e) => {setTrivia(e.target.value); setCambio(true);}}
                                className="w-full px-4 py-2 bg-[#2C2C2C] text-[#FFFFFF] border border-[#3C3C3C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                            />
                        </div>
                        <div>
                            <label className="block text-[#B0B0B0] mb-2" htmlFor="height">Estatura (en m)</label>
                            <input
                                type="number"
                                id="height"
                                value={height}
                                onChange={(e) => {setHeight(parseFloat(e.target.value)); setCambio(true);}}
                                className="w-full px-4 py-2 bg-[#2C2C2C] text-[#FFFFFF] border border-[#3C3C3C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                                step="0.01"
                            />
                        </div>
                        <div className="flex justify-center">
                            {cambio && <button
                                onClick={handleUpdateStaff}
                                className="px-6 py-2 bg-[#FF6600] text-[#FFFFFF] rounded-lg hover:bg-[#FF4500] focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                            >
                                Actualizar Actor/Director
                            </button>}
                        </div>
                    </div>
                </div>
                <div className='w-3/6 bg-neutral-700 flex flex-col p-8 rounded-lg mx-auto my-10'>
                    <h2 className="text-xl font-bold text-white text-center mb-8">Familiares</h2>
                    <div>
                        <label className="block text-[#B0B0B0] mb-2" htmlFor="parents">Padres</label>
                        <input
                            type="text"
                            id="parents"
                            value={parentName}
                            onChange={(e) => setParentName(e.target.value)}
                            className="w-full px-4 py-2 mb-2 bg-[#2C2C2C] text-[#FFFFFF] border border-[#3C3C3C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                        />
                        <button
                            type="button"
                            onClick={() => addNameToList(parents, setParents, parentName, setParentName)}
                            className="px-4 py-2 mb-4 bg-[#FF6600] text-[#FFFFFF] rounded-lg hover:bg-[#FF4500] focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                        >
                            Añadir Padre/Madre
                        </button>
                        <ul className="list-disc list-inside text-white">
                            {parents.map((parent, index) => (
                                <li className='hover: cursor-pointer' onClick={() => removeNameFromList(parents, setParents, index)} key={index}>{parent}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <label className="block text-[#B0B0B0] mb-2" htmlFor="children">Hijos</label>
                        <input
                            type="text"
                            id="children"
                            value={childName}
                            onChange={(e) => setChildName(e.target.value)}
                            className="w-full px-4 py-2 mb-2 bg-[#2C2C2C] text-[#FFFFFF] border border-[#3C3C3C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                        />
                        <button
                            type="button"
                            onClick={() => addNameToList(children, setChildren, childName, setChildName)}
                            className="px-4 py-2 mb-4 bg-[#FF6600] text-[#FFFFFF] rounded-lg hover:bg-[#FF4500] focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                        >
                            Añadir Hijo/a
                        </button>
                        <ul className="list-disc list-inside text-white">
                            {children.map((child, index) => (
                                <li className='hover: cursor-pointer' onClick={() => removeNameFromList(children, setChildren, index)} key={index}>{child}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <label className="block text-[#B0B0B0] mb-2" htmlFor="partner">Pareja</label>
                        <input
                            type="text"
                            id="partner"
                            value={partnerName}
                            onChange={(e) => setPartnerName(e.target.value)}
                            className="w-full px-4 py-2 mb-2 bg-[#2C2C2C] text-[#FFFFFF] border border-[#3C3C3C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                        />
                        <button
                            type="button"
                            onClick={() => addNameToList(partner, setPartner, partnerName, setPartnerName)}
                            className="px-4 py-2 mb-4 bg-[#FF6600] text-[#FFFFFF] rounded-lg hover:bg-[#FF4500] focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                        >
                            Añadir Pareja
                        </button>
                        <ul className="list-disc list-inside text-white">
                            {partner.map((part, index) => (
                                <li className='hover: cursor-pointer' onClick={() => removeNameFromList(partner, setPartner, index)} key={index}>{part}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <label className="block text-[#B0B0B0] mb-2" htmlFor="siblings">Hermanos</label>
                        <input
                            type="text"
                            id="siblings"
                            value={siblingName}
                            onChange={(e) => setSiblingName(e.target.value)}
                            className="w-full px-4 py-2 mb-2 bg-[#2C2C2C] text-[#FFFFFF] border border-[#3C3C3C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                        />
                        <button
                            type="button"
                            onClick={() => addNameToList(siblings, setSiblings, siblingName, setSiblingName)}
                            className="px-4 py-2 mb-4 bg-[#FF6600] text-[#FFFFFF] rounded-lg hover:bg-[#FF4500] focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                        >
                            Add Hermano/a
                        </button>
                        <ul className="list-disc list-inside text-white">
                            {siblings.map((sibling, index) => (
                                <li className='hover: cursor-pointer' onClick={() => removeNameFromList(siblings, setSiblings, index)} key={index}>{sibling}</li>
                            ))}
                        </ul>

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
                    {cambioImagen && <button
                                onClick={updateImage}
                                className="px-6 py-2 bg-[#FF6600] text-[#FFFFFF] rounded-lg hover:bg-[#FF4500] focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                            >
                                Actualizar Imagen
                            </button>}
                    
                </div>

            </div>
        </div>
    );
};

export default EditActorDirector;
