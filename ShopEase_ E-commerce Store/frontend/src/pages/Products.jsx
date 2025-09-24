import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import ProductCard from "../components/ProductCard"
import LoadingSpinner from "../components/LoadingSpinner"

const Products = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filters, setFilters] = useState({
    category: "All Categories",
    minPrice: "",
    maxPrice: "",
    search: "",
    sort: "featured"
  })

  const [searchParams] = useSearchParams()

  // Categories for filter dropdown
  const categories = [
    "All Categories",
    "Electronics",
    "Clothing",
    "Books",
    "Home & Garden",
    "Sports",
    "Beauty",
    "Toys",
    "Automotive",
    "Other"
  ]

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch('http://localhost:5000/api/products')
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('Products API Response:', data)
        
        // Handle different response structures
        let productsArray = []
        if (data.success && data.data) {
          productsArray = data.data
        } else if (data.products) {
          productsArray = data.products
        } else if (Array.isArray(data)) {
          productsArray = data
        }
        
        setProducts(productsArray)
        setFilteredProducts(productsArray)
        setError("")
      } catch (err) {
        setError("Failed to load products. Make sure your backend is running.")
        console.error("Error fetching products:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Handle URL search params
  useEffect(() => {
    const categoryParam = searchParams.get('category')
    const searchParam = searchParams.get('search')
    
    if (categoryParam || searchParam) {
      setFilters(prev => ({
        ...prev,
        category: categoryParam || "All Categories",
        search: searchParam || ""
      }))
    }
  }, [searchParams])

  // Apply filters whenever filters or products change
  useEffect(() => {
    if (!products || products.length === 0) return

    let filtered = [...products]

    // Category filter
    if (filters.category && filters.category !== "All Categories") {
      filtered = filtered.filter(product => 
        product.category === filters.category
      )
    }

    // Price filter
    if (filters.minPrice) {
      filtered = filtered.filter(product => 
        product.price >= parseFloat(filters.minPrice)
      )
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(product => 
        product.price <= parseFloat(filters.maxPrice)
      )
    }

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.description.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    // Sort
    switch (filters.sort) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      default:
        // Featured - keep original order or sort by featured flag
        break
    }

    setFilteredProducts(filtered)
  }, [filters, products])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      category: "All Categories",
      minPrice: "",
      maxPrice: "",
      search: "",
      sort: "featured"
    })
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    // Search is already handled by useEffect
  }

  return (
    <div className="products-page">
      <div className="container">
        <div className="page-header">
          <h1>Products</h1>
          <p>Discover our wide range of quality products</p>
        </div>

        <div className="products-layout">
          {/* Filters Sidebar */}
          <div className="filters-sidebar">
            <div className="filters-header">
              <h3>Filters</h3>
              <button onClick={clearFilters} className="clear-filters">
                Clear All
              </button>
            </div>

            {/* Search */}
            <div className="filter-group">
              <label>Search</label>
              <form onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="search-input"
                />
              </form>
            </div>

            {/* Category */}
            <div className="filter-group">
              <label>Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="filter-select"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="filter-group">
              <label>Price Range</label>
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="price-input"
                />
                <span>to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="price-input"
                />
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="products-content">
            {/* Sort and Results */}
            <div className="products-header">
              <div className="results-count">
                {loading ? (
                  <span>Loading...</span>
                ) : (
                  <span>{filteredProducts?.length || 0} products found</span>
                )}
              </div>
              
              <div className="sort-controls">
                <label>Sort by:</label>
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="sort-select"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
            </div>

            {/* Products Display */}
            {loading ? (
              <LoadingSpinner text="Loading products..." />
            ) : error ? (
              <div className="error-message">
                <p>{error}</p>
                <button onClick={() => window.location.reload()} className="btn btn-primary">
                  Try Again
                </button>
              </div>
            ) : !filteredProducts || filteredProducts.length === 0 ? (
              <div className="no-products">
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms</p>
                <button onClick={clearFilters} className="btn btn-primary">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="products-grid">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id || product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .products-page {
          padding: 2rem 0;
          min-height: 80vh;
        }
        
        .page-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        
        .page-header h1 {
          color: var(--white);
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        
        .page-header p {
          color: var(--gray-light);
          font-size: 1.2rem;
        }
        
        .products-layout {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 3rem;
          align-items: start;
        }
        
        .filters-sidebar {
          background: var(--navy-medium);
          padding: 2rem;
          border-radius: 12px;
          position: sticky;
          top: 2rem;
        }
        
        .filters-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--gray-medium);
        }
        
        .filters-header h3 {
          color: var(--white);
          font-size: 1.5rem;
          margin: 0;
        }
        
        .clear-filters {
          color: var(--accent-blue);
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.9rem;
        }
        
        .clear-filters:hover {
          text-decoration: underline;
        }
        
        .filter-group {
          margin-bottom: 2rem;
        }
        
        .filter-group label {
          display: block;
          color: var(--white);
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        
        .search-input,
        .filter-select,
        .price-input,
        .sort-select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid var(--gray-medium);
          border-radius: 6px;
          background: var(--navy-dark);
          color: var(--white);
          font-size: 0.9rem;
        }
        
        .search-input:focus,
        .filter-select:focus,
        .price-input:focus,
        .sort-select:focus {
          outline: none;
          border-color: var(--accent-blue);
        }
        
        .price-inputs {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .price-input {
          flex: 1;
        }
        
        .price-inputs span {
          color: var(--gray-light);
          font-size: 0.9rem;
        }
        
        .products-content {
          flex: 1;
        }
        
        .products-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding: 1rem 0;
          border-bottom: 1px solid var(--gray-medium);
        }
        
        .results-count {
          color: var(--gray-light);
          font-size: 0.9rem;
        }
        
        .sort-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .sort-controls label {
          color: var(--white);
          font-size: 0.9rem;
        }
        
        .sort-select {
          width: auto;
          min-width: 200px;
        }
        
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
        }
        
        .error-message {
          text-align: center;
          padding: 3rem;
          color: var(--error);
        }
        
        .no-products {
          text-align: center;
          padding: 4rem 2rem;
        }
        
        .no-products h3 {
          color: var(--white);
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }
        
        .no-products p {
          color: var(--gray-light);
          margin-bottom: 2rem;
        }
        
        @media (max-width: 968px) {
          .products-layout {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          
          .filters-sidebar {
            position: static;
          }
          
          .products-header {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }
          
          .sort-controls {
            justify-content: space-between;
          }
        }
        
        @media (max-width: 768px) {
          .page-header h1 {
            font-size: 2rem;
          }
          
          .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 1.5rem;
          }
          
          .filters-sidebar {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  )
}

export default Products