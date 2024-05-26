import React from 'react';
import Navbar from '../components/Navbar';

import { CalendarIcon } from "@radix-ui/react-icons"
import { addDays, format } from "date-fns"

 
import { cn } from "../lib/utils"
import { Button } from "../components/ui/button"
import { Calendar } from "../components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"
import { useNavigate } from 'react-router-dom';


const Perfil = () => {

    const [date, setDate] = React.useState();
    const navigate = useNavigate();

    const menuAdmin = () => {
      navigate('/adminMenu');
    }

    return (
        <div className='h-screen'>
            <Navbar/>
            <div className='flex flex-col p-4'>
                <h2 className='text-white text-3xl'>Perfil</h2>
                <div className='bg-cardBackground w-11/12 rounded-md flex flex-row self-center px-20 py-4 mt-6'>
                    <div className='flex flex-col space-y-12 items-start'>
                        <h2 className='text-white h-8'>Nombre:</h2>
                        <h2 className='text-white h-8'>Primer Apellido:</h2>
                        <h2 className='text-white h-8'>Segundo Apellido:</h2>
                        <h2 className='text-white h-8'>No. Identificación:</h2>
                        <h2 className='text-white h-8'>Fecha de Nacimiento:</h2>
                        <h2 className='text-white h-8'>Correo Electrónico:</h2>
                    </div>
                    <div className='flex flex-col space-y-12 items-start px-6'>
                        <input className='bg-white text-black hover:bg-gray-200 w-60
                        focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 p-2 rounded h-8' type='text' placeholder='Nombre'/>
                        <input className='bg-white text-black hover:bg-gray-200 w-60
                        focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 p-2 rounded h-8' type='text' placeholder='Nombre' />
                        <input className='bg-white text-black hover:bg-gray-200 w-60
                        focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 p-2 rounded h-8' type='text' placeholder='Nombre' />
                        <input className='bg-white text-black hover:bg-gray-200 w-60
                        focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 p-2 rounded h-8' type='text' placeholder='Nombre' />
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            align="start"
                            className="flex w-auto flex-col space-y-2 p-2"
                          >
                            <Select
                              onValueChange={(value) =>
                                setDate(addDays(new Date(), parseInt(value)))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent position="popper">
                                <SelectItem value="0">Today</SelectItem>
                                <SelectItem value="1">Tomorrow</SelectItem>
                                <SelectItem value="3">In 3 days</SelectItem>
                                <SelectItem value="7">In a week</SelectItem>
                              </SelectContent>
                            </Select>
                            <div className="rounded-md border">
                              <Calendar mode="single" selected={date} onSelect={setDate} />
                            </div>
                          </PopoverContent>
                        </Popover>
                        <input className='bg-white text-black hover:bg-gray-200 w-60
                        focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 p-2 rounded h-8' type='text' placeholder='Nombre' />
                      </div>
                      <div className='flex flex-col px-4 items-start'>
                        <h2 className='text-white text-lg'>Nacionalidad</h2>
                        <div class="w-auto">
                          <div class="mt-1 relative">
                            <select id="combo-box" name="combo-box" class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white shadow-sm">
                              <option>Option 1</option>
                              <option>Option 2</option>
                              <option>Option 3</option>
                              <option>Option 4</option>
                            </select>
                            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                              <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M10 3a1 1 0 01.7.3l5 5a1 1 0 01-1.4 1.4L10 5.4l-4.3 4.3a1 1 0 01-1.4-1.4l5-5A1 1 0 0110 3z" clip-rule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        </div>
                    </div>
                    <div class="file-chooser-container px-2 py-3 bg-white shadow-lg rounded-lg h-16">
                     <label for="file-upload" class="file-chooser-label flex items-center justify-center cursor-pointer bg-white text-black py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50">
                        <svg class="w-6 h-6 mr-2 text-black" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                          <path d="M12 2a5 5 0 0 1 5 5v1h1.5A2.5 2.5 0 0 1 21 10.5V18a2 2 0 0 1-2 2h-5v-5H10v5H5a2 2 0 0 1-2-2v-7.5A2.5 2.5 0 0 1 5.5 9H7V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v1h6V7a3 3 0 0 0-3-3z"/>
                        </svg>
                        <span>Choose a picture</span>
                        <input id="file-upload" type="file" class="hidden" accept="image/*"/>
                      </label>
                    </div>
                </div>
            </div>
            <div className='flex items-start px-10'>
              <Button onClick={menuAdmin}>Administrador</Button>
            </div>
            
        </div>
    );
}

export default Perfil;
