import { useState } from "react";
import { useCart } from "../../context/CartContext";
import "./ProductCard.css";

function ProductCard({ producto }) {
  const { addToCart } = useCart();
  const [talla, setTalla] = useState("S");

  function handleAgregar() {
    addToCart({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      img: producto.img,
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
          <del>$000</del>
        </div>
      </div>

      <div className="buttons">
        <select className="talla" value={talla} onChange={(e) => setTalla(e.target.value)}>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="G">G</option>
          <option value="XL">XL</option>
        </select>

        <button className="toCart" onClick={handleAgregar}>AGREGAR AL CARRITO</button>
      </div>
    </article>
  );
}

export default ProductCard;