import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api.js";

export default function TicketNew() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("normal");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token"); // JWT token

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title || !description) {
      setError("Title and description are required");
      return;
    }

    try {
      const data = await API.apiRequest("/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, priority }),
      });

      if (data.error) {
        setError(data.error.message);
        return;
      }

      alert("Ticket created successfully!");
      navigate("/tickets"); // Redirect to tickets list
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to create ticket");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Create New Ticket</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label>Priority:</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="normal">Normal</option>
            <option value="high">High</option>
          </select>
        </div>

        <button type="submit">Create Ticket</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
