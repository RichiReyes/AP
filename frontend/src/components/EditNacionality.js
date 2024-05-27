import { useSupabaseClient } from '@supabase/auth-helpers-react';
import React, { useEffect, useState } from 'react';

const EditNacionality = ({idEditar, volver}) => {
    
    const supabase = useSupabaseClient();
    const [nationalityName, setNationalityName] = useState('');
    const [loading, setLoading] = useState(false);
    

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const { data, error } = await supabase.from('nationality').select('name').eq('id', idEditar).single();
                if (error) throw error;
                setNationalityName(data.name);
            } catch (error) {
                console.error('Error fetching category:', error.message);
            }
        };

        fetchCategory();
    }, [idEditar, supabase]);

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.rpc('update_nationality_name', {
                p_id: idEditar,
                p_new_name: nationalityName
            });

            if (error) throw error;
            alert('Nacionalidad editada con éxito');
            volver();
        } catch (error) {
            console.error('Error updating nationality:', error.message);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className='m-6 self-center bg-neutral-700 flex flex-col space-y-2 p-4 rounded-lg'>
            <label className='text-white mb-2' htmlFor='categoryName'>Actualizar nombre de nacionalidad</label>
            <input
                type='text'
                id='categoryName'
                value={nationalityName}
                onChange={(e) => setNationalityName(e.target.value)}
                className='w-full px-4 py-2 bg-[#2C2C2C] text-[#FFFFFF] border border-[#3C3C3C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6600]'
            />
            <button
                onClick={handleUpdate}
                disabled={loading}
                className='px-6 py-2 bg-[#FF6600] text-[#FFFFFF] rounded-lg hover:bg-[#FF4500] focus:outline-none focus:ring-2 focus:ring-[#FF6600]'
            >
                {loading ? 'Actualizando...' : 'Actualizar'}
            </button>
        </div>
    );
}

export default EditNacionality;
