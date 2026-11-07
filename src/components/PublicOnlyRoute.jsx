import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Loading from './Loading'

export default function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loading text="Loading session..." />
      </div>
    )
  }

  // Redirect authenticated students away from login/register to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return children ? children : <Outlet />
}
