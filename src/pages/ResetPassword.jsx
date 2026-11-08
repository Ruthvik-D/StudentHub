import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  GraduationCap,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  KeyRound,
  ArrowLeft,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import FormInput from '../components/FormInput'

export default function ResetPassword() {
  const { session, user, isPasswordRecovery, updatePassword, signOut, isConfigured } = useAuth()
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [apiError, setApiError] = useState('')

  // Check if we have an active recovery session or user session from the recovery link
  const hasRecoveryAccess = Boolean(session || user || isPasswordRecovery)

  const validate = () => {
    const newErrors = {}

    if (!password) {
      newErrors.password = 'New password is required.'
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.'
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm your new password.'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError('')

    if (!validate()) return

    try {
      setLoading(true)
      await updatePassword(password)
      setSuccess(true)
      // Sign out to clear temporary recovery session so user logs in cleanly with new password
      try {
        await signOut()
      } catch (signOutErr) {
        console.warn('Post-reset signout notice:', signOutErr)
      }
    } catch (err) {
      console.error('Password reset update failed:', err)
      setApiError(err.message || 'Failed to update password. Your recovery link may have expired.')
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
            <KeyRound className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Create New Password
          </h2>
          <p className="text-sm text-slate-500">
            Set a new, secure password for your StudentHub account.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm">
          {success ? (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Password Reset Complete</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Your password has been successfully updated. You can now sign in with your new credentials.
              </p>
              <div className="pt-4">
                <Link
                  to="/login"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors"
                >
                  Proceed to Sign In
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : !hasRecoveryAccess ? (
            <div className="space-y-4 text-center">
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm flex items-start gap-3 text-left">
                <AlertCircle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-amber-950">Recovery Link Required</p>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    To reset your password, you must open the password recovery link sent to your student email. If your link has expired or is invalid, please request a new one.
                  </p>
                </div>
              </div>
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  to="/forgot-password"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  Request New Reset Link
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 py-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Return to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <>
              {apiError && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold text-red-900">Reset Error</p>
                    <p className="text-xs text-red-700 leading-relaxed">{apiError}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <FormInput
                  label="New Password"
                  id="password"
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (errors.password) setErrors((prev) => ({ ...prev, password: '' }))
                    if (apiError) setApiError('')
                  }}
                  error={errors.password}
                  icon={Lock}
                  required
                  autoComplete="new-password"
                  disabled={loading}
                  helperText="Must be at least 8 characters long."
                />

                <FormInput
                  label="Confirm New Password"
                  id="confirmPassword"
                  type="password"
                  placeholder="Repeat your new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }))
                    if (apiError) setApiError('')
                  }}
                  error={errors.confirmPassword}
                  icon={Lock}
                  required
                  autoComplete="new-password"
                  disabled={loading}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm hover:shadow transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <span>Save New Password</span>
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
