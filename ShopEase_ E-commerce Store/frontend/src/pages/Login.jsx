"use client"

import { useState, useContext, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const { login, isAuthenticated } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || "/"

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, from])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const result = await login(formData.email, formData.password)

    if (result.success) {
      navigate(from, { replace: true })
    } else {
      setError(result.error)
    }

    setLoading(false)
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your ShopEase account</p>
        </div>

        {error && (
          <div className="error-alert">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className="input"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="input"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="spinner-small"></div>
                Signing In...
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="auth-link">
              Create one here
            </Link>
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="demo-credentials">
          <h4>Demo Credentials</h4>
          <div className="demo-accounts">
            <div className="demo-account">
              <strong>Admin:</strong> admin@shopease.com / admin123
            </div>
            <div className="demo-account">
              <strong>User:</strong> john@example.com / password123
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .auth-container {
          min-height: calc(100vh - 200px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        .auth-card {
          background-color: var(--navy-medium);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 3rem;
          width: 100%;
          max-width: 450px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        .auth-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .auth-header h1 {
          color: var(--white);
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .auth-header p {
          color: var(--gray-light);
          font-size: 1rem;
        }
        .error-alert {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background-color: rgba(239, 68, 68, 0.1);
          border: 1px solid var(--error);
          color: var(--error);
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
        }
        .auth-form {
          margin-bottom: 2rem;
        }
        .form-group {
          margin-bottom: 1.5rem;
        }
        .form-group label {
          display: block;
          color: var(--white);
          font-weight: 500;
          margin-bottom: 0.5rem;
        }
        .btn-full {
          width: 100%;
          padding: 1rem;
          font-size: 1rem;
          font-weight: 600;
        }
        .spinner-small {
          width: 20px;
          height: 20px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-right: 0.5rem;
        }
        .auth-footer {
          text-align: center;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border-color);
        }
        .auth-footer p {
          color: var(--gray-light);
        }
        .auth-link {
          color: var(--accent-blue);
          text-decoration: none;
          font-weight: 500;
        }
        .auth-link:hover {
          text-decoration: underline;
        }
        .demo-credentials {
          margin-top: 2rem;
          padding: 1.5rem;
          background-color: var(--navy-light);
          border-radius: 8px;
          border: 1px solid var(--border-color);
        }
        .demo-credentials h4 {
          color: var(--white);
          font-size: 1rem;
          margin-bottom: 1rem;
          text-align: center;
        }
        .demo-accounts {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .demo-account {
          color: var(--gray-light);
          font-size: 0.9rem;
          padding: 0.5rem;
          background-color: var(--navy-dark);
          border-radius: 4px;
        }
        .demo-account strong {
          color: var(--white);
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @media (max-width: 480px) {
          .auth-card {
            padding: 2rem;
          }
        }
      `}</style>
    </div>
  )
}

export default Login
