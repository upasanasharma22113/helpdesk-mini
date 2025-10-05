import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api.js";

export default function TicketsList() {
  const [tickets, setTickets] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTickets() {
      try {
        const data = await API.apiRequest("/tickets?limit=10&offset=0", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data.items) {
          setTickets(data.items);
        } else {
          setTickets([]);
        }
      } catch (err) {
        console.error(err);
      }
    }

    fetchTickets();
  }, [token]);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Tickets List</h1>
      <ul>
        {tickets.map((ticket) => (
          <li
            key={ticket.id}
            onClick={() => navigate(`/tickets/${ticket.id}`)}
            style={{
              cursor: "pointer",
              marginBottom: "1rem",
              padding: "1rem",
              border: "1px solid #ccc",
              backgroundColor: ticket.breached ? "#f8d7da" : "#e2f0d9",
            }}
          >
            <strong>{ticket.title}</strong> <br />
            Status: {ticket.status} | Priority: {ticket.priority}{" "}
            {ticket.breached && <span style={{ color: "red" }}>⚠ SLA breached</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
