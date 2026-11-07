import React from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, ArrowLeft, Home, Search } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function NotFound() {
  const { user } = useAuth()

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
          <div className="w-20 h-20 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-sm">
            <Search className="w-10 h-10" />
          </div>
          <span className="absolute -bottom-1 -right-1 px-2.5 py-0.5 rounded-full bg-blue-600 text-white font-mono text-xs font-bold shadow">
            404
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Page Not Found
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            The page or student resource you are trying to reach does not exist or has been relocated within the portal.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to={user ? '/dashboard' : '/'}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all"
          >
            <Home className="w-4 h-4" />
            <span>{user ? 'Return to Dashboard' : 'Return to Home'}</span>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 shadow-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  )
}
