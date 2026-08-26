import { useState, useEffect } from "react";
import "./PromoBar.css";

/**
 * Banner de promoción con cuenta regresiva.
 *
 * Uso en Navbar.jsx (arriba del todo):
 *   <PromoBar
 *     mensaje="PROMO 3X2 y 4x3 + ENVÍO GRATIS SOLO HOY"
 *     fechaFin="2026-09-19T23:59:59"
 *   />
 *
 * Cuando la fecha "fechaFin" ya pasó, el componente no renderiza nada
 * (return null), así que la promo desaparece sola sin que tengas
 * que tocar código de nuevo. Para terminar la promo antes de tiempo,
 * solo borra el <PromoBar ... /> de donde lo hayas puesto, o cambia
 * la fecha.
 */
function PromoBar({ mensaje, fechaFin }) {
  const [tiempoRestante, setTiempoRestante] = useState(() =>
    calcularTiempoRestante(fechaFin)
  );

  useEffect(() => {
    const intervalo = setInterval(() => {
      setTiempoRestante(calcularTiempoRestante(fechaFin));
    }, 1000);
    return () => clearInterval(intervalo);
  }, [fechaFin]);

  // La promo ya terminó: no mostrar nada.
  if (!tiempoRestante) return null;

  const { horas, minutos, segundos } = tiempoRestante;

  return (
    <div className="promo-bar">
      <span className="promo-bar-mensaje">{mensaje}</span>

      <div className="promo-bar-timer">
        <div className="promo-bar-unidad">
          <span className="promo-bar-numero">{pad(horas)}</span>
          <span className="promo-bar-label">HRS</span>
        </div>
        <span className="promo-bar-separador">:</span>
        <div className="promo-bar-unidad">
          <span className="promo-bar-numero">{pad(minutos)}</span>
          <span className="promo-bar-label">MIN</span>
        </div>
        <span className="promo-bar-separador">:</span>
        <div className="promo-bar-unidad">
          <span className="promo-bar-numero">{pad(segundos)}</span>
          <span className="promo-bar-label">SEG</span>
        </div>
      </div>
    </div>
  );
}

function calcularTiempoRestante(fechaFin) {
  const diferencia = new Date(fechaFin).getTime() - Date.now();

  if (diferencia <= 0) return null;

  const horas = Math.floor(diferencia / (1000 * 60 * 60));
  const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
  const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

  return { horas, minutos, segundos };
}

function pad(numero) {
  return String(numero).padStart(2, "0");
}

export default PromoBar;
