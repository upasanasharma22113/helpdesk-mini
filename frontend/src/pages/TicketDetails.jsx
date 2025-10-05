import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../utils/api.js";

export default function TicketDetails() {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [ticket, setTicket] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    async function fetchTicket() {
      try {
        // Fetch ticket details
        const ticketData = await API.apiRequest(`/tickets/${id}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        setTicket(ticketData);

        // Fetch timeline
        const timelineData = await API.apiRequest(`/tickets/${id}/timeline`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        setTimeline(timelineData.logs || []);

        // Fetch comments
        const commentsData = await API.apiRequest(`/tickets/${id}/comments`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        setComments(commentsData.comments || []);
      } catch (err) {
        console.error(err);
      }
    }

    fetchTicket();
  }, [id, token]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment) return;

    try {
      const data = await API.apiRequest(`/tickets/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (data.id) {
        setComments((prev) => [...prev, { content: newComment, created_at: new Date().toISOString() }]);
        setNewComment("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!ticket) return <p>Loading ticket details...</p>;

  const now = new Date();
  const breached = ticket.due_date && new Date(ticket.due_date) < now;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Ticket Details</h1>
      <p><strong>Title:</strong> {ticket.title}</p>
      <p><strong>Description:</strong> {ticket.description}</p>
      <p><strong>Status:</strong> {ticket.status}</p>
      <p><strong>Priority:</strong> {ticket.priority}</p>
      {breached && <p style={{ color: "red" }}>⚠ SLA breached</p>}

      <h2>Timeline</h2>
      <ul>
        {timeline.map((log, idx) => (
          <li key={idx}>
            {log.action} by user {log.user_id} at {new Date(log.created_at).toLocaleString()}
          </li>
        ))}
      </ul>

      <h2>Comments</h2>
      <ul>
        {comments.map((c, idx) => (
          <li key={idx}>
            {c.content} <em>({new Date(c.created_at).toLocaleString()})</em>
          </li>
        ))}
      </ul>

      <form onSubmit={handleCommentSubmit}>
        <input
          type="text"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          style={{ width: "300px" }}
        />
        <button type="submit">Add Comment</button>
      </form>
    </div>
  );
}
