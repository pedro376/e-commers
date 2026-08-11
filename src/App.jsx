import { Routes, Route } from 'react-router-dom';

import Inicio from './pages/Inicio'
import Navbar from './components/Navbar'
import Footer from './components/Footer';


import './css/global.css'
import './css/inicio.css'

function App() {

  return (
    <>
      <div className='grain'/>
      <Navbar />
      <Routes>
        <Route path='/' element={<Inicio/>} />
      </Routes>
      <Footer/>
    </>
  )
}

export default App
