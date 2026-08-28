import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import WelcomeModal from './components/WelcomeModal.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import ProductoDetalle from './pages/ProductoDetalle.jsx';
import Inicio from './pages/Inicio.jsx';
import Selecciones from './pages/Selecciones.jsx';
import Clubes from './pages/Clubes.jsx';
import Retro from './pages/Retro.jsx';

import './css/global.css';
import './App.css';

function App() {

  return (
    <CartProvider>
      <div className='grain'/>
      <Navbar />
      <Routes>
        <Route path='/' element={<Inicio/>} />
        <Route path="/selecciones" element={<Selecciones />} />
        <Route path="/clubes" element={<Clubes />} />
        <Route path="/retro" element={<Retro />} />
      </Routes>
      <Footer/>     
      <Route path="/producto/:handle" element={<ProductoDetalle />} />   
      <CartDrawer />
      <WelcomeModal />
    </CartProvider>
  )
}

export default App