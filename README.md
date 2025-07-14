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

## Database CRUD Optimization & Containerization

- All major models use indexed ForeignKey fields for fast queries (see `db_index=True` in models).
- Views and services use `select_related` to optimize related object queries and avoid N+1 problems.
- Critical operations (such as event participation) use `transaction.atomic` to ensure data consistency.
- The database service in `docker-compose.yml` uses a persistent data volume (`db_data`) and a healthcheck for reliability.
- Sensitive database credentials are managed via environment variables.

### How to Deploy

1. Copy `.env.example` to `.env` and set your `DB_PASSWORD` and other secrets.
2. Run `docker-compose up -d` to start all services with persistent database storage and healthcheck.
3. All CRUD operations are optimized for performance and reliability.

## MVT Pattern in UniHub

UniHub follows the Django MVT (Model-View-Template) pattern:

- **Model**: Defines the data structure and business rules (see `models.py` in each app).
- **View**: Handles HTTP requests, permissions, and delegates business logic to the service layer (see `views.py`).
- **Template**: In this API-based project, serializers (`serializers.py`) serve as templates, formatting data for input/output.

**Best Practices:**
- Views are kept thin, focusing on request/response and delegating logic to services.
- Models are responsible for data integrity and constraints.
- Serializers ensure consistent data representation and validation.

**Advantages:**
- Clear separation of concerns
- Easy to maintain and extend
- Facilitates testing and code reuse

**Limitations:**
- In API projects, the Template role is replaced by serializers.
- For complex UI, front-end frameworks (React) take over the traditional template role.

This approach ensures UniHub is robust, maintainable, and scalable.

## Contributors

- Backend: [Wei Xian Wong]
- Frontend: [Wei Xian Wong]
- UI/UX Design: [Wei Xian Wong]

## License

MIT License