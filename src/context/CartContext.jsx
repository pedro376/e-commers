import { createContext, useContext, useState, useMemo, useEffect, useRef } from 'react';
import { sincronizarCarrito } from '../lib/shopify';

const CartContext = createContext(null);

const SYNC_INICIAL = {
  totalConDescuento: null,
  ahorro: 0,
  checkoutUrl: null,
  descuentosPorLinea: {},
  sincronizando: false,
};

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [sync, setSync] = useState(SYNC_INICIAL);
  const requestIdRef = useRef(0);

  function addToCart(producto) {
    setItems((prev) => {
      const existente = prev.find(
        (item) => item.id === producto.id && item.talla === producto.talla
      );
      if (existente) {
        return prev.map((item) =>
          item.id === producto.id && item.talla === producto.talla
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
    setIsCartOpen(true);
  }

  function removeFromCart(id, talla) {
    setItems((prev) => prev.filter((item) => !(item.id === id && item.talla === talla)));
  }

  function updateQuantity(id, talla, nuevaCantidad) {
    if (nuevaCantidad < 1) return;
    setItems((prev) =>
      prev.map((item) =>
        item.id === id && item.talla === talla ? { ...item, cantidad: nuevaCantidad } : item
      )
    );
  }

  function clearCart() {
    setItems([]);
  }

  function toggleCart() {
    setIsCartOpen((prev) => !prev);
  }

  function closeCart() {
    setIsCartOpen(false);
  }

  const cartCount = useMemo(
    () => items.reduce((suma, item) => suma + item.cantidad, 0),
    [items]
  );

  // Total SIN descuento, calculado localmente (se usa como precio "tachado"
  // mientras llega la respuesta real de Shopify, y como referencia del ahorro)
  const cartTotal = useMemo(
    () => items.reduce((suma, item) => suma + item.precio * item.cantidad, 0),
    [items]
  );

  // Cada vez que cambian los items, le preguntamos a Shopify el total
  // real (con descuentos automáticos aplicados, como el 3x2).
  // El setTimeout de 500ms evita mandar una petición por cada click
  // rápido en los botones de + / -.
  useEffect(() => {
    if (items.length === 0) {
      setSync(SYNC_INICIAL);
      return;
    }

    const miRequestId = ++requestIdRef.current;
    setSync((prev) => ({ ...prev, sincronizando: true }));

    const timer = setTimeout(async () => {
      try {
        const resultado = await sincronizarCarrito(items);
        // Si mientras esperábamos la respuesta el carrito volvió a
        // cambiar, esta respuesta ya está vieja: la ignoramos.
        if (miRequestId !== requestIdRef.current) return;

        setSync({
          totalConDescuento: resultado.total,
          ahorro: resultado.ahorro,
          checkoutUrl: resultado.checkoutUrl,
          descuentosPorLinea: resultado.descuentosPorLinea,
          sincronizando: false,
        });
      } catch (error) {
        console.error('Error sincronizando carrito con Shopify:', error);
        if (miRequestId !== requestIdRef.current) return;
        setSync((prev) => ({ ...prev, sincronizando: false }));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [items]);

  const value = {
    items, addToCart, removeFromCart, updateQuantity, clearCart,
    isCartOpen, toggleCart, closeCart, cartCount, cartTotal,
    ...sync,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de un <CartProvider>');
  }
  return context;
}