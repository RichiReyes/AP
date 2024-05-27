import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useNavigate } from 'react-router-dom';

const AddPlatform = () => {
    const user = useUser();
    const supabase = useSupabaseClient();
    const navigate = useNavigate();
    const [person, setPerson] = useState(null);
    const [platformName, setPlatformName] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            if (user) {
                try {
                    const { data, error } = await supabase.rpc('get_person_by_user_id', { p_user_id: user.id });

                    if (error) {
                        throw error;
                    }

                    if (data && data.length > 0) {
                        setPerson(data[0]);
                    }
                } catch (error) {
                    console.error('Error calling stored procedure:', error.message);
                }
            }
        };

        fetchData();
    }, [user, supabase]);

    const handleAddPlatform = async (e) => {
        e.preventDefault();
        if (!platformName) {
            alert('Porfavor inserte un nombre.');
            return;
        }

        try {
            const { data, error } = await supabase
                .from('platform')
                .insert([{ name: platformName }]);

            if (error) {
                throw error;
            }

            alert('Platforma agregada con éxito');
            navigate("/adminMenu");
        } catch (error) {
            console.error('Error adding platform:', error.message);
            alert('Error adding platform');
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
            <Navbar />
            <div className="mt-10 flex flex-col items-center justify-center min-h-screen bg-[#1E1E1E]">
                <div className="bg-[#2A2A2A] p-8 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-3xl font-bold text-[#FFFFFF] text-center mb-8">Agregar Plataforma</h2>
                    <form onSubmit={handleAddPlatform} className="space-y-6">
                        <div>
                            <label className="block text-[#B0B0B0] mb-2" htmlFor="platformName">Nombre de Plataforma</label>
                            <input
                                type="text"
                                id="platformName"
                                value={platformName}
                                onChange={(e) => setPlatformName(e.target.value)}
                                className="w-full px-4 py-2 bg-[#2C2C2C] text-[#FFFFFF] border border-[#3C3C3C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 bg-[#FF6600] text-[#FFFFFF] rounded-lg hover:bg-[#e65c00] focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                        >
                            Agregar Plataforma
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddPlatform;
