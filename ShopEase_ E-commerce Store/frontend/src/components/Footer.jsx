"use client"
import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer
      style={{ backgroundColor: "var(--navy-medium)", borderTop: "1px solid var(--border-color)", marginTop: "4rem" }}
    >
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4">
          {/* Company Info */}
          <div className="mb-8">
            <h3 className="text-2xl mb-4" style={{ color: "var(--white)", fontWeight: "700" }}>
              ShopEase
            </h3>
            <p style={{ color: "var(--gray-light)", lineHeight: "1.6" }}>
              Your one-stop destination for quality products at unbeatable prices. Shop with confidence and ease.
            </p>
          </div>

          {/* Quick Links */}
          <div className="mb-8">
            <h4 className="mb-4" style={{ color: "var(--white)", fontWeight: "600" }}>
              Quick Links
            </h4>
            <div className="flex flex-col space-y-2">
              <Link to="/" className="footer-link">
                Home
              </Link>
              <Link to="/products" className="footer-link">
                Products
              </Link>
              <Link to="/cart" className="footer-link">
                Cart
              </Link>
              <Link to="/orders" className="footer-link">
                Orders
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div className="mb-8">
            <h4 className="mb-4" style={{ color: "var(--white)", fontWeight: "600" }}>
              Categories
            </h4>
            <div className="flex flex-col space-y-2">
              <Link to="/products?category=Electronics" className="footer-link">
                Electronics
              </Link>
              <Link to="/products?category=Clothing" className="footer-link">
                Clothing
              </Link>
              <Link to="/products?category=Books" className="footer-link">
                Books
              </Link>
              <Link to="/products?category=Home & Garden" className="footer-link">
                Home & Garden
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="mb-8">
            <h4 className="mb-4" style={{ color: "var(--white)", fontWeight: "600" }}>
              Contact
            </h4>
            <div className="flex flex-col space-y-2">
              <p style={{ color: "var(--gray-light)" }}>Email: support@shopease.com</p>
              <p style={{ color: "var(--gray-light)" }}>Phone: (555) 123-4567</p>
              <p style={{ color: "var(--gray-light)" }}>Hours: Mon-Fri 9AM-6PM</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8" style={{ borderTop: "1px solid var(--border-color)" }}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p style={{ color: "var(--gray-medium)" }}>© 2024 ShopEase. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="/privacy" className="footer-link">
                Privacy Policy
              </Link>
              <Link to="/terms" className="footer-link">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer-link {
          color: var(--gray-light);
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .footer-link:hover {
          color: var(--white);
        }
      `}</style>
    </footer>
  )
}

export default Footer
