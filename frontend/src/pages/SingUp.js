import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const SignUp = () => {
    const navigate = useNavigate();
    const supabase = useSupabaseClient();
    const user = useUser();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [secondName, setSecondName] = useState('');
    const [lastName, setLastName] = useState('');
    const [secondLastName, setSecondLastName] = useState('');
    const [idNumber, setIdNumber] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [community, setCommunity] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [birthdate, setBirthdate] = useState('');
    const [nationalities, setNationalities] = useState([]);
    const [selectedNationality, setSelectedNationality] = useState('');

    useEffect(() => {
        const fetchNationalities = async () => {
            try {
                const { data, error } = await supabase.from('nationality').select('id, name').order('name');
                if (error) throw error;
                setNationalities(data);
            } catch (error) {
                console.error('Error fetching nationalities:', error.message);
            }
        };

        fetchNationalities(); // Fetch nationalities
    }, [supabase]);

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (!email || !password || !name || !lastName || !idNumber || !phoneNumber || !community || !birthdate || !selectedNationality) {
            alert('Please fill in all fields.');
            return;
        }

        const { data: dataSignup, error: signUpError } = await supabase.auth.signUp({ email, password });

        if (signUpError) {
            console.error('SignUp error:', signUpError);
            alert(signUpError.message);
            return;
        }

        if (dataSignup) {
            const userId = dataSignup.user.id;

            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });

            if (signInError) {
                console.error('SignIn error:', signInError);
                alert(signInError.message);
                return;
            }
            // Adding a delay of 1 second before inserting person data
            setTimeout(async () => {
                if (signInData) {
                    
                    const { data: insertPersonData, error: insertPersonError } = await supabase.rpc('insert_person', {
                        p_name: name,
                        p_secondname: secondName,
                        p_lastname: lastName,
                        p_secondlastname: secondLastName,
                        p_idnumber: idNumber,
                        p_birthdate: birthdate,
                        p_nationality: selectedNationality,
                        p_phonenumber: phoneNumber,
                        p_community: community,
                        p_iduser: userId,
                        p_isadmin: false,
                    });

                    if (insertPersonError) {
                        console.error('InsertPerson error:', insertPersonError);
                        alert(insertPersonError.message);
                    } else {
                        console.log('InsertPerson success:', insertPersonData);
                        alert('User signed up successfully');
                        navigate('/'); // Navigate to some page after successful insertion
                    }
                }
            }, 3000); // 1000 milliseconds = 1 second delay
        }
    };

    const handleLogin = () => {
        navigate('/login');
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        const formattedDate = date ? date.toISOString().split('T')[0] : '';
        setBirthdate(formattedDate);
    };

    const handleNationalityChange = (e) => {
        setSelectedNationality(e.target.value);
    };

    return (
        <div>
            <Navbar />
            <div className="h-1/2 overflow-y-auto flex items-center justify-center bg-[#1E1E1E] mt-10 mb-10">
                <div className="bg-[#2A2A2A] p-8 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-3xl font-bold text-[#FFFFFF] text-center mb-8">Sign Up</h2>
                    <form onSubmit={handleSignUp} className="space-y-6">
                        <div>
                            <label className="block text-[#B0B0B0] mb-2" htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                className="w-full px-4 py-2 bg-[#2C2C2C] text-[#FFFFFF] border border-[#3C3C3C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-[#B0B0B0] mb-2" htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                className="w-full px-4 py-2 bg-[#2C2C2C] text-[#FFFFFF] border border-[#3C3C3C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-[#B0B0B0] mb-2" htmlFor="name">Name</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2 bg-[#2C2C2C] text-[#FFFFFF] border border-[#3C3C3C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                            />
                        </div>
                        <div>
                            <label className="block text-[#B0B0B0] mb-2" htmlFor="secondName">Second Name</label>
                            <input
                                type="text"
                                id="secondName"
                                value={secondName}
                                onChange={(e) => setSecondName(e.target.value)}
                                className="w-full px-4 py-2 bg-[#2C2C2C] text-[#FFFFFF] border border-[#3C3C3C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                            />
                        </div>
                        <div>
                            <label className="block text-[#B0B0B0] mb-2" htmlFor="lastName">Last Name</label>
                            <input
                                type="text"
                                id="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full px-4 py-2 bg-[#2C2C2C] text-[#FFFFFF] border border-[#3C3C3C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                            />
                        </div>
                        <div>
                            <label className="block text-[#B0B0B0] mb-2" htmlFor="secondLastName">Second Last Name</label>
                            <input
                                type="text"
                                id="secondLastName"
                                value={secondLastName}
                                onChange={(e) => setSecondLastName(e.target.value)}
                                className="w-full px-4 py-2 bg-[#2C2C2C] text-[#FFFFFF] border border-[#3C3C3C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                            />
                        </div>
                        <div>
                            <label className="block text-[#B0B0B0] mb-2" htmlFor="idNumber">ID Number</label>
                            <input
                                type="number"
                                id="idNumber"
                                value={idNumber}
                                onChange={(e) => setIdNumber(e.target.value)}
                                className="w-full px-4 py-2 bg-[#2C2C2C] text-[#FFFFFF] border border-[#3C3C3C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                            />
                        </div>
                        <div>
                            <label className="block text-[#B0B0B0] mb-2" htmlFor="phoneNumber">Phone Number</label>
                            <input
                                type="number"
                                id="phoneNumber"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="w-full px-4 py-2 bg-[#2C2C2C] text-[#FFFFFF] border border-[#3C3C3C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                            />
                        </div>
                        <div>
                            <label className="block text-[#B0B0B0] mb-2" htmlFor="community">Community</label>
                            <input
                                type="text"
                                id="community"
                                value={community}
                                onChange={(e) => setCommunity(e.target.value)}
                                className="w-full px-4 py-2 bg-[#2C2C2C] text-[#FFFFFF] border border-[#3C3C3C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                            />
                        </div>
                        <label className="block text-[#B0B0B0] mb-2" htmlFor="birthdate">Birth Date</label>
                        <DatePicker
                            selected={selectedDate}
                            onChange={handleDateChange}
                            className="w-full px-4 py-2 bg-white text-black border border-[#3C3C3C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                            dateFormat="yyyy-MM-dd"
                            showYearDropdown
                            yearDropdownItemNumber={40}
                            scrollableYearDropdown
                        />
                        <select
                            id="combo-box"
                            name="combo-box"
                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white shadow-sm"
                            value={selectedNationality}
                            onChange={handleNationalityChange}
                        >
                            <option value="">Select Nationality</option>
                            {nationalities.map(nationality => (
                                <option key={nationality.id} value={nationality.id}>
                                    {nationality.name}
                                </option>
                            ))}
                        </select>
                        
                        <button
                            type="submit"
                            className="w-full py-2 bg-[#FF6600] text-[#FFFFFF] rounded-lg hover:bg-[#e65c00] focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                        >
                            Sign Up
                        </button>
                        <p className="text-center text-[#B0B0B0]">
                            Already have an account?{' '}
                            <a onClick={handleLogin} href="#" className="text-[#4CAF50] hover:underline">Login</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
