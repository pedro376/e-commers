import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { obtenerProductoPorHandle } from "../lib/shopify";
import { useCart } from "../context/CartContext";
import GuiaTallas from "../Componentes/GuiaTallas/GuiaTallas";
import "../css/productoDetalle.css";

function ProductoDetalle() {
  const { handle } = useParams();
  const { addToCart } = useCart();

  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [talla, setTalla] = useState("");
  const [ajusteElegido, setAjusteElegido] = useState("normal");
  const [imagenActiva, setImagenActiva] = useState(0);

  useEffect(() => {
    setCargando(true);
    obtenerProductoPorHandle(handle)
      .then((data) => {
        setProducto(data);
        setTalla(data?.tallas?.[0]?.talla || "");
        setAjusteElegido(data?.ajuste || "normal");
      })
      .catch((error) => console.error("Error obteniendo producto:", error))
      .finally(() => setCargando(false));
  }, [handle]);

  function handleAgregar() {
    const varianteElegida = producto.tallas.find((t) => t.talla === talla);
    if (!varianteElegida) {
      alert("Selecciona una talla disponible");
      return;
    }

    addToCart({
      id: producto.id,
      variantId: varianteElegida.variantId,
      nombre: producto.nombre,
      precio: producto.precio,
      img: producto.img,
      ajuste: ajusteElegido,
      talla,
    });
  }

  if (cargando) {
    return (
      <section className="producto-detalle-container">
        <p>Cargando producto...</p>
      </section>
    );
  }

  if (!producto) {
    return (
      <section className="producto-detalle-container">
        <p>No encontramos este producto.</p>
        <Link to="/">Volver al inicio</Link>
      </section>
    );
  }

  const imagenes = producto.imagenes.length > 0
    ? producto.imagenes
    : [{ url: producto.img, alt: producto.nombre }];

  return (
    <section className="producto-detalle-container">
      <div className="producto-detalle-grid">
        <div className="producto-detalle-galeria">
          <img
            className="producto-detalle-img-principal"
            src={imagenes[imagenActiva]?.url}
            alt={producto.nombre}
          />
          {imagenes.length > 1 && (
            <div className="producto-detalle-miniaturas">
              {imagenes.map((img, i) => (
                <img
                  key={i}
                  src={img.url}
                  alt={img.alt || producto.nombre}
                  className={i === imagenActiva ? "activa" : ""}
                  onClick={() => setImagenActiva(i)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="producto-detalle-info">
          {producto.enPromo3x2 && <span className="badge-3x2">3X2</span>}

          <h1>{producto.nombre}</h1>
          <p className="producto-detalle-precio">${producto.precio}</p>

          {producto.descripcion && (
            <p className="producto-detalle-descripcion">{producto.descripcion}</p>
          )}

          <div className="producto-detalle-seleccion">
            <label htmlFor="talla-select">Talla</label>
            <select
              id="talla-select"
              value={talla}
              onChange={(e) => setTalla(e.target.value)}
            >
              {producto.tallas.map((t) => (
                <option key={t.variantId} value={t.talla} disabled={!t.disponible}>
                  {t.talla} {!t.disponible ? "(agotada)" : ""}
                </option>
              ))}
            </select>
          </div>

          <button className="cta-btn producto-detalle-boton" onClick={handleAgregar}>
            AGREGAR AL CARRITO
          </button>

          <GuiaTallas valor={ajusteElegido} onChange={setAjusteElegido} />
        </div>
      </div>
    </section>
  );
}

export default ProductoDetalle;