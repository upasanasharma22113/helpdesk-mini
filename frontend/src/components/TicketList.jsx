import { useEffect, useState } from "react";

export default function TicketList({ token, onSelectTicket }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/tickets?limit=10&offset=0`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data?.error?.message || "Failed to fetch tickets");

      setTickets(data.items);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  if (loading) return <p>Loading tickets...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!tickets.length) return <p>No tickets found.</p>;

  return (
    <div className="space-y-2">
      {tickets.map((ticket) => (
        <div
          key={ticket.id}
          onClick={() => onSelectTicket(ticket.id)}
          className="border p-4 rounded cursor-pointer hover:bg-gray-100"
        >
          <h3 className="font-semibold">{ticket.title}</h3>
          <p className="text-sm text-gray-500">Status: {ticket.status}</p>
          <p className="text-sm text-gray-400">Priority: {ticket.priority}</p>
        </div>
      ))}
    </div>
  );
}
