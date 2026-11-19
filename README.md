# 🏢 Enterprise Employee Management System (EMS)

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-11.0-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Firestore](https://img.shields.io/badge/Cloud_Firestore-Database-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/docs/firestore)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel&logoColor=white)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, cloud-native **Employee Management System (EMS)** engineered with high performance, role-based access control (RBAC), real-time attendance tracking, leave request lifecycles, monthly payroll computation, and data export reporting.

Powered by a sleek, dark glassmorphism user interface built with **React 19**, **Tailwind CSS**, and **Framer Motion**, and backed directly by **Google Cloud Firestore**, **Firebase Authentication**, and **Firebase Storage**.

---

## 📸 Screenshots Showcase

### 1. Executive Operations Dashboard
Real-time workforce metrics, dynamic KPI cards, staff directory preview, and quick access navigation.
![Executive Dashboard](screenshots/01_dashboard.png)

---

### 2. Employee Directory
Interactive employee catalog featuring instant multi-attribute search, department filters, status badges, and management actions.
![Employee Directory](screenshots/02_employees.png)

---

### 3. Department Management
Organizational units overview displaying department head assignments, descriptions, and active headcount statistics.
![Department Directory](screenshots/03_departments.png)

---

### 4. Attendance & Time Tracking
Shift clock-in/clock-out tracking, real-time live clock, and comprehensive daily employee logs.
![Attendance Logs](screenshots/04_attendance.png)

---

### 5. Leave Management & Approval Portal
Leave balances (Casual, Sick, Annual, Maternity), status tracking (Pending, Approved, Rejected), and request workflows.
![Leave Portal](screenshots/05_leave_management.png)

---

### 6. Payroll & Salary Disbursals
Automated payroll computation, basic salary, performance bonuses, tax deductions, net payout, and payslip generation.
![Payroll Processing](screenshots/06_payroll.png)

---

### 7. Reports & Export Center
Workforce reporting center with instant export to CSV and formatted Microsoft Excel (.xlsx) workbooks.
![Reports Center](screenshots/07_reports.png)

---

### 8. Account & Security Settings
User profile updates, contact details configuration, and password security management.
![Account Settings](screenshots/08_settings.png)

---

### 9. Secure Authentication
Modern glassmorphic authentication system supporting dual-role login (Administrator / Employee) with Firebase Auth.
![Login Screen](screenshots/09_login.png)

---

### 10. User Registration
Streamlined onboarding form for new team members with validation.
![Signup Screen](screenshots/10_signup.png)

---

## ✨ Key Features

- **🔥 Cloud-Native Serverless Backend:** Powered by Google Cloud Firestore for real-time data persistence and Firebase Authentication for identity.
- **🛡️ Role-Based Access Control (RBAC):**
  - **Administrator:** Full administrative rights to manage employees, departments, approve leaves, run payrolls, and export reports.
  - **Employee:** Dedicated self-service portal to clock in/out, view personal attendance, submit leave requests, view payslips, and manage profiles.
- **⚡ Modern Dark Glassmorphic UI:** Smooth Framer Motion transitions, responsive Tailwind CSS layouts, Lucide icons, and toast notifications.
- **👥 Complete Workforce Directory:** Search by name, designation, email, or employee code with full pagination and CRUD modals.
- **🏢 Organizational Units:** Track department heads, team size distribution, and department responsibilities.
- **⏱️ Shift & Attendance Tracking:** One-click clock-in and clock-out with live timestamping and historical audit logs.
- **🌴 Leave Request Workflow:** Employee leave requests with status progression (Pending ➔ Approved / Rejected) and leave quota balances.
- **💰 Monthly Payroll Automation:** Flexible salary structures factoring in base pay, bonuses, and deductions with receipt generation.
- **📊 Reporting & Data Export:** One-click data exports to CSV and Microsoft Excel (.xlsx) workbooks.
- **🌱 Automatic Seeding:** Firestore automatically checks and seeds initial starter departments and personnel on first launch.

---

## 🛠️ Technology Stack

### Frontend & Application Layer
- **Framework:** React 19 (Vite 5)
- **Styling:** Tailwind CSS 3, PostCSS, Autoprefixer
- **Icons & UI:** Lucide React, React Icons, Framer Motion
- **State & Data:** React Query, React Hook Form
- **Feedback:** React Hot Toast, SweetAlert2
- **Routing:** React Router v6

### Backend & Cloud Infrastructure
- **Cloud Database:** Google Cloud Firestore (Collections: `departments`, `employees`, `attendance`, `leaves`, `payrolls`, `users`)
- **Authentication:** Firebase Authentication (Email/Password & RBAC claims)
- **Cloud Storage:** Firebase Storage (profile avatars & assets)
- **Analytics:** Firebase Analytics

---

## 🚀 Getting Started

### Prerequisites
- **Node.js:** v18+ (Node v20+ recommended)
- **npm:** v9+

---

### 1. Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/LakshmiCharith/employee-management-system.git
   cd employee-management-system/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

---

### 2. Firebase Configuration
The application is pre-configured with Firebase in `frontend/src/firebase/config.js`:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyA48jb61YzKKVZhQhyWE4LaCF17DI87Tvw",
  authDomain: "employee-management-syst-76842.firebaseapp.com",
  projectId: "employee-management-syst-76842",
  storageBucket: "employee-management-syst-76842.firebasestorage.app",
  messagingSenderId: "207818045658",
  appId: "1:207818045658:web:4b4493f2def92e60ee0de3",
  measurementId: "G-X6SJS4T7K3"
};
```

---

### 3. Deploy to Vercel
The repository is fully configured for zero-configuration Vercel deployment via [`vercel.json`](vercel.json):
1. Import your GitHub repository into [Vercel](https://vercel.com/new).
2. Click **Deploy**. Vercel will automatically build the application and serve it on your custom `.vercel.app` production domain.

Or deploy via Vercel CLI:
```bash
npx vercel --prod
```

---

## 📸 Re-generating Screenshots

To capture fresh high-resolution screenshots of all pages:
```powershell
.\take_screenshots.ps1
```
*Screenshots will be automatically saved directly into the `screenshots/` directory.*

---

## 📂 Project Structure

```text
employee-management-system/
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI components (Navbar, Sidebar, Logo, Footer)
│   │   ├── context/             # React AuthContext with Firebase Auth & state
│   │   ├── firebase/            # Firebase SDK configuration & initial seeder
│   │   │   ├── config.js        # Firebase app, db, auth, storage initialization
│   │   │   └── seed.js          # Firestore starter collections auto-seeder
│   │   ├── layouts/             # App shell & dashboard layouts
│   │   ├── pages/               # Views (Dashboard, Employees, Attendance, etc.)
│   │   └── services/            # Firestore CRUD services (departments, employees, leaves, payroll)
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── screenshots/                 # Application visual screenshots
├── take_screenshots.ps1         # Automated headless screenshot capture script
├── .gitignore                   # Git ignore rules
└── README.md                    # Project documentation
```

---

## 👤 Author

- **Lakshmi Charith**
- GitHub: [@LakshmiCharith](https://github.com/LakshmiCharith)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
