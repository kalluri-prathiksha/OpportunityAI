# 🎓 OpportunityAI — Personalized Opportunity Finder

**OpportunityAI** is a full-stack, AI-powered web application that helps college students discover scholarships, internships, competitions, hackathons, online courses, training programs, and research fellowships tailored to their education, skills, interests, and career goals.

---

## 🌟 Key Highlights & Core Features

1. **AI Semantic Matching Engine**:
   - Calculates a precision match score (0–100%) between student profiles and opportunity criteria.
   - Evaluates degree/major compatibility, year of study eligibility, technical skills, and career aspirations.
   - Generates natural-language explainability summaries:
     > *"This internship strongly matches your B.Tech Computer Science background and leverages your skills in Python and SQL. It also directly aligns with your interest in Data Analytics."*
   - Includes **Skill Gap Analysis** that highlights in-demand skills to elevate profile matching.

2. **Unified Opportunity Discovery (7 Categories)**:
   - Scholarships, Internships, Hackathons, Competitions, Training Programs, Fellowships, Online Courses.
   - 22+ realistic sample opportunities tailored for Indian undergraduate and postgraduate students (e.g., GSoC, SIH, ISRO Internship, Flipkart GRiD, Reliance Scholarship, Adobe Women-in-Tech, Samsung PRISM).
   - Rich filtering by category, delivery mode (Online/Offline/Hybrid), location, skill keywords, and approaching deadlines.

3. **Student Profile & Privacy-First Architecture**:
   - Full student profile management: college/university, degree, year of study, skills tags with quick-add pills, domain interests, location preferences, and optional resume attachment.
   - Instant recalculation of AI matches whenever the student updates their skills or goals.

4. **Interactive Application Tracker (Pipelines & Checklists)**:
   - Track application stages: *Interested → Preparing application → Applied → Assessment or interview → Accepted → Rejected → Withdrawn*.
   - Dynamic step-by-step preparation checklists generated for every tracked opportunity.
   - Celebration confetti animation upon marking applications as *Accepted*!

5. **Deadline Calendar & In-App Reminders**:
   - Chronological deadline schedules with urgent countdown alerts (closing in 3–7 days).
   - Custom in-app and email reminder scheduling with personal preparation notes.

6. **Admin Management & Moderation Portal**:
   - Role-based authorization protecting administrative functions.
   - Real-time platform analytics with interactive Recharts diagrams.
   - Opportunity publishing modal, live verification toggle, expiration marker, and bulk CSV dataset import.

---

## 🏗️ Project Architecture & Tech Stack

```
OpportunityAI/
├── client/                     # Frontend (React 18 + TypeScript + Vite)
│   ├── src/
│   │   ├── components/         # Reusable UI components (Navbar, Sidebar, OpportunityCard, Modals)
│   │   ├── context/            # AuthContext & AppContext
│   │   ├── pages/              # All 15 application pages
│   │   ├── services/           # API client (api.ts)
│   │   ├── types/              # TypeScript interfaces
│   │   ├── App.tsx             # Route management & layout wrapping
│   │   └── main.tsx            # Application entrypoint
│   └── package.json
├── server/                     # Backend (Node.js + Express)
│   ├── src/
│   │   ├── data/               # 22+ curated initial opportunities
│   │   ├── services/           # Semantic AI matching & explanation engine (aiMatcher.js)
│   │   └── index.js            # Express REST API & SPA static serving
│   └── package.json
├── supabase/
│   └── schema.sql              # Supabase PostgreSQL schema, RLS policies & indexes
├── scripts/
│   └── test-flows.js           # Automated test suite verifying all 10 user flows
├── package.json                # Root orchestration scripts
└── README.md
```

### Tech Stack:
- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React, Recharts, Canvas-Confetti, Vite.
- **Backend**: Node.js, Express, ES Modules, Multer, Dotenv.
- **AI Matching**: Semantic ontology concept mapping, cosine qualification scoring, eligibility validation, and personalized natural language synthesis.
- **Database / Auth**: Supabase PostgreSQL DDL with RLS policies, alongside a persistent fallback datastore ensuring zero external friction out-of-the-box.

---

## 🚀 Quick Start Guide (Local Setup)

### Prerequisites:
- **Node.js**: v18 or higher (v24 recommended)
- **npm**: v9 or higher

### Step 1: Install Dependencies
```bash
# In the project root:
npm run install:all
```

### Step 2: Build the Frontend
```bash
npm run build
```

### Step 3: Run the Application
You can run the full application in a single unified process:
```bash
npm run dev:server
```
Then open your browser at:
👉 **`http://localhost:5000`**

*(Alternatively, to run the Vite HMR dev server during frontend development, run `npm run dev:client` in one terminal and `npm run dev:server` in another).*

---

## 🔑 Pre-Configured Demo Accounts

For instant evaluation, one-click demo login buttons are provided on the Sign In page:

| Persona | Email | Password | Role & Profile |
| :--- | :--- | :--- | :--- |
| **Demo Student** | `student@demo.com` | `demo123` | **Aarav Sharma**, NIT • B.Tech Computer Science (3rd Year) • Skills: Python, SQL, Machine Learning, React |
| **Demo Admin** | `admin@demo.com` | `admin123` | **Platform Administrator** • Opportunity management, verification, CSV import |

You can also create a new student account at any time using the Sign Up page.

---

## 🤖 AI Semantic Matching Configuration

The AI matching engine is located in [`server/src/services/aiMatcher.js`](server/src/services/aiMatcher.js).

It operates in two complementary modes:
1. **Self-Contained Semantic Engine (Default)**:
   - Uses domain-specific concept ontology clusters, multi-attribute qualification weighting (35% Skills, 25% Degree, 25% Interests, 15% Mode), and hard eligibility verification.
   - Requires **zero external API keys** and produces instantaneous, consistent recommendations.
2. **External LLM Integration (Optional)**:
   - To connect Gemini or OpenAI APIs, supply your key in `.env`:
     ```env
     GEMINI_API_KEY=your_gemini_api_key_here
     # or
     OPENAI_API_KEY=your_openai_api_key_here
     ```

---

## 🗄️ Database Setup (Supabase PostgreSQL)

A complete database migration script is provided in [`supabase/schema.sql`](supabase/schema.sql).

To deploy with your own Supabase project:
1. Create a project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Paste and run the contents of [`supabase/schema.sql`](supabase/schema.sql).
4. Copy your project URL and Anon Key into `server/.env` and `client/.env`:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   ```

---

## 🧪 Automated Verification & Testing

To run the automated end-to-end verification covering all 10 core user flows:
```bash
node scripts/test-flows.js
```

**Verified Flows:**
1. ✅ Student signs up and creates profile
2. ✅ Student explores opportunities
3. ✅ AI recommendations are generated
4. ✅ Student views opportunity match explanation
5. ✅ Student saves opportunity
6. ✅ Student adds to application tracker
7. ✅ Student updates application status
8. ✅ Student creates a deadline reminder
9. ✅ Admin adds and verifies opportunity
10. ✅ Student immediately sees newly added opportunity

---

## 🚢 Production Deployment

### Option A: Node.js Host (Render / Railway / Fly.io / VPS)
1. Build the client: `npm run build`
2. Start the server: `node server/src/index.js`
3. Set `PORT=5000` (or host assigned port). The server serves both the API and client SPA automatically.

### Option B: Decoupled (Vercel Frontend + Render Backend)
1. Deploy `client/` to Vercel (Build Command: `npm run build`, Output Directory: `dist`).
2. Deploy `server/` to Render or Railway.
3. Point `VITE_API_URL` to your live backend domain.

---

## 📄 License & Social Impact
Developed for **OpportunityAI** — bringing transparent, personalized, and accessible opportunity discovery to college students nationwide.
