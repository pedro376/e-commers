import { useState, useEffect } from "react";
import { suscribirCorreo } from "../lib/shopify";
import "./WelcomeModal.css";

const CODIGO_DESCUENTO = "BIENVENIDO10";
const CLAVE_LOCALSTORAGE = "kj_welcome_modal_visto";
const RETRASO_MS = 4000; // espera 4 segundos antes de mostrarlo

function WelcomeModal() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const yaVisto = localStorage.getItem(CLAVE_LOCALSTORAGE);
    if (yaVisto) return;

    const timer = setTimeout(() => setVisible(true), RETRASO_MS);
    return () => clearTimeout(timer);
  }, []);

  function cerrar() {
    setVisible(false);
    localStorage.setItem(CLAVE_LOCALSTORAGE, "true");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("Ingresa un correo válido");
      return;
    }
    setError("");
    setEnviando(true);
    try {
      await suscribirCorreo(email);
      setEnviado(true);
      localStorage.setItem(CLAVE_LOCALSTORAGE, "true");
    } catch (err) {
      console.error(err);
      setError("Hubo un problema, intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  if (!visible) return null;

  return (
    <div className="welcome-overlay" onClick={cerrar}>
      <div className="welcome-modal" onClick={(e) => e.stopPropagation()}>
        <button className="welcome-close" onClick={cerrar} aria-label="Cerrar">
          &times;
        </button>

        <div className="welcome-img">
          {/* Reemplaza esta imagen por una foto de tus propios productos */}
          <img src="/img-promo/barcelona.jpeg" alt="Kingdom Jerseys" />
        </div>

        <div className="welcome-content">
          {!enviado ? (
            <>
              <h2 className="display">ESPERA, NO TE VAYAS SIN TU</h2>
              <p>
                ⚡ 10% OFF en tu primera compra ❗
                <br />
                <small>*No válido en promoción 3x2*</small>
              </p>

              <form onSubmit={handleSubmit} className="welcome-form">
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={enviando}
                />
                {error && <p className="welcome-error">{error}</p>}
                <button className="cta-btn" type="submit" disabled={enviando}>
                  {enviando ? "Enviando..." : "QUIERO MI DESCUENTO 🔥"}
                </button>
              </form>
            </>
          ) : (
            <>
              <h2 className="display">¡LISTO!</h2>
              <p>Usa este código al pagar:</p>
              <div className="welcome-codigo">{CODIGO_DESCUENTO}</div>
              <button className="cta-btn" onClick={cerrar}>
                Ir a comprar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default WelcomeModal;