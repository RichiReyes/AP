import React, { useState } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { Button } from './ui/button';

const AddReview = ({ tipo, movie, onClose, fetchReviews }) => {
    const supabase = useSupabaseClient();
    const user = useUser();
    const [stars, setStars] = useState(0);
    const [description, setDescription] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (user) {
                const { data: reviewData, error: reviewError } = await supabase
                    .from('review')
                    .insert([{ stars, description, created_at: new Date(), last_update: new Date() }])
                    .select();

                if (reviewError) throw reviewError;

                const newReviewId = reviewData[0]?.id;

                if (tipo === 'movie') {
                    const { error: movieReviewError } = await supabase
                        .from('moviexreview')
                        .insert([{ idmovie: movie.id, idreview: newReviewId }]);
                    if (movieReviewError) throw movieReviewError;
                } else {
                    const { error: showReviewError } = await supabase
                        .from('showxreview')
                        .insert([{ idshow: movie.id, idreview: newReviewId }]);
                    if (showReviewError) throw showReviewError;
                }

                await fetchReviews();
                onClose();
            } else {
                console.error('User is not logged in');
            }
        } catch (error) {
            console.log('Error adding review:', error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-2xl mb-4">Agregar reseña</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Estrellas</label>
                        <input
                            type="number"
                            min="0"
                            max="5"
                            value={stars}
                            onChange={(e) => setStars(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Descripción</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-4">
                        <Button type="button" onClick={onClose}>Cancelar</Button>
                        <Button type="submit">Enviar</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddReview;
