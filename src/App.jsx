import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import './css/global.css'

import NavBar from './components/Navbar'
import Catalogo from './Componentes/Catalogo/Catalogo'
import Footer from './components/Footer'

function App() {

  return (
    <>
    <NavBar/>
    <Catalogo/>
    <Footer/>
    </>
   )
}

export default App
