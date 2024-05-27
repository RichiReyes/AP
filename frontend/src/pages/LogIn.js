import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useNavigate } from 'react-router-dom';

const LogIn = () => {

    const supabase = useSupabaseClient();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    
    function hola(){
        navigate('/singup');
    }

    async function handleLogIn(){
        try{
            const {data, error} = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            })
            if (data){
                navigate('/');
            }
            if(error){
                console.log(error);
            }
        } catch{

        }
    }

    return (
        <div>
            <Navbar/>
            <div className="min-h-screen flex items-center justify-center bg-[#1E1E1E] mt-10">
                <div className="bg-[#2A2A2A] p-8 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-3xl font-bold text-[#FFFFFF] text-center mb-8">Login</h2>
                    {/* <form onSubmit={handleLogIn} className="space-y-6"> */}
                    <div className='space-y-6'>
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
                    <button
                      onClick={handleLogIn}
                      className="w-full py-2 bg-[#FF6600] text-[#FFFFFF] rounded-lg hover:bg-[#e65c00] focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                    >
                    Login
                    </button>
                    <p className="text-center text-[#B0B0B0]">
                      Don't have an account?{' '}
                      <a onClick={hola} href="#" className="text-[#4CAF50] hover:underline">Sign up</a>
                    </p>
                    {/* </form> */}
                    </div>
                    </div>
                </div>
            </div>
    );
}

export default LogIn;
