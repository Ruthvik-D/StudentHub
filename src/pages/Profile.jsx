import React, { useState, useEffect } from 'react'
import {
  User,
  Mail,
  Building2,
  Calendar,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  Clock,
  ShieldCheck,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Sidebar'
import FormInput from '../components/FormInput'
import Loading from '../components/Loading'

const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Information Technology',
  'Data Science & AI',
  'Electrical & Electronics Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Business Administration (MBA / BBA)',
  'Biotechnology & Bioinformatics',
  'Liberal Arts & Social Sciences',
]

export default function Profile() {
  const { user, profile, updateProfile, profileLoading } = useAuth()

  const [fullName, setFullName] = useState('')
  const [department, setDepartment] = useState('')
  const [customDepartment, setCustomDepartment] = useState('')
  const [isCustomDept, setIsCustomDept] = useState(false)

  const [saving, setSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [validationError, setValidationError] = useState('')

  useEffect(() => {
    if (profile || user) {
      const name = profile?.full_name || user?.user_metadata?.full_name || ''
      setFullName(name)

      const dept = profile?.department || user?.user_metadata?.department || ''
      if (DEPARTMENTS.includes(dept)) {
        setDepartment(dept)
        setIsCustomDept(false)
      } else if (dept) {
        setDepartment('Other')
        setCustomDepartment(dept)
        setIsCustomDept(true)
      } else {
        setDepartment(DEPARTMENTS[0])
        setIsCustomDept(false)
      }
    }
  }, [profile, user])

  const handleDeptSelectChange = (e) => {
    const val = e.target.value
    setDepartment(val)
    if (val === 'Other') {
      setIsCustomDept(true)
    } else {
      setIsCustomDept(false)
    }
    if (successMessage) setSuccessMessage('')
    if (errorMessage) setErrorMessage('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccessMessage('')
    setErrorMessage('')
    setValidationError('')

    if (!fullName.trim()) {
      setValidationError('Full name cannot be blank.')
      return
    }

    const finalDept = isCustomDept
      ? customDepartment.trim() || 'General Studies'
      : department

    try {
      setSaving(true)
      await updateProfile({
        fullName: fullName.trim(),
        department: finalDept,
      })
      setSuccessMessage('Student profile successfully updated and synchronized to Supabase.')
    } catch (err) {
      console.error('Failed to update profile:', err)
      setErrorMessage(err.message || 'Unable to update profile. Please verify your connection.')
    } finally {
      setSaving(false)
    }
  }

  if (profileLoading && !profile) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loading text="Retrieving profile details..." />
      </div>
    )
  }

  const createdAtFormatted = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Unknown'

  const updatedAtFormatted = profile?.updated_at
    ? new Date(profile.updated_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Never modified'

  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('') || 'S'

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex flex-col lg:flex-row">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6">
        {/* Page Title */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Student Profile Settings
          </h1>
          <p className="text-sm text-slate-500">
            View verified enrollment details and update your academic identity.
          </p>
        </div>

        {/* Notifications */}
        {successMessage && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start gap-3 shadow-sm transition-all">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-semibold text-emerald-900">Changes Saved</p>
              <p className="text-xs text-emerald-700 leading-relaxed">{successMessage}</p>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3 shadow-sm transition-all">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-semibold text-red-900">Update Failed</p>
              <p className="text-xs text-red-700 leading-relaxed">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Profile Identity Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-2xl shadow-md shrink-0">
            {initials}
          </div>
          <div className="text-center sm:text-left space-y-1 flex-1">
            <h2 className="text-xl font-bold text-slate-900">{fullName || 'Student'}</h2>
            <p className="text-sm text-blue-600 font-medium">
              {isCustomDept ? customDepartment || 'Custom Department' : department}
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Joined {createdAtFormatted}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Verified Student
              </span>
            </div>
          </div>
        </div>

        {/* Profile Update Form */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
            Edit Student Details
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <FormInput
              label="Student Full Name"
              id="fullName"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value)
                if (validationError) setValidationError('')
                if (successMessage) setSuccessMessage('')
              }}
              error={validationError}
              icon={User}
              required
              disabled={saving}
              helperText="This name will appear on official student portal records."
            />

            {/* Read-only Email Field */}
            <div>
              <label htmlFor="studentEmail" className="block text-sm font-medium text-slate-700 mb-1.5">
                Authenticated University Email
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="studentEmail"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  readOnly
                  className="block w-full rounded-lg border border-slate-200 pl-10 pr-10 py-2.5 text-slate-500 bg-slate-100/90 text-sm cursor-not-allowed select-all"
                />
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-1.5 text-xs text-slate-500 flex items-center gap-1">
                <Lock className="w-3 h-3 text-slate-400 inline" />
                Email is tied to your primary Supabase login account and cannot be modified directly here.
              </p>
            </div>

            {/* Department Selection */}
            <div>
              <label htmlFor="deptSelect" className="block text-sm font-medium text-slate-700 mb-1.5">
                Academic Department <span className="text-red-500">*</span>
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Building2 className="h-5 w-5" />
                </div>
                <select
                  id="deptSelect"
                  value={department}
                  onChange={handleDeptSelectChange}
                  disabled={saving}
                  className="block w-full rounded-lg border border-slate-300 pl-10 pr-4 py-2.5 text-slate-900 text-sm bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-colors"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                  <option value="Other">Other / Custom Department</option>
                </select>
              </div>
            </div>

            {isCustomDept && (
              <FormInput
                label="Custom Department Name"
                id="customDept"
                placeholder="e.g. Cognitive Systems"
                value={customDepartment}
                onChange={(e) => {
                  setCustomDepartment(e.target.value)
                  if (successMessage) setSuccessMessage('')
                }}
                disabled={saving}
                required
              />
            )}

            {/* Submit Action */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 py-2.5 px-6 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-70 shadow-sm transition-all"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving to Database...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Database Metadata Audit Box */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Database Record Audit
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block font-medium">Record Created</span>
              <span className="text-slate-800 font-semibold mt-0.5 block">{createdAtFormatted}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block font-medium">Last Modified</span>
              <span className="text-slate-800 font-semibold mt-0.5 block">{updatedAtFormatted}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block font-medium">PostgreSQL Table</span>
              <span className="text-blue-700 font-mono font-semibold mt-0.5 block">public.profiles</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
