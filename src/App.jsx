import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'

import './css/global.css'
import './css/inicio.css'

import NavBar from './components/Navbar'
import Catalogo from './Componentes/Catalogo/Catalogo'
import Footer from './components/Footer'
import Inicio from './pages/Inicio'

function App() {

  return (
    <>
      <div className='grain'/>
      <NavBar />
      <Routes>
        <Route path='/' element={<Inicio/>} />
        <Route path='/selecciones' element={<Catalogo/>} />
      </Routes>
      <Footer/>
    </>
   )
}

export default App
