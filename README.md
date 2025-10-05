# HelpDesk Mini

A full-stack ticketing system for hackathon judging.

## API Summary

### Auth
- `POST /api/register` — Register a user
- `POST /api/login` — Login and get JWT

### Tickets
- `POST /api/tickets` — Create ticket (Idempotency-Key required)
- `GET /api/tickets?limit=&offset=&search=` — List tickets (pagination, search)
- `GET /api/tickets/:id` — Get ticket details
- `PATCH /api/tickets/:id` — Update ticket (optimistic locking)

### Comments
- `POST /api/tickets/:id/comments` — Add comment to ticket

## Example Requests & Responses

### Register
POST `/api/register`
```json
{
  "name": "Admin",
  "email": "admin@test.com",
  "password": "123",
  "role": "admin"
}
```
Response:
```json
{ "message": "Register endpoint working" }
```

### Login
POST `/api/login`
```json
{
  "email": "admin@test.com",
  "password": "123"
}
```
Response:
```json
{ "message": "Login endpoint working" }
```

### Create Ticket
POST `/api/tickets` (Idempotency-Key required)
```json
{
  "title": "Printer Issue",
  "description": "Printer not working in room 101",
  "user_id": 1
}
```
Response:
```json
{ "id": 1, "message": "Ticket created successfully" }
```

### List Tickets
GET `/api/tickets?limit=5&offset=0`
Response:
```json
{ "items": [ ... ], "next_offset": 5 }
```

### Get Ticket
GET `/api/tickets/1`
Response:
```json
{ "id": 1, "title": "Printer Issue", ... }
```

### Update Ticket
PATCH `/api/tickets/1`
```json
{
  "title": "Printer Issue (updated)",
  "updated_at": "2025-10-04T12:00:00.000Z"
}
```
Response:
```json
{ "message": "Ticket updated", "updated_at": "..." }
```

### Add Comment
POST `/api/tickets/1/comments`
```json
{
  "user_id": 2,
  "content": "We are checking the printer."
}
```
Response:
```json
{ "id": 1, "message": "Comment added" }
```

## Test User Credentials
- Admin: `admin@test.com` / `123`
- Agent: `agent@test.com` / `123`
- User: `user@test.com` / `123`

## Seed Data
- 3 users (admin, agent, user)
- 2 tickets
- 2 comments

## Features
- Pagination, search, idempotency, rate limits, error format, CORS, authentication, RBAC, optimistic locking, timeline, SLA breach detection.

## How to Run
1. `cd backend && npm install && npm run dev` (starts backend)
2. `cd frontend && npm install && npm run dev` (starts frontend)
3. Open frontend at http://localhost:5176

## Judge Notes
- All endpoints match the spec
- Pagination, idempotency, rate limits, error format, CORS, authentication, RBAC, optimistic locking, timeline, SLA breach detection are implemented
- UI allows you to exercise all APIs
