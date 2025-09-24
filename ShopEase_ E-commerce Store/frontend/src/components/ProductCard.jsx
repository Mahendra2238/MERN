import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const ProductCard = ({ product }) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)

  const { addToCart, isInCart, getItemQuantity } = useCart()

  if (!product) {
    return null
  }

  const handleImageError = () => {
    setImageError(true)
    setImageLoading(false)
  }

  const handleImageLoad = () => {
    setImageLoading(false)
    setImageError(false)
  }

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsAdding(true)
    try {
      await addToCart(product, 1)
      // Optional: Show success message
      console.log('Added to cart:', product.name)
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setTimeout(() => setIsAdding(false), 500) // Brief delay for better UX
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="star filled">★</span>
      )
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="star half">★</span>
      )
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="star empty">★</span>
      )
    }

    return stars
  }

  // Fallback image URL
  const fallbackImage = "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center&auto=format"
  
  // Use product image or fallback
  const imageUrl = imageError ? fallbackImage : (product.image || fallbackImage)

  const itemQuantity = getItemQuantity(product._id || product.id)
  const inCart = isInCart(product._id || product.id)

  return (
    <div className="product-card">
      <Link to={`/products/${product._id || product.id}`} className="product-link">
        <div className="product-image-container">
          {imageLoading && (
            <div className="image-loading">
              <div className="loading-spinner"></div>
            </div>
          )}
          <img
            src={imageUrl}
            alt={product.name || 'Product'}
            className={`product-image ${imageLoading ? 'loading' : ''}`}
            onError={handleImageError}
            onLoad={handleImageLoad}
            loading="lazy"
          />
          {product.stock <= 0 && (
            <div className="out-of-stock-overlay">
              <span>Out of Stock</span>
            </div>
          )}
          {product.stock > 0 && product.stock <= 10 && (
            <div className="low-stock-badge">
              Only {product.stock} left!
            </div>
          )}
        </div>
        
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-description">
            {product.description && product.description.length > 80
              ? `${product.description.substring(0, 80)}...`
              : product.description}
          </p>
          
          <div className="product-rating">
            <div className="stars">
              {renderStars(product.rating || 0)}
            </div>
            <span className="rating-text">
              {product.rating ? product.rating.toFixed(1) : '0.0'} 
              ({product.numReviews || 0} reviews)
            </span>
          </div>
          
          <div className="product-footer">
            <div className="product-price">
              {formatPrice(product.price)}
            </div>
            <div className="product-category">
              {product.category}
            </div>
          </div>
        </div>
      </Link>
      
      {/* Add to Cart Button */}
      <div className="product-actions">
        {product.stock > 0 ? (
          <button 
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`add-to-cart-btn ${inCart ? 'in-cart' : ''} ${isAdding ? 'adding' : ''}`}
          >
            {isAdding ? (
              <span className="btn-loading">
                <div className="btn-spinner"></div>
                Adding...
              </span>
            ) : inCart ? (
              <span>
                In Cart ({itemQuantity})
              </span>
            ) : (
              'Add to Cart'
            )}
          </button>
        ) : (
          <button className="add-to-cart-btn out-of-stock" disabled>
            Out of Stock
          </button>
        )}
      </div>
      
      <style jsx>{`
        .product-card {
          background: var(--navy-medium);
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
          border: 1px solid var(--gray-medium);
          height: 100%;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          border-color: var(--accent-blue);
        }
        
        .product-link {
          text-decoration: none;
          color: inherit;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        
        .product-image-container {
          position: relative;
          width: 100%;
          height: 240px;
          overflow: hidden;
          background: var(--gray-medium);
        }
        
        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease, opacity 0.3s ease;
        }
        
        .product-image.loading {
          opacity: 0;
        }
        
        .product-card:hover .product-image {
          transform: scale(1.05);
        }
        
        .image-loading {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 2;
        }
        
        .loading-spinner {
          width: 30px;
          height: 30px;
          border: 3px solid var(--gray-medium);
          border-top: 3px solid var(--accent-blue);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .out-of-stock-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--white);
          font-weight: bold;
          font-size: 1.1rem;
        }
        
        .low-stock-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background: linear-gradient(45deg, #ff6b35, #f39c12);
          color: var(--white);
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: bold;
        }
        
        .product-info {
          padding: 1.5rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        
        .product-name {
          color: var(--white);
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .product-description {
          color: var(--gray-light);
          font-size: 0.9rem;
          line-height: 1.4;
          margin-bottom: 1rem;
          flex: 1;
        }
        
        .product-rating {
          margin-bottom: 1rem;
        }
        
        .stars {
          display: flex;
          gap: 2px;
          margin-bottom: 0.25rem;
        }
        
        .star {
          font-size: 1rem;
          color: var(--gray-medium);
        }
        
        .star.filled {
          color: #ffc107;
        }
        
        .star.half {
          background: linear-gradient(90deg, #ffc107 50%, var(--gray-medium) 50%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .rating-text {
          color: var(--gray-light);
          font-size: 0.8rem;
        }
        
        .product-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
        }
        
        .product-price {
          color: var(--accent-blue);
          font-size: 1.5rem;
          font-weight: 700;
        }
        
        .product-category {
          background: var(--navy-dark);
          color: var(--gray-light);
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          border: 1px solid var(--gray-medium);
        }
        
        .product-actions {
          padding: 1rem 1.5rem;
          border-top: 1px solid var(--gray-medium);
        }
        
        .add-to-cart-btn {
          width: 100%;
          padding: 0.75rem 1rem;
          border: none;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          background: var(--accent-blue);
          color: var(--white);
        }
        
        .add-to-cart-btn:hover:not(:disabled) {
          background: var(--accent-blue-dark);
          transform: translateY(-1px);
        }
        
        .add-to-cart-btn.in-cart {
          background: var(--success);
        }
        
        .add-to-cart-btn.adding {
          background: var(--gray-medium);
          cursor: not-allowed;
        }
        
        .add-to-cart-btn.out-of-stock {
          background: var(--gray-medium);
          color: var(--gray-light);
          cursor: not-allowed;
        }
        
        .btn-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        
        .btn-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid var(--gray-light);
          border-top: 2px solid var(--white);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @media (max-width: 768px) {
          .product-image-container {
            height: 200px;
          }
          
          .product-info {
            padding: 1rem;
          }
          
          .product-name {
            font-size: 1.1rem;
          }
          
          .product-price {
            font-size: 1.3rem;
          }
          
          .product-actions {
            padding: 0.75rem 1rem;
          }
        }
      `}</style>
    </div>
  )
}

export default ProductCard