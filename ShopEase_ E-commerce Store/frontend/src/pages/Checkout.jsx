"use client"

import { useState, useContext } from "react"
import { CartContext } from "../context/CartContext"
import { AuthContext } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
import "../styles/Checkout.css"

const Checkout = () => {
  const { cartItems, clearCart, getCartTotal } = useContext(CartContext)
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "USA",
  })

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  })

  const [loading, setLoading] = useState(false)

  const handleShippingChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value,
    })
  }

  const handlePaymentChange = (e) => {
    setPaymentInfo({
      ...paymentInfo,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const orderData = {
        items: cartItems.map((item) => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: shippingInfo,
        paymentMethod: "Credit Card",
        totalAmount: getCartTotal() + 10 + getCartTotal() * 0.08, // Including shipping and tax
      }

      const response = await api.post("/orders", orderData)

      if (response.data.success) {
        clearCart()
        navigate("/orders")
        alert("Order placed successfully!")
      }
    } catch (error) {
      console.error("Order placement failed:", error)
      alert("Failed to place order. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const subtotal = getCartTotal()
  const shipping = 10
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>

      <div className="checkout-content">
        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="form-section">
            <h3>Shipping Information</h3>
            <div className="form-row">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={shippingInfo.fullName}
                onChange={handleShippingChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={shippingInfo.email}
                onChange={handleShippingChange}
                required
              />
            </div>
            <input
              type="text"
              name="address"
              placeholder="Street Address"
              value={shippingInfo.address}
              onChange={handleShippingChange}
              required
            />
            <div className="form-row">
              <input
                type="text"
                name="city"
                placeholder="City"
                value={shippingInfo.city}
                onChange={handleShippingChange}
                required
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={shippingInfo.state}
                onChange={handleShippingChange}
                required
              />
              <input
                type="text"
                name="zipCode"
                placeholder="ZIP Code"
                value={shippingInfo.zipCode}
                onChange={handleShippingChange}
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Payment Information</h3>
            <input
              type="text"
              name="cardName"
              placeholder="Name on Card"
              value={paymentInfo.cardName}
              onChange={handlePaymentChange}
              required
            />
            <input
              type="text"
              name="cardNumber"
              placeholder="Card Number"
              value={paymentInfo.cardNumber}
              onChange={handlePaymentChange}
              required
            />
            <div className="form-row">
              <input
                type="text"
                name="expiryDate"
                placeholder="MM/YY"
                value={paymentInfo.expiryDate}
                onChange={handlePaymentChange}
                required
              />
              <input
                type="text"
                name="cvv"
                placeholder="CVV"
                value={paymentInfo.cvv}
                onChange={handlePaymentChange}
                required
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="place-order-btn">
            {loading ? "Placing Order..." : `Place Order - $${total.toFixed(2)}`}
          </button>
        </form>

        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="order-items">
            {cartItems.map((item) => (
              <div key={item._id} className="order-item">
                <img src={item.image || "/placeholder.svg"} alt={item.name} />
                <div className="item-details">
                  <p>{item.name}</p>
                  <p>Qty: {item.quantity}</p>
                </div>
                <p className="item-price">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="summary-totals">
            <div className="summary-line">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-line">
              <span>Shipping:</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="summary-line">
              <span>Tax:</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="summary-line total">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
