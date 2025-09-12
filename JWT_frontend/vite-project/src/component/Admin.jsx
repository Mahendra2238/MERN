import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Admin() {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmin = async () => {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/');

      const res = await fetch('http://localhost:5000/admin', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
        navigate('/');
      } else {
        setMessage(data.message);
      }
    };
    fetchAdmin();
  }, []);

  return (
    <div className="admin-container">
      <h2>Admin Dashboard</h2>
      <p>{message}</p>
    </div>
  );
}

export default Admin;
