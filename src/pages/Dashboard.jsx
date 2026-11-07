import React from 'react'
import { Link } from 'react-router-dom'
import {
  GraduationCap,
  User,
  Building2,
  Mail,
  Calendar,
  ShieldCheck,
  Clock,
  ArrowRight,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Key,
  Activity,
  Layers,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Sidebar'
import Loading from '../components/Loading'

export default function Dashboard() {
  const { user, profile, profileLoading } = useAuth()

  if (profileLoading && !profile) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loading text="Loading student records..." />
      </div>
    )
  }

  const fullName = profile?.full_name || user?.user_metadata?.full_name || 'Student'
  const department = profile?.department || user?.user_metadata?.department || 'Unassigned'
  const email = user?.email || 'N/A'

  // Format real timestamps
  const createdAtFormatted = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Recently'

  const lastSignInFormatted = user?.last_sign_in_at
    ? new Date(user.last_sign_in_at).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Current Session'

  // Profile completion based purely on actual database fields
  const fields = [
    { name: 'Full Name', completed: Boolean(profile?.full_name?.trim()) },
    { name: 'Authenticated Email', completed: Boolean(user?.email) },
    { name: 'Academic Department', completed: Boolean(profile?.department?.trim() && profile.department !== 'Unassigned') },
  ]
  const completedFieldsCount = fields.filter((f) => f.completed).length
  const completionPercentage = Math.round((completedFieldsCount / fields.length) * 100)

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Welcome Header */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Academic Session
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, {fullName}! 👋
            </h1>
            <p className="text-sm text-slate-500">
              Department of <span className="font-semibold text-slate-700">{department}</span> · Enrolled since {createdAtFormatted}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all"
            >
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Profile Completion Meter */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Profile Completion Status</h2>
              <p className="text-xs text-slate-500">
                Calculated strictly from your confirmed account credentials and department data.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-blue-600">{completionPercentage}%</span>
              <span className="text-xs text-slate-400 font-medium">({completedFieldsCount} of {fields.length} completed)</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-2.5 rounded-full transition-all duration-500 ${
                completionPercentage === 100 ? 'bg-emerald-500' : 'bg-blue-600'
              }`}
              style={{ width: `${completionPercentage}%` }}
            />
          </div>

          {/* Checklist items */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {fields.map((f) => (
              <div
                key={f.name}
                className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                  f.completed
                    ? 'bg-emerald-50/60 border-emerald-200 text-emerald-800'
                    : 'bg-amber-50/60 border-amber-200 text-amber-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  {f.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  )}
                  <span className="font-semibold">{f.name}</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  {f.completed ? 'Confirmed' : 'Pending'}
                </span>
              </div>
            ))}
          </div>

          {completionPercentage < 100 && (
            <div className="mt-4 p-3 bg-blue-50/80 rounded-xl border border-blue-100 flex items-center justify-between text-xs text-blue-900">
              <span>Complete your department designation to finish setting up your student profile.</span>
              <Link to="/profile" className="font-bold underline ml-2 shrink-0">
                Update Now
              </Link>
            </div>
          )}
        </div>

        {/* Student Information Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Academic Identity */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Academic Identity</h3>
                <p className="text-[11px] text-slate-500">Student Profile Record</p>
              </div>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Full Name</span>
                <span className="text-slate-900 font-semibold text-sm">{fullName}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Department</span>
                <span className="text-slate-900 font-semibold">{department}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Student UUID</span>
                <span className="text-slate-600 font-mono text-[11px] break-all">{user?.id}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Security & Authentication */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Security & Access</h3>
                <p className="text-[11px] text-slate-500">Authenticated Session</p>
              </div>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Primary Email</span>
                <span className="text-slate-900 font-semibold truncate block">{email}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Access Provider</span>
                <span className="text-emerald-700 font-semibold inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Supabase Auth (Encrypted)
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Data Protection</span>
                <span className="text-blue-700 font-semibold">Row Level Security (RLS)</span>
              </div>
            </div>
          </div>

          {/* Card 3: Account Timestamps */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Account Timestamps</h3>
                <p className="text-[11px] text-slate-500">Real System Activity</p>
              </div>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Registration Date</span>
                <span className="text-slate-900 font-semibold">{createdAtFormatted}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Last Successful Login</span>
                <span className="text-slate-900 font-semibold">{lastSignInFormatted}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Session Persistence</span>
                <span className="text-emerald-600 font-semibold">Active & Saved in Local Storage</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Navigation Cards */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-4">Quick Navigation</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/profile"
              className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-blue-100 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                    Manage Student Profile
                  </h4>
                  <p className="text-xs text-slate-500">Update full name and academic department.</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
            </Link>

            <Link
              to="/"
              className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-slate-100 text-slate-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                    Institutional Portal Home
                  </h4>
                  <p className="text-xs text-slate-500">Review announcements and features.</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
