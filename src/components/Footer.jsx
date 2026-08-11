import logoCrown from '../assets/logo-crown.jpeg';
import '../css/footer.css';

function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-top">
          <div>
            <div className="foot-brand">
              <img src={logoCrown} alt="Kingdom Jerseys" />
              <span>Kingdom Jerseys</span>
            </div>
            <p>
              Jerseys de selecciones, clubes y ediciones retro para quien vive
              el fútbol como afición real. Hecho en México.
            </p>
          </div>

          <div className="foot-col">
            <h5>Tienda</h5>
            <a href="/selecciones">Selecciones</a>
            <a href="/clubes">Clubes</a>
            <a href="/retro">Retro</a>
            <a href="/lanzamientos">Lanzamientos</a>
          </div>

          <div className="foot-col">
            <h5>Kingdom</h5>
            <a href="#">Instagram</a>
          </div>
        </div>

        <div className="foot-bottom">
          <span>&copy; 2026 Kingdom Jerseys. Todos los derechos reservados.</span>
          <div className="foot-social">
            <a href="#">IG</a>
            <a href="#">TT</a>
            <a href="#">WA</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;