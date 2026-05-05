# Project Management Web App

A full-stack, production-ready Project Management tool built with Java 21, Spring Boot 3, and React.js (Vite).

## Tech Stack
- **Backend:** Java 21, Spring Boot 3.x, Spring Security 6 (JWT), Spring Data JPA, PostgreSQL, Flyway, MapStruct, Lombok.
- **Frontend:** React (Vite), React Router v6, TailwindCSS, Zustand, React Hook Form + Zod, Axios, @dnd-kit/core.

## Prerequisites
- Java 21
- Maven
- PostgreSQL running on port 5432
- Node.js 20+

## Setup & Running

### Database
1. Create a PostgreSQL database named `project_manager_dev`:
   ```sql
   CREATE DATABASE project_manager_dev;
   ```

### Backend
1. Navigate to the `backend` directory.
2. The application uses `application-dev.yml` by default if you set the profile, or you can use the default.
3. Start the application:
   ```bash
   mvn spring-boot:run -Dspring-boot.run.profiles=dev
   ```
4. Flyway will automatically run the migrations and seed data.

### Frontend
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` (already done by default in setup).
4. Start the dev server:
   ```bash
   npm run dev
   ```

## Seed Credentials
Once Flyway runs `V5__seed_data.sql`, the following users are available:
- **Admin:** `admin@example.com` / `Admin@1234`
- **Member:** `alice@example.com` / `Member@1234`
