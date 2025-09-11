// App.js
import { BrowserRouter as Router, Route, Routes, NavLink } from "react-router-dom";
import Home from "./components/Home";
import Welcome from "./components/welcome";
// import About from "./components/about";
import Payment from "./components/payment";

function App() {
  return (
    <Router>
      {/* Navigation Bar */}
      <nav style={{ display: "flex", gap: "20px", padding: "15px", background: "#d8b4fe" }}>
        <NavLink to="/" style={{ textDecoration: "none" }}>Welcome</NavLink>
        <NavLink to="/home" style={{ textDecoration: "none" }}>Home</NavLink>
        <NavLink to="/payment" style={{ textDecoration: "none" }}>Payment</NavLink>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/home" element={<Home />} />
        {/* <Route path="/about" element={<About />} /> */}
        <Route path="/payment" element={<Payment />} />
      </Routes>
    </Router>
  );
}

export default App;
