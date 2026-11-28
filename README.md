README.md# CodeSentinel | Enterprise Three-Tier Task Manager

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green?logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18-blue?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-v6-purple?logo=vite)](https://vitejs.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.x-orange?logo=mysql)](https://www.mysql.com/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v3-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-ISC-gray)]()

**CodeSentinel** is a production-ready, three-tier enterprise task and deliverable management application. Engineered with strict separation of concerns, multi-tenant user isolation, secure JWT authentication, and parameterized SQL queries, it provides an operations command center for agile teams.

Designed for modern DevOps practices, this architecture is fully prepared for containerization with Docker and deployment onto AWS infrastructure via Terraform, Ansible, and automated CI/CD pipelines in Jenkins with SonarQube quality gates.

---

## 🏛️ System Architecture

CodeSentinel adheres to a decoupled **Three-Tier Architecture**:

```
+-------------------------------------------------------------+
|                 PRESENTATION TIER (Frontend)                |
|  React 18 + Vite + Tailwind CSS + React Router + Axios      |
|  - SaaS Dashboard UI with responsive Sidebar & Topbar       |
|  - Client-side JWT session interceptors & Protected Routes  |
|  - Real-time search, multi-criteria filtering, CRUD modals  |
+------------------------------+------------------------------+
                               |
                   REST APIs / JSON (over HTTP)
                               |
+------------------------------v------------------------------+
|                 APPLICATION TIER (Backend API)              |
|  Node.js + Express.js + MVC Pattern Architecture            |
|  - Security & Headers: Helmet, CORS, JSON Body Parsing      |
|  - Authentication: bcryptjs password hashing + JWT tokens   |
|  - Validation: express-validator input verification rules   |
|  - Controllers, Models, Middleware, Centralized Errors      |
+------------------------------+------------------------------+
                               |
               Parameterized SQL (mysql2 connection pool)
                               |
+------------------------------v------------------------------+
|                     DATA TIER (Database)                    |
|  MySQL 8 / MariaDB                                          |
|  - Database: codesentinel_db                                |
|  - Tables: users, tasks (with Foreign Keys & Indexes)       |
|  - Enforced ACID transactions, cascades & tenant isolation  |
+-------------------------------------------------------------+
```

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework:** React.js 18 with Vite build tooling
- **Routing:** React Router DOM (v6) with Protected / Public route guards
- **Styling:** Tailwind CSS with custom color palette and responsive utility classes
- **HTTP Client:** Axios with centralized base URL configuration and JWT token injection interceptors
- **Icons:** Lucide React icons
- **State & Notifications:** React Context API for global Authentication, Theme (Dark/Light mode), and Toast notification system

### **Backend**
- **Runtime:** Node.js (v18+)
- **Web Framework:** Express.js 4
- **Database Driver:** `mysql2` with promise-based connection pooling
- **Authentication:** JSON Web Tokens (`jsonwebtoken`) & `bcryptjs`
- **Validation:** `express-validator` schema validators
- **Security & Logging:** `helmet` security headers, `cors` cross-origin configuration, and `morgan` HTTP logger

### **Database**
- **Engine:** MySQL 8.x / MariaDB 10.4+
- **Schema Name:** `codesentinel_db`
- **Tables:** `users`, `tasks` with foreign key constraints (`ON DELETE CASCADE`) and composite index optimizations

---

## 📂 Project Folder Structure

```
CodeSentinel/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MySQL connection pool & table initializer
│   │   ├── controllers/
│   │   │   ├── authController.js     # User registration, login, and profile logic
│   │   │   └── taskController.js     # Task CRUD, status updates, and statistics
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js     # JWT verification & tenant context injection
│   │   │   ├── errorMiddleware.js    # Global error & 404 handlers
│   │   │   └── validateMiddleware.js # express-validator error mapper
│   │   ├── models/
│   │   │   ├── userModel.js          # User queries with parameterized SQL
│   │   │   └── taskModel.js          # Task queries, filters, and statistics
│   │   ├── routes/
│   │   │   ├── authRoutes.js         # /api/auth routes
│   │   │   └── taskRoutes.js         # /api/tasks routes
│   │   ├── validators/
│   │   │   ├── authValidator.js      # Input validation for registration & login
│   │   │   └── taskValidator.js      # Input validation for tasks & parameters
│   │   ├── app.js                    # Express app configuration & middleware
│   │   └── server.js                 # Server entry point with graceful shutdown
│   ├── .env.example                  # Backend environment template
│   ├── package.json                  # Backend dependencies and scripts
│   └── test_api.js                   # Automated E2E integration test suite
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── axios.js              # Axios instance with interceptors
│   │   │   ├── authApi.js            # Authentication endpoints client
│   │   │   └── taskApi.js            # Task endpoints client
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── ProtectedRoute.jsx# Auth route guard
│   │   │   │   └── PublicRoute.jsx   # Guest route guard
│   │   │   ├── common/
│   │   │   │   ├── Badge.jsx         # Priority and status pill badges
│   │   │   │   ├── ConfirmModal.jsx  # Deletion confirmation dialog
│   │   │   │   ├── LoadingSpinner.jsx# Spinners and skeletons
│   │   │   │   ├── Navbar.jsx        # Sticky top header
│   │   │   │   ├── Sidebar.jsx       # Responsive navigation sidebar
│   │   │   │   └── StatCard.jsx      # Metric overview cards
│   │   │   └── tasks/
│   │   │       ├── TaskCard.jsx      # Task item card view
│   │   │       ├── TaskFilters.jsx   # Search & filter toolbar
│   │   │       ├── TaskModal.jsx     # Create & edit task dialog
│   │   │       └── TaskTable.jsx     # Tabular task view
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # Authentication state provider
│   │   │   └── ToastContext.jsx      # Toast notification system
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx     # Main task operations dashboard
│   │   │   ├── LoginPage.jsx         # User login screen
│   │   │   ├── RegisterPage.jsx      # User registration screen
│   │   │   └── NotFoundPage.jsx      # 404 fallback page
│   │   ├── App.jsx                   # React Router layout
│   │   ├── index.css                 # Tailwind directives and fonts
│   │   └── main.jsx                  # React DOM mount point
│   ├── .env.example                  # Frontend environment template
│   ├── index.html                    # HTML root template
│   ├── package.json                  # Frontend dependencies and scripts
│   ├── tailwind.config.js            # Tailwind styling configuration
│   └── vite.config.js                # Vite development and proxy settings
│
├── database/
│   └── init.sql                      # DDL schema initialization script
│
├── .gitignore                        # Git exclusion rules (node_modules, .env, dist)
└── README.md                         # Project documentation
```

---

## ⚡ Prerequisites

Before launching CodeSentinel, ensure your environment has:
1. **Node.js**: v18.0.0 or higher
2. **npm**: v9.0.0 or higher
3. **MySQL Server**: MySQL 8.x or MariaDB 10.4+ running locally on port 3306

---

## 🗄️ MySQL Database Setup

1. Start your local MySQL service (e.g., MySQL Windows Service, XAMPP, or MariaDB).
2. Execute the provided initialization script `database/init.sql`:

```bash
# Using MySQL Command Line Client:
mysql -u root -p < database/init.sql

# Or using PowerShell on Windows:
Get-Content database/init.sql | mysql -u root
```

This creates the database `codesentinel_db` and initializes the following schema:
- **`users` table**: `id`, `name`, `email` (unique index), `password` (bcrypt hash), `created_at`.
- **`tasks` table**: `id`, `user_id` (foreign key referencing `users.id`), `title`, `description`, `priority` (Enum: Low, Medium, High), `status` (Enum: pending, completed), `due_date`, `created_at`, `updated_at`.

---

## ⚙️ Environment Configuration

### **Backend Configuration (`backend/.env`)**
Create `backend/.env` based on `backend/.env.example`:

```env
PORT=5000
NODE_ENV=development

# MySQL Database Configuration
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=codesentinel_db

# JWT Configuration
JWT_SECRET=codesentinel_super_secure_jwt_secret_production_ready_key_12345
JWT_EXPIRES_IN=24h
```

### **Frontend Configuration (`frontend/.env`)**
Create `frontend/.env` based on `frontend/.env.example`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🚀 Running the Application Locally

### 1. Start the Backend API Server
```bash
# Open a terminal in the project root:
cd backend
npm install
npm run dev      # Runs with nodemon auto-reload
# or
npm start        # Standard Node runtime
```
Backend API will be live at: `http://localhost:5000`  
Health check endpoint: `http://localhost:5000/api/health`

### 2. Start the Frontend Development Server
```bash
# Open a new terminal in the project root:
cd frontend
npm install
npm run dev
```
Frontend application will be accessible at: `http://localhost:5173`

### 3. Production Build
To test the production build of the frontend:
```bash
cd frontend
npm run build
npm run preview
```

---

## 📡 API Endpoint Documentation

All endpoints return consistent JSON responses with a `success` boolean.

### **Authentication Endpoints** (`/api/auth`)

| Method | Endpoint | Access | Description | Request Body |
|---|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new user | `{ "name": "Alex", "email": "alex@domain.io", "password": "SecretPassword" }` |
| `POST` | `/api/auth/login` | Public | Authenticate user & issue JWT | `{ "email": "alex@domain.io", "password": "SecretPassword" }` |
| `GET` | `/api/auth/profile` | Private | Retrieve logged-in user profile | Requires `Authorization: Bearer <TOKEN>` |

### **Task Management Endpoints** (`/api/tasks`)

All task endpoints require `Authorization: Bearer <TOKEN>`.

| Method | Endpoint | Query / Path Params | Request Body | Description |
|---|---|---|---|---|
| `GET` | `/api/tasks` | `search`, `status`, `priority` | None | Fetch all tasks belonging to the authenticated user |
| `GET` | `/api/tasks/stats` | None | None | Get task metrics (total, pending, completed, highPriority) |
| `GET` | `/api/tasks/:id` | `id` (int) | None | Get a single task by ID (tenant isolated) |
| `POST` | `/api/tasks` | None | `{ "title": "Deploy API", "description": "...", "priority": "High", "status": "pending", "dueDate": "2026-12-01" }` | Create a new task |
| `PUT` | `/api/tasks/:id` | `id` (int) | `{ "title": "Updated", "priority": "Medium", "status": "completed" }` | Update task details |
| `PATCH` | `/api/tasks/:id/status` | `id` (int) | `{ "status": "completed" }` | Quickly toggle status between pending and completed |
| `DELETE` | `/api/tasks/:id` | `id` (int) | None | Delete task (tenant isolated) |

---

## 🧪 Testing and Verification

CodeSentinel comes equipped with a 23-point automated integration test suite that tests registration, login security, JWT authorization, task CRUD, status updates, search/filtering, and multi-tenant data isolation.

To run the automated test suite:
```bash
npm test --prefix backend
```

### **Automated Test Results Summary:**
```text
====================================================
🚀 Starting CodeSentinel Full E2E Integration Tests
====================================================

  ✅ PASS: Health check endpoint returns UP
  ✅ PASS: User 1 registered with JWT token
  ✅ PASS: Duplicate registration was rejected with 409
  ✅ PASS: User 1 login successful with valid token
  ✅ PASS: Login with wrong password rejected with 401
  ✅ PASS: Protected profile fetched successfully
  ✅ PASS: Unauthenticated profile request rejected with 401
  ✅ PASS: Created Task 1 (High Priority)
  ✅ PASS: Created Task 2 (Medium Priority)
  ✅ PASS: Created Task 3 (Low Priority)
  ✅ PASS: Fetched all tasks (count = 3)
  ✅ PASS: Fetched single task by ID
  ✅ PASS: Updated task details via PUT
  ✅ PASS: Marked task as completed via PATCH
  ✅ PASS: Stats calculated correctly (Total: 3, Completed: 1, Pending: 2)
  ✅ PASS: Search filtered accurately by keyword
  ✅ PASS: Filter by status=completed returned 1 task
  ✅ PASS: User 2 cannot see User 1's tasks (Isolated Tenancy)
  ✅ PASS: User 2 blocked from viewing User 1's task (404/Forbidden)
  ✅ PASS: User 2 blocked from modifying User 1's task (404/Forbidden)
  ✅ PASS: User 2 blocked from deleting User 1's task (404/Forbidden)
  ✅ PASS: User 1 successfully deleted their own task
  ✅ PASS: Deleted task is no longer accessible (404 Not Found)

====================================================
📊 Test Summary: 23 Passed | 0 Failed
====================================================
```

---

## 🎨 UI Features & Walkthrough

1. **Enterprise Header & Sidebar**: Fast switching between All Tasks, Pending, Completed, and High Priority views, with user profile details and logout button.
2. **Operations Dashboard Counters**: Live metrics cards tracking Total Tasks, In-Progress Tasks, Completed Deliverables, and High-Priority items alongside a dynamic sprint progress bar.
3. **Filter & Search Toolbar**: Instant title/description search, priority filter dropdown, and Grid / Tabular view toggle.
4. **Task Modal**: Modal dialog for both creating new tasks and editing existing items with validation feedback.
5. **Interactive Cards & Tables**: Quick status toggling via one-click checkboxes, overdue warning indicators, priority badges, and confirmation dialogs before irreversible deletions.
6. **Toast Notification System**: Animated, auto-dismissing feedback messages for all actions.
7. **Dark / Light Mode**: Seamless theme switching with system preference detection and persistent localStorage state.

---

## 🔒 Security Best Practices Implemented

- **Password Hashing:** Salted `bcryptjs` hashing with minimum cost factor of 10.
- **Tenant Isolation:** All database queries scope tasks strictly to `user_id = ?`, preventing horizontal privilege escalation.
- **SQL Injection Prevention:** Strictly parameterized queries across all model methods with `mysql2`.
- **JWT Protection:** Signed tokens verified on every private request with expiration enforcement.
- **HTTP Security Headers:** `helmet` enabled to prevent clickjacking, MIME sniffing, and XSS attacks.
- **Input Sanitization:** `express-validator` validates and normalizes all user input before database execution.

---

## ☁️ DevOps, CI/CD & AWS Deployment

CodeSentinel uses an automated CI/CD workflow to build, test, scan, and deploy the application on an AWS EC2 instance.

### DevOps Technology Stack

| Tool | Purpose |
|---|---|
| AWS EC2 | Application hosting |
| Docker | Application containerization |
| Docker Compose | Multi-container orchestration |
| Jenkins | CI/CD pipeline automation |
| GitHub Webhooks | Automatic pipeline triggering |
| SonarQube | Code quality analysis |
| Trivy | Docker image vulnerability scanning |
| Ansible | Deployment automation |
| Terraform | Infrastructure as Code (IaC) |

### CI/CD Pipeline Architecture

```text
Developer
    |
    | Git Push
    v
GitHub Repository
    |
    | GitHub Webhook
    v
Jenkins CI/CD Pipeline
    |
    +--> Git Checkout
    |
    +--> Backend Dependency Installation
    |
    +--> Frontend Dependency Installation
    |
    +--> Backend Tests & Coverage
    |
    +--> Frontend Tests & Coverage
    |
    +--> SonarQube Analysis
    |
    +--> Frontend Build
    |
    +--> Docker Image Build
    |
    +--> Trivy Security Scan
    |
    +--> Ansible Deployment
    |
    +--> Application Health Verification
    |
    v
AWS EC2 Instance
    |
    +--> Frontend Container
    +--> Backend Container
    +--> MySQL Container
```

### Jenkins CI/CD Pipeline Stages

The Jenkins pipeline automates the following stages:

1. **Git Checkout:** Retrieves the latest source code from GitHub.
2. **Backend Dependency Installation:** Installs backend Node.js dependencies.
3. **Frontend Dependency Installation:** Installs frontend Node.js dependencies.
4. **Backend Tests & Coverage:** Executes backend tests and coverage checks.
5. **Frontend Tests & Coverage:** Executes frontend tests and coverage checks.
6. **SonarQube Analysis:** Performs static code quality analysis.
7. **Frontend Build:** Generates the production frontend build using Vite.
8. **Docker Image Build:** Builds backend and frontend Docker images using Docker Compose.
9. **Trivy Security Scan:** Scans Docker images for known vulnerabilities.
10. **Ansible Deployment:** Executes the Ansible playbook to deploy the application.
11. **Application Health Verification:** Checks frontend and backend HTTP health endpoints.

### GitHub Webhook Integration

- Configured a GitHub repository webhook to communicate with Jenkins.
- Enabled automatic Jenkins pipeline triggering on Git push events.
- Verified successful webhook delivery.
- Tested automatic pipeline execution after pushing code to the `main` branch.

### Ansible Deployment Automation

Ansible automates application deployment through Docker Compose.

Project structure:

```text
ansible/
├── ansible.cfg
├── inventory/
│   └── hosts.ini
└── playbooks/
    └── deploy.yml
```

Deployment tasks include:

- Verify Docker Compose configuration exists.
- Deploy application containers using Docker Compose.
- Wait for frontend HTTP response.
- Verify backend API health endpoint.
- Display deployment status.

### AWS Infrastructure

- AWS EC2 Ubuntu instance for application hosting.
- Docker-based application deployment.
- Security Group rules for application access and GitHub webhook communication.
- Terraform configuration maintained under `infra/terraform/`.

### Application Health Verification

The pipeline verifies application availability using:

```bash
curl http://127.0.0.1/
curl http://127.0.0.1/api/health
```

Successful HTTP responses confirm that the frontend and backend health checks are passing.

---
