import { createContext, useReducer, useState, useEffect } from "react";

const CartContext = createContext({
  items: [],
  totalAmount: 0,
  addItem: (item) => {},
  removeItem: (id) => {},
  clearCart: () => {},
});

function cartReducer(state, action) {
  if (action.type === "ADD_ITEM") {
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.item.id
    );

    const updatedItems = [...state.items];
    let updatedTotalAmount =
      state.totalAmount + action.item.price * action.item.quantity;

    if (existingCartItemIndex > -1) {
      const existingItem = state.items[existingCartItemIndex];
      const updatedItem = {
        ...existingItem,
        quantity: existingItem.quantity + action.item.quantity,
      };
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      updatedItems.push({ ...action.item });
    }

    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount,
    };
  }

  if (action.type === "REMOVE_ITEM") {
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.id
    );
    const existingCartItem = state.items[existingCartItemIndex];

    const updatedItems = [...state.items];
    let updatedTotalAmount = state.totalAmount - existingCartItem.price;

    if (existingCartItem.quantity === 1) {
      updatedItems.splice(existingCartItemIndex, 1);
    } else {
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity - 1,
      };
      updatedItems[existingCartItemIndex] = updatedItem;
    }

    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount,
    };
  }

  if (action.type === "CLEAR_CART") {
    return {
      items: [],
      totalAmount: 0,
    };
  }

  if (action.type === "SET_CART") {
    return {
      items: action.cart.items || [],
      totalAmount: action.cart.totalAmount || 0,
    };
  }

  return state;
}

export function CartContextProvider({ children }) {
  const [orderDetails, setOrderDetails] = useState(null);
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  const [cart, dispatchCartAction] = useReducer(cartReducer, {
    items: [],
    totalAmount: 0,
  });

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (parsedCart.items && Array.isArray(parsedCart.items)) {
          dispatchCartAction({
            type: "SET_CART",
            cart: parsedCart,
          });
        }
      } catch (err) {
        console.error("Failed to parse cart data", err);
        localStorage.removeItem("cart");
      }
    }
    setIsCartLoaded(true); // Mark cart as loaded
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isCartLoaded) {
      // Only save after initial load
      localStorage.setItem(
        "cart",
        JSON.stringify({
          items: cart.items,
          totalAmount: cart.totalAmount,
        })
      );
    }
  }, [cart, isCartLoaded]);

  function addItem(item) {
    dispatchCartAction({
      type: "ADD_ITEM",
      item,
    });
  }

  function removeItem(id) {
    dispatchCartAction({
      type: "REMOVE_ITEM",
      id,
    });
  }

  function clearCart() {
    dispatchCartAction({
      type: "CLEAR_CART",
    });
    localStorage.removeItem("cart"); // Clear from localStorage when cart is emptied
  }

  const cartContext = {
    items: cart.items,
    totalAmount: cart.totalAmount,
    addItem,
    removeItem,
    clearCart,
    orderDetails,
    setOrderDetails,
  };

  return (
    <CartContext.Provider value={cartContext}>{children}</CartContext.Provider>
  );
}

export default CartContext;
