import React from "react";

function Payment() {
  const loadRazorpay = () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const options = {
        key: "rzp_test_1a1bX0Tqn56znR", // replace with your Razorpay Key ID
        amount: "50000", // 50000 paise = INR 500
        currency: "INR",
        name: "My Vite App",
        description: "Test Transaction",
        image: "https://example.com/your_logo",
        handler: function (response) {
          alert(`Payment Successful! ID: ${response.razorpay_payment_id}`);
        },
        theme: {
          color: "#6366f1",
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    };
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #f9d2ff, #dcd6ff)",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "2rem 3rem",
          borderRadius: "20px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        <h1 style={{ marginBottom: "1rem", color: "#333" }}>Payment Page</h1>
        <p style={{ marginBottom: "1.5rem", color: "#666" }}>
          Click below to complete your payment securely.
        </p>
        <button
          onClick={loadRazorpay}
          style={{
            background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
            color: "#fff",
            border: "none",
            padding: "12px 24px",
            borderRadius: "12px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "600",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
          }}
          onMouseOver={(e) => {
            e.target.style.transform = "scale(1.05)";
            e.target.style.boxShadow = "0 8px 20px rgba(99,102,241,0.4)";
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow = "none";
          }}
        >
          💳 Pay Now
        </button>
      </div>
    </div>
  );
}

export default Payment;
