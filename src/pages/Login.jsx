import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  GraduationCap,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Send,
  RefreshCw,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import FormInput from '../components/FormInput'

export default function Login() {
  const { signIn, resendVerificationEmail, isConfigured } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Location redirect destination if redirected by ProtectedRoute
  const from = location.state?.from?.pathname || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [authError, setAuthError] = useState('')

  // Resend verification email state
  const [isUnverifiedEmail, setIsUnverifiedEmail] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendSuccess, setResendSuccess] = useState('')
  const [resendError, setResendError] = useState('')
  const [resendCooldown, setResendCooldown] = useState(0)

  // Cooldown countdown timer
  useEffect(() => {
    let timer
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0))
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [resendCooldown])

  const validate = () => {
    const newErrors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!email.trim()) {
      newErrors.email = 'Email address is required.'
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address.'
    }

    if (!password) {
      newErrors.password = 'Password is required.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setAuthError('')
    setIsUnverifiedEmail(false)
    setResendSuccess('')
    setResendError('')

    if (!validate()) return

    try {
      setLoading(true)
      await signIn({ email, password, rememberMe })
      navigate(from, { replace: true })
    } catch (err) {
      console.error('Sign in error:', err)
      const msg = err.message || 'Failed to sign in.'
      if (msg.includes('Invalid login credentials')) {
        setAuthError('Invalid email or password. Please verify your credentials.')
      } else if (msg.includes('Email not confirmed')) {
        setAuthError('Your email address has not been confirmed yet. Please verify your email before logging in.')
        setIsUnverifiedEmail(true)
      } else {
        setAuthError(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResendVerification = async () => {
    if (!email.trim()) {
      setResendError('Please enter your email address to receive the verification link.')
      return
    }

    if (resendCooldown > 0 || resendLoading) return

    setResendError('')
    setResendSuccess('')

    try {
      setResendLoading(true)
      await resendVerificationEmail(email)
      setResendSuccess(`Verification email dispatched to ${email}. Please check your inbox and spam folder.`)
      setResendCooldown(60) // 60-second cooldown to prevent spam / rate-limiting
    } catch (err) {
      console.error('Resend verification failed:', err)
      const msg = err.message || 'Unable to resend verification email.'
      if (msg.toLowerCase().includes('rate limit') || msg.toLowerCase().includes('security purposes')) {
        setResendError('Rate limit exceeded: You can request a verification email only once per minute. Please wait.')
        setResendCooldown(60)
      } else {
        setResendError(msg)
      }
    } finally {
      setResendLoading(false)
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
            Sign In to StudentHub
          </h2>
          <p className="text-sm text-slate-500">
            Enter your student credentials to access your dashboard.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm">
          {/* Main Error Alert */}
          {authError && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="space-y-1 w-full">
                <p className="font-semibold text-red-900">Authentication Error</p>
                <p className="text-xs text-red-700 leading-relaxed">{authError}</p>

                {/* Option to resend verification link when email is unverified */}
                {isUnverifiedEmail && (
                  <div className="mt-3 pt-3 border-t border-red-200/80 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={handleResendVerification}
                      disabled={resendLoading || resendCooldown > 0}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 disabled:text-slate-400 disabled:cursor-not-allowed self-start transition-colors"
                    >
                      {resendLoading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Dispatching verification link...</span>
                        </>
                      ) : resendCooldown > 0 ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-400" />
                          <span>Resend available in {resendCooldown}s</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Resend verification email to this address</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Resend Status Notifications */}
          {resendSuccess && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed font-medium">{resendSuccess}</p>
            </div>
          )}

          {resendError && (
            <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed font-medium">{resendError}</p>
            </div>
          )}

          {!isConfigured && (
            <div className="mb-6 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Supabase connection is not yet configured. Please configure your <code className="font-mono font-semibold">.env</code> file.
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              label="Student Email"
              id="email"
              type="email"
              placeholder="student@university.edu"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errors.email) setErrors((prev) => ({ ...prev, email: '' }))
                if (authError) setAuthError('')
                if (resendSuccess) setResendSuccess('')
                if (resendError) setResendError('')
              }}
              error={errors.email}
              icon={Mail}
              required
              autoComplete="email"
              disabled={loading}
            />

            <FormInput
              label="Password"
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (errors.password) setErrors((prev) => ({ ...prev, password: '' }))
                if (authError) setAuthError('')
              }}
              error={errors.password}
              icon={Lock}
              required
              autoComplete="current-password"
              disabled={loading}
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span>Remember this session</span>
              </label>

              <Link
                to="/forgot-password"
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm hover:shadow transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
            Don't have a student account yet?{' '}
            <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700 underline-offset-2 hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
