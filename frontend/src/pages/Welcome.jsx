import { useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../utils/api.js";

export default function Welcome({ setToken }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await API.apiRequest("/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (data.error) {
        setError(data.error.message);
        return;
      }

      setToken(data.token);
      localStorage.setItem("token", data.token);
      setIsLoggedIn(true);
      setError("");
      alert("Login successful!");
      navigate("/tickets"); // redirect after login
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome to HelpDesk Mini</h1>

      {!isLoggedIn && (
        <>
          <h2>Login</h2>
          <form onSubmit={handleLogin} style={{ marginBottom: "2rem" }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <button type="submit">Login</button>
          </form>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </>
      )}

      {isLoggedIn && (
        <>
          <h2>Navigate</h2>
          <ul>
            <li>
              <button onClick={() => navigate("/tickets")}>Tickets List</button>
            </li>
            <li>
              <button onClick={() => navigate("/tickets/new")}>Create New Ticket</button>
            </li>
          </ul>
        </>
      )}
    </div>
  );
}
