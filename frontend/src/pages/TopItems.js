import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { Button } from '../components/ui/button';

const TopItems = () => {
    const [topN, setTopN] = useState(10); // Default to top 10 items
    const [topItems, setTopItems] = useState([]);
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

    const fetchTopItems = async () => {
        try {
            
            const { data: topMovies, error: movieError } = await supabase
                .from('movie')
                .select('id, title, releasedate, purchasequantity')
                .order('purchasequantity', { ascending: false })
                .limit(topN);
            if (movieError) throw movieError;

            
            const { data: topShows, error: showError } = await supabase
                .from('show')
                .select('id, name, releaseyear, purchasequantity')
                .order('purchasequantity', { ascending: false })
                .limit(topN);
            if (showError) throw showError;

            
            const combinedItems = [...topMovies, ...topShows].sort((a, b) => b.purchasequantity - a.purchasequantity);

           
            setTopItems(combinedItems.slice(0, topN));
        } catch (error) {
            console.log('Error fetching top items:', error);
        }
    };

    useEffect(() => {
        fetchTopItems();
    }, [topN]);

    const handleTopNChange = (e) => {
        setTopN(Number(e.target.value));
    };

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
                <h2 className="text-3xl mt-8">Top {topN} Most Sold Items</h2>
                <div className="flex items-center space-x-4 mt-4">
                    <input
                        type="number"
                        value={topN}
                        onChange={handleTopNChange}
                        className="px-4 py-2 bg-gray-800 border border-gray-700 rounded text-center w-20"
                        min="1"
                        max="100"
                    />
                    <Button onClick={fetchTopItems} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Fetch Top Items</Button>
                </div>
                <div className="mt-6">
                    {topItems.map(item => (
                        <div key={item.id} className="p-4 bg-gray-800 rounded-lg mb-4 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg">{item.title || item.name} ({item.releasedate || item.releaseyear})</h3>
                                <p>Purchase Quantity: {item.purchasequantity}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TopItems;
