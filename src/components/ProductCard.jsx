import { useState } from "react";
import { useCart } from "../../../context/CartContext";
import "./ProductCard.css";

function ProductCard({ producto }) {
  const { addToCart } = useCart();
  const [tallaSeleccionada, setTallaSeleccionada] = useState(producto.tallas[0]?.talla || "");

  function handleAgregar() {
    const varianteElegida = producto.tallas.find((t) => t.talla === tallaSeleccionada);
    if (!varianteElegida) return;

    addToCart({
      id: producto.id,
      variantId: varianteElegida.variantId, // ← este es el que Shopify necesita para cobrar
      nombre: producto.nombre,
      precio: producto.precio,
      img: producto.img,
      talla: tallaSeleccionada,
    });
  }

  return (
    <article className="productCard">
      <img className="productImg" src={producto.img} alt={producto.nombre} />
      <div className="info">
        <div className="row">
          <h3>{producto.nombre}</h3>
          <span>${producto.precio}</span>
        </div>
      </div>
      <div className="buttons">
        <select
          className="talla"
          value={tallaSeleccionada}
          onChange={(e) => setTallaSeleccionada(e.target.value)}
        >
          {producto.tallas.map((t) => (
            <option key={t.variantId} value={t.talla} disabled={!t.disponible}>
              {t.talla}
            </option>
          ))}
        </select>
        <button className="toCart" onClick={handleAgregar}>AGREGAR AL CARRITO</button>
      </div>
    </article>
  );
}

export default ProductCard;