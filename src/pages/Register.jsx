import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  GraduationCap,
  User,
  Mail,
  Lock,
  Building2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Loader2,
  ShieldCheck,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import FormInput from '../components/FormInput'

const POPULAR_DEPARTMENTS = [
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

export default function Register() {
  const { signUp, isConfigured } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    department: 'Computer Science & Engineering',
    customDepartment: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [supabaseError, setSupabaseError] = useState('')
  const [emailConfirmMessage, setEmailConfirmMessage] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    // Clear validation error on type
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
    if (supabaseError) setSupabaseError('')
  }

  const validate = () => {
    const newErrors = {}

    // Full name
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required.'
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters.'
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.'
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid academic or personal email address.'
    }

    // Password
    if (!formData.password) {
      newErrors.password = 'Password is required.'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.'
    }

    // Confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm your password.'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.'
    }

    // Terms
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the student portal terms.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSupabaseError('')

    if (!validate()) return

    const selectedDept =
      formData.department === 'Other'
        ? formData.customDepartment.trim() || 'General Studies'
        : formData.department

    try {
      setLoading(true)
      const data = await signUp({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        department: selectedDept,
      })

      // If user requires email verification:
      // In Supabase, if email confirmation is turned on, data.session is null and data.user.identities has user or identities is empty
      if (data?.user && !data?.session) {
        setEmailConfirmMessage(true)
      } else {
        // Direct session created (auto-confirm enabled)
        navigate('/dashboard')
      }
    } catch (err) {
      console.error('Registration failed:', err)
      setSupabaseError(err.message || 'Unable to register student account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-blue-600 text-white items-center justify-center shadow-lg shadow-blue-500/20 mb-2">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Register Student Account
          </h2>
          <p className="text-sm text-slate-500">
            Join StudentHub to access your profile, courses, and department records.
          </p>
        </div>

        {/* Confirmation State */}
        {emailConfirmMessage ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-md text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
              <Mail className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Verification Email Sent</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              We have sent an authentication link to{' '}
              <span className="font-semibold text-slate-800">{formData.email}</span>.
              Please check your inbox to confirm your registration.
            </p>
            <div className="pt-4">
              <Link
                to="/login"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors"
              >
                Proceed to Login
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* Registration Form Card */
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm">
            {supabaseError && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-red-900">Registration Notice</p>
                  <p className="text-xs text-red-700 leading-relaxed">{supabaseError}</p>
                </div>
              </div>
            )}

            {!isConfigured && (
              <div className="mb-6 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Supabase environment credentials not yet detected in <code className="font-mono font-semibold">.env</code>.
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <FormInput
                label="Full Name"
                id="fullName"
                placeholder="e.g. Jane Doe"
                value={formData.fullName}
                onChange={handleChange}
                error={errors.fullName}
                icon={User}
                required
                autoComplete="name"
                disabled={loading}
              />

              {/* Email */}
              <FormInput
                label="University or Personal Email"
                id="email"
                type="email"
                placeholder="student@university.edu"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                icon={Mail}
                required
                autoComplete="email"
                disabled={loading}
              />

              {/* Department */}
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Academic Department <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    disabled={loading}
                    className="block w-full rounded-lg border border-slate-300 pl-10 pr-4 py-2.5 text-slate-900 text-sm bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-colors"
                  >
                    {POPULAR_DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                    <option value="Other">Other / Custom Department</option>
                  </select>
                </div>
              </div>

              {formData.department === 'Other' && (
                <FormInput
                  label="Specify Department"
                  id="customDepartment"
                  placeholder="e.g. Applied Physics"
                  value={formData.customDepartment}
                  onChange={handleChange}
                  disabled={loading}
                />
              )}

              {/* Password */}
              <FormInput
                label="Password"
                id="password"
                type="password"
                placeholder="Minimum 8 characters"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                icon={Lock}
                required
                autoComplete="new-password"
                disabled={loading}
                helperText="Must be at least 8 characters long."
              />

              {/* Confirm Password */}
              <FormInput
                label="Confirm Password"
                id="confirmPassword"
                type="password"
                placeholder="Repeat your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                icon={Lock}
                required
                autoComplete="new-password"
                disabled={loading}
              />

              {/* Terms Checkbox */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    disabled={loading}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs text-slate-600 leading-normal">
                    I agree to the <span className="text-blue-600 font-medium">Terms of Academic Portal Use</span> and
                    acknowledge my data will be securely processed under Supabase Row Level Security.
                  </span>
                </label>
                {errors.agreeTerms && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{errors.agreeTerms}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm hover:shadow transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating Student Account...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Registration</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
              Already have a student account?{' '}
              <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700 underline-offset-2 hover:underline">
                Sign in here
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
