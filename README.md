# Appointment Management System (SDE Intern Assignment)

This repository contains the implementation of the **Appointment Scheduling and Queue Management** feature (Feature B) for the EMR system. It combines a React frontend with a Python (FastAPI) backend.

## 📂 Submission Files
*   **Frontend**: `frontend/src/EMR_Frontend_Assignment.jsx` (Primary UI implementation)
*   **Backend**: `backend/appointment_service.py` (Core API logic & mock data)
*   **API Entrypoint**: `api/index.py` (Serverless entrypoint for Vercel)

## 🚀 Features
*   **View Appointments**: Filter by "Upcoming" (consolidated Scheduled), "Today", "Past", or specific dates.
*   **Calendar Integration**: Interactive calendar to filter appointments by selecting a date.
*   **Status Management**: Real-time status updates (e.g., Scheduled → Confirmed → Completed) causing immediate UI refreshes.
*   **Advanced Filtering**: Filter by Doctor, Status, and Search by patient/doctor name.
*   **Mock Data Layer**: Backend service with 10+ mock records simulating a database.

## 🛠️ Setup & Installation

### Prerequisites
*   Node.js & npm
*   Python 3.x

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
# Backend runs at http://localhost:8000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
# Frontend runs at http://localhost:5174
```

---

Technical Explanation

1. API Design & Query Structure (
get_appointments
)
While the implementation uses a RESTful approach via FastAPI, the 
get_appointments
 function is designed with a flexible, query-like structure similar to a GraphQL resolver.

Filter Logic
The function accepts a filters dictionary argument, allowing the frontend to request specific slices of data without needing multiple distinct endpoints. This mirrors the arguments one would pass to a GraphQL query field.

Supported Filters:

date
: Exact date match (e.g., retrieving appointments for a "Custom" selected date).
start_date / end_date: Range queries (used for "Upcoming" and "Past" tabs).
status
: Filtering by lifecycle state (e.g., "Scheduled", "Confirmed", "Cancelled").
doctor_name: multi-tenant simulation to filter by provider.
search_query: Text search across patient names and doctor names.
Response Structure: The function returns a list of appointment objects serialized as JSON. Each object contains comprehensive details (Patient Name, Date/Time, Doctor, Status, Mode) necessary to render the UI cards without additional round-trips (solving the N+1 problem inherent in some REST designs).

2. Data Consistency on Update (
update_appointment_status
)
The 
update_appointment_status
 function ensures data consistency through the following mechanism:

Atomic-like Operation: somewhat similar to a database transaction, the function locates the specific appointment by unique ID and updates its status in a single pass.
Return Value Confirmation: It returns the updated appointment object immediately. The frontend uses this return value to update its local state only if the backend operation was successful, ensuring the UI never shows a state that disagrees with the server.
Real-World Production Context (AWS AppSync & Aurora)
In a production deployment (as simulated by the code comments), consistency would be enforced by:

Transactional Writes: The update would be an ACID-compliant transaction against the Amazon Aurora PostgreSQL database (UPDATE appointments SET status = ... WHERE id = ...).
Real-time Synchronization: An AWS AppSync mutation would trigger a Subscription. Connected clients (doctors/admins) would receive the status change in real-time via WebSockets, ensuring that if one user cancels an appointment, all other users see it turn "red" immediately, preventing conflict (e.g., double booking).