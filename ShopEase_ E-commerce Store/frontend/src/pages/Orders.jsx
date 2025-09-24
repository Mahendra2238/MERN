"use client"

import { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import LoadingSpinner from "../components/LoadingSpinner"
import { orderService } from "../services/api"

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [pagination, setPagination] = useState({})
  const [currentPage, setCurrentPage] = useState(1)

  const { user } = useContext(AuthContext)

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user, currentPage])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const response = await orderService.getOrders({ page: currentPage, limit: 10 })
      setOrders(response.orders)
      setPagination(response.pagination)
    } catch (err) {
      setError("Failed to load orders")
      console.error("Error fetching orders:", err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: "var(--warning)",
      confirmed: "var(--accent-blue)",
      processing: "var(--accent-blue)",
      shipped: "var(--accent-green)",
      delivered: "var(--success)",
      cancelled: "var(--error)",
    }
    return colors[status] || "var(--gray-medium)"
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!user) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h2>Please log in to view your orders</h2>
          <Link to="/login" className="btn btn-primary mt-4">
            Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="orders-header mb-8">
        <h1>My Orders</h1>
        <p>Track and manage your order history</p>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading your orders..." />
      ) : error ? (
        <div className="error-message text-center">
          <p>{error}</p>
          <button onClick={fetchOrders} className="btn btn-primary mt-4">
            Try Again
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-orders text-center">
          <div className="empty-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="m1 1 4 4 2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </div>
          <h3>No Orders Yet</h3>
          <p>You haven't placed any orders yet. Start shopping to see your orders here.</p>
          <Link to="/products" className="btn btn-primary mt-4">
            Start Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order #{order.orderNumber}</h3>
                    <p>Placed on {formatDate(order.createdAt)}</p>
                  </div>
                  <div className="order-status">
                    <span className="status-badge" style={{ backgroundColor: getStatusColor(order.orderStatus) }}>
                      {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="order-items">
                  {order.items.slice(0, 3).map((item) => (
                    <div key={item._id} className="order-item">
                      <img
                        src={item.image || "/placeholder.svg?height=60&width=60&query=product"}
                        alt={item.name}
                        className="item-image"
                      />
                      <div className="item-details">
                        <h4>{item.name}</h4>
                        <p>
                          Qty: {item.quantity} × ${item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 3 && <div className="more-items">+{order.items.length - 3} more items</div>}
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    <strong>Total: ${order.total.toFixed(2)}</strong>
                  </div>
                  <div className="order-actions">
                    <Link to={`/orders/${order._id}`} className="btn btn-secondary">
                      View Details
                    </Link>
                    {order.orderStatus === "delivered" && <button className="btn btn-primary">Reorder</button>}
                  </div>
                </div>

                {order.trackingNumber && (
                  <div className="tracking-info">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"></path>
                      <path d="M15 18H9"></path>
                      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"></path>
                      <circle cx="17" cy="18" r="2"></circle>
                      <circle cx="7" cy="18" r="2"></circle>
                    </svg>
                    Tracking: {order.trackingNumber}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn btn-secondary"
              >
                Previous
              </button>

              <div className="page-info">
                Page {currentPage} of {pagination.totalPages}
              </div>

              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
                className="btn btn-secondary"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <style jsx>{`
        .orders-header h1 {
          color: var(--white);
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }
        .orders-header p {
          color: var(--gray-light);
          font-size: 1.1rem;
        }
        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .order-card {
          background-color: var(--navy-medium);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 1.5rem;
          transition: all 0.2s ease;
        }
        .order-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        }
        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
        }
        .order-info h3 {
          color: var(--white);
          font-size: 1.25rem;
          margin-bottom: 0.25rem;
        }
        .order-info p {
          color: var(--gray-light);
          font-size: 0.9rem;
        }
        .status-badge {
          color: var(--white);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
        }
        .order-items {
          margin-bottom: 1.5rem;
        }
        .order-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .order-item:last-child {
          margin-bottom: 0;
        }
        .item-image {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 8px;
          border: 1px solid var(--border-color);
        }
        .item-details h4 {
          color: var(--white);
          font-size: 1rem;
          margin-bottom: 0.25rem;
        }
        .item-details p {
          color: var(--gray-light);
          font-size: 0.9rem;
        }
        .more-items {
          color: var(--gray-medium);
          font-size: 0.9rem;
          font-style: italic;
          margin-top: 0.5rem;
        }
        .order-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border-color);
        }
        .order-total {
          color: var(--white);
          font-size: 1.1rem;
        }
        .order-actions {
          display: flex;
          gap: 1rem;
        }
        .tracking-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 1rem;
          padding: 0.75rem;
          background-color: var(--navy-light);
          border-radius: 8px;
          color: var(--accent-green);
          font-size: 0.9rem;
        }
        .empty-orders {
          padding: 4rem 2rem;
        }
        .empty-icon {
          color: var(--gray-medium);
          margin-bottom: 1.5rem;
        }
        .empty-orders h3 {
          color: var(--white);
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }
        .empty-orders p {
          color: var(--gray-light);
          margin-bottom: 2rem;
        }
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 2rem;
          margin-top: 2rem;
        }
        .page-info {
          color: var(--gray-light);
          font-size: 0.9rem;
        }
        .error-message {
          padding: 3rem;
          color: var(--error);
        }
        @media (max-width: 768px) {
          .order-header {
            flex-direction: column;
            gap: 1rem;
          }
          .order-footer {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }
          .order-actions {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  )
}

export default Orders
