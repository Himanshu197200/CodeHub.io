# 🚀 CodeHub – Mini GitHub for College Developers

> A full-stack web platform where students can **upload, collaborate, and manage coding projects**, just like GitHub — but built specifically for campus developers.

---

## 🧩 Overview

**CodeHub** is a collaborative version-control platform for students. It allows users to create repositories, track commits, open issues, discuss ideas, and collaborate with teammates — all within a college ecosystem.
Built with **React.js, Express.js, Prisma, MySQL, and Google OAuth**, it demonstrates your ability to design and deploy **industry-level software architecture**.

---

## ✨ Features

### 👤 Authentication & Profiles

* Google OAuth 2.0 login for easy access
* Student profiles with bio, avatar, and college details
* View other developers’ profiles and public repositories

### 📦 Repository Management

* Create, update, and delete repositories
* Public/private visibility settings
* Fork existing repositories
* Star your favorite repositories

### 🧑‍🤝‍🧑 Collaboration

* Add collaborators (Owner, Maintainer, Contributor)
* Role-based permissions
* Shared commit history and issues

### 💬 Discussions & Issues

* Open issues with detailed descriptions
* Comment and discuss issues in real time
* Tag issues as `OPEN` or `CLOSED`

### 💾 Commits

* Record commit messages (simulated Git commits)
* Track commit logs by date, author, and repository
* Each commit is versioned and stored in the database

### 🌟 Leaderboard

* Global college leaderboard of top contributors
* Scores update dynamically based on user activity:

  | Action         | Points |
  | -------------- | ------ |
  | New repository | +10    |
  | New commit     | +2     |
  | Issue resolved | +5     |
  | Repo starred   | +1     |
  | Repo forked    | +3     |

### 🧠 Additional Features

* Markdown rendering for README files
* Repository analytics (stars, forks, commits count)
* Notifications for team activities
* Responsive UI inspired by GitHub’s clean design

---

## 🛠️ Tech Stack

| Layer      | Technology                                                      |
| ---------- | --------------------------------------------------------------- |
| Frontend   | **React.js**, Axios, TailwindCSS                                |
| Backend    | **Express.js**, Node.js                                         |
| Database   | **MySQL** with **Prisma ORM**                                   |
| Auth       | **Google OAuth 2.0**                                            |
| Deployment | Vercel (frontend) + Render/Railway (backend)                    |
| Optional   | Socket.io for real-time comments, Cloudinary for profile images |

---

## 🧱 Database Schema (Simplified)

Key models include:

* **User** → Google login info, profile data
* **Repository** → project info + owner/fork links
* **Commit** → commit message + author + repo
* **Issue** → bug reports / feature requests
* **Discussion** → threaded comments
* **Star** → repo likes
* **Collaborator** → multi-role team members
* **Leaderboard** → user ranking system

> See full schema in `/prisma/schema.prisma`.

---

## 🧩 Folder Structure

```
codehub/
├── client/               # React frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Home, Repo, Profile, etc.
│   │   ├── services/     # API calls (Axios)
│   │   └── App.js
│   └── package.json
│
├── server/               # Express backend
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   └── index.js
│   └── package.json
│
├── .env.example
├── README.md
└── LICENSE
```

---

## 🔗 API Endpoints (Sample)

| Method   | Endpoint                  | Description           |
| -------- | ------------------------- | --------------------- |
| **POST** | `/api/auth/google`        | Google OAuth login    |
| **GET**  | `/api/repos`              | Get all repositories  |
| **POST** | `/api/repos`              | Create new repository |
| **GET**  | `/api/repos/:id`          | Get single repository |
| **POST** | `/api/repos/:id/commit`   | Add commit to repo    |
| **POST** | `/api/repos/:id/fork`     | Fork repository       |
| **POST** | `/api/repos/:id/star`     | Star repository       |
| **GET**  | `/api/issues/:repoId`     | Get all issues        |
| **POST** | `/api/issues`             | Create new issue      |
| **POST** | `/api/issues/:id/comment` | Add comment to issue  |
| **GET**  | `/api/leaderboard`        | Get top contributors  |

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone https://github.com/<your-username>/codehub.git
cd codehub
```

### 2️⃣ Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 3️⃣ Setup `.env`

```bash
# Backend (.env)
DATABASE_URL="mysql://user:password@localhost:3306/codehub"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_secret"
SESSION_SECRET="some_random_secret"

# Frontend (.env)
VITE_API_URL="http://localhost:5000"
```

### 4️⃣ Run database migrations

```bash
cd server
npx prisma migrate dev --name init
```

### 5️⃣ Start the app

```bash
# Backend
npm run dev

# Frontend
cd ../client
npm start
```

App runs on:

* Frontend → `http://localhost:5173`
* Backend → `http://localhost:5000`

---

## 🧠 Future Enhancements

* Real Git integration (push/pull simulation)
* Real-time collaboration using WebSockets
* CI/CD simulation badges (`build passing ✅`)
* AI-based code suggestions for repositories
* Private messaging between contributors
* Project analytics dashboard

---

## 🧑‍💻 Contributing

1. Fork the repo
2. Create a new branch:

   ```bash
   git checkout -b feature/new-feature
   ```
3. Commit your changes:

   ```bash
   git commit -m "Add some feature"
   ```
4. Push and open a Pull Request 🚀

---

## 📸 UI Screenshots (Optional Section)

*(Add screenshots once UI is ready)*

* Login Page
* Dashboard
* Repository Page
* Issues & Discussions
* Leaderboard

---

## 🧾 License

This project is licensed under the **MIT License** — free to use, modify, and distribute.

---
