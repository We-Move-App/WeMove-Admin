# 🛠️ WeMove Admin

A robust and scalable admin panel built for managing the WeMove transport system. This dashboard enables administrators to efficiently oversee buses, routes, drivers, ticketing, and operator activities. Developed using React and Vite, the application delivers a responsive, performance-optimized interface tailored for admin operations. It includes secure authentication and API integration for dynamic data handling.

---

## 🚀 Features

- 🧭 Admin dashboard to view overall system operations
- 🚌 Manage all buses, routes, and seat layouts
- 👨‍✈️ Add and edit driver details, assign buses to drivers
- 🎫 Oversee and manage ticket bookings
- 👥 Monitor and control operator access and roles
- 🧩 Multi-step forms with validation for accurate data entry
- 🔐 JWT-based secure authentication for admins
- ⚡ Built with Vite for lightning-fast development and builds
- 🖥️ Responsive design with Material UI
- 🔄 State management using Redux Toolkit and Context API

---

## 🛠 Tech Stack

- **Frontend**: React.js
- **State Management**: Redux Toolkit, Context API
- **UI Library**: Material UI
- **Build Tool**: Vite
- **Authentication**: JWT-based (assumed)
- **API Integration**: Axios (or Fetch)
- **Deployment**: Hosted on cloud via public IP

---

## 📂 Folder Structure

```bash
wemove-bus-operator/
├── public/
├── src/
│   ├── api/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── context/
│   ├── styles/
│   └── App.jsx
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn

### Installation

```bash
git clone https://gitlab.com/Ranjimadebug/wemove-admin-rbac.git
cd wemove-admin-rbac
npm install
```

### Running Locally

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

---

## 🌐 Live Demo

🔗http://142.93.222.196:8082

---

## 🔐 Authentication

Secure login with JWT-based authentication is enabled for all admin-level functionalities.

---

## 📈 Future Enhancements

- 📊 Analytics dashboard for ticket sales and usage insights
- 🛎️ Real-time notifications and alerts
- 🧪 Unit and integration testing with Testing Library
- 🌍 Multi-language support for broader accessibility

---

## 👤 Author

**Ranjima Ghosh**  
[GitLab Profile](https://gitlab.com/Ranjimadebug)

---

## 📄 License

This project is licensed under the MIT License.

---
