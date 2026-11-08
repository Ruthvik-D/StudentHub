import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ConfigAlert from './components/ConfigAlert'
import ProtectedRoute from './components/ProtectedRoute'
import PublicOnlyRoute from './components/PublicOnlyRoute'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'

function AppLayout() {
  const location = useLocation()
  const isDashboardOrProfile = ['/dashboard', '/profile'].includes(location.pathname)

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      <ConfigAlert />
      <Navbar />
      <div className="flex-1">
        <Routes>
          {/* Public Home Page */}
          <Route path="/" element={<Home />} />

          {/* Public Only Auth Pages (Redirect to dashboard if logged in) */}
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicOnlyRoute>
                <Register />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicOnlyRoute>
                <ForgotPassword />
              </PublicOnlyRoute>
            }
          />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected Student Portal Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Catch-all 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      {/* Hide bulky public footer on interactive dashboard views to maintain clean app layout */}
      {!isDashboardOrProfile && <Footer />}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout />
      </Router>
    </AuthProvider>
  )
}
