# Backend (Express + MongoDB)

## Env
See `.env.example`

## Run
```bash
npm install
npm run dev
```

## Models
- **User**: name, email, passwordHash
- **Event**: title, startTime, endTime, status (BUSY|SWAPPABLE|SWAP_PENDING), userId
- **SwapRequest**: mySlot (ObjectId), theirSlot (ObjectId), requester (UserId of who initiated), recipient (UserId of who owns `theirSlot`), status (PENDING|ACCEPTED|REJECTED)

## Endpoints
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/events`
- `POST /api/events`
- `PATCH /api/events/:id`
- `DELETE /api/events/:id`
- `GET /api/swappable-slots`
- `POST /api/swap-request`
- `POST /api/swap-response/:requestId`
- `GET /api/requests` — lists incoming & outgoing for current user
