import { useRef } from "react";
import "./GuiaTallas.css";

const NIVELES = [
  { valor: "suelto", label: "Suelto", nota: "Pedir 1-2 tallas menos para ajuste normal" },
  { valor: "normal", label: "Normal", nota: "Pedir talla normal" },
  { valor: "ajustado", label: "Ajustado", nota: "Pedir 1-2 tallas más para ajuste normal" },
];

/**
 * Slider interactivo de ajuste. El cliente lo usa para elegir cómo
 * prefiere que le quede la camiseta (Suelto / Normal / Ajustado).
 * Esta elección se guarda como nota en su pedido al agregar al carrito.
 *
 * Props:
 *  - valor: el valor actual ("suelto" | "normal" | "ajustado")
 *  - onChange: función que se llama con el nuevo valor cuando el
 *    usuario hace clic o arrastra
 */
function GuiaTallas({ valor = "normal", onChange }) {
  const trackRef = useRef(null);
  const arrastrando = useRef(false);

  const indiceActivo = NIVELES.findIndex((n) => n.valor === valor);
  const nivelActivo = NIVELES[indiceActivo] ?? NIVELES[1];

  function moverAlPuntoMasCercano(clientX) {
    const track = trackRef.current;
    if (!track) return;

    const rect = track.getBoundingClientRect();
    const porcentaje = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const indiceCercano = Math.round(porcentaje * (NIVELES.length - 1));

    onChange?.(NIVELES[indiceCercano].valor);
  }

  function handlePointerDown(e) {
    arrastrando.current = true;
    moverAlPuntoMasCercano(e.clientX);
    e.target.setPointerCapture?.(e.pointerId);
  }

  function handlePointerMove(e) {
    if (!arrastrando.current) return;
    moverAlPuntoMasCercano(e.clientX);
  }

  function handlePointerUp() {
    arrastrando.current = false;
  }

  return (
    <div className="guia-tallas">
      <span className="guia-tallas-titulo">Guía de tallas</span>

      <div
        className="guia-tallas-track"
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <div
          className="guia-tallas-punto"
          style={{ left: `${(indiceActivo / (NIVELES.length - 1)) * 100}%` }}
        />
      </div>

      <div className="guia-tallas-labels">
        {NIVELES.map((nivel) => (
          <button
            key={nivel.valor}
            type="button"
            className={nivel.valor === valor ? "activo" : ""}
            onClick={() => onChange?.(nivel.valor)}
          >
            {nivel.label}
          </button>
        ))}
      </div>

      <p className="guia-tallas-descripcion">{nivelActivo.nota}</p>
    </div>
  );
}

export default GuiaTallas;