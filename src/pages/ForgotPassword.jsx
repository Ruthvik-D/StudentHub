import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  GraduationCap,
  Mail,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import FormInput from '../components/FormInput'

export default function ForgotPassword() {
  const { resetPassword, isConfigured } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.')
      return
    }

    try {
      setLoading(true)
      await resetPassword(email)
      setSuccess(true)
    } catch (err) {
      console.error('Password reset failed:', err)
      setError(err.message || 'Unable to send password reset email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-blue-600 text-white items-center justify-center shadow-lg shadow-blue-500/20 mb-2">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Reset Portal Password
          </h2>
          <p className="text-sm text-slate-500">
            Enter your student email and we'll send you a password recovery link.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm">
          {success ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Recovery Link Dispatched</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                If an account exists for <span className="font-semibold text-slate-800">{email}</span>, a secure password recovery link has been dispatched. Click the link in the email to set your new password.
              </p>
              <div className="pt-4">
                <Link
                  to="/login"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Return to Login
                </Link>
              </div>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold text-red-900">Reset Error</p>
                    <p className="text-xs text-red-700 leading-relaxed">{error}</p>
                  </div>
                </div>
              )}

              {!isConfigured && (
                <div className="mb-6 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Supabase credentials missing. Check your <code className="font-mono font-semibold">.env</code>.
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <FormInput
                  label="Registered Student Email"
                  id="email"
                  type="email"
                  placeholder="student@university.edu"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (error) setError('')
                  }}
                  icon={Mail}
                  required
                  autoComplete="email"
                  disabled={loading}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Recovery Link...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Recovery Link</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
