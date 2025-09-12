import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Login from './component/Login';
import Register from './component/Register';
import Profile from './component/Profile';
import Admin from './component/Admin';

function App() {
  return (
    <div className="App">
      {/* Header / Navbar */}
      <header style={{ padding: '10px', background: '#282c34', color: '#fff' }}>
        <nav style={{ display: 'flex', gap: '20px' }}>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Login</Link>
          <Link to="/register" style={{ color: '#fff', textDecoration: 'none' }}>Register</Link>
          <Link to="/profile" style={{ color: '#fff', textDecoration: 'none' }}>Profile</Link>
          <Link to="/admin" style={{ color: '#fff', textDecoration: 'none' }}>Admin</Link>
        </nav>
      </header>

      {/* Routes */}
      <main style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
