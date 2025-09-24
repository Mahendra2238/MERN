import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, getCartTotal, getCartCount } = useCart()
  const [isLoading, setIsLoading] = useState(false)

  // Ensure cart is always an array
  const cartItems = Array.isArray(cart) ? cart : []

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId)
      return
    }
    
    setIsLoading(true)
    try {
      await updateQuantity(productId, newQuantity)
    } catch (error) {
      console.error('Error updating quantity:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveItem = (productId) => {
    removeFromCart(productId)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const handleCheckout = () => {
    // Navigate to checkout or implement checkout logic
    alert('Checkout functionality coming soon!')
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-header">
            <h1>Shopping Cart</h1>
            <p>Your cart is currently empty</p>
          </div>
          
          <div className="empty-cart">
            <div className="empty-cart-icon">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="m1 1 4 4 16 6-3 9H6L4 5H2"></path>
              </svg>
            </div>
            <h2>Your Cart is Empty</h2>
            <p>Start shopping to add items to your cart</p>
            <Link to="/products" className="btn btn-primary btn-large">
              Start Shopping
            </Link>
          </div>
        </div>

        <style jsx>{`
          .cart-page {
            min-height: 80vh;
            padding: 2rem 0;
          }
          
          .cart-header {
            text-align: center;
            margin-bottom: 3rem;
          }
          
          .cart-header h1 {
            color: var(--white);
            font-size: 3rem;
            margin-bottom: 1rem;
          }
          
          .cart-header p {
            color: var(--gray-light);
            font-size: 1.2rem;
          }
          
          .empty-cart {
            text-align: center;
            padding: 4rem 2rem;
            background: var(--navy-medium);
            border-radius: 12px;
            max-width: 600px;
            margin: 0 auto;
          }
          
          .empty-cart-icon {
            color: var(--gray-medium);
            margin-bottom: 2rem;
          }
          
          .empty-cart h2 {
            color: var(--white);
            font-size: 2rem;
            margin-bottom: 1rem;
          }
          
          .empty-cart p {
            color: var(--gray-light);
            font-size: 1.1rem;
            margin-bottom: 2rem;
          }
          
          .btn-large {
            padding: 16px 32px;
            font-size: 1.1rem;
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <p>{getCartCount()} {getCartCount() === 1 ? 'item' : 'items'} in your cart</p>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.product._id || item.product.id} className="cart-item">
                <div className="item-image">
                  <img 
                    src={item.product.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop'} 
                    alt={item.product.name}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop'
                    }}
                  />
                </div>
                
                <div className="item-details">
                  <h3>{item.product.name}</h3>
                  <p className="item-description">
                    {item.product.description?.length > 100 
                      ? `${item.product.description.substring(0, 100)}...`
                      : item.product.description
                    }
                  </p>
                  <div className="item-price">
                    {formatPrice(item.product.price)}
                  </div>
                </div>

                <div className="item-quantity">
                  <label>Quantity:</label>
                  <div className="quantity-controls">
                    <button 
                      onClick={() => handleQuantityChange(item.product._id || item.product.id, item.quantity - 1)}
                      disabled={isLoading}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <span className="quantity-display">{item.quantity}</span>
                    <button 
                      onClick={() => handleQuantityChange(item.product._id || item.product.id, item.quantity + 1)}
                      disabled={isLoading}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="item-total">
                  <div className="total-price">
                    {formatPrice(item.product.price * item.quantity)}
                  </div>
                  <button 
                    onClick={() => handleRemoveItem(item.product._id || item.product.id)}
                    className="remove-btn"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>
              
              <div className="summary-row">
                <span>Subtotal ({getCartCount()} items):</span>
                <span>{formatPrice(getCartTotal())}</span>
              </div>
              
              <div className="summary-row">
                <span>Shipping:</span>
                <span>FREE</span>
              </div>
              
              <div className="summary-row">
                <span>Tax:</span>
                <span>{formatPrice(getCartTotal() * 0.08)}</span>
              </div>
              
              <hr />
              
              <div className="summary-row total-row">
                <span>Total:</span>
                <span>{formatPrice(getCartTotal() + (getCartTotal() * 0.08))}</span>
              </div>

              <button 
                onClick={handleCheckout}
                className="btn btn-primary btn-large checkout-btn"
              >
                Proceed to Checkout
              </button>

              <div className="cart-actions">
                <Link to="/products" className="btn btn-secondary">
                  Continue Shopping
                </Link>
                <button 
                  onClick={clearCart}
                  className="btn btn-outline"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .cart-page {
          min-height: 80vh;
          padding: 2rem 0;
        }
        
        .cart-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        
        .cart-header h1 {
          color: var(--white);
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        
        .cart-header p {
          color: var(--gray-light);
          font-size: 1.2rem;
        }
        
        .cart-content {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 3rem;
          align-items: start;
        }
        
        .cart-items {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .cart-item {
          display: grid;
          grid-template-columns: 100px 1fr auto auto;
          gap: 1.5rem;
          align-items: center;
          background: var(--navy-medium);
          padding: 1.5rem;
          border-radius: 12px;
          border: 1px solid var(--gray-medium);
        }
        
        .item-image img {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 8px;
        }
        
        .item-details h3 {
          color: var(--white);
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
        }
        
        .item-description {
          color: var(--gray-light);
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }
        
        .item-price {
          color: var(--accent-blue);
          font-size: 1.1rem;
          font-weight: 600;
        }
        
        .item-quantity label {
          color: var(--gray-light);
          font-size: 0.9rem;
          display: block;
          margin-bottom: 0.5rem;
        }
        
        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .quantity-btn {
          width: 32px;
          height: 32px;
          border: 1px solid var(--gray-medium);
          background: var(--navy-dark);
          color: var(--white);
          border-radius: 4px;
          cursor: pointer;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .quantity-btn:hover:not(:disabled) {
          background: var(--accent-blue);
          border-color: var(--accent-blue);
        }
        
        .quantity-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .quantity-display {
          color: var(--white);
          font-weight: 600;
          min-width: 30px;
          text-align: center;
        }
        
        .item-total {
          text-align: right;
        }
        
        .total-price {
          color: var(--white);
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        
        .remove-btn {
          color: var(--error);
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.9rem;
        }
        
        .remove-btn:hover {
          text-decoration: underline;
        }
        
        .summary-card {
          background: var(--navy-medium);
          padding: 2rem;
          border-radius: 12px;
          border: 1px solid var(--gray-medium);
          position: sticky;
          top: 2rem;
        }
        
        .summary-card h3 {
          color: var(--white);
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
        }
        
        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          color: var(--gray-light);
        }
        
        .summary-row span:last-child {
          color: var(--white);
          font-weight: 600;
        }
        
        .total-row {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--white);
        }
        
        hr {
          border: none;
          height: 1px;
          background: var(--gray-medium);
          margin: 1rem 0;
        }
        
        .checkout-btn {
          width: 100%;
          margin: 1.5rem 0;
        }
        
        .cart-actions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .cart-actions .btn {
          width: 100%;
          text-align: center;
        }
        
        @media (max-width: 968px) {
          .cart-content {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          
          .cart-item {
            grid-template-columns: 80px 1fr;
            grid-template-areas: 
              "image details"
              "quantity total";
            gap: 1rem;
          }
          
          .item-image {
            grid-area: image;
          }
          
          .item-details {
            grid-area: details;
          }
          
          .item-quantity {
            grid-area: quantity;
          }
          
          .item-total {
            grid-area: total;
            text-align: right;
          }
        }
        
        @media (max-width: 768px) {
          .cart-header h1 {
            font-size: 2rem;
          }
          
          .summary-card {
            position: static;
          }
        }
      `}</style>
    </div>
  )
}

export default Cart