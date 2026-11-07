# StudentHub – Complete Full-Stack Student Portal

StudentHub is a modern, responsive, and secure higher-education student portal web application. Built with **React (Vite)**, **Tailwind CSS**, and **Supabase (PostgreSQL & Authentication)**, it offers streamlined student authentication, profile management, academic department tracking, and strict Row Level Security (RLS).

---

## 🚀 Key Features

- **Academic Identity & Department Management**: Students can view and update their full name and academic department with instant PostgreSQL synchronization.
- **Enterprise-Grade Authentication**: Powered by Supabase Auth with secure JWT session handling, password hashing, and session persistence in browser storage.
- **Row Level Security (RLS)**: PostgreSQL database policies strictly limit data access so authenticated students can only select and update their own records.
- **Automated Profile Provisioning**: Database triggers automatically create a corresponding `public.profiles` row upon new student registration.
- **Responsive University SaaS UI/UX**: Clean layout using an institutional color palette (Navy & Royal Blue with light slate surfaces), generous whitespace, mobile slide drawer, and Lucide React icons.
- **Zero-Fabricated Metrics**: Real-time calculated profile completion progress based exclusively on confirmed database fields.
- **Secure Password Recovery**: Integrated Supabase password reset workflow.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | [React 18](https://react.dev/) with [Vite](https://vitejs.dev/) |
| **Language** | JavaScript (ES Modules) |
| **Styling & Design** | [Tailwind CSS 3](https://tailwindcss.com/) with custom University theme |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Routing** | [React Router DOM v6](https://reactrouter.com/) |
| **Backend & Database** | [Supabase](https://supabase.com/) (PostgreSQL 15+) |
| **Authentication** | Supabase Auth (JWT, email/password) |
| **Security & Access** | PostgreSQL Row Level Security (RLS) & Triggers |

---

## 📁 Project Structure

```text
├── public/
├── src/
│   ├── components/
│   │   ├── ConfigAlert.jsx      # Banner displayed if Supabase credentials are not configured
│   │   ├── Footer.jsx           # Institutional footer with platform & compliance info
│   │   ├── FormInput.jsx        # Reusable form field with validation & password toggle
│   │   ├── Loading.jsx          # Branded animated loading spinner
│   │   ├── Navbar.jsx           # Responsive header with desktop/mobile navigation & auth pills
│   │   ├── ProtectedRoute.jsx   # Guards /dashboard and /profile from unauthenticated access
│   │   ├── PublicOnlyRoute.jsx  # Redirects authenticated students away from /login and /register
│   │   └── Sidebar.jsx          # Side navigation bar for authenticated dashboard views
│   ├── context/
│   │   └── AuthContext.jsx      # Global authentication provider, session manager & profile sync
│   ├── lib/
│   │   └── supabase.js          # Supabase client instantiation & configuration validation
│   ├── pages/
│   │   ├── Dashboard.jsx        # Protected student dashboard with live profile metrics & cards
│   │   ├── ForgotPassword.jsx   # Password reset request page
│   │   ├── Home.jsx             # Official landing page with hero, features & about sections
│   │   ├── Login.jsx            # Student sign-in form with remember session toggle
│   │   ├── NotFound.jsx         # Custom 404 page with return actions
│   │   ├── Profile.jsx          # Student profile view and real-time database update form
│   │   └── Register.jsx         # New student registration with client & server validation
│   ├── App.jsx                  # Main router and layout hierarchy
│   ├── index.css                # Tailwind directives and custom scrollbar styles
│   └── main.jsx                 # Application entry point
├── supabase/
│   └── migrations/
│       └── 001_create_profiles.sql  # SQL schema, RLS policies, and user creation trigger
├── .env.example                 # Template for environment credentials
├── .gitignore                   # Standard Git ignore rules
├── index.html                   # HTML template with Google Fonts (Inter)
├── package.json                 # Project dependencies and npm scripts
├── postcss.config.js            # PostCSS configuration
├── tailwind.config.js           # Tailwind theme styling configuration
└── vite.config.js               # Vite bundler configuration
```

---

## ⚙️ Environment Configuration

Create a `.env` file in the root directory by copying `.env.example`:

```bash
cp .env.example .env
```

Populate the file with your Supabase project credentials:

```env
# Supabase Configuration (obtained from Project Settings > API)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-or-publishable-key
```

> **Security Note**: Never expose your Supabase `service_role` key in frontend code or repository commits. Only use the public `anon` / `publishable` key.

---

## 🗄️ Supabase Database Setup & Migration

### Step 1: Create a Supabase Project
1. Log in to [Supabase](https://supabase.com/dashboard) and create a new project.
2. Under **Project Settings** > **API**, copy your **Project URL** and **anon / public key**, then paste them into your local `.env`.

### Step 2: Run the Database Migration
1. Open the **SQL Editor** from the left navigation in your Supabase dashboard.
2. Click **New query**.
3. Open [`supabase/migrations/001_create_profiles.sql`](./supabase/migrations/001_create_profiles.sql) in this repository and copy its entire contents into the SQL Editor.
4. Click **Run** to execute the script.

#### What this migration creates:
- `public.profiles` table with foreign key `id REFERENCES auth.users(id) ON DELETE CASCADE`.
- Row Level Security (RLS) enabled on `public.profiles`.
- Strict RLS policies allowing authenticated users to `SELECT`, `UPDATE`, and `INSERT` exclusively their own records (`auth.uid() = id`).
- A PostgreSQL trigger function `public.handle_new_user()` that runs automatically when a student registers via `auth.users`, provisioning a new profile row with their full name and department.
- A trigger function `public.handle_profile_updated()` to automatically update the `updated_at` timestamp.

---

## 💻 Local Development Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Build for Production
```bash
npm run build
```
The compiled, minified bundle will be generated in the `dist/` directory.

### 4. Preview the Production Build Locally
```bash
npm run preview
```

---

## 🔒 Security Architecture

1. **Authorization via Row Level Security (RLS)**: Client-side route protection prevents unauthorized viewing, while PostgreSQL RLS provides the ultimate defense against spoofing, SQL injection, or API manipulation.
2. **Password Protection**: Passwords are encrypted and hashed by Supabase Auth using bcrypt / argon2. Passwords are never stored in `public.profiles` or returned to the client.
3. **Environment Segregation**: `.env` is listed in `.gitignore` to prevent credential leakage.
4. **Input Sanitation & Validation**: Emails are validated via regular expression; passwords require a minimum of 8 characters; matching confirm-passwords are required during registration.

---

## 🌐 Deployment Guide

### Deploying to Vercel

1. Push your repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit for StudentHub portal"
   git branch -M main
   git remote add origin https://github.com/your-username/studenthub.git
   git push -u origin main
   ```
2. Log in to [Vercel](https://vercel.com) and click **Add New Project**.
3. Import your GitHub repository.
4. In the **Environment Variables** section, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
5. Click **Deploy**. Vercel will automatically run `npm run build` and publish your site with global edge caching.

> **Single Page Application Routing Note**: If direct URL visits to `/dashboard` return 404 on Vercel, ensure a `vercel.json` file is present in the root with rewrites:
> ```json
> {
>   "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
> }
> ```

---

## 📄 License
This project is licensed under the MIT License.
