import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Navbar from '../components/Navbar';

const ActorDirectorInfo = () => {
    const { id } = useParams();
    const supabase = useSupabaseClient();
    const [info, setInfo] = useState(null);
    const [familyMembers, setFamilyMembers] = useState([]);

    const CDNURL = "https://jheqfwbznxusdwclwccv.supabase.co/storage/v1/object/public/imgs/";
    const imageurl = CDNURL+'staff/'+id;

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                // Fetch actor/director information
                const { data: infoData, error: infoError } = await supabase
                    .rpc('get_actordirector_info', { actor_id: id });

                if (infoError) throw infoError;
                setInfo(infoData[0]);

                // Fetch family members
                const { data: familyData, error: familyError } = await supabase
                    .from('familymember')
                    .select('name, type')
                    .eq('idactordirector', id);

                if (familyError) throw familyError;
                setFamilyMembers(familyData);
            } catch (error) {
                console.log(error);
            }
        };

        fetchInfo();
    }, [id, supabase]);

    if (!info) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-purple-400 to-indigo-600 text-white p-6">
            <Navbar />
            <div className="container mx-auto bg-white text-black rounded-lg shadow-md p-6 mt-6">
                <h2 className="text-4xl font-bold mb-4">{info.name} {info.secondname} {info.lastname} {info.secondlastname}</h2>
                <p className="text-lg mb-2"><strong>Birthdate:</strong> {new Date(info.birthdate).toLocaleDateString()}</p>
                <p className="text-lg mb-2"><strong>Nationality:</strong> {info.nationality}</p>
                <p className="text-lg mb-2"><strong>Birthplace:</strong> {info.birthplace}</p>
                <p className="text-lg mb-2"><strong>Height:</strong> {info.height} cm</p>
                <p className="text-lg mb-4"><strong>Biography:</strong> {info.biography}</p>
                <h3 className="text-2xl font-semibold mb-2">Family Members:</h3>
                <ul className="list-disc list-inside mb-4">
                    {familyMembers.map((member, index) => (
                        <li key={index}>{member.name} - {member.type}</li>
                    ))}
                </ul>
                <h3 className="text-2xl font-semibold mb-2">Trivia:</h3>
                <p className="text-lg">{info.trivia}</p>
                <img src={imageurl} alt="No se encontró esta imagen" className='image-desc max-w-full max-h-[48rem] w-auto h-auto object-cover rounded-lg shadow-lg mb-4' />
            </div>
        </div>
    );
};

export default ActorDirectorInfo;
