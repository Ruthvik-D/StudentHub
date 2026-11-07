import React from 'react'
import { Link } from 'react-router-dom'
import {
  GraduationCap,
  ShieldCheck,
  UserCheck,
  Building2,
  Lock,
  ArrowRight,
  Database,
  CheckCircle2,
  Sparkles,
  Zap,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/60 via-white to-slate-50 pt-16 pb-20 md:pt-24 md:pb-28 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-xs font-semibold text-blue-800 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Next-Gen Academic Student Management</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              A Unified Academic Portal for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700">
                Modern University Students
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed">
              StudentHub brings authentication, student profiles, academic department tracking,
              and enterprise-grade Row Level Security into one clean, seamless experience.
            </p>

            {/* Actions */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              {user ? (
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  Go to Student Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md hover:shadow-lg transition-all"
                  >
                    Create Student Account
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/login"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-300 shadow-sm transition-all"
                  >
                    Student Sign In
                  </Link>
                </>
              )}
            </div>

            {/* Key trust bullets */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Row Level Security (RLS)
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Supabase Auth & Session Persistence
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Zero-Fabricated Metrics
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs uppercase tracking-widest font-bold text-blue-600">
              Core Capabilities
            </h2>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Designed For High Academic Standards
            </p>
            <p className="text-slate-600 text-sm sm:text-base">
              Every feature is built around data integrity, security, and responsive student productivity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-blue-200 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Student Profile Management</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Seamlessly manage student identification details and academic department affiliations with instant PostgreSQL synchronization.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-blue-200 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Supabase Row-Level Security</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Granular PostgreSQL policies ensure each student can only view and update their own authorized records. Zero data leakage.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-blue-200 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Encrypted Authentication</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Secure JWT-based session handling, password hashing, and encrypted credential management powered by Supabase Auth.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-blue-200 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Department Tracking</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Keep major academic affiliations organized across engineering, sciences, arts, and business divisions with easy updates.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-blue-200 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Real PostgreSQL Persistence</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                No simulated or mock states. Everything updates directly in a production-ready PostgreSQL relational database schema.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-blue-200 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Responsive & Fast</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Built with Vite and Tailwind CSS for rapid load times, smooth transitions, and seamless access on desktops, tablets, and phones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-8 sm:p-12 lg:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                  <GraduationCap className="w-4 h-4" />
                  <span>Institutional Vision</span>
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  Built to modernize university portal experiences.
                </h2>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                  Legacy student portals are often cluttered, slow, and frustrating to navigate. StudentHub
                  re-engineers the university experience with a clean SaaS design philosophy, generous spacing,
                  and clear feedback loops.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-1 rounded bg-blue-50 text-blue-600 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">100% Student-Centric Data</h4>
                      <p className="text-xs text-slate-500">Every piece of information reflects verified database records.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-1 rounded bg-blue-50 text-blue-600 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">Automated Profile Provisioning</h4>
                      <p className="text-xs text-slate-500">PostgreSQL triggers create student profile entries automatically upon sign up.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-1 rounded bg-blue-50 text-blue-600 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">Compliant Authorization</h4>
                      <p className="text-xs text-slate-500">Protected routes guard frontend pages, while RLS guards the database.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Graphical Card Preview */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-blue-950 p-8 rounded-2xl text-white shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">Student Identity Standard</h4>
                      <p className="text-[11px] text-blue-300">Active Academic Session</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                    RLS Enabled
                  </span>
                </div>

                <div className="space-y-3 font-mono text-xs text-blue-200">
                  <div className="p-3 rounded-lg bg-black/30 border border-white/5 space-y-1">
                    <p className="text-slate-400 text-[10px] uppercase font-sans">Database Query</p>
                    <p className="text-emerald-400">SELECT * FROM public.profiles WHERE auth.uid() = id;</p>
                  </div>
                  <div className="p-3 rounded-lg bg-black/30 border border-white/5 space-y-1">
                    <p className="text-slate-400 text-[10px] uppercase font-sans">Auth Integrity</p>
                    <p className="text-blue-300">Session: JWT verified · Zero Plaintext Storage</p>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to={user ? "/dashboard" : "/register"}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold shadow-md transition-colors"
                  >
                    <span>{user ? "Open Dashboard" : "Get Started Today"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
