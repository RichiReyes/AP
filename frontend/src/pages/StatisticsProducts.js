import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';

const StatisticsProducts = () => {
    const [categoryStats, setCategoryStats] = useState([]);
    const supabase = useSupabaseClient();
    const [person, setPerson] = useState(null);
    const user = useUser();

    const fetchCategoryStats = async () => {
        try {
           
            const { data: movieCategoryCounts, error: movieCategoryError } = await supabase
                .rpc('get_category_counts', { table_name: 'moviexcategory' });
            if (movieCategoryError) throw movieCategoryError;

            
            const { data: showCategoryCounts, error: showCategoryError } = await supabase
                .rpc('get_category_counts', { table_name: 'showxcategory' });
            if (showCategoryError) throw showCategoryError;

            
            const combinedCounts = {};

            movieCategoryCounts.forEach(item => {
                combinedCounts[item.idcategory] = (combinedCounts[item.idcategory] || 0) + item.count;
            });

            showCategoryCounts.forEach(item => {
                combinedCounts[item.idcategory] = (combinedCounts[item.idcategory] || 0) + item.count;
            });

           
            const { data: categories, error: categoryError } = await supabase
                .from('category')
                .select('id, nombre');
            if (categoryError) throw categoryError;

            
            const categoryStatsData = Object.entries(combinedCounts).map(([id, count]) => {
                const category = categories.find(cat => cat.id === id);
                return { nombre: category?.nombre || 'Unknown', count };
            });

            setCategoryStats(categoryStatsData);
        } catch (error) {
            console.log('Error fetching category stats:', error);
        }
    };

    useEffect(() => {
        fetchCategoryStats();
    }, []);

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

    if (!person) {
        return <div>Loading...</div>;
    }

    if (!person.isadmin) {
        return <div>You do not have access to this page.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Navbar />
            <div className="max-w-4xl mx-auto p-6">
                <h2 className="text-3xl mt-8">Category Statistics</h2>
                <div className="mt-6">
                    {categoryStats.map((category, index) => (
                        <div key={index} className="p-4 bg-gray-800 rounded-lg mb-4 flex justify-between items-center">
                            <h3 className="text-lg">{category.nombre}</h3>
                            <p className="text-lg">{category.count} products</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StatisticsProducts;
