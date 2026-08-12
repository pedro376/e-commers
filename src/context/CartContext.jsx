import { createContext, useContext, useState, useMemo } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

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

  const cartTotal = useMemo(
    () => items.reduce((suma, item) => suma + item.precio * item.cantidad, 0),
    [items]
  );

  const value = {
    items, addToCart, removeFromCart, updateQuantity, clearCart,
    isCartOpen, toggleCart, closeCart, cartCount, cartTotal,
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