import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import ProductCard from "../components/ProductCard"
import LoadingSpinner from "../components/LoadingSpinner"

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch('http://localhost:5000/api/products?limit=6')
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('API Response:', data)
        
        // Handle different response structures
        let products = []
        if (data.success && data.data) {
          products = data.data
        } else if (data.products) {
          products = data.products
        } else if (Array.isArray(data)) {
          products = data
        }
        
        setFeaturedProducts(products)
        setError("")
      } catch (err) {
        setError("Failed to load featured products. Make sure your backend is running.")
        console.error("Error fetching featured products:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content text-center">
            <h1 className="hero-title">Discover Amazing Products at Unbeatable Prices</h1>
            <p className="hero-subtitle">
              Shop the latest trends and find everything you need in one place. Quality products, fast shipping, and
              exceptional customer service.
            </p>
            <div className="hero-actions">
              <Link to="/products" className="btn btn-primary btn-large">
                Shop Now
              </Link>
              <Link to="/products?featured=true" className="btn btn-secondary btn-large">
                View Featured
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-8">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="feature-card text-center">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m7.5 4.27 9 5.15"></path>
                  <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
                  <path d="m3.3 7 8.7 5 8.7-5"></path>
                  <path d="M12 22V12"></path>
                </svg>
              </div>
              <h3>Fast Shipping</h3>
              <p>Free shipping on orders over $100. Get your products delivered quickly and safely.</p>
            </div>

            <div className="feature-card text-center">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4"></path>
                  <path d="M21 12c.552 0 1-.448 1-1V8a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v3c0 .552.448 1 1 1"></path>
                  <path d="M3 12v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                </svg>
              </div>
              <h3>Quality Guarantee</h3>
              <p>All products are carefully selected and tested to ensure the highest quality standards.</p>
            </div>

            <div className="feature-card text-center">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                  <polyline points="14,2 14,8 20,8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10,9 9,9 8,9"></polyline>
                </svg>
              </div>
              <h3>Easy Returns</h3>
              <p>30-day return policy. Not satisfied? Return your purchase hassle-free.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-section py-8">
        <div className="container">
          <div className="section-header text-center mb-8">
            <h2>Featured Products</h2>
            <p>Discover our handpicked selection of premium products</p>
          </div>

          {loading ? (
            <LoadingSpinner text="Loading featured products..." />
          ) : error ? (
            <div className="error-message text-center">
              <p>{error}</p>
              <button onClick={() => window.location.reload()} className="btn btn-primary mt-4">
                Try Again
              </button>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center">
              <p style={{ color: 'var(--gray-light)' }}>No featured products available.</p>
            </div>
          )}

          <div className="text-center mt-8">
            <Link to="/products" className="btn btn-secondary">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        .hero-section {
          background: linear-gradient(135deg, var(--navy-dark) 0%, var(--navy-medium) 100%);
          padding: 6rem 0;
          position: relative;
          overflow: hidden;
        }
        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('/abstract-tech-pattern.png') center/cover;
          opacity: 0.1;
          z-index: 0;
        }
        .hero-content {
          position: relative;
          z-index: 1;
        }
        .hero-title {
          font-size: 3.5rem;
          font-weight: 700;
          color: var(--white);
          margin-bottom: 1.5rem;
          line-height: 1.2;
        }
        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--gray-light);
          margin-bottom: 2.5rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }
        .hero-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        .btn-large {
          padding: 16px 32px;
          font-size: 1.1rem;
        }
        .features-section {
          background-color: var(--navy-medium);
        }
        .feature-card {
          padding: 2rem;
        }
        .feature-icon {
          color: var(--accent-blue);
          margin-bottom: 1rem;
        }
        .feature-card h3 {
          color: var(--white);
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }
        .feature-card p {
          color: var(--gray-light);
          line-height: 1.6;
        }
        .section-header h2 {
          color: var(--white);
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }
        .section-header p {
          color: var(--gray-light);
          font-size: 1.1rem;
        }
        .error-message {
          color: var(--error);
          padding: 2rem;
        }
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }
          .hero-subtitle {
            font-size: 1.1rem;
          }
          .hero-actions {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </div>
  )
}

export default Home