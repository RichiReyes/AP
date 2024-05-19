import {BrowserRouter, Route, Routes} from 'react-router-dom'

import logo from './logo.svg';
import './App.css';
import './index.css';

//import de las paginas del app
import Home from './pages/Home';
import Buscar from './pages/Buscar';
import Carrito from './pages/Carrito';

function App() {
  return (
    <div className="App">
      {/* rutas con sus paginas */}
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<Home/>}/>
          <Route exact path ='/buscar' element={<Buscar/>}/>
          <Route exact path ='/carrito' element={<Carrito/>}/>


        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
