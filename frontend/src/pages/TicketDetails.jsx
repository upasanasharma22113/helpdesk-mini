import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";

export default function TicketDetails() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  useEffect(() => {
    API.get(`/tickets/${id}`).then(res => {
      setTicket(res.data);
    });
  }, [id]);
  if (!ticket) return <div className="p-4">Loading...</div>;
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{ticket.title}</h1>
      <div className="mb-2">{ticket.description}</div>
      <div className="text-sm text-gray-500">Status: {ticket.status}</div>
    </div>
  );
}
