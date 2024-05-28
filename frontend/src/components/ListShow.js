import React from 'react';
import { Button } from './ui/button';

const ListShow = ({shows, clickEdit, regresarMenu}) => {
    return (
    <div>
        <button onClick={regresarMenu} className="mt-6 mb-4 px-6 py-2 bg-[#FF6600] text-[#FFFFFF] rounded-lg hover:bg-[#FF4500] focus:outline-none focus:ring-2 focus:ring-[#FF6600]">
            Volver
        </button>
      <div className='flex flex-col space-y-4 items-center py-6'>
        {shows.map((show) => (
          <div key={show.id} className='bg-neutral-700 rounded-md flex flex-row w-3/4 px-4 py-2 items-center'>
            <div className=''>
              <h2 className='text-white'>{show.name}</h2>
              <span className='text-gray-400 ml-auto'>({show.releaseyear})</span>
            </div>
            <Button onClick={() => clickEdit(show.id)} className='ml-auto'>Editar</Button>
          </div>
        ))}
      </div>
    </div>
    );
}

export default ListShow;
