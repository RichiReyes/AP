import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useNavigate } from 'react-router-dom';

const AddCategory = () => {
    const user = useUser();
    const supabase = useSupabaseClient();
    const navigate = useNavigate();

    const [person, setPerson] = useState(null);
    const [categoryName, setCategoryName] = useState('');

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

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!categoryName) {
            alert('Please enter a category name.');
            return;
        }

        try {
            const { data, error } = await supabase
                .from('category')  
                .insert([{ nombre: categoryName }]);

            if (error) {
                throw error;
            }

            alert('Categoría añadida con éxito');
            navigate("/adminMenu");
        } catch (error) {
            console.error('Error adding category:', error.message);
            alert('Error adding category');
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
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#1E1E1E] mt-10">
                <div className="bg-[#2A2A2A] p-8 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-3xl font-bold text-[#FFFFFF] text-center mb-8">Agregar Categoría</h2>
                    <form onSubmit={handleAddCategory} className="space-y-6">
                        <div>
                            <label className="block text-[#B0B0B0] mb-2" htmlFor="categoryName">Nombre de Categoría</label>
                            <input
                                type="text"
                                id="categoryName"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                className="w-full px-4 py-2 bg-[#2C2C2C] text-[#FFFFFF] border border-[#3C3C3C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 bg-[#FF6600] text-[#FFFFFF] rounded-lg hover:bg-[#e65c00] focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                        >
                            Agregar Categoría
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddCategory;
