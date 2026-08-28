import { useState } from "react";
import { useCart } from "../../context/CartContext";
import GuiaTallas from "../GuiaTallas/GuiaTallas";
import "./ProductCard.css";

function ProductCard({ producto }) {
  const { addToCart } = useCart();
  const [talla, setTalla] = useState(producto.tallas[0]?.talla || "");

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
      ajuste: producto.ajuste,
      talla,
    });
  }

  return (
    <article className="productCard">
      <img className="productImg" src={producto.img} alt="Producto" />

      <div className="info">
        <div className="row">
          <h3>{producto.nombre}</h3>
          <span>${producto.precio}</span>
        </div>

        <div className="row">
          <h5>Selección</h5>
        </div>
      </div>

      <div className="buttons">
        <select className="talla" value={talla} onChange={(e) => setTalla(e.target.value)}>
          {producto.tallas.map((t) => (
            <option key={t.variantId} value={t.talla} disabled={!t.disponible}>
              {t.talla}
            </option>
          ))}
        </select>

        <button className="toCart" onClick={handleAgregar}>AGREGAR AL CARRITO</button>
      </div>

      <GuiaTallas ajuste={producto.ajuste} />
    </article>
  );
}

export default ProductCard;