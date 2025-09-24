// frontend/src/context/CartContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react'

// Create the context
const CartContext = createContext()

// Cart actions
const CART_ACTIONS = {
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART'
}

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_TO_CART:
      const existingItem = state.find(item => 
        (item.product._id || item.product.id) === (action.payload.product._id || action.payload.product.id)
      )
      
      if (existingItem) {
        return state.map(item =>
          (item.product._id || item.product.id) === (action.payload.product._id || action.payload.product.id)
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        )
      }
      
      return [...state, action.payload]

    case CART_ACTIONS.REMOVE_FROM_CART:
      return state.filter(item => 
        (item.product._id || item.product.id) !== action.payload
      )

    case CART_ACTIONS.UPDATE_QUANTITY:
      return state.map(item =>
        (item.product._id || item.product.id) === action.payload.productId
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0)

    case CART_ACTIONS.CLEAR_CART:
      return []

    case CART_ACTIONS.LOAD_CART:
      return action.payload || []

    default:
      return state
  }
}

// Cart provider component
export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, [])

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('shopease_cart')
      if (savedCart) {
        dispatch({
          type: CART_ACTIONS.LOAD_CART,
          payload: JSON.parse(savedCart)
        })
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
    }
  }, [])

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    try {
      localStorage.setItem('shopease_cart', JSON.stringify(cart))
    } catch (error) {
      console.error('Error saving cart to localStorage:', error)
    }
  }, [cart])

  // Cart functions
  const addToCart = (product, quantity = 1) => {
    dispatch({
      type: CART_ACTIONS.ADD_TO_CART,
      payload: { product, quantity }
    })
  }

  const removeFromCart = (productId) => {
    dispatch({
      type: CART_ACTIONS.REMOVE_FROM_CART,
      payload: productId
    })
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    
    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { productId, quantity }
    })
  }

  const clearCart = () => {
    dispatch({
      type: CART_ACTIONS.CLEAR_CART
    })
  }

  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0)
  }

  const isInCart = (productId) => {
    return cart.some(item => 
      (item.product._id || item.product.id) === productId
    )
  }

  const getItemQuantity = (productId) => {
    const item = cart.find(item => 
      (item.product._id || item.product.id) === productId
    )
    return item ? item.quantity : 0
  }

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartCount,
    getCartTotal,
    isInCart,
    getItemQuantity
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext)
  
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  
  return context
}

// Export the context for direct use if needed
export { CartContext }