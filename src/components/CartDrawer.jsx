import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { crearCheckoutUrl } from '../lib/shopify';
import '../css/cart.css';

function CartDrawer() {
  const {
    items, isCartOpen, closeCart, removeFromCart,
    updateQuantity, clearCart, cartCount, cartTotal,
  } = useCart();
  const [procesando, setProcesando] = useState(false);

  async function handleCheckout() {
    setProcesando(true);
    try {
      const url = await crearCheckoutUrl(items);
      if (url) window.location.href = url;
    } catch (error) {
      console.error(error);
      alert("Hubo un problema al procesar tu pedido, intenta de nuevo.");
    } finally {
      setProcesando(false);
    }
  }

  return (
    <>
      <div className={`cart-overlay ${isCartOpen ? 'open' : ''}`} onClick={closeCart} />

      <aside className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-head">
          <div>
            <span className="eyebrow">Kingdom Jerseys</span>
            <h2 className="display">
              Tu carrito <span className="cart-head-count">({cartCount})</span>
            </h2>
          </div>
          <button className="cart-close" onClick={closeCart} aria-label="Cerrar carrito">&times;</button>
        </div>

        <div className="cart-items">
          {items.length === 0 ? (
            <p className="cart-empty">Tu carrito está vacío. Agrega un jersey desde el catálogo.</p>
          ) : (
            items.map((item) => (
              <div className="cart-item" key={`${item.id}-${item.talla}`}>
                <img src={item.img} alt={item.nombre} className="cart-item-img" />
                <div className="cart-item-info">
                  <div className="cart-item-top">
                    <h4>{item.nombre}</h4>
                    <button className="cart-item-remove" onClick={() => removeFromCart(item.id, item.talla)} aria-label="Quitar producto">&times;</button>
                  </div>
                  <p className="cart-item-talla">Talla: {item.talla}</p>
                  <div className="cart-item-bottom">
                    <span className="cart-item-price">${(item.precio * item.cantidad).toFixed(2)}</span>
                    <div className="qty-stepper">
                      <button onClick={() => updateQuantity(item.id, item.talla, item.cantidad - 1)} aria-label="Restar">&minus;</button>
                      <span>{item.cantidad}</span>
                      <button onClick={() => updateQuantity(item.id, item.talla, item.cantidad + 1)} aria-label="Sumar">+</button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-foot">
            <button className="cart-clear" onClick={clearCart}>Vaciar carrito</button>
            <div className="cart-subtotal">
              <span>Subtotal</span>
              <strong>${cartTotal.toFixed(2)}</strong>
            </div>
            <p className="cart-shipping-note">Envío calculado al finalizar la compra.</p>
            <button className="cta-btn cart-checkout" onClick={handleCheckout} disabled={procesando}>
              {procesando ? "Procesando..." : "Proceder al pago"}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

export default CartDrawer;