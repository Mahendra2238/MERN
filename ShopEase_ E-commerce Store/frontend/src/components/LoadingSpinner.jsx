"use client"

const LoadingSpinner = ({ size = "medium", text = "Loading..." }) => {
  const sizeClasses = {
    small: "20px",
    medium: "40px",
    large: "60px",
  }

  return (
    <div className="loading-container">
      <div
        className="spinner"
        style={{
          width: sizeClasses[size],
          height: sizeClasses[size],
        }}
      ></div>
      {text && <p className="loading-text">{text}</p>}

      <style jsx>{`
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        .spinner {
          border: 3px solid var(--border-color);
          border-top: 3px solid var(--accent-blue);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        .loading-text {
          color: var(--gray-light);
          margin-top: 1rem;
          font-size: 1rem;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default LoadingSpinner
