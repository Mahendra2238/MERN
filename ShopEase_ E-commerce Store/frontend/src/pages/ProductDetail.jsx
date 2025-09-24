"use client"

import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { CartContext } from "../context/CartContext"
import api from "../services/api"
import LoadingSpinner from "../components/LoadingSpinner"
import "../styles/ProductDetail.css"

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useContext(CartContext)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`)
      if (response.data.success) {
        setProduct(response.data.product)
      } else {
        navigate("/products")
      }
    } catch (error) {
      console.error("Failed to fetch product:", error)
      navigate("/products")
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity)
      alert("Product added to cart!")
    }
  }

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!product) {
    return (
      <div className="product-detail-container">
        <div className="product-not-found">
          <h2>Product Not Found</h2>
          <button onClick={() => navigate("/products")}>Back to Products</button>
        </div>
      </div>
    )
  }

  const images = product.images || [product.image || "/placeholder.svg"]

  return (
    <div className="product-detail-container">
      <button onClick={() => navigate("/products")} className="back-btn">
        ← Back to Products
      </button>

      <div className="product-detail-content">
        <div className="product-images">
          <div className="main-image">
            <img src={images[selectedImage] || "/placeholder.svg"} alt={product.name} />
          </div>
          {images.length > 1 && (
            <div className="image-thumbnails">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} ${index + 1}`}
                  className={selectedImage === index ? "active" : ""}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="product-info">
          <h1>{product.name}</h1>
          <div className="product-rating">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.floor(product.rating || 4) ? "filled" : ""}>
                  ★
                </span>
              ))}
            </div>
            <span className="rating-text">
              {product.rating || 4.0} ({product.reviews || 0} reviews)
            </span>
          </div>

          <div className="product-price">
            <span className="current-price">${product.price}</span>
            {product.originalPrice && <span className="original-price">${product.originalPrice}</span>}
          </div>

          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          <div className="product-details">
            <div className="detail-item">
              <span className="label">Category:</span>
              <span className="value">{product.category}</span>
            </div>
            <div className="detail-item">
              <span className="label">Stock:</span>
              <span className="value">{product.stock} available</span>
            </div>
            <div className="detail-item">
              <span className="label">SKU:</span>
              <span className="value">{product._id.slice(-8).toUpperCase()}</span>
            </div>
          </div>

          <div className="purchase-section">
            <div className="quantity-selector">
              <label>Quantity:</label>
              <div className="quantity-controls">
                <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                  -
                </button>
                <span className="quantity-display">{quantity}</span>
                <button onClick={() => handleQuantityChange(1)} disabled={quantity >= product.stock}>
                  +
                </button>
              </div>
            </div>

            <div className="purchase-buttons">
              <button onClick={handleAddToCart} className="add-to-cart-btn" disabled={product.stock === 0}>
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
              <button
                onClick={() => {
                  handleAddToCart()
                  navigate("/cart")
                }}
                className="buy-now-btn"
                disabled={product.stock === 0}
              >
                Buy Now
              </button>
            </div>
          </div>

          <div className="shipping-info">
            <div className="shipping-item">
              <span className="icon">🚚</span>
              <span>Free shipping on orders over $100</span>
            </div>
            <div className="shipping-item">
              <span className="icon">↩️</span>
              <span>30-day return policy</span>
            </div>
            <div className="shipping-item">
              <span className="icon">🔒</span>
              <span>Secure payment guaranteed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
