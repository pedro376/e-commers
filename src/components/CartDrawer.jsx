import { useCart } from '../context/CartContext';
import '../css/cart.css';
import './cart-promo.css';

function CartDrawer() {
  const {
    items, isCartOpen, closeCart, removeFromCart,
    updateQuantity, clearCart, cartCount, cartTotal,
    totalConDescuento, ahorro, checkoutUrl, descuentosPorLinea, sincronizando,
  } = useCart();

  function handleCheckout() {
    if (!checkoutUrl) return;
    window.location.href = checkoutUrl;
  }

  const totalAMostrar = totalConDescuento ?? cartTotal;

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
            items.map((item) => {
              const descuentoLinea = descuentosPorLinea[item.variantId] || 0;
              const precioLineaOriginal = item.precio * item.cantidad;
              const esGratis = descuentoLinea >= precioLineaOriginal - 1; // margen de centavos

              return (
                <div className="cart-item" key={`${item.id}-${item.talla}`}>
                  <img src={item.img} alt={item.nombre} className="cart-item-img" />
                  <div className="cart-item-info">
                    <div className="cart-item-top">
                      <h4>{item.nombre}</h4>
                      <button className="cart-item-remove" onClick={() => removeFromCart(item.id, item.talla)} aria-label="Quitar producto">&times;</button>
                    </div>
                    <p className="cart-item-talla">Talla: {item.talla}</p>

                    {descuentoLinea > 0 && (
                      <span className="cart-item-promo-tag">
                        3X2 {esGratis ? '· GRATIS' : `· -$${descuentoLinea.toFixed(2)}`}
                      </span>
                    )}

                    <div className="cart-item-bottom">
                      <span className="cart-item-price">
                        {descuentoLinea > 0 && (
                          <span className="cart-item-price-original">
                            ${precioLineaOriginal.toFixed(2)}
                          </span>
                        )}
                        {' '}
                        {esGratis
                          ? 'GRATIS'
                          : `$${(precioLineaOriginal - descuentoLinea).toFixed(2)}`}
                      </span>
                      <div className="qty-stepper">
                        <button onClick={() => updateQuantity(item.id, item.talla, item.cantidad - 1)} aria-label="Restar">&minus;</button>
                        <span>{item.cantidad}</span>
                        <button onClick={() => updateQuantity(item.id, item.talla, item.cantidad + 1)} aria-label="Sumar">+</button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-foot">
            <button className="cart-clear" onClick={clearCart}>Vaciar carrito</button>

            {ahorro > 0 && (
              <div className="cart-savings-banner">
                Estás ahorrando ${ahorro.toFixed(2)} con la promo 3X2
              </div>
            )}

            <div className="cart-subtotal">
              <span>Subtotal</span>
              <strong>
                {ahorro > 0 && (
                  <span className="cart-subtotal-original">${cartTotal.toFixed(2)}</span>
                )}
                {' '}${totalAMostrar.toFixed(2)}
              </strong>
            </div>
            <p className="cart-shipping-note">Envío calculado al finalizar la compra.</p>
            <button
              className="cta-btn cart-checkout"
              onClick={handleCheckout}
              disabled={sincronizando || !checkoutUrl}
            >
              {sincronizando ? "Calculando..." : "Proceder al pago"}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

export default CartDrawer;