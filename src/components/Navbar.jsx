import { NavLink, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import logoCrown from '../assets/logo-crown.jpeg';
import '../css/navbar.css';

const NAV_LINKS = [
  { to: '/selecciones', label: 'Selecciones' },
  { to: '/clubes', label: 'Clubes' },
  { to: '/retro', label: 'Retro' },
  { to: '/nosotros', label: 'Nosotros' },
];

function Navbar() {
  const { cartCount, toggleCart } = useCart();

  return (
    <>
      <header>
        <div className="navbar">
          <Link to="/" className="brand">
            <img src={logoCrown} alt="Kingdom Jerseys" />
            <span className='log'>Kingdom Jerseys</span>
          </Link>

          <nav className="links">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'active' : undefined)}>
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="nav-actions">
            <button className="cart-nav-btn" type="button" aria-label="Abrir carrito" onClick={toggleCart}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartCount > 0 && <span className="cart-nav-count">{cartCount}</span>}
            </button>
            <button className="cta-btn gold">Comprar</button>
          </div>
        </div>
      </header>

      <div className="marquee">
        <div className="marquee-track">
          <span>
            <span className="dot">●</span> ENVÍOS A TODO MÉXICO{' '}
            <span className="dot">●</span> TEMPORADA 25/26 YA DISPONIBLE{' '}
            <span className="dot">●</span> CALIDAD FAN &amp; JUGADOR{' '}
            <span className="dot">●</span> PAGA CONTRA ENTREGA{' '}
            <span className="dot">●</span> ENVÍOS A TODO MÉXICO{' '}
            <span className="dot">●</span> TEMPORADA 25/26 YA DISPONIBLE{' '}
            <span className="dot">●</span> CALIDAD FAN &amp; JUGADOR{' '}
            <span className="dot">●</span> PAGA CONTRA ENTREGA <span className="dot">●</span>
          </span>
        </div>
      </div>
    </>
  );
}

export default Navbar;