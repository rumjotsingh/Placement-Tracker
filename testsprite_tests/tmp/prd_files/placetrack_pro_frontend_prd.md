# PlaceTrack Pro — Frontend Product Requirements Document (PRD)

**Version:** 1.1  
**Date:** July 4, 2026  
**Product:** Placement-Tracker Frontend  
**Purpose:** Complete PRD for frontend end-to-end testing with TestSprite  
**Base URL:** http://localhost:5173  
**API Base URL:** http://localhost:8080/api

---

## 1. Executive Summary

PlaceTrack Pro is a campus placement preparation and recruitment management platform. The frontend is a React + TypeScript SPA serving three roles — **Student**, **Coordinator**, and **Admin** — each with dedicated dashboards and workflows.

Students browse placement drives, apply to eligible positions, track applications, sync coding platform stats, manage resumes, and view interviews. Coordinators manage companies, create placement drives, review applicants, update application statuses, and schedule interviews. Admins view institution-wide analytics and can access coordinator capabilities.

---

## 2. Product Goals

| Goal | Description |
|------|-------------|
| Centralize placement tracking | Single portal for students to manage their placement journey |
| Streamline coordinator workflows | Manage drives, applicants, and interviews efficiently |
| Provide actionable analytics | Dashboards with metrics and charts for all roles |
| Integrate coding profiles | Sync stats from LeetCode, Codeforces, CodeChef, GeeksforGeeks, GitHub |
| Enforce role-based access | Strict route guards ensuring users only access authorized areas |

---

## 3. User Personas

### 3.1 Student
- **Needs:** Find and apply to drives, track progress, showcase coding skills, upload resumes
- **Access:** `/student/*` only
- **Registration:** Signup page or Google OAuth

### 3.2 Coordinator
- **Needs:** Create companies/drives, manage applicants, update statuses, schedule interviews
- **Access:** `/coordinator/*`
- **Login:** Pre-seeded account (`coordinator@placetrack.edu`)

### 3.3 Admin
- **Needs:** Institution-wide overview and analytics
- **Access:** `/admin/*` (coordinator routes require separate COORDINATOR role unless shared)
- **Login:** Pre-seeded account (`admin@placetrack.edu`)

---

## 4. Technical Context

| Component | Technology |
|-----------|------------|
| Framework | React 19 + TypeScript |
| Build | Vite 8 (port 5173) |
| Routing | React Router 7 |
| State | Zustand (auth → localStorage `placetrack-auth`) |
| Data fetching | TanStack Query (30s stale time) |
| HTTP | Axios + Bearer token interceptor |
| Forms | React Hook Form + Zod |
| UI | Tailwind CSS 4 + Radix/shadcn |
| Charts | Recharts |
| Toasts | Sonner |

### Environment
- `VITE_API_URL=http://localhost:8080/api`
- Backend on port 8080, MongoDB required
- Seed: `cd backend && node src/scripts/seedUsers.js`

### Demo Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@placetrack.edu | admin123 |
| Coordinator | coordinator@placetrack.edu | coord123 |

---

## 5. Routes & Pages

### Public
| Route | Page | Features |
|-------|------|----------|
| `/` | LandingPage | Hero, features, testimonials, FAQ, signup/login CTAs |
| `/login` | LoginPage | Email login, Google OAuth, demo credentials |
| `/signup` | SignupPage | Student registration, Google OAuth |
| `/forgot-password` | ForgotPasswordPage | Request reset email |
| `/auth/google/callback` | GoogleCallbackPage | OAuth token handoff |

### Student (`STUDENT` role)
| Route | Page |
|-------|------|
| `/student` | StudentDashboard |
| `/student/profile` | ProfilePage |
| `/student/applications` | ApplicationsPage |
| `/student/applications/:id` | ApplicationDetailPage |
| `/student/drives` | DrivesPage |
| `/student/drives/:id` | DriveDetailPage |
| `/student/coding` | CodingProfilesPage |
| `/student/dsa` | DSATrackerPage |
| `/student/resume` | ResumeVaultPage |
| `/student/interviews` | InterviewsPage |
| `/student/notifications` | NotificationsPage |
| `/student/settings` | SettingsPage |

### Coordinator (`COORDINATOR` or `ADMIN`)
| Route | Page |
|-------|------|
| `/coordinator` | CoordinatorDashboard |
| `/coordinator/companies` | CompaniesPage |
| `/coordinator/drives` | CoordinatorDrivesPage |
| `/coordinator/drives/:id/applicants` | DriveApplicantsPage |
| `/coordinator/students` | StudentsPage |
| `/coordinator/applications` | CoordinatorApplicationsPage |
| `/coordinator/interviews` | CoordinatorInterviewsPage |
| `/coordinator/notifications` | NotificationsPage |

### Admin (`ADMIN` only)
| Route | Page |
|-------|------|
| `/admin` | AdminDashboard |
| `/admin/users` | StudentsPage |
| `/admin/companies` | CompaniesPage |
| `/admin/drives` | CoordinatorDrivesPage |
| `/admin/drives/:id/applicants` | DriveApplicantsPage |
| `/admin/applications` | CoordinatorApplicationsPage |
| `/admin/interviews` | CoordinatorInterviewsPage |
| `/admin/analytics` | AdminDashboard |

---

## 6. Authentication & Authorization

### Requirements
- **AUTH-001:** Unauthenticated users on protected routes → redirect `/login`
- **AUTH-002:** Authenticated users on `/login`, `/signup`, `/forgot-password` → redirect to role home
- **AUTH-003:** Students cannot access `/coordinator/*` or `/admin/*`
- **AUTH-004:** Coordinators cannot access `/student/*` or `/admin/*`
- **AUTH-005:** Admins access `/admin/*`; coordinator routes allow `COORDINATOR` and `ADMIN`
- **AUTH-006:** API 401 → clear auth, redirect `/login`
- **AUTH-007:** JWT sent as `Authorization: Bearer <token>`

### Login Flow
1. Enter email + password (min 6 chars, valid email)
2. `POST /auth/login`
3. Redirect: ADMIN → `/admin`, COORDINATOR → `/coordinator`, STUDENT → `/student`
4. Errors shown via toast

### Signup Flow
1. Fields: name (min 2), email, password (min 6), roll number, branch, graduation year (2020–2035)
2. `POST /auth/register`
3. Redirect to `/student`

### Google OAuth
1. Click "Continue with Google" → redirect `{API_URL}/auth/google`
2. Callback at `/auth/google/callback?token=&role=` or `?error=`
3. `GET /auth/me` → store auth → role redirect

### Forgot Password
1. Email → `POST /auth/forgot-password`
2. Show generic success message

---

## 7. Feature Requirements

### 7.1 Student Dashboard
- Greeting by time of day
- Stat cards: applications, offers, interviews, active drives
- Mini cards: LeetCode solved, GitHub repos, Codeforces rating
- LeetCode difficulty pie chart
- Recent applications (4) and upcoming interviews (4)
- Sidebar nav + unread notification badge (30s poll)

### 7.2 Profile
- Hero: name, branch, CGPA, year, roll
- Tabs: Coding Profiles | Personal Info | Skills & Projects
- Edit: CGPA, phone, skills (comma-separated), 5 platform usernames
- Save → `PUT /profile/me`
- Sync All → `POST /coding/sync/all`
- Projects read-only

### 7.3 Applications
- Table: company, role, package, date, status badge
- Detail: timeline, linked interviews, meeting links
- Withdraw when status = Applied and not withdrawn → `PATCH /applications/:id/withdraw`

### 7.4 Drives
- List OPEN drives with search
- Cards: logo, role, package, location, deadline, CGPA, branches, applied badge
- Detail: full description, eligibility panel (`GET /drives/:id/eligibility`)
- Apply disabled if ineligible/already applied
- Confirm dialog → `POST /applications/drives/:driveId/apply`

### 7.5 Coding Profiles & DSA
- 5 platforms: GitHub, LeetCode, Codeforces, CodeChef, GeeksforGeeks
- Per-platform sync + Sync All
- Summary cards, bar/pie/line charts
- DSA: easy/medium/hard aggregation, growth charts (`GET /coding/dsa`)

### 7.6 Resume Vault
- PDF-only drag-drop upload (`POST /resumes`)
- Version history, download, delete (`DELETE /resumes/:id`)
- Active resume badge

### 7.7 Interviews (Student)
- List and Timeline tabs
- Company, role, datetime, mode, result, meeting link

### 7.8 Notifications
- Grouped: Today, Yesterday, Earlier
- Mark read on click → navigate via link
- Mark all read action
- Unread badge in layout

### 7.9 Settings
- Read-only account info from auth store

### 7.10 Coordinator Dashboard
- 5 metric cards, quick actions, branch chart, recent applications

### 7.11 Companies
- Search, add (name required), delete
- Fields: name*, website, industry, location, description
- `?add=true` opens add dialog

### 7.12 Drives (Coordinator/Admin)
- Create/edit: company*, role*, package*, deadline*, drive date*, min CGPA, branches, job type, description
- Validation: deadline before drive date; deadline future on create
- Close OPEN drives, delete with confirmation
- Applicants link → drive applicants page

### 7.13 Drive Applicants
- Filter by branch and status (9 statuses)
- Inline status update (`PATCH /applications/:id/status`)
- Schedule interview dialog

### 7.14 Coordinator Applications
- Filter by drive and status
- Status update + schedule interview

### 7.15 Coordinator Interviews
- List all interviews
- Add feedback (required text, result Pending/Passed/Failed)
- Cancel interview

### 7.16 Schedule Interview Dialog
- Required: application, date (≥ today), time, mode (Online/Offline)
- Meeting link shown for Online (optional)
- `POST /interviews`

### 7.17 Students / Users
- Search by name, email, roll
- Read-only table

### 7.18 Admin Dashboard
- 6 metrics including placement rate
- Branch placements bar chart, top recruiters pie chart

---

## 8. Data Models & Enums

**Application Statuses:** Applied, Shortlisted, Online Assessment Scheduled, Online Assessment Cleared, Interview Round 1, Interview Round 2, HR Round, Selected, Rejected

**Branches:** CSE, IT, ECE, EEE, ME, CE, AI/ML, DS

**Job Types:** Full-Time, Internship, Contract

**Drive Status:** OPEN, CLOSED

**Interview Mode:** Online, Offline

**Interview Result:** Pending, Passed, Failed

---

## 9. API Endpoints (Frontend Usage)

| Service | Key Endpoints |
|---------|---------------|
| Auth | POST `/auth/login`, `/auth/register`, `/auth/forgot-password`, GET `/auth/me` |
| Profile | GET/PUT `/profile/me` |
| Resumes | GET/POST `/resumes`, DELETE `/resumes/:id` |
| Companies | GET/POST/DELETE `/companies` |
| Drives | GET/POST/PUT/PATCH/DELETE `/drives`, GET `/drives/:id/eligibility`, GET `/drives/:id/applicants` |
| Applications | GET `/applications/my`, POST apply, PATCH withdraw/status, GET detail |
| Interviews | GET/POST `/interviews`, PATCH cancel/feedback |
| Coding | GET `/coding/stats`, `/coding/dsa`, POST `/coding/sync/*` |
| Dashboard | GET `/dashboard/student`, `/dashboard/coordinator`, `/dashboard/admin` |
| Notifications | GET `/dashboard/notifications`, PATCH read/read-all, GET unread-count |
| Search | GET `/search/students` |

---

## 10. Error Handling

| Scenario | Behavior |
|----------|----------|
| Network/API error | Error toast |
| 401 | Logout + `/login` |
| 403 | Permission error toast |
| Empty lists | EmptyState with CTA |
| Form validation | Inline errors, submit blocked |
| Already applied | Apply disabled + reason shown |

---

## 11. Out of Scope (Known Gaps)

1. Reset password page (API only)
2. Profile image upload UI
3. Company edit UI
4. Header global search (placeholder)
5. Settings password change
6. Student dashboard weekly chart (mock data)
7. Admin package distribution chart
8. Landing "Watch Demo" button
9. Projects create/edit on profile
10. Student drill-down from coordinator students page

---

## 12. TestSprite Test Scope

### Priority 1 — Critical
1. Login per role + correct redirect
2. Route protection (cross-role blocked)
3. Student signup → dashboard
4. Browse drives → eligibility → apply
5. Applications list + detail
6. Coordinator: create company → create drive
7. Applicants: status update → schedule interview
8. Logout

### Priority 2 — Core
1. Profile edit + save
2. Resume PDF upload
3. Coding sync buttons
4. DSA tracker charts
5. Student interviews
6. Notifications mark read
7. Coordinator applications filters
8. Interview feedback
9. Admin dashboard

### Priority 3 — Secondary
1. Landing page CTAs
2. Forgot password
3. Drive search/filters
4. Application withdraw
5. Drive close/delete
6. Company delete
7. Mobile sidebar drawer
8. Empty states

### Test Setup
```bash
cd backend && npm run dev    # port 8080
cd frontend && npm run dev   # port 5173
cd backend && node src/scripts/seedUsers.js
```

---

*End of PRD — PlaceTrack Pro Frontend v1.1*
