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
import SingUp from './pages/SingUp';
import AddStaff from './pages/AddStaff';
import AddCategory from './pages/AddCategory';
import AddNationality from './pages/AddNationality';
import AddPlatform from './pages/AddPlatform';
import AddMovie from './pages/AddMovie';
import AddShow from './pages/AddShow';
import AdmiCategory from './pages/AdmiCategory';
import AdmiNacionality from './pages/AdmiNacionality';
import AdmiPlatform from './pages/AdmiPlatform';
import AdmiMovie from './pages/AdmiMovie';
import AdmiShow from './pages/AdmiShow';
import AdmiActorDirector from './pages/AdmiActorDirector';
import AddAdmin from './pages/AddAdmin';
import AdmiAdmin from './pages/AdmiAdmin';
import MovieDesc from './components/movieDesc';
import Favoritos from './pages/Favoritos';

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
          <Route exact path='/singup' element={<SingUp/>}/>
          <Route exact path='/addStaff' element={<AddStaff/>}/>
          <Route exact path='/addCategory' element={<AddCategory/>}/>
          <Route exact path='/addNationality' element={<AddNationality/>}/>
          <Route exact path='/addPlatform' element={<AddPlatform/>}/>
          <Route exact path='/addMovie' element={<AddMovie/>}/>
          <Route exact path='/addShow' element={<AddShow/>}/>
          <Route exact path='/admiCategory' element={<AdmiCategory/>}/>
          <Route exact path='/admiNationality' element={<AdmiNacionality/>}/>
          <Route exact path='/admiPlatform' element={<AdmiPlatform/>}/>
          <Route exact path='/admiMovie' element={<AdmiMovie/>}/>
          <Route exact path='/admiShow' element={<AdmiShow/>}/>
          <Route exact path='/admiActorsDirectors' element={<AdmiActorDirector/>}/>
          <Route exact path='/addAdmin' element={<AddAdmin/>}/>
          <Route exact path='/admiAdmin' element={<AdmiAdmin/>}/>
          <Route exact path='/movieDesc' element={<MovieDesc/>}/>
          <Route exact path='/favoritos' element={<Favoritos/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
