import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button } from "../components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';

const Perfil = () => {
  const [fechaLoad, setFechaload] = useState('listo para mostrar');
  const user = useUser();
  const supabase = useSupabaseClient();
  const [person, setPerson] = useState({
    id: '',
    name: '',
    secondname: '',
    lastname: '',
    secondlastname: '',
    idnumber: '',
    birthdate: '',
    email: '',
  });
  const [cambios, setCambios] = useState(null);
  const [cambioUsuario, setCambiousuario] = useState('cargar');

  const [selectedDate, setSelectedDate] = useState(null);
  const [nationalities, setNationalities] = useState([]);
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState(null);
  const [cambioImagen, setCambioImagen] = useState(false);

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

    if (!person.person_id || !selectedImage) {
      alert('Please select an image and ensure user information is loaded.');
      return;
    }

    try {
      const { data: imageData, error: imageError } = await supabase
        .storage
        .from('imgs')
        .upload(`users/${user.id}`, selectedImage, { upsert: true });

      if (imageError) throw imageError;
      alert('Profile picture updated successfully');
      setCambioImagen(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (fechaLoad === 'listo para mostrar') {
      if (person && person.birthdate) {
        const [year, month, day] = person.birthdate.split('-');
        const newDate = new Date(year, month - 1, day);
        if (!isNaN(newDate)) {
          setSelectedDate(newDate);
          setFechaload('mostrado');
        }
      }
    }
  }, [person, fechaLoad]);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const { data } = await supabase.rpc('get_person_by_user_id', { p_user_id: user.id });
          if (data && data.length > 0) {
            setPerson(data[0]);
            setCambiousuario(null);
          }
        } catch (error) {
          console.error('Error calling stored procedure:', error.message);
        }
      }
    };
    fetchData();
  }, [user, supabase, cambioUsuario]);

  useEffect(() => {
    const fetchNationalities = async () => {
      try {
        const { data, error } = await supabase.from('nationality').select('id, name');
        if (error) throw error;
        setNationalities(data);
      } catch (error) {
        console.error('Error fetching nationalities:', error.message);
      }
    };
    fetchNationalities();
  }, [supabase]);

  const menuAdmin = () => {
    navigate('/adminMenu');
  }

  const handleLogOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phonenumber' || name === 'idnumber') {
      const numericValue = value.replace(/\D/, '');
      setPerson((prevPerson) => ({
        ...prevPerson,
        [name]: numericValue,
      }));
      setCambios('cambio');
    } else {
      setPerson((prevPerson) => ({
        ...prevPerson,
        [name]: value,
      }));
      setCambios('cambio');
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const formattedDate = date ? date.toISOString().split('T')[0] : '';
    setPerson((prevPerson) => ({
      ...prevPerson,
      birthdate: formattedDate,
    }));
    setCambios('cambio');
  };

  const handleNationalityChange = (e) => {
    const { value } = e.target;
    setPerson(prevPerson => ({
      ...prevPerson,
      nationality: value,
    }));
    setCambios('cambio');
  };

  const handleCambio = async () => {
    try {
      const { data, error } = await supabase.rpc('update_person', {
        p_id: person.id,
        p_name: person.name,
        p_secondname: person.secondname,
        p_lastname: person.lastname,
        p_secondlastname: person.secondlastname,
        p_idnumber: person.idnumber,
        p_birthdate: person.birthdate,
        p_nationality: person.nationality,
        p_phonenumber: person.phonenumber,
        p_community: person.community
      });

      if (data) {
        window.setTimeout(() => {
          alert("Cambios realizados con éxito");
          setCambios(null);
          setCambiousuario('cargar');
        }, 100);
      }
      if (error) {
        console.log(error);
      }
    } catch {
      console.log("Error updating person");
    }
  }

  if (person) {
    return (
      <div className='h-screen'>
        <Navbar />
        <div className='flex flex-col p-4'>
          <h2 className='text-white text-3xl'>Perfil</h2>
          <div className='bg-cardBackground w-11/12 rounded-md flex flex-row self-center px-20 py-4 mt-6'>
            <div className='flex flex-col space-y-12 items-start'>
              <h2 className='text-white h-8'>Nombre:</h2>
              <h2 className='text-white h-8'>Segundo Nombre:</h2>
              <h2 className='text-white h-8'>Primer Apellido:</h2>
              <h2 className='text-white h-8'>Segundo Apellido:</h2>
              <h2 className='text-white h-8'>Número Teléfono:</h2>
              <h2 className='text-white h-8'>Comunidad:</h2>
              <h2 className='text-white h-8'>No. Identificación:</h2>
              <h2 className='text-white h-8'>Fecha de Nacimiento:</h2>
              <h2 className='text-white h-8'>Correo Electrónico:</h2>
            </div>
            <div className='flex flex-col space-y-12 items-start px-6'>
              <input
                className='bg-white text-black hover:bg-gray-200 w-60
                  focus:outline-none focus:ring-2 focus:ring-[#FF6600] border border-gray-300 p-2 rounded h-8'
                type='text'
                placeholder='Nombre'
                name='name'
                value={person.name}
                onChange={handleChange}
              />
              <input
                className='bg-white text-black hover:bg-gray-200 w-60
                  focus:outline-none focus:ring-2 focus:ring-[#FF6600] border border-gray-300 p-2 rounded h-8'
                type='text'
                placeholder='Segundo Nombre'
                name='secondname'
                value={person.secondname}
                onChange={handleChange}
              />
              <input
                className='bg-white text-black hover:bg-gray-200 w-60
                  focus:outline-none focus:ring-2 focus:ring-[#FF6600] border border-gray-300 p-2 rounded h-8'
                type='text'
                placeholder='Primer Apellido'
                name='lastname'
                value={person.lastname}
                onChange={handleChange}
              />
              <input
                className='bg-white text-black hover:bg-gray-200 w-60
                  focus:outline-none focus:ring-2 focus:ring-[#FF6600] border border-gray-300 p-2 rounded h-8'
                type='text'
                placeholder='Segundo Apellido'
                name='secondlastname'
                value={person.secondlastname}
                onChange={handleChange}
              />
              <input
                type='text'
                placeholder='Número de teléfono'
                name='phonenumber'
                value={person.phonenumber}
                onChange={handleChange}
                className='bg-white text-black hover:bg-gray-200 w-60
                  focus:outline-none focus:ring-2 focus:ring-[#FF6600] border border-gray-300 p-2 rounded h-8'
              />
              <input
                type='text'
                placeholder='Comunidad'
                name='community'
                value={person.community}
                onChange={handleChange}
                className='bg-white text-black hover:bg-gray-200 w-60
                  focus:outline-none focus:ring-2 focus:ring-[#FF6600] border border-gray-300 p-2 rounded h-8'
              />
              <input
                className='bg-white text-black hover:bg-gray-200 w-60
                  focus:outline-none focus:ring-2 focus:ring-[#FF6600] border border-gray-300 p-2 rounded h-8'
                type='text'
                placeholder='Identificacion'
                name='idnumber'
                value={person.idnumber}
                onChange={handleChange}
              />
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                className="w-full px-4 py-2 bg-white text-black border border-[#3C3C3C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                dateFormat="yyyy-MM-dd"
                showYearDropdown
                yearDropdownItemNumber={40}
                scrollableYearDropdown
              />
              <input
                className='bg-white text-black hover:bg-gray-200 w-60
                  focus:outline-none focus:ring-2 focus:ring-[#FF6600] border border-gray-300 p-2 rounded h-8'
                type='text'
                placeholder='correo'
                name='email'
                value={user?.email || ''}
                onChange={handleChange}
                disabled={true}
              />
            </div>
            <div className='flex flex-col px-4 items-start'>
              <h2 className='text-white text-lg'>Nacionalidad</h2>
              <div className="w-auto">
                <div className="mt-1 relative">
                  <select
                    id="combo-box"
                    name="combo-box"
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white shadow-sm"
                    value={person.nationality}
                    onChange={handleNationalityChange}
                  >
                    {nationalities.map(nationality => (
                      <option key={nationality.id} value={nationality.id}> {/* Set value to nationality.id */}
                        {nationality.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 3a1 1 0 01.7.3l5 5a1 1 0 01-1.4 1.4L10 5.4l-4.3 4.3a1 1 0 01-1.4-1.4l5-5A1 1 0 0110 3z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <h2 className='text-white text-lg'>Foto de Perfil</h2>
            <div className="file-chooser-container px-2 py-2 shadow-lg rounded-lg h-16">
              <label htmlFor="file-upload" className="file-chooser-label flex items-center justify-center cursor-pointer bg-white text-black py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50">
                <svg className="w-6 h-6 mr-2 text-black" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M12 2a5 5 0 0 1 5 5v1h1.5A2.5 2.5 0 0 1 21 10.5V18a2 2 0 0 1-2 2h-5v-5H10v5H5a2 2 0 0 1-2-2v-7.5A2.5 2.5 0 0 1 5.5 9H7V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v1h6V7a3 3 0 0 0-3-3z" />
                </svg>
                <span>Escoger imagen</span>
                <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
              {cambioImagen && <button
                onClick={updateImage}
                className="mt-10 px-6 py-2 bg-[#FF6600] text-[#FFFFFF] rounded-lg hover:bg-[#FF4500] focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
              >
                Cambiar Imagen
              </button>}
            </div>
          </div>
        </div>
        <div className='flex items-start flex-row space-x-3 px-10 pb-10'>
          {person.isadmin && <Button onClick={menuAdmin}>Administrador</Button>}
          <Button onClick={handleLogOut}>LogOut</Button>
          {cambios && <Button onClick={handleCambio}>Guardar Cambios</Button>}
        </div>
      </div>
    );
  }

  return null; // Return null while loading
}

export default Perfil;
