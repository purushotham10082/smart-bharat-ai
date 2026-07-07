# Smart Bharat – AI-Powered Civic Companion

**Smart Bharat** is a modern, production-ready GenAI-powered Civic Companion Platform that enables Indian citizens to access government services, understand welfare schemes, file infrastructure grievances with GPS coordinates and images, check qualifications with eligibility checker checklists, and get speech-integrated assistance in multiple regional languages.

---

## 🌟 Key Hackathon-Grade Features

1. **Multilingual Context Engine**: Natively supports 10 languages: English, Hindi, Telugu, Tamil, Kannada, Malayalam, Marathi, Bengali, Gujarati, and Punjabi.
2. **Zero-Infrastructure Document OCR**: Leverage Gemini's multimodal capabilities (on the `/api/ocr` endpoint) to scan and extract metadata from uploaded Aadhaar or PAN cards.
3. **AI Grievance Classifier**: Triage grievances using Gemini (via `/api/classify`) to automatically categorize issues (Roads, Water, power) and delegate them to responsible departments (PWD, Jal Board) with priority rankings.
4. **Speech Synthesis & Speech-to-Text**: Voice-enabled chatbot utilizing HTML5 speech synthesis to read responses aloud and speech recognition for hands-free queries.
5. **Interactive Status Tracker**: Timelines, actual resolution logs, and officer replies showing citizen progress.
6. **Graceful Fallback Protocols**: Safe local storage fallbacks if Supabase (`.env.local`) or Google Gemini keys are absent, allowing instant local review.

---

## 🚀 Setup Instructions

### 1. Clone & Install Dependencies
Ensure you have Node.js 18+ installed. Run this in your terminal:
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` into a new `.env.local` file:
```bash
cp .env.example .env.local
```
Fill in the credentials:
- **`GOOGLE_GENERATIVE_AI_API_KEY`**: Get a key from [Google AI Studio](https://aistudio.google.com/).
- **`NEXT_PUBLIC_SUPABASE_URL`** & **`NEXT_PUBLIC_SUPABASE_ANON_KEY`**: Sign up at [Supabase](https://supabase.com) and retrieve these in API settings.

### 3. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🛠️ Supabase SQL Database Schema

Run this SQL query inside the **Supabase SQL Editor** to configure your database tables:

```sql
-- 1. Profiles Table (supports Role-Based Admin & Officers)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  role text default 'citizen' check (role in ('citizen', 'officer', 'admin')),
  state text default 'Delhi',
  language text default 'en',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Profiles
alter table public.profiles enable row level security;

create policy "Users can read all profiles." on public.profiles
  for select using (true);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- 2. Grievances Table
create table public.complaints (
  id text primary key,
  citizen_id uuid references public.profiles(id) on delete set null,
  title text not null,
  description text not null,
  category text not null,
  location text not null,
  image_url text,
  department text not null,
  urgency text not null,
  status text default 'Pending' check (status in ('Pending', 'In Progress', 'Resolved')),
  officer_remarks text,
  resolution_date text,
  timeline jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Complaints
alter table public.complaints enable row level security;

create policy "Anyone can read complaints." on public.complaints
  for select using (true);

create policy "Citizens can insert complaints." on public.complaints
  for insert with check (auth.uid() = citizen_id);

create policy "Officers and Admins can update complaints." on public.complaints
  for update using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('officer', 'admin')
    )
  );
```

---

## 🔑 Reviewer Credentials (Mock/Fallback mode)

If you are evaluating the platform in offline/fallback mode (without Supabase active), log in with these sample email addresses to explore different dashboard interfaces:
- 👥 **Citizen Persona**: `citizen@smartbharat.in` (accesses tracker, saved schemes, checklists).
- 👮 **Municipal Officer**: `officer@smartbharat.in` (inspects grievances, updates remarks, changes status).
- ⚙️ **Administrator**: `admin@smartbharat.in` (full analytics graphs, caseload metrics, priority grids).

---

## ☁️ Deployment on Vercel

1. Push your project code to a private or public GitHub repository.
2. Go to the [Vercel Dashboard](https://vercel.com) and click **"Add New Project"**.
3. Import your repository.
4. Expand **Environment Variables** and add:
   - `GOOGLE_GENERATIVE_AI_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click **"Deploy"**. Vercel will build and host your App Router code.
