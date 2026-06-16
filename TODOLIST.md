# Mini Booking Management System - TODO

## 1. Docker

- [x] Create `docker-compose.yml` with `backend`, `frontend`, and `database` services.
- [x] Create backend Dockerfile for Laravel/PHP runtime under `docker/backend`.
- [x] Create frontend Dockerfile for React/Vite runtime under `docker/frontend`.
- [x] Configure Laravel `.env` to connect to the `database` service.
- [x] Verify containers can start and communicate through Docker network.

## 2. Backend

- [x] Create Laravel project in `backend`.
- [x] Create `Room` and `Booking` models, migrations, factories, and seeders.
- [x] Define relationships: a room has many bookings, a booking belongs to a room.
- [x] Create REST API routes:
  - [x] `GET /api/rooms`
  - [x] `GET /api/rooms/{id}/bookings`
  - [x] `POST /api/bookings`
  - [x] `DELETE /api/bookings/{id}`
- [x] Add Laravel Resources for API responses.
- [x] Add Form Request validation for booking creation.
- [x] Prevent overlapping bookings for the same room.
- [x] Ensure `start_time` is before `end_time`.
- [x] Add service and repository layers for booking logic.
- [x] Add tests for API behavior and booking validation.
- [ ] Optional bonus: add Sanctum token authentication.

## 3. Frontend

- [x] Create React project in `frontend`.
- [x] Configure API client with Axios or Fetch API.
- [x] Build room list panel.
- [x] Load bookings when a room is selected.
- [x] Build booking creation form with:
  - [x] User name
  - [x] Start time
  - [x] End time
- [x] Add client-side validation.
- [x] Add booking delete action.
- [x] Optional bonus: use React Context for shared booking state.
- [x] Optional bonus: use React Hook Form for form handling.
- [x] Add README instructions for running and design decisions.
