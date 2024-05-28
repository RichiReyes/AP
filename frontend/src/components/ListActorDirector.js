import React from 'react';
import { Button } from './ui/button';

const ListActorDirector = ({actors, clickEdit, regresarMenu}) => {
    return (
        <div>
        <button onClick={regresarMenu} className="mt-6 mb-4 px-6 py-2 bg-[#FF6600] text-[#FFFFFF] rounded-lg hover:bg-[#FF4500] focus:outline-none focus:ring-2 focus:ring-[#FF6600]">
            Volver
        </button>
      <div className='flex flex-col space-y-4 items-center py-6'>
        {actors.map((actor) => (
          <div key={actors.id} className='bg-neutral-700 rounded-md flex flex-row w-3/4 px-4 py-2 items-center'>
            <div className=''>
              <h2 className='text-white'>{actor.name} {actor.lastname}</h2>
            </div>
            <Button onClick={() => clickEdit(actor.id)} className='ml-auto'>Editar</Button>
          </div>
        ))}
      </div>
    </div>
    );
}

export default ListActorDirector;
