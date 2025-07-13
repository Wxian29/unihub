# Uni Hub

A comprehensive campus social platform designed for university students, providing community management, event organization, information sharing, and more.

## Project Structure

```
uni-hub/
├── backend/            # Django backend project
├── frontend/           # React frontend project
├── docker-compose.yml  # Docker Compose file
└── README.md           # Project documentation
```

## Tech Stack

- **Backend**: Django + Django REST Framework + PostgreSQL
- **Frontend**: React + Redux Toolkit
- **Deployment**: Docker + Docker Compose
- **Authentication**: JWT (JSON Web Token)

## Quick Start

### Using Docker Compose (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd uni-hub

# Start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# Admin Panel: http://localhost:8000/admin
```

### Local Development

#### Backend Development

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

#### Frontend Development

```bash
cd frontend
npm install
npm start
```

## Features

- 👥 **User Management**: Register, login, and manage personal profiles
- 🏘️ **Community**: Create, search, and join communities
- 📅 **Event Management**: Publish, browse, and join events
- 💬 **Information Sharing**: Post updates and interact with others
- 🔔 **Notification System**: Real-time notifications
- 📱 **Responsive Design**: Multi-device support

## Contributors

- Backend: [Wei Xian Wong]
- Frontend: [Wei Xian Wong]
- UI/UX Design: [Wei Xian Wong]

## License

MIT License