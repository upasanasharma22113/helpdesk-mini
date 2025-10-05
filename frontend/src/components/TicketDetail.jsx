import { useEffect, useState } from "react";
import CommentForm from "./CommentForm";

export default function TicketDetail({ ticketId, token }) {
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);

  const fetchTicket = async () => {
    const res = await fetch(`http://localhost:5000/api/tickets/${ticketId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setTicket(data.ticket);
    setComments(data.comments || []);
  };

  useEffect(() => {
    fetchTicket();
  }, [ticketId]);

  return (
    <div className="p-4">
      {ticket && (
        <>
          <h2 className="text-xl font-bold">{ticket.title}</h2>
          <p>{ticket.description}</p>
          <p className="mt-2 text-sm text-gray-500">Status: {ticket.status}</p>

          <h3 className="mt-4 font-semibold">Comments</h3>
          {comments.map((c) => (
            <div key={c.id} className="border-b py-2">
              <p>{c.content}</p>
              <p className="text-xs text-gray-400">{c.created_at}</p>
            </div>
          ))}

          <CommentForm
            ticketId={ticketId}
            token={token}
            onCommentAdded={(newComment) => setComments([...comments, newComment])}
          />
        </>
      )}
    </div>
  );
}
