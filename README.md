# Social Dashboard - Productivity Hub

A full-stack productivity application with task management, notes, bookmarks, and event calendar.

## Features

- Task management with priorities and due dates
- Rich-text notes with tags
- Bookmark manager
- Event calendar
- Dark/Light mode
- Responsive design

## Tech Stack

**Frontend:** React, Vite, Tailwind CSS, Zustand  
**Backend:** Node.js, Express, MongoDB, JWT Authentication

## Installation

### Prerequisites

- Node.js (v16+)
- MongoDB

### Quick Start

Run the installation script:

```bash
.\install.ps1
```

### Manual Setup

**Backend:**

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/social-dashboard
JWT_SECRET=your_jwt_secret
```

**Frontend:**

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### Run the Application

```bash
.\start.ps1
```

Or manually:

```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev
```

Access the app at `http://localhost:3000`

## License

MIT License
