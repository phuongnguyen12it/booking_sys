# Mini Booking Management System

Mini booking management system for a co-working space. Users can view rooms and room bookings, while booking actions allow creating and deleting reservations with overlap validation.

## Tech Stack

- Backend: Laravel 13, PHP 8.3, Apache
- Frontend: React 19, Vite, React Hook Form
- Database: PostgreSQL 16
- Runtime: Docker Compose

## Features

- List all rooms.
- List bookings for a selected room.
- Create a booking with server-side and client-side validation.
- Delete a booking.
- Prevent overlapping bookings for the same room.
- Protect booking create/delete actions with Sanctum API tokens.
- Service and repository layers for booking logic.
- Laravel Resources and Form Requests.
- React Context for shared frontend state.

## Project Structure

```text
.
+-- backend              # Laravel API
+-- frontend             # React/Vite app
+-- docker
|   +-- backend          # Backend Docker and Apache config
|   +-- frontend         # Frontend Docker config
+-- docker-compose.yml
+-- TODOLIST.md
```

## Requirements

- Docker
- Docker Compose

No local PHP, Composer, Node, or PostgreSQL installation is required.

## Getting Started

Start all services:

```bash
docker compose up -d --build
```

Install backend dependencies if this is the first run after cloning:

```bash
docker compose exec backend composer install
```

Create the Laravel environment file:

```bash
cp backend/.env.example backend/.env
docker compose exec backend php artisan key:generate
```

Run migrations and seed sample data:

```bash
docker compose exec backend php artisan migrate:fresh --seed
```

Open the app:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:8000
```

The frontend container installs Node dependencies automatically when `node_modules` is missing.

Seeded admin credentials:

```text
Email:    test@example.com
Password: password
```

## API Endpoints

```text
GET    /api/rooms
GET    /api/rooms/{id}/bookings
POST   /api/auth/token
DELETE /api/auth/token
POST   /api/bookings
DELETE /api/bookings/{id}
```

Create token payload:

```json
{
  "email": "test@example.com",
  "password": "password"
}
```

Create booking payload:

```json
{
  "room_id": 1,
  "user_name": "Jane Doe",
  "start_time": "2026-06-20 09:00:00",
  "end_time": "2026-06-20 10:00:00"
}
```

Protected endpoints require:

```http
Authorization: Bearer <token>
```

## Running Tests

Backend tests:

```bash
docker compose exec backend php artisan test
```

Frontend lint:

```bash
docker compose run --rm frontend npm run lint
```

Frontend production build:

```bash
docker compose run --rm frontend npm run build
```

## Design Decisions

- PostgreSQL was selected because it is strict, stable in Docker, and well suited for time-based booking data.
- The backend keeps overlap detection in `BookingService` and `BookingRepository` so controllers remain thin.
- `GET` endpoints are public, while `POST /api/bookings` and `DELETE /api/bookings/{id}` require a Sanctum Bearer token.
- The frontend uses React Context for rooms/bookings state and React Hook Form for ergonomic form validation.
- Apache is used in the backend container instead of `php artisan serve` to make the Docker setup closer to a real web server environment.

## Useful Commands

Stop services:

```bash
docker compose down
```

Reset database:

```bash
docker compose exec backend php artisan migrate:fresh --seed
```

View logs:

```bash
docker compose logs -f backend
docker compose logs -f frontend
```
