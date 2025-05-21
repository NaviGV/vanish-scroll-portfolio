
# Vanish Scroll Portfolio

A full-stack portfolio application with separate frontend, backend and admin interfaces.

## Project Structure

```
vanish-scroll-portfolio/
│
├── backend/              # Node.js + Express + MongoDB
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Authentication middleware
│   ├── .env.example      # Environment variables example
│   └── server.js         # Main server file
│
├── frontend/             # Public portfolio website
│   ├── public/           # Static assets
│   ├── src/              # React components
│   ├── .env.example      # Environment variables example
│   └── index.html        # Main HTML file
│
├── admin/                # Admin dashboard interface
│   ├── src/              # React admin components
│   ├── .env.example      # Environment variables example
│   └── index.html        # Admin HTML file
│
└── README.md             # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd vanish-scroll-portfolio
```

2. Set up the backend:
```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB connection string and other config
npm install
npm start
```

3. Set up the frontend:
```bash
cd ../frontend
cp .env.example .env
# Edit .env with backend URL
npm install
npm start
```

4. Set up the admin dashboard:
```bash
cd ../admin
cp .env.example .env
# Edit .env with backend URL
npm install
npm start
```

## Features

- **Public Portfolio**
  - Hero section
  - About section
  - Projects showcase
  - Contact form

- **Admin Dashboard**
  - Authentication system
  - Manage contact messages (mark as responded/completed)
  - Edit profile information
  - Manage projects (add, edit, delete)

## Environment Variables

### Backend (.env)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT tokens
- `ADMIN_USERNAME` - Default admin username
- `ADMIN_PASSWORD` - Default admin password
- `PORT` - Server port (default: 5000)
- `EMAIL_SERVICE` - Email service for contact notifications
- `EMAIL_USER` - Email username
- `EMAIL_PASSWORD` - Email password
- `NOTIFICATION_EMAIL` - Email to receive notifications

### Frontend/Admin (.env)
- `VITE_BACKEND_URL` - URL to backend API (default: http://localhost:5000)
