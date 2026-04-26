# 🌟 GroupChat - Real-time Fullstack Chat Application

A modern, high-performance real-time chat application built with the **MERN Stack** and **Socket.io**. Featuring a sleek **Glassmorphism UI**, secure authentication, and seamless real-time communication.

---

## ✨ Features

- **Real-time Messaging:** Instant message delivery using Socket.io
- **Group Channels:** Join different groups and chat with multiple members
- **Glassmorphism UI:** Clean, modern, and spacious design with Tailwind CSS
- **Secure Auth:** JWT-based authentication system
- **Active Members:** See who is online in real-time
- **Message Reactions:** Add emoji reactions to messages
- **Message Management:** Edit and delete your own messages
- **Typing Indicators:** See when others are typing
- **User Profiles:** Manage your account and security settings
- **Responsive Design:** Optimized for both Desktop and Mobile views
- **Cloud Storage:** Image and profile handling via Cloudinary

---

## 🚀 Tech Stack

| Frontend                | Backend            | Database/Tools    |
| :---------------------- | :----------------- | :---------------- |
| Next.js 15 (App Router) | Node.js            | MongoDB Atlas     |
| TypeScript              | Express.js         | Socket.io         |
| Tailwind CSS            | Socket.io (Server) | Vercel (Frontend) |
| Lucide React (Icons)    | JWT & Bcrypt       | Render (Backend)  |
| React Hooks             | CORS               | Cloudinary        |

---

## 📋 Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account
- Cloudinary account (for file uploads)
- npm or yarn package manager

---

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/mahmudulkarim420/gc-front-end.git
cd gc-front-end
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SOCKET_URL=your_backend_url
NEXT_PUBLIC_API_URL=your_backend_url/api
```

**Backend (.env):**

```env
DB_URL=your_mongodb_connection_string
PORT=5000
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Home page
│   ├── chat/              # Chat page
│   ├── profile/           # User profile
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── Sidebar.tsx        # Main navigation sidebar
│   ├── auth/              # Authentication components
│   ├── chat/              # Chat-related components
│   └── profile/           # Profile components
├── hooks/                 # Custom React hooks
│   └── useChat.ts         # Chat logic hook
├── lib/                   # Utility functions
│   └── api.ts            # API calls
└── config/               # Configuration files
    └── constants.ts      # App constants
```

---

## 🔑 Key Features Explained

### Real-time Messaging

Uses Socket.io for instant bi-directional communication between clients and server.

### Authentication

Secure JWT-based authentication with password hashing using bcrypt.

### Group Management

Create, update, and delete chat groups with multiple members.

### User Presence

Real-time tracking of online/offline users in each group.

### Message Features

- Send text messages
- Upload and share images/videos
- Edit your messages
- Delete messages
- React with emojis

---

## 🚀 Deployment

### Frontend (Vercel)

```bash
npm run build
```

Push to GitHub and connect to Vercel for automatic deployments.

### Backend (Render)

Deploy Node.js Express server to Render with environment variables configured.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📝 License

This project is open source and available under the MIT License.

---

## 📧 Contact

For questions or feedback, please reach out through the repository issues.
CLOUDINARY_CLOUD_NAME=...
Install dependencies:

Bash
npm install
Run the application:

Bash
npm run dev
🌐 Deployment
Frontend: Deployed on Vercel.

Backend: Deployed on Render (to support persistent Socket.io connections).

👤 Author
Mahmudul Karim

Frontend Developer (MERN)

Location: Dhaka, Bangladesh

LinkedIn | Portfolio
