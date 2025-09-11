import React from "react";

function Payment() {
  const loadRazorpay = async () => {
    try {
      const res = await fetch('http://localhost:5000/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 1000, // example amount in paisa
          currency: 'INR',
          receipt: 'receipt_1',
        }),
      });
      const data = await res.json();
      console.log(data);
      // Handle the order creation response
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  return (
    <div>
      <h1>Payment Component</h1>
      <button onClick={loadRazorpay}>Create Order</button>
    </div>
  );
}

export default Payment;

