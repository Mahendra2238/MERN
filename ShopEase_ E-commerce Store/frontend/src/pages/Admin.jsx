"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
import "../styles/Admin.css"

const Admin = () => {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  })
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  // Product form state
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: "",
  })
  const [editingProduct, setEditingProduct] = useState(null)

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/")
      return
    }
    fetchDashboardData()
  }, [user, navigate])

  const fetchDashboardData = async () => {
    try {
      const [productsRes, ordersRes, usersRes] = await Promise.all([
        api.get("/products"),
        api.get("/orders/admin"),
        api.get("/users/admin"),
      ])

      setProducts(productsRes.data.products || [])
      setOrders(ordersRes.data.orders || [])
      setUsers(usersRes.data.users || [])

      // Calculate stats
      const totalRevenue = ordersRes.data.orders?.reduce((sum, order) => sum + order.totalAmount, 0) || 0
      setStats({
        totalProducts: productsRes.data.products?.length || 0,
        totalOrders: ordersRes.data.orders?.length || 0,
        totalUsers: usersRes.data.users?.length || 0,
        totalRevenue,
      })
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleProductSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, productForm)
      } else {
        await api.post("/products", productForm)
      }

      setProductForm({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        image: "",
      })
      setEditingProduct(null)
      fetchDashboardData()
    } catch (error) {
      console.error("Failed to save product:", error)
      alert("Failed to save product")
    }
  }

  const handleEditProduct = (product) => {
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      image: product.image || "",
    })
    setEditingProduct(product)
  }

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/${productId}`)
        fetchDashboardData()
      } catch (error) {
        console.error("Failed to delete product:", error)
        alert("Failed to delete product")
      }
    }
  }

  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus })
      fetchDashboardData()
    } catch (error) {
      console.error("Failed to update order status:", error)
      alert("Failed to update order status")
    }
  }

  if (loading) {
    return <div className="admin-loading">Loading admin dashboard...</div>
  }

  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <h2>Admin Panel</h2>
        <nav className="admin-nav">
          <button className={activeTab === "dashboard" ? "active" : ""} onClick={() => setActiveTab("dashboard")}>
            Dashboard
          </button>
          <button className={activeTab === "products" ? "active" : ""} onClick={() => setActiveTab("products")}>
            Products
          </button>
          <button className={activeTab === "orders" ? "active" : ""} onClick={() => setActiveTab("orders")}>
            Orders
          </button>
          <button className={activeTab === "users" ? "active" : ""} onClick={() => setActiveTab("users")}>
            Users
          </button>
        </nav>
      </div>

      <div className="admin-content">
        {activeTab === "dashboard" && (
          <div className="dashboard-tab">
            <h1>Dashboard Overview</h1>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Products</h3>
                <p className="stat-number">{stats.totalProducts}</p>
              </div>
              <div className="stat-card">
                <h3>Total Orders</h3>
                <p className="stat-number">{stats.totalOrders}</p>
              </div>
              <div className="stat-card">
                <h3>Total Users</h3>
                <p className="stat-number">{stats.totalUsers}</p>
              </div>
              <div className="stat-card">
                <h3>Total Revenue</h3>
                <p className="stat-number">${stats.totalRevenue.toFixed(2)}</p>
              </div>
            </div>

            <div className="recent-orders">
              <h3>Recent Orders</h3>
              <div className="orders-list">
                {orders.slice(0, 5).map((order) => (
                  <div key={order._id} className="order-item">
                    <span>Order #{order._id.slice(-6)}</span>
                    <span>{order.user?.name || "Unknown User"}</span>
                    <span>${order.totalAmount.toFixed(2)}</span>
                    <span className={`status ${order.status.toLowerCase()}`}>{order.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div className="products-tab">
            <h1>Product Management</h1>

            <form onSubmit={handleProductSubmit} className="product-form">
              <h3>{editingProduct ? "Edit Product" : "Add New Product"}</h3>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  required
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  required
                />
              </div>
              <div className="form-row">
                <select
                  value={productForm.category}
                  onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Home">Home</option>
                  <option value="Sports">Sports</option>
                  <option value="Books">Books</option>
                </select>
                <input
                  type="number"
                  placeholder="Stock Quantity"
                  value={productForm.stock}
                  onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                  required
                />
              </div>
              <input
                type="url"
                placeholder="Image URL"
                value={productForm.image}
                onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
              />
              <textarea
                placeholder="Product Description"
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                required
              />
              <div className="form-buttons">
                <button type="submit">{editingProduct ? "Update Product" : "Add Product"}</button>
                {editingProduct && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct(null)
                      setProductForm({
                        name: "",
                        description: "",
                        price: "",
                        category: "",
                        stock: "",
                        image: "",
                      })
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="products-list">
              <h3>All Products</h3>
              <div className="products-grid">
                {products.map((product) => (
                  <div key={product._id} className="product-card">
                    <img src={product.image || "/placeholder.svg"} alt={product.name} />
                    <div className="product-info">
                      <h4>{product.name}</h4>
                      <p className="product-price">${product.price}</p>
                      <p className="product-stock">Stock: {product.stock}</p>
                      <div className="product-actions">
                        <button onClick={() => handleEditProduct(product)}>Edit</button>
                        <button onClick={() => handleDeleteProduct(product._id)} className="delete-btn">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="orders-tab">
            <h1>Order Management</h1>
            <div className="orders-table">
              {orders.map((order) => (
                <div key={order._id} className="order-row">
                  <div className="order-info">
                    <h4>Order #{order._id.slice(-6)}</h4>
                    <p>Customer: {order.user?.name || "Unknown"}</p>
                    <p>Total: ${order.totalAmount.toFixed(2)}</p>
                    <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="order-status">
                    <select value={order.status} onChange={(e) => handleOrderStatusUpdate(order._id, e.target.value)}>
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="order-items">
                    <h5>Items:</h5>
                    {order.items.map((item, index) => (
                      <p key={index}>
                        {item.product?.name || "Unknown Product"} x{item.quantity}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="users-tab">
            <h1>User Management</h1>
            <div className="users-table">
              {users.map((user) => (
                <div key={user._id} className="user-row">
                  <div className="user-info">
                    <h4>{user.name}</h4>
                    <p>{user.email}</p>
                    <p>Role: {user.role}</p>
                    <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="user-stats">
                    <p>Orders: {orders.filter((order) => order.user?._id === user._id).length}</p>
                    <p>
                      Total Spent: $
                      {orders
                        .filter((order) => order.user?._id === user._id)
                        .reduce((sum, order) => sum + order.totalAmount, 0)
                        .toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Admin
