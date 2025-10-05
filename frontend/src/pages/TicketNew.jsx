import { useState } from "react";
import API from "../api";

export default function TicketNew() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await API.post(
        "/tickets",
        { title, description, user_id: 1 }, // Default to Admin for demo
        { headers: { "Idempotency-Key": Date.now().toString() } }
      );
      setMessage("Ticket created: " + res.data.id);
      setTitle("");
      setDescription("");
    } catch (err) {
      setMessage(err.response?.data?.error?.message || "Error");
    }
  };
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">New Ticket</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="border p-2 w-full"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <textarea
          className="border p-2 w-full"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">
          Create Ticket
        </button>
      </form>
      {message && <div className="mt-4 text-green-600">{message}</div>}
    </div>
  );
}
