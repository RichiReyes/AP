import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useNavigate } from 'react-router-dom';

const AddAdmin = () => {
    const user = useUser();
    const supabase = useSupabaseClient();
    const navigate = useNavigate();
    const [person, setPerson] = useState(null);
    const [cargar, setCargar] = useState('');
    const [people, setPeople] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (user) {
                try {
                    const { data: personData, error: personError } = await supabase.rpc('get_person_by_user_id', { p_user_id: user.id });
                    if (personError) throw personError;
                    if (personData && personData.length > 0) setPerson(personData[0]);

                    const { data: peopleData, error: peopleError } = await supabase
                        .from('person')
                        .select('*')
                        .order('name', { ascending: true });
                    if (peopleError) throw (peopleError);
                    setPeople(peopleData);
                    setCargar('');

                } catch (error) {
                    console.error('Error fetching data:', error.message);
                }
            }
        };

        fetchData();
    }, [user, supabase, cargar]);

    const handleAddAdmin = async (personId) => {
        try {
            const { error } = await supabase
                .from('person')
                .update({ isAdmin: true })
                .eq('id', personId);
            if (error) throw error;
            setCargar('reload');
        } catch (error) {
            console.error('Error adding admin:', error.message);
        }
    };

    if (!person) return <div>Loading...</div>;
    if (!person.isadmin) return <div>You do not have access to this page.</div>;

    return (
        <div>
            <Navbar />
            <div className='flex flex-col m-6 space-y-5'>
                {people.filter(person => !person.isAdmin).map((person) => (
                    <div key={person.id} className='bg-neutral-700 rounded-md p-4 flex justify-between items-center'>
                        <h2 className='text-white text-base'>{person.name} {person.lastname}</h2>
                        <button
                            onClick={() => handleAddAdmin(person.id)}
                            className='px-4 py-2 bg-[#FF6600] text-[#FFFFFF] rounded-lg hover:bg-[#FF4500] focus:outline-none focus:ring-2 focus:ring-[#FF6600]'
                        >
                            Agregar Administrador
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AddAdmin;
