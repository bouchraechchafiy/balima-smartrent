 Balima SmartRent Ecosystem

>The Future of Property Management. An AI-driven SaaS platform that connects Managers, Tenants, and Technicians into a single, intelligent decision-making ecosystem.

Overview

Balima SmartRent is a **digital decision-intelligence ecosystem** designed for the luxury real estate market (specifically Balima Residences in Rabat). Unlike traditional property management tools, this platform uses **Google Gemini AI** to:

1.  Predict Vacancy Risk: Analyzing lease terms and market data.
2.  Triage Maintenance: Automatically prioritizing requests (Critical vs. Routine).
3.  Optimize Pricing: Suggesting rent adjustments based on AI market analysis.

The system features three distinct portals with role-based access control:
Manager: Executive dashboard with financial KPIs, AI insights, and team chat.
Tenant: "Airbnb-style" dashboard to pay rent, request repairs, and view lease info.
Technician: Trello-style Kanban board for real-time maintenance tracking.

Key Features

Artificial Intelligence (Gemini 2.5 flash OR possible PRO 2.5)

Smart Maintenance: When a tenant types "The pipe burst\!", the AI detects "High Priority" and assigns the category "Plumbing" automatically.
Data Analyst Assistant: Managers can ask natural language questions like *"How can we increase revenue next month?"* and get data-backed answers.
Vacancy Prediction: Visual risk meters showing which tenants are likely to leave.

 Modern User Experience

Real-Time Chat: WhatsApp-style messaging between Tenants, Managers, and Techs.

Interactive Dashboards: Dynamic charts (Recharts) and smooth transitions (Framer Motion). 

Public Listings: A public-facing page showcasing available units with real-time status.


Technology Stack

Frontend:

 React (Vite + TypeScript):** Blazing fast UI.
 Tailwind CSS: Professional "Command Center" styling (Dark Sidebar, Glassmorphism).
Framer Motion: High-end animations and page transitions.
 Recharts: Interactive financial analytics.

Backend:

Python (FastAPI): High-performance async API.
SQLite (SQLModel): Lightweight, relational database (no setup required). 
Google Gemini API: The intelligence engine.



Getting Started 

Follow these steps to run the full ecosystem on your local machine.

Prerequisites

Node.js (v18+)
Python (v3.10+)
Google Gemini API Key

1 Backend Setup (The Brain)

Open a terminal in the root folder `Balima__smartrent`:

```bash
# 1. Create a virtual environment 
python -m venv .venv
# Windows:
.venv\Scripts\activate
# Mac/Linux:
source .venv/bin/activate

# 2. Install Python dependencies
pip install -r backend/requirements.txt

# 3. Configure AI Key
# Open backend/ai_engine.py and paste your Google API Key where it says "YOUR_GEMINI_API_KEY"

# 4. Seed the Database (Create Real Data)
python -m backend.seed_data

# 5. Start the Server
uvicorn backend.main:app --reload


The Backend will run at: `http://127.0.0.1:8000`

⃣ Frontend Setup 

Open a new terminal in the root folder:


# 1. Go to frontend folder
cd frontend/balima-frontend

# 2. Install JS dependencies
npm install

# 3. Start the UI
npm run dev
```

The App will run at: `http://localhost:5173`

-----

 Demo Credentials

The database comes pre-seeded with these accounts for testing:

| Role       | Email | Password | Features to Test |
|:-----------| :--- | :--- | :--- |
| Manager    | `admin@balima.com` | `123` | AI Insights, Revenue Charts, Chat, Ask AI Button |
| Tenant     | `sarah@balima.com` | `123` | Submit Request (Try typing a real issue\!), View Listings |
| Technician | `mike@balima.com` | `123` | Drag-and-drop Kanban Board, Update Job Status |

-----

📂Project Structure


Balima__smartrent/
├── backend/
│   ├── main.py            # API Routes (The Nervous System)
│   ├── models.py          # Database Tables (User, Apartment, Request)
│   ├── ai_engine.py       # Gemini AI Logic
│   └── seed_data.py       # Script to reset/populate database
│
├── frontend/balima-frontend/src/
│   ├── components/        # Reusable UI (Sidebar, ProtectedRoute)
│   ├── context/           # Auth Context (Login Logic)
│   ├── layouts/           # Dashboard Wrapper (Sidebar + Header)
│   ├── pages/
│   │   ├── manager/       # Admin Dashboards
│   │   ├── tenant/        # Tenant Portal
│   │   ├── tech/          # Technician Board
│   │   └── public/        # Landing Page & Login
│   └── App.tsx            # Main Router
```

-----

  How to Test the Full Flow

1.  Public View: Go to `http://localhost:5173`. Click "View Available Units" to see the catalog.
2.  Tenant Request: Login as **Sarah**. Go to "Maintenance". Type "My kitchen sink is flooding the floor\!". Submit.
3.  AI Analysis: The backend sends this to Google Gemini. It determines this is High Priority / Plumbing.
4.  Technician Action: Login as Mike. You will see the new card in "To Do" marked High Priority. Drag it to "In Progress".
5.  Manager Oversight: Login as Admin. Check the Dashboard. You will see "Pending Requests" updated and a Notification in the bell icon.
6.  Chat: Go to "Team Chat" as Manager. Send a message. Login as Sarah, and you will see the message in real-time polling.

-----

© 2025 Balima Residences Capstone Project.