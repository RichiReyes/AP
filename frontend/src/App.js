import {BrowserRouter, Route, Routes} from 'react-router-dom'


import './App.css';
import './index.css';

//import de las paginas del app
import Home from './pages/Home';
import Buscar from './pages/Buscar';
import Carrito from './pages/Carrito';
import VistosReciente from './pages/VistosReciente';
import Perfil from './pages/Perfil';
import AdminMenu from './pages/AdminMenu';
import LogIn from './pages/LogIn';

function App() {
  return (
    <div className="App">
      {/* rutas con sus paginas */}
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<Home/>}/>
          <Route exact path ='/buscar' element={<Buscar/>}/>
          <Route exact path ='/carrito' element={<Carrito/>}/>
          <Route exact path='/recientes' element={<VistosReciente/>}/>
          <Route exact path='/perfil' element={<Perfil/>}/>
          <Route exact path='/adminMenu' element={<AdminMenu/>}/>
          <Route exact path='/login' element={<LogIn/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
