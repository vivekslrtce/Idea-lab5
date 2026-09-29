# Urban Utility Problem Reporting Platform

A modern, responsive, citizen-centric web application designed as an academic prototype for reporting municipal and urban utility issues (streetlights, water leakage, potholes, drainage, sanitation, electricity) and enabling civic authorities to inspect, triage, and resolve complaints.

---

## 🏛️ System Overview

The **Urban Utility Problem Reporting Platform** bridges the communication gap between citizens and municipal authorities. Citizens can quickly lodge complaints with photos and GPS coordinates, while civic administrators can track problems through an interactive map and manage complaints through a streamlined status lifecycle.

---

## 🔑 Demo Credentials

The platform enforces a strict authentication gate. On page refresh or new session, users are prompted to authenticate. You can use the pre-seeded credentials below or register a new citizen account:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Citizen (Demo)** | `citizen@example.com` | `password123` | Report problems, track submissions, view live/solved issues, view profile |
| **Civic Admin** | `admin@citygov.org` | `admin123` | Manage all complaints, change departments, reassign priorities, update statuses, add remarks |

> **Note**: Admin access is restricted. Clicking **Admin Portal** or **Admin Login** opens a dedicated credential verification modal requiring valid administrative credentials.

---

## ✨ Key Features

### 1. 🔐 Authentication & Session Security
- **Strict Login Gate**: Fresh sessions and page reloads always require authentication before entering the app.
- **Citizen Registration**: Full form validation for Full Name, Email, 10-digit Mobile number, and matching Passwords.
- **Admin Passcode Modal**: Dedicated authentication barrier preventing unauthorized access to the admin dashboard.
- **Fast Demo Sign-in**: One-click autofill buttons for rapid testing during evaluations and demonstrations.

### 2. 📊 Citizen Dashboard & Analytics
- **Live Statistics Cards**: Real-time counter of Total Reports, Active Issues, In Progress, and Solved Complaints.
- **Interactive Leaflet Map**: Visualizes open utility complaints across the city with color-coded status pins.
- **Quick Action Cards**: Direct navigation to report issues or explore departments.

### 3. 📝 Smart Problem Reporting
- **Basic Details**: Problem Title, Department category, specific Problem Type, and Priority (Low / Medium / High).
- **Intelligent Department Suggester**: Simple rule-based keyword matching that inspects the title/description and automatically suggests the appropriate municipal department (e.g., *"water pipe burst"* ➔ `Water Supply`, *"pothole"* ➔ `Roads`, *"street light flicker"* ➔ `Street Lights`, *"garbage dump"* ➔ `Waste Management`). Allows 1-click acceptance.
- **Geolocation Integration**:
  - One-click **"Use Current Location"** button fetching browser GPS latitude & longitude.
  - Granular inputs for Street Address, Area / Locality, City, and Nearby Landmark.
- **Photo Evidence & Camera Support**:
  - Live webcam / device camera capture using the HTML5 MediaDevices API.
  - Image upload option with live thumbnail preview and removal capability.
- **Automated Tracking ID**: Generates standard formatted Complaint IDs (e.g., `UFR-2026-0001`).

### 4. 🗺️ Map Visualizer (Leaflet.js)
- Integrated Leaflet map rendering city-wide problem markers.
- Status-coded markers:
  - 🔵 **Reported** (Blue)
  - 🟡 **Under Review** (Amber)
  - 🟣 **In Progress** (Indigo)
  - 🟢 **Resolved** (Emerald)
- Interactive popups displaying issue title, department, address, thumbnail, and a direct button to inspect the full complaint details.
- Department-based filter to focus on specific municipal domains.

### 5. 🗂️ Complaint Tracking & Views
- **Submitted Problems**: Citizen's own complaint history with search, department filtering, priority filtering, and status badges.
- **Live Issues**: Public municipal board of all active, unresolved issues (`Reported`, `Under Review`, `In Progress`).
- **Solved Issues**: Archive of resolved civic issues with resolution timestamps and administrative notes.
- **Complaint Details Modal**:
  - Full audit trail with a 4-stage lifecycle timeline: `Reported` ➔ `Under Review` ➔ `In Progress` ➔ `Resolved`.
  - Photo inspection preview.
  - Geographic coordinates with quick link to view location.
  - Official administrative remarks.

### 6. 🛠️ Administrative Control Center
- Centralized overview with municipal metrics: Total Complaints, New Reports, In Progress, and Resolved Issues.
- Universal search across complaint IDs, citizen names, locations, and titles.
- Administrative controls to:
  - Update complaint status (`Reported`, `Under Review`, `In Progress`, `Resolved`).
  - Reassign responsible department.
  - Escalate or lower priority (`Low`, `Medium`, `High`).
  - Append internal notes and public resolution remarks.

### 7. 👤 User Profile Management
- Shows registered citizen profile details (Name, Email, Mobile).
- Personal activity summary (Total Lodged, Active, and Solved reports).
- In-place profile editor to update personal contact information.

---

## 🏛️ Supported Municipal Departments

1. ⚡ **Electricity** (Power outages, loose wiring, damaged transformer, voltage fluctuation)
2. 💧 **Water Supply** (Pipeline leaks, contaminated water, low pressure, broken meter)
3. 💡 **Street Lights** (Non-functioning lights, flickering lamps, exposed junction box)
4. 🛣️ **Roads & Pavements** (Potholes, broken footpaths, road cave-in, unpainted speed breakers)
5. 🌊 **Drainage & Sewage** (Blocked drains, sewage overflow, missing manhole covers)
6. 🗑️ **Waste Management** (Garbage accumulation, overflowing dumpsters, irregular collection)
7. 🏢 **Other Civic Utilities** (Encroachments, public park maintenance, stray animals, general utilities)

---

## 💻 Tech Stack

- **Framework**: [React 19](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Maps**: [Leaflet.js](https://leafletjs.com/) with OpenStreetMap tiles
- **Persistence**: Browser `localStorage` (seeds automatically with realistic demo civic data)
- **APIs**: HTML5 Geolocation API, MediaDevices Camera API, HTML5 FileReader API

---

## 📂 Project Structure

```
├── index.html                   # HTML entry point with Leaflet stylesheets & meta tags
├── metadata.json                # AI Studio application metadata and permissions
├── package.json                 # Project dependencies and npm scripts
├── tsconfig.json                # TypeScript configuration
├── vite.config.ts               # Vite configuration with Tailwind CSS integration
└── src/
    ├── main.tsx                 # Application entry point
    ├── App.tsx                  # Main router, global state, and authentication guard
    ├── index.css                # Tailwind CSS global styles
    ├── types.ts                 # TypeScript interfaces (Complaint, User, Department, etc.)
    ├── components/
    │   ├── HeaderNavbar.tsx     # Top navigation with role indicators & auth triggers
    │   ├── SidebarNav.tsx       # Sidebar navigation for views and department links
    │   ├── DashboardView.tsx    # Citizen analytics, quick links, and Leaflet map
    │   ├── MapVisualizer.tsx    # Leaflet interactive map with custom pins & popups
    │   ├── ReportProblemView.tsx# Complaint form, auto-suggester, camera, & GPS
    │   ├── CameraModal.tsx      # Device camera stream capture modal
    │   ├── SubmittedProblemsView.tsx # Citizen's submitted complaint history & filters
    │   ├── LiveIssuesView.tsx   # Public board of all active municipal issues
    │   ├── SolvedIssuesView.tsx # Completed civic resolutions archive
    │   ├── DepartmentsView.tsx  # Department cards and department-specific complaint filter
    │   ├── AdminDashboardView.tsx # Authority triage portal, status updater, & remarks
    │   ├── ProfileView.tsx      # User profile, summary statistics, & edit modal
    │   ├── LoginModal.tsx       # Citizen login & registration modal with validation
    │   ├── AdminAuthModal.tsx   # Secured administrator credential gate
    │   └── ComplaintDetailsModal.tsx # Full complaint viewer with 4-step status timeline
    └── utils/
        ├── departmentSuggester.ts # Keyword-matching department prediction engine
        └── initialData.ts       # Pre-seeded demo complaints, users, and localStorage initialization
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (version 18 or higher recommended)
- npm or yarn

### Installation
1. Clone or download the project files into your working directory.
2. Install the required dependencies:
   ```bash
   npm install
   ```

### Running Locally
Start the Vite development server:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

### Building for Production
To create an optimized production build:
```bash
npm run build
```

### Type Checking & Linting
Validate TypeScript code:
```bash
npm run lint
```

---

## 📱 Complaint Status Lifecycle

Every reported problem follows a standardized four-phase administrative progression:

```
[ Reported ] ──▶ [ Under Review ] ──▶ [ In Progress ] ──▶ [ Resolved ]
```

1. **Reported**: Newly lodged by a citizen; waiting for municipal desk assignment.
2. **Under Review**: Assessed by department supervisors; field team scheduled.
3. **In Progress**: Field workers or repair crews actively on-site addressing the issue.
4. **Resolved**: Work completed, verified by civic authorities, with closing remarks documented.

---

## 🎓 Academic Prototype Note

This project is built as an academic web prototype showcasing clean frontend engineering principles, intuitive UI design, state persistence with `localStorage`, and interactive client-side features without complex backend or cloud database dependencies.
