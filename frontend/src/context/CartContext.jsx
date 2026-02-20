import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // 🔥 IMPORTANT: Always read token directly when needed
  const isAuthenticated = () => {
    return !!localStorage.getItem("token");
  };

  const addToCart = (product) => {
    if (!isAuthenticated()) return false;

    setCart((prevCart) => {
      const exists = prevCart.find((item) => item._id === product._id);

      if (exists) {
        return prevCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });

    return true;
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotal = () => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const toggleWishlist = (product) => {
    if (!isAuthenticated()) return false;

    setWishlist((prevWishlist) => {
      const exists = prevWishlist.find((item) => item._id === product._id);

      if (exists) {
        return prevWishlist.filter((item) => item._id !== product._id);
      } else {
        return [...prevWishlist, product];
      }
    });

    return true;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        clearCart,
        getTotal,
        toggleWishlist,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
