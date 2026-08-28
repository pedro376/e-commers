import "./GuiaTallas.css";

const NIVELES = [
  { valor: "suelto", label: "Suelto", nota: "Pedir 1-2 tallas menos para ajuste normal" },
  { valor: "normal", label: "Normal", nota: "Pedir talla normal" },
  { valor: "ajustado", label: "Ajustado", nota: "Pedir 1-2 tallas más para ajuste normal" },
];

function GuiaTallas({ ajuste = "normal" }) {
  const indiceActivo = NIVELES.findIndex((n) => n.valor === ajuste);
  const nivelActivo = NIVELES[indiceActivo] ?? NIVELES[1];

  return (
    <div className="guia-tallas">
      <div className="guia-tallas-track">
        <div
          className="guia-tallas-punto"
          style={{ left: `${(indiceActivo / (NIVELES.length - 1)) * 100}%` }}
        />
      </div>

      <div className="guia-tallas-labels">
        {NIVELES.map((nivel) => (
          <span
            key={nivel.valor}
            className={nivel.valor === ajuste ? "activo" : ""}
          >
            {nivel.label}
          </span>
        ))}
      </div>

      <p className="guia-tallas-descripcion">{nivelActivo.nota}</p>
    </div>
  );
}

export default GuiaTallas;