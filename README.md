# Social Dashboard - Productivity Hub

A feature-rich, full-stack productivity application with task management, notes, bookmarks, and event calendar.

## 🚀 Features

- **Authentication**: Secure JWT-based authentication with login/register
- **Dashboard**: Customizable dashboard with drag-and-drop widgets
- **Task Manager**: Full CRUD operations with priorities, status, and due dates
- **Rich-Text Notes**: Create notes with TipTap editor, colors, and tags
- **Bookmark Manager**: Save and organize bookmarks with tags and categories
- **Event Calendar**: Interactive calendar for scheduling events
- **Dark/Light Mode**: Theme toggle with smooth transitions
- **Real-time Updates**: Socket.io integration for live updates
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Animations**: Smooth animations with Framer Motion

## 🛠️ Tech Stack

### Frontend

- React 18
- Vite
- Tailwind CSS
- Framer Motion
- React Router
- Zustand (State Management)
- TipTap (Rich Text Editor)
- React Big Calendar
- DnD Kit (Drag & Drop)
- Socket.io Client
- Axios

### Backend

- Node.js
- Express
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt
- Socket.io
- Express Validator

## 📦 Installation

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)

### Backend Setup

1. Navigate to backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/social-dashboard
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

4. Start MongoDB (if running locally):

```bash
mongod
```

5. Start the server:

```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

4. Start the development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 🌐 Deployment

### Frontend (Vercel)

1. Install Vercel CLI:

```bash
npm i -g vercel
```

2. Deploy:

```bash
cd frontend
vercel
```

3. Set environment variables in Vercel dashboard:

```
VITE_API_URL=your_backend_url/api
VITE_SOCKET_URL=your_backend_url
```

### Backend (Render/Heroku)

#### Render

1. Create a new Web Service on Render
2. Connect your repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables

#### Heroku

```bash
cd backend
heroku create your-app-name
heroku config:set MONGODB_URI=your_mongodb_atlas_uri
heroku config:set JWT_SECRET=your_secret
git push heroku main
```

## 📱 Features in Detail

### Task Manager

- Create, read, update, delete tasks
- Priority levels (Low, Medium, High, Urgent)
- Status tracking (Todo, In Progress, Completed)
- Due dates
- Tags
- Filter by status and priority

### Notes

- Rich text editing with TipTap
- Color-coded notes
- Pin important notes
- Archive functionality
- Tag organization
- Search notes

### Bookmarks

- Save favorite links
- Categories and tags
- Favorites
- Favicon display
- Quick access links

### Calendar

- Interactive calendar view
- Create events with dates and times
- All-day events
- Location tracking
- Event categories
- Color coding

### Dashboard

- Drag-and-drop widgets
- Recent items from all sections
- Quick stats
- Real-time updates

## 🔒 Security Features

- JWT authentication
- Password hashing with bcrypt
- Protected API routes
- HTTP-only cookies (optional)
- Input validation
- XSS protection

## 🎨 UI/UX Features

- Dark/Light mode toggle
- Smooth animations and transitions
- Responsive design for all devices
- Loading states
- Toast notifications
- Modal dialogs
- Hover effects
- Gradient backgrounds

## 📝 API Endpoints

### Authentication

- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user
- PUT `/api/auth/profile` - Update profile

### Tasks

- GET `/api/tasks` - Get all tasks
- GET `/api/tasks/:id` - Get single task
- POST `/api/tasks` - Create task
- PUT `/api/tasks/:id` - Update task
- DELETE `/api/tasks/:id` - Delete task

### Notes

- GET `/api/notes` - Get all notes
- GET `/api/notes/:id` - Get single note
- POST `/api/notes` - Create note
- PUT `/api/notes/:id` - Update note
- DELETE `/api/notes/:id` - Delete note

### Bookmarks

- GET `/api/bookmarks` - Get all bookmarks
- GET `/api/bookmarks/:id` - Get single bookmark
- POST `/api/bookmarks` - Create bookmark
- PUT `/api/bookmarks/:id` - Update bookmark
- DELETE `/api/bookmarks/:id` - Delete bookmark

### Events

- GET `/api/events` - Get all events
- GET `/api/events/:id` - Get single event
- POST `/api/events` - Create event
- PUT `/api/events/:id` - Update event
- DELETE `/api/events/:id` - Delete event

### Widgets

- GET `/api/widgets` - Get all widgets
- POST `/api/widgets` - Create widget
- PUT `/api/widgets/:id` - Update widget
- PUT `/api/widgets/batch/update` - Batch update widgets
- DELETE `/api/widgets/:id` - Delete widget

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ using React, Node.js, and MongoDB

## 🙏 Acknowledgments

- React Team
- Tailwind CSS
- Framer Motion
- TipTap Editor
- All other open-source libraries used
