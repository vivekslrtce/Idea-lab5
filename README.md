# 🏙️ Urban Utility Problem Reporting Platform

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC.svg)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900.svg)](https://leafletjs.com/)

A modern, responsive, citizen-centric municipal civic portal designed as an academic prototype for lodging, tracking, and resolving urban utility issues (streetlights, water leakage, potholes, drainage, sewage, waste management, and electricity) with real-time GPS mapping and municipal administrative controls.

---

## 📑 Table of Contents

- [System Overview](#-system-overview)
- [Credentials & Authentication Access](#-credentials--authentication-access)
- [Validation Standards & Input Rules](#-validation-standards--input-rules)
- [Layout & Responsive Viewport](#-layout--responsive-viewport)
- [Core Functional Modules](#-core-functional-modules)
  - [1. Authentication & Security Gate](#1--authentication--security-gate)
  - [2. Citizen Analytics Dashboard](#2--citizen-analytics-dashboard)
  - [3. Interactive Leaflet Map Visualizer](#3--interactive-leaflet-map-visualizer)
  - [4. Smart Problem Reporting & Auto-Suggester](#4--smart-problem-reporting--auto-suggester)
  - [5. Public Civic Transparency Boards](#5--public-civic-transparency-boards)
  - [6. Municipal Authority Control Center](#6--municipal-authority-control-center)
  - [7. Activity Audit Logs & Event Trail](#7--activity-audit-logs--event-trail)
  - [8. User Profile Management](#8--user-profile-management)
- [Complaint Lifecycle Workflow](#-complaint-lifecycle-workflow)
- [Data Models & Schema](#-data-models--schema)
- [Client Storage Architecture](#-client-storage-architecture)
- [Project Directory Tree](#-project-directory-tree)
- [Getting Started & Local Setup](#-getting-started--local-setup)
- [Step-by-Step Evaluation Walkthrough](#-step-by-step-evaluation-walkthrough)

---

## 🏛️ System Overview

The **Urban Utility Problem Reporting Platform** bridges the communication gap between citizens and municipal authorities. 

- **For Citizens**: Provides an intuitive interface to report public infrastructure defects with photo evidence, HTML5 camera capture, geolocation tagging, and automated municipal department prediction.
- **For Civic Authorities**: Equips municipal officers with a centralized triage dashboard to review incoming reports, reassign departments, adjust priority levels, dispatch crews, update statuses across a 4-phase lifecycle, and document official administrative remarks.
- **For Public Transparency**: Offers open boards for tracking live unresolved issues and reviewing resolved civic archives with full audit timelines.

---

## 🔑 Credentials & Authentication Access

The platform enforces a strict authentication gate. On initial load or page refresh, users are prompted to authenticate before accessing portal views:

| Role | Email Requirement | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **Citizen (Demo)** | `citizen@example.com` | `password123` | Lodge complaints, track submissions, view public map & issues, update personal profile |
| **Civic Admin** | Any handle with **`@gov.in`** domain (e.g., `admin@gov.in`, `officer@gov.in`, `commissioner@gov.in`) | `admin123` | Full municipal authority: triage dashboard, department reassignment, priority escalation, lifecycle status updates, public remarks, activity audit logs |

### 🛡️ Admin Login Access Notes
1. **Domain Verification**: Admin email accounts accept any username/handle, but the domain **must strictly be `@gov.in`** (or a subdomain ending with `.gov.in`).
2. **Clean Security UI**: In accordance with administrative security practices, the Admin Sign In form contains **no placeholder hints** and **no exposed default credentials**.
3. **One-Click Switch**: Citizens and evaluators can switch immediately to admin login via the **"Admin Login? Sign In"** link located at the bottom of the citizen login form.

---

## 📋 Validation Standards & Input Rules

The application implements strict client-side validation to ensure clean civic records:

### 1. Indian Mobile Number Validation
- **Digit Length**: Exactly **10 digits** (non-numeric characters stripped automatically).
- **Starting Digit**: Must start with **6, 7, 8, or 9** in accordance with Indian National Numbering Plan (INP).
- **Error Feedback**: Displays the clear notice: `Enter a Valid Mobile Number` if the number does not meet INP requirements.
- **Storage Format**: Automatically formatted and saved with country code: `+91 XXXXX XXXXX`.

### 2. Administrator Email Domain Verification
- **Accepted Pattern**: `[name]@[subdomain.]gov.in` (e.g., `admin@gov.in`, `ward12@delhi.gov.in`).
- **Rejection Feedback**: If an admin enters an unsupported email domain (such as `@gmail.com` or `@example.com`), the form displays: `Invalid Admin Email: Domain must be @gov.in (e.g. any name with @gov.in)`.

### 3. Password Standards
- Citizen registrations require a minimum length of **6 characters** and strict confirmation matching.

---

## 🖥️ Layout & Responsive Viewport

- **Fixed Sidebar & Header Navigation**: In full-screen and standard desktop viewports, the top navigation bar and left sidebar remain **fixed and sticky**. When scrolling long complaint lists or map views, navigation elements stay firmly anchored.
- **Mobile Responsive Drawer**: On small screens, the sidebar collapses into an accessible slide-over drawer toggled via the hamburger menu.
- **Zero Jitter**: Built with Tailwind CSS viewport structures (`min-h-screen`, `sticky top-0`, `h-[calc(100vh-...)]`) to prevent unexpected layout shifts.

---

## ⚙️ Core Functional Modules

### 1. 🔐 Authentication & Security Gate
- **Unified Login Modal**: Switch seamlessly between **Sign In**, **Create Citizen Account**, and **Admin Sign In**.
- **Role-Based Guards**: Admin views (*Admin Dashboard* and *Activity Audit Logs*) are strictly guarded; attempting to access them as a citizen triggers the Admin verification prompt.
- **Session Termination**: Clean sign-out resets the session and displays the authentication gate.

### 2. 📊 Citizen Analytics Dashboard
- **Metric KPI Cards**: Real-time summary counters for:
  - *Total Complaints Lodged*
  - *Active Civic Issues*
  - *In Progress Work Orders*
  - *Resolved Infrastructure Problems*
- **Quick Action Links**: 1-click shortcuts to lodge new problems or filter complaints by municipal department.
- **Interactive Overview Map**: Embedded Leaflet map showcasing pins for all unresolved civic problems.

### 3. 🗺️ Interactive Leaflet Map Visualizer
- Powered by **Leaflet.js** and OpenStreetMap tiles.
- **Status-Coded Map Markers**:
  - 🔵 **Reported** (Blue marker pin)
  - 🟡 **Under Review** (Amber marker pin)
  - 🟣 **In Progress** (Indigo marker pin)
  - 🟢 **Resolved** (Emerald marker pin)
- **Rich Popups**: Displays complaint title, department badge, street location, thumbnail preview, and an **"Inspect Details"** button opening the modal.
- **Department Filter**: Dropdown to isolate specific municipal domains (e.g., show only *Street Lights* or *Roads*).

### 4. 📝 Smart Problem Reporting & Auto-Suggester
- **Input Fields**: Problem Title, Department selection, specific Problem Sub-type, Priority level (`Low`, `Medium`, `High`), and detailed Problem Description.
- **Rule-Based Department Suggester**: 
  - Analyzes the citizen's title and description in real-time using keyword heuristics.
  - Examples:
    - *"water pipe burst"* ➔ suggests **Water Supply**
    - *"pothole on main road"* ➔ suggests **Roads**
    - *"dark street lamp flickering"* ➔ suggests **Street Lights**
    - *"garbage dump overflow"* ➔ suggests **Waste Management**
    - *"sparking transformer"* ➔ suggests **Electricity**
    - *"clogged drain sewage smell"* ➔ suggests **Drainage**
  - Displays a 1-click **"Accept Suggestion"** banner.
- **HTML5 Camera Capture**: Built-in webcam/device camera stream capture modal via the `MediaDevices.getUserMedia` API.
- **File Upload & Preview**: Image upload with thumbnail preview, file size check, and removal option.
- **Geolocation Integration**: 1-click **"Use Current Location"** button fetching device GPS coordinates (`latitude`, `longitude`).

### 5. 🗂️ Public Civic Transparency Boards
- **Submitted Problems View**: Citizen's personal history with search, department filtering, priority filter, and status pills.
- **Live Issues View**: Public board of all currently open civic issues (`Reported`, `Under Review`, `In Progress`) across the municipality.
- **Solved Issues View**: Archive of successfully resolved problems with verification timestamps and closing remarks.
- **Complaint Details Modal**:
  - 4-stage lifecycle timeline visualizer.
  - High-resolution photo inspection.
  - Exact coordinates with an external map viewing link.
  - Official municipal administrative remarks.

### 6. 🛠️ Municipal Authority Control Center
- Accessible strictly to users authenticated with a `@gov.in` domain.
- **Triage Data Table**: Search and filter by Department, Status, and Priority.
- **Administrative Actions**:
  - Transition status (`Reported` ➔ `Under Review` ➔ `In Progress` ➔ `Resolved`).
  - Re-route complaint to another municipal department.
  - Escalate or de-escalate priority (`Low`, `Medium`, `High`).
  - Add official public remarks and internal work order notes.

### 7. 📜 Activity Audit Logs & Event Trail
- **Tamper-Evident LocalStorage Audit Store**: Records civic and administrative actions in `ufr_activity_logs`.
- **Tracked Actions**:
  - `USER_LOGIN` / `USER_LOGOUT`: Session sign-in and sign-out timestamps.
  - `USER_REGISTER`: Account creation with contact info.
  - `COMPLAINT_CREATED`: Filing of problem reports with department and coordinate metadata.
  - `COMPLAINT_STATUS_UPDATED`: Real-time status changes.
  - `COMPLAINT_UPDATED`: Department or priority modifications.
  - `PROFILE_UPDATED`: Profile detail updates.
- **Audit View Features**:
  - Filter by Actor Role (`All`, `Citizens Only`, `Admins Only`).
  - Filter by Action Category (`Complaints`, `Status Changes`, `Authentication`, `Profile`).
  - Search by actor name, email, action description, or complaint tracking ID.
  - Direct complaint inspector trigger: clicking any `UFR-xxxx` badge immediately opens the Complaint Details modal.
  - Analytics cards: Total Audit Logs, Citizen Actions, Admin Actions, and Events in the Past 24 Hours.
  - Utility tools: **Export JSON**, **Real-Time Refresh**, and **Reset Demo Logs**.

### 8. 👤 User Profile Management
- Displays user identity (Full Name, Email Address, Formatted Mobile, Role Badge).
- Personal activity summary (Total Lodged, Active, and Solved reports).
- In-place profile editor with Indian mobile validation and `@gov.in` domain validation for administrators.

---

## 🔄 Complaint Lifecycle Workflow

Every civic issue moves through four standardized municipal phases:

```
┌──────────────┐      ┌────────────────┐      ┌───────────────┐      ┌────────────┐
│   Reported   │ ───► │  Under Review  │ ───► │  In Progress  │ ───► │  Resolved  │
└──────────────┘      └────────────────┘      └───────────────┘      └────────────┘
  Lodged by citizen     Assessed by desk        Field maintenance      Verified by
  with photos & GPS.    supervisors & teams.    crew on-site.          authority with
                                                                       official notes.
```

1. **Reported**: Problem lodged by a citizen; waiting for municipal desk assignment.
2. **Under Review**: Assessed by department supervisors; field team scheduled.
3. **In Progress**: Field workers or repair crews actively on-site addressing the issue.
4. **Resolved**: Work completed, verified by civic authorities, with closing remarks documented.

---

## 🏛️ Supported Municipal Departments

| Department | Icon | Typical Problem Domains |
| :--- | :---: | :--- |
| **Electricity** | ⚡ | Power outages, loose wiring, damaged transformer, voltage fluctuation |
| **Water Supply** | 💧 | Pipeline leaks, contaminated water, low water pressure, broken meter |
| **Street Lights** | 💡 | Broken lamps, flickering streetlights, exposed junction box, dark road |
| **Roads & Pavements**| 🛣️ | Potholes, broken footpath slabs, road cave-in, unpainted speed breakers |
| **Drainage & Sewage**| 🌊 | Blocked drains, sewage overflow, missing manhole covers, monsoon waterlogging |
| **Waste Management** | 🗑️ | Garbage accumulation, overflowing dumpsters, irregular waste collection |
| **Other Civic Utilities**| 🏢 | Public park maintenance, stray animal menace, encroachments, utility damage |

---

## 📊 Data Models & Schema

The application is written in strict TypeScript. The core interfaces defined in `src/types.ts` include:

```typescript
export type Department =
  | 'Electricity'
  | 'Water Supply'
  | 'Street Lights'
  | 'Roads'
  | 'Drainage'
  | 'Waste Management'
  | 'Other';

export type Priority = 'Low' | 'Medium' | 'High';
export type ComplaintStatus = 'Reported' | 'Under Review' | 'In Progress' | 'Resolved';
export type UserRole = 'citizen' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: UserRole;
}

export interface StatusHistoryItem {
  status: ComplaintStatus;
  timestamp: string;
  note?: string;
}

export interface Complaint {
  id: string;
  userId: string;
  userName: string;
  userMobile: string;
  title: string;
  department: Department;
  problemType: string;
  priority: Priority;
  address: string;
  area: string;
  city: string;
  landmark: string;
  latitude?: number;
  longitude?: number;
  image?: string;
  description: string;
  status: ComplaintStatus;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  statusHistory: StatusHistoryItem[];
  adminRemark?: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: UserRole;
  action: ActivityActionType;
  title: string;
  description: string;
  targetId?: string;
  metadata?: Record<string, any>;
}
```

---

## 💾 Client Storage Architecture

The application persists all state in browser `localStorage` without requiring external database setups:

| Key | Description | Initial Seed Behavior |
| :--- | :--- | :--- |
| `ufr_complaints` | Array of all civic complaints across all departments | Pre-seeded with 8 realistic urban utility complaints across Delhi/NCR coordinates |
| `ufr_registered_users`| Array of registered citizens and civic authorities | Pre-seeded with demo citizen (`citizen@example.com`) and admin (`admin@gov.in`) |
| `ufr_activity_logs` | Comprehensive immutable event audit log trail | Pre-seeded with realistic submission, triage, and status change audit entries |

---

## 📁 Project Directory Tree

```
├── index.html                     # HTML entry point with Leaflet stylesheets & meta tags
├── metadata.json                  # AI Studio application metadata and capabilities
├── package.json                   # Project dependencies and npm scripts
├── tsconfig.json                  # TypeScript compiler configuration
├── vite.config.ts                 # Vite bundler configuration
└── src/
    ├── main.tsx                   # React root entry point
    ├── App.tsx                    # Root layout, sticky containers, router, and auth guard
    ├── index.css                  # Tailwind CSS v4 styling rules
    ├── types.ts                   # Domain TypeScript interfaces and types
    ├── components/
    │   ├── HeaderNavbar.tsx       # Sticky top navigation with role badge & auth triggers
    │   ├── SidebarNav.tsx         # Fixed sidebar navigation for views and department links
    │   ├── DashboardView.tsx      # Citizen analytics counters, quick links, and Leaflet map
    │   ├── MapVisualizer.tsx      # Leaflet interactive map with custom pins & popups
    │   ├── ReportProblemView.tsx  # Problem report form, auto-suggester, camera, & GPS
    │   ├── CameraModal.tsx        # Device camera stream capture modal via getUserMedia
    │   ├── SubmittedProblemsView.tsx # Citizen's personal complaint history & search/filters
    │   ├── LiveIssuesView.tsx     # Public board of all unresolved municipal complaints
    │   ├── SolvedIssuesView.tsx   # Archive of completed resolutions with remarks
    │   ├── DepartmentsView.tsx    # Municipal department cards and directory
    │   ├── AdminDashboardView.tsx # Authority triage portal, status updater, & remarks
    │   ├── ProfileView.tsx        # User profile, summary statistics, & edit modal
    │   ├── LoginModal.tsx         # Citizen login, registration, & admin sign-in view
    │   ├── AdminAuthModal.tsx     # Secured administrator credential gate (@gov.in domain)
    │   ├── ActivityLogsView.tsx   # Admin audit logs viewer, filters, metrics, & export
    │   └── ComplaintDetailsModal.tsx # Full complaint inspector with 4-stage lifecycle timeline
    └── utils/
        ├── activityLogger.ts      # 'ufr_activity_logs' storage operations, logger, & seed data
        ├── departmentSuggester.ts # Rule-based department prediction engine
        └── initialData.ts         # Pre-seeded demo complaints, @gov.in validation helper, & users
```

---

## 🚀 Getting Started & Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation Steps
1. Clone the repository or navigate to the project directory:
   ```bash
   cd urban-utility-reporting
   ```
2. Install project dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server on port 3000:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:3000`.

### Production Build
To create a production build with minified bundles:
```bash
npm run build
```

### Type Checking & Linting
To check TypeScript types and verify code correctness:
```bash
npm run lint
```

---

## 🧪 Step-by-Step Evaluation Walkthrough

Follow these steps to experience the complete feature set:

### Scenario A: Citizen Experience
1. **Sign In**: Launch the app. In the login modal, use `citizen@example.com` / `password123` (or click *Create Citizen Account* to register with your own 10-digit Indian mobile number starting with 6, 7, 8, or 9).
2. **Explore Dashboard**: View the live KPI metric cards and browse open issues on the interactive Leaflet map.
3. **Lodge a Complaint**:
   - Navigate to **"Report a Problem"**.
   - Type *"Severe water pipe burst flooding road"* in the title.
   - Observe the **Department Suggester** automatically recommending **Water Supply**. Click **Accept Suggestion**.
   - Click **"Use Current Location"** to pull GPS coordinates.
   - Capture a photo using your camera or upload a file.
   - Submit the complaint and note the generated tracking ID (e.g., `UFR-2026-0009`).
4. **Track Status**: Go to **"Submitted Problems"** to see your new complaint marked as `Reported`.

### Scenario B: Municipal Authority Experience
1. **Switch to Admin**: Click your profile badge in the header and choose **Sign Out**, or click **Admin Dashboard** in the sidebar.
2. **Admin Authentication**: 
   - Click **"Admin Login? Sign In"**.
   - Enter an authorized government email with `@gov.in` domain (e.g. `admin@gov.in` or `commissioner@gov.in`).
   - Enter password `admin123` and sign in.
3. **Triage the Complaint**:
   - In the **Admin Dashboard**, find the complaint lodged in Scenario A.
   - Click **Update Status** to change it from `Reported` ➔ `In Progress`.
   - Add an official remark: *"Maintenance crew dispatched with heavy water pump."*
4. **Inspect Audit Trail**:
   - Navigate to **"Activity Audit Logs"**.
   - Search for the complaint ID to verify that the login, filing, and status updates were immutably recorded.
   - Click the tracking badge to inspect the complete 4-stage lifecycle timeline.

---

## 🎓 Academic Prototype Note

This project was built as an academic web application prototype demonstrating modern frontend software engineering, component-driven design with React 19 and TypeScript, responsive interface layout with Tailwind CSS v4, client-side data persistence with `localStorage`, and real-world civic governance workflows.
