import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';

const Navbar = () => {
    const CDNURL = "https://jheqfwbznxusdwclwccv.supabase.co/storage/v1/object/public/imgs/";

    const user = useUser();
    const supabase = useSupabaseClient();
    const [src, setSrc] = useState("");
    const [fallback, setFallback] = useState("");
    const [person, setPerson] = useState(null);

    useEffect(()=>{

        const fetchData = async() => {
            try{
                const { data, error } = await supabase.rpc('get_person_by_user_id', { p_user_id: user.id });
                if(error)throw(error);
                setPerson(data);
                setSrc(CDNURL+'users/'+data[0].id);
                setFallback(data[0].name[0]+data[0].lastname[0]);
            }catch(error){
                console.log(error);
            }
        }

        if(user){
            fetchData();
        }
    },[user, supabase])

    const navigate = useNavigate();

    function handleHome() {
        navigate('/');
    }
    function handleBuscar() {
        navigate('/buscar');
    }
    function handleCarrito() {
        navigate('/carrito');
    }
    function handleRecientes(){
        navigate('/recientes');
    }
    function handlePerfil(){

        if(user === null){
            navigate('/login');
        } else {
            navigate('/perfil');
        }
    }

    return (
        <header className='headerNav'>
            <div className="headText">
                <h2>IMDb</h2>
            </div>
            <div className="botonesNav">
            <button onClick={handleHome} className='left-buttons'>Home</button> <button onClick={handleBuscar}className='left-buttons'>Buscar</button> <button onClick={handleRecientes} className='left-buttons'>Vistos Recientemente</button>
            <div className='flex ml-auto space-x-4'>
                <button onClick={handleCarrito}className='right-buttons'>Carrito</button>
                <Avatar onClick={handlePerfil} className='hover:cursor-pointer'>
                    <AvatarImage src={src} />
                    <AvatarFallback>{fallback}</AvatarFallback>
                </Avatar>
            </div>
            
            </div>
        </header>
    );
}

export default Navbar;
