import React from 'react';
import { Button } from './ui/button';

const ListNacionality = ({nationalities, handleEditClick}) => {
    return (
        <div className='w-3/4 flex flex-col space-y-2 mt-10'>
            {nationalities.map((nationality) => (
            <div key={nationality.id} className='flex flex-row bg-neutral-700 p-2 w-3/4 rounded-md space-x-5'>
                <h2 className='text-white self-start'>{nationality.name}</h2>
                <div className='flex-1'></div>
                <Button onClick={()=> handleEditClick(nationality.id)} className='w-14 flex-1'>Editar</Button>
            </div>
        ))}
    </div>
    );
}

export default ListNacionality;
