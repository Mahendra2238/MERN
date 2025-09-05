import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    age: "",
  });

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/users", form);
      // After a successful post, fetch all users again to get the updated list
      fetchUsers();
      setForm({ name: "", email: "", age: "" });
    } catch (err) {
      console.error("Failed to add user:", err);
    }
  };

  return (
    <div className="App">
      <h1>User Management</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
        />
        <button type="submit">Add User</button>
      </form>
      <div>
        <h2>Users</h2>
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              {user.name} ({user.email}) - Age: {user.age}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;