import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

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

    const data = {
        labels: categoryStats.map(stat => stat.nombre),
        datasets: [
            {
                label: 'Products by Category',
                data: categoryStats.map(stat => stat.count),
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#FF9F40', '#4BC0C0',
                    '#9966FF', '#FF9F80', '#FFCD56', '#8DFF57', '#575EFF',
                    '#FF5757', '#57FFA5', '#FFA857', '#D957FF', '#57E8FF',
                    '#FF57E8', '#9EFF57', '#FF8D57', '#5757FF', '#A857FF'
                ],
                hoverBackgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#FF9F40', '#4BC0C0',
                    '#9966FF', '#FF9F80', '#FFCD56', '#8DFF57', '#575EFF',
                    '#FF5757', '#57FFA5', '#FFA857', '#D957FF', '#57E8FF',
                    '#FF57E8', '#9EFF57', '#FF8D57', '#5757FF', '#A857FF'
                ],
            },
        ],
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Navbar />
            <div className="max-w-4xl mx-auto p-6">
                <h2 className="text-3xl mt-8">Estadísticas por categoría</h2>
                <div className="mt-6">
                    <Pie data={data} />
                </div>
            </div>
        </div>
    );
    
};

export default StatisticsProducts;
