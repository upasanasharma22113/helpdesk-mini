import { useEffect, useState } from "react";
import API from "../api";

export default function TicketsList() {
  const [tickets, setTickets] = useState([]);
  useEffect(() => {
    API.get("/tickets?limit=5&offset=0").then(res => {
      setTickets(res.data.items || []);
    });
  }, []);
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tickets List</h1>
      <ul>
        {tickets.map(t => (
          <li key={t.id} className="mb-2 p-2 border rounded">
            <a href={`/tickets/${t.id}`}>{t.title}</a>
            <div className="text-sm text-gray-500">{t.description}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
