# NST Events - College Event Management System

## 🚀 Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, Prisma (MongoDB)
- **Authentication**: [Clerk](https://clerk.com/) (Managed Auth)
- **Database**: MongoDB (Atlas)
- **File Storage**: Cloudinary

## 🏗️ Architecture
The project is split into two main directories:
- **`backend/`**: Express server with Prisma ORM and Clerk integration. [See detailed backend architecture](./backend/README.md)
- **`frontend/`**: React application with Tailwind CSS.

## 🛠️ Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB Database URL
- Clerk Publishable & Secret Keys
- Cloudinary Credentials (Optional)

### Backend Setup
1. Navigate to `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure `.env`:
   - Rename `.env.example` to `.env`.
   - Update `DATABASE_URL` with your MongoDB string.
   - Add `CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`.
4. Generate Prisma Client:
   ```bash
   npx prisma generate
   ```
5. Start Server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure `.env`:
   - Add `VITE_CLERK_PUBLISHABLE_KEY`.
4. Start Dev Server:
   ```bash
   npm run dev
   ```

## ✨ Features Implemented
- **Universal Auth**: Seamless login via Clerk (Google, Email, etc.).
- **Role-Based Access**: Student, Organizer, Faculty, and Admin levels.
- **Event Lifecycle**: Create, Edit, Delete, and Register for events.
- **Team Registrations**: Support for team-based competitions with join codes.
- **Real-time Analytics**: Dashboard for organizers to track engagement.
- **Automated Sync**: Clerk identities are automatically synced to MongoDB profiles.
- **Responsive Design**: Fully optimized for mobile and desktop.

## 📜 Documentation
- [Detailed Backend Architecture](./backend/README.md)
- [Frontend Component Guide](./frontend/README.md) (To be added)
