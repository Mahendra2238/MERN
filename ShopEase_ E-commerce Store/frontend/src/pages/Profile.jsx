"use client"

import { useState, useContext, useEffect } from "react"
import { AuthContext } from "../context/AuthContext"
import LoadingSpinner from "../components/LoadingSpinner"

const Profile = () => {
  const { user, updateProfile, loading: authLoading } = useContext(AuthContext)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
    },
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [activeTab, setActiveTab] = useState("profile")

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        address: {
          street: user.address?.street || "",
          city: user.address?.city || "",
          state: user.address?.state || "",
          zipCode: user.address?.zipCode || "",
          country: user.address?.country || "United States",
        },
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1]
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value,
        },
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: "", text: "" })

    const result = await updateProfile(formData)

    if (result.success) {
      setMessage({ type: "success", text: "Profile updated successfully!" })
    } else {
      setMessage({ type: "error", text: result.error })
    }

    setLoading(false)
  }

  if (authLoading) {
    return <LoadingSpinner text="Loading profile..." />
  }

  if (!user) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h2>Please log in to view your profile</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="profile-layout">
        {/* Profile Sidebar */}
        <aside className="profile-sidebar">
          <div className="profile-card">
            <div className="profile-avatar">
              <div className="avatar-placeholder">{user.name.charAt(0).toUpperCase()}</div>
            </div>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <div className="user-badge">{user.role === "admin" ? "Administrator" : "Customer"}</div>
          </div>

          <nav className="profile-nav">
            <button
              className={`nav-item ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Profile Information
            </button>
            <button
              className={`nav-item ${activeTab === "security" ? "active" : ""}`}
              onClick={() => setActiveTab("security")}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <circle cx="12" cy="16" r="1"></circle>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Security
            </button>
          </nav>
        </aside>

        {/* Profile Content */}
        <main className="profile-content">
          {activeTab === "profile" && (
            <div className="content-section">
              <div className="section-header">
                <h2>Profile Information</h2>
                <p>Update your personal information and address</p>
              </div>

              {message.text && (
                <div className={`alert ${message.type === "success" ? "success" : "error"}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {message.type === "success" ? (
                      <path d="M9 12l2 2 4-4"></path>
                    ) : (
                      <>
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                      </>
                    )}
                  </svg>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-section">
                  <h3>Personal Information</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="name">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="input"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <input type="email" id="email" className="input" value={user.email} disabled />
                      <small>Email cannot be changed</small>
                    </div>

                    <div className="form-group">
                      <label htmlFor="phone">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="input"
                        placeholder="(555) 123-4567"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3>Address Information</h3>
                  <div className="form-grid">
                    <div className="form-group full-width">
                      <label htmlFor="address.street">Street Address</label>
                      <input
                        type="text"
                        id="address.street"
                        name="address.street"
                        className="input"
                        placeholder="123 Main Street"
                        value={formData.address.street}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="address.city">City</label>
                      <input
                        type="text"
                        id="address.city"
                        name="address.city"
                        className="input"
                        placeholder="New York"
                        value={formData.address.city}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="address.state">State</label>
                      <input
                        type="text"
                        id="address.state"
                        name="address.state"
                        className="input"
                        placeholder="NY"
                        value={formData.address.state}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="address.zipCode">Zip Code</label>
                      <input
                        type="text"
                        id="address.zipCode"
                        name="address.zipCode"
                        className="input"
                        placeholder="10001"
                        value={formData.address.zipCode}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="address.country">Country</label>
                      <select
                        id="address.country"
                        name="address.country"
                        className="input"
                        value={formData.address.country}
                        onChange={handleChange}
                      >
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Australia">Australia</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? (
                      <div className="flex items-center">
                        <div className="spinner-small"></div>
                        Updating...
                      </div>
                    ) : (
                      "Update Profile"
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "security" && (
            <div className="content-section">
              <div className="section-header">
                <h2>Security Settings</h2>
                <p>Manage your account security and password</p>
              </div>

              <div className="security-info">
                <div className="info-card">
                  <h4>Password</h4>
                  <p>Your password was last updated when you created your account.</p>
                  <button className="btn btn-secondary" disabled>
                    Change Password (Coming Soon)
                  </button>
                </div>

                <div className="info-card">
                  <h4>Account Status</h4>
                  <p>Your account is active and secure.</p>
                  <div className="status-badge success">Active</div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <style jsx>{`
        .profile-layout {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 2rem;
        }
        .profile-sidebar {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .profile-card {
          background-color: var(--navy-medium);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
        }
        .profile-avatar {
          margin-bottom: 1rem;
        }
        .avatar-placeholder {
          width: 80px;
          height: 80px;
          background-color: var(--accent-blue);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 700;
          color: var(--white);
          margin: 0 auto;
        }
        .profile-card h3 {
          color: var(--white);
          margin-bottom: 0.5rem;
        }
        .profile-card p {
          color: var(--gray-light);
          margin-bottom: 1rem;
        }
        .user-badge {
          background-color: var(--accent-green);
          color: var(--white);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
          display: inline-block;
        }
        .profile-nav {
          background-color: var(--navy-medium);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          overflow: hidden;
        }
        .nav-item {
          width: 100%;
          padding: 1rem 1.5rem;
          background: none;
          border: none;
          color: var(--gray-light);
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          border-bottom: 1px solid var(--border-color);
        }
        .nav-item:last-child {
          border-bottom: none;
        }
        .nav-item:hover {
          background-color: var(--navy-light);
          color: var(--white);
        }
        .nav-item.active {
          background-color: var(--accent-blue);
          color: var(--white);
        }
        .profile-content {
          background-color: var(--navy-medium);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 2rem;
        }
        .section-header {
          margin-bottom: 2rem;
        }
        .section-header h2 {
          color: var(--white);
          font-size: 1.75rem;
          margin-bottom: 0.5rem;
        }
        .section-header p {
          color: var(--gray-light);
        }
        .alert {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
        }
        .alert.success {
          background-color: rgba(16, 185, 129, 0.1);
          border: 1px solid var(--success);
          color: var(--success);
        }
        .alert.error {
          background-color: rgba(239, 68, 68, 0.1);
          border: 1px solid var(--error);
          color: var(--error);
        }
        .form-section {
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid var(--border-color);
        }
        .form-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }
        .form-section h3 {
          color: var(--white);
          font-size: 1.25rem;
          margin-bottom: 1.5rem;
        }
        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
        }
        .form-group.full-width {
          grid-column: 1 / -1;
        }
        .form-group label {
          color: var(--white);
          font-weight: 500;
          margin-bottom: 0.5rem;
        }
        .form-group small {
          color: var(--gray-medium);
          font-size: 0.85rem;
          margin-top: 0.25rem;
        }
        .form-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 2rem;
        }
        .spinner-small {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-right: 0.5rem;
        }
        .security-info {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .info-card {
          background-color: var(--navy-light);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 1.5rem;
        }
        .info-card h4 {
          color: var(--white);
          margin-bottom: 0.5rem;
        }
        .info-card p {
          color: var(--gray-light);
          margin-bottom: 1rem;
        }
        .status-badge {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
          display: inline-block;
        }
        .status-badge.success {
          background-color: var(--success);
          color: var(--white);
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .profile-layout {
            grid-template-columns: 1fr;
          }
          .form-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

export default Profile
