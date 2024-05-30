import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const ageRanges = [
    { range: '0-17', min: 0, max: 17 },
    { range: '18-25', min: 18, max: 25 },
    { range: '26-35', min: 26, max: 35 },
    { range: '36-45', min: 36, max: 45 },
    { range: '46-60', min: 46, max: 60 },
    { range: '61+', min: 61, max: Infinity },
];

const groupByAgeRange = (ages) => {
    const ageGroupCounts = {};
    ageRanges.forEach(range => {
        ageGroupCounts[range.range] = 0;
    });

    ages.forEach(age => {
        const range = ageRanges.find(r => age >= r.min && age <= r.max);
        if (range) {
            ageGroupCounts[range.range]++;
        }
    });

    return ageGroupCounts;
};

const calculateAge = (birthdate) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

const StatsAges = () => {
    const [ageStats, setAgeStats] = useState({});
    const supabase = useSupabaseClient();
    const [person, setPerson] = useState(null);
    const user = useUser();

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

    const fetchUserAges = async () => {
        try {
            const { data: users, error } = await supabase
                .from('person')
                .select('birthdate');
            if (error) throw error;

            const ages = users.map(user => calculateAge(user.birthdate));
            const groupedAges = groupByAgeRange(ages);
            setAgeStats(groupedAges);
        } catch (error) {
            console.log('Error fetching user ages:', error);
        }
    };

    useEffect(() => {
        fetchUserAges();
    }, []);

    if (!person) {
        return <div>Loading...</div>;
    }

    if (!person.isadmin) {
        return <div>You do not have access to this page.</div>;
    }

    const data = {
        labels: Object.keys(ageStats),
        datasets: [
            {
                label: 'Users by Age Range',
                data: Object.values(ageStats),
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#FF9F40',
                    '#FFCD56',
                    '#4BC0C0',
                ],
                hoverBackgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#FF9F40',
                    '#FFCD56',
                    '#4BC0C0',
                ],
            },
        ],
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Navbar />
            <div className="max-w-4xl mx-auto p-6">
                <h2 className="text-3xl mt-8">Estadísticas de usuarios por edad</h2>
                <div className="mt-6">
                    <Pie data={data} />
                </div>
            </div>
        </div>
    );
};

export default StatsAges;
