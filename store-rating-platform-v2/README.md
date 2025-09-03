# Store Rating Platform (v2) - FullStack Intern Coding Challenge

This repo is a ready-to-run scaffold implementing the project requirements:
- Backend: Express + Prisma + PostgreSQL
- Frontend: React + Vite
- Roles: ADMIN, USER, OWNER
- Features: Auth, role-based routes, stores listing, rating (1-5), admin + owner dashboards, validations, seeding, Docker setup.

## Quick start (without docker)
1. Start Postgres locally (or use Docker)
2. Backend:
   cd backend
   npm install
   cp ../.env.example .env
   npx prisma generate
   npx prisma migrate dev --name init
   node prisma/seed.js
   npm run dev
3. Frontend:
   cd ../frontend
   npm install
   npm run dev

## Quick start (with docker-compose)
From repo root:
  docker compose up --build -d

The frontend will be available at http://localhost:5173 and backend at http://localhost:4000

Default seeded admin: admin@example.com / Admin@123
Default seeded store: store@example.com
