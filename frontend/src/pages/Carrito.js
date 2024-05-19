import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Button } from '../components/ui/button';
import CarritoCard from '../components/carritoCard';
import Historial from '../components/Historial';

const Carrito = () => {

    const[carrito, setCarrito] = useState(true);
    const [historial, setHistorial] = useState(false);

    function limpiarPantalla() {
        setCarrito(false);
        setHistorial(false);
    }
    function handleHistorial(){
        limpiarPantalla();
        setHistorial(true);
    }
    
    return (
        <div>
            <Navbar/>
            {carrito && <div className="carrito-main">
                <div className="carrito-content">
                    <h2 className='text-white text-2xl mt-8'>Carrito</h2>
                    <CarritoCard/>
                </div>
                <div className="carrito-footer">
                    <div className="footer-left">
                        <Button variant="agregarFav">Proceder al pago</Button>
                        <Button variant="agregarFav">Borrar Carrito</Button>
                    </div>
                    <div className="footer-right">
                        <Button onClick={handleHistorial} variant="agregarFav">Historial de Compras</Button>
                    </div>
                </div>
            </div>}
            {historial && <Historial limpiarPantalla={limpiarPantalla} setCarrito={setCarrito}/>}
        </div>
    );
}

export default Carrito;
