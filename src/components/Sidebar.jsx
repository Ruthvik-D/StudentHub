import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, User, LogOut, Shield, ChevronRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Sidebar() {
  const location = useLocation()
  const { user, profile, signOut } = useAuth()

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student'
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(n => n[0].toUpperCase())
    .join('') || 'S'

  const links = [
    {
      name: 'Overview Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      description: 'Activity & summary',
    },
    {
      name: 'Student Profile',
      path: '/profile',
      icon: User,
      description: 'Department & personal info',
    },
  ]

  return (
    <aside className="w-full lg:w-64 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 lg:min-h-[calc(100vh-4rem)] p-4 lg:p-6 flex flex-col justify-between">
      <div className="space-y-6">
        {/* User Quick Info */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-base shadow-sm">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-bold text-slate-900 truncate" title={displayName}>
                {displayName}
              </h2>
              <p className="text-xs text-blue-600 font-medium truncate">
                {profile?.department || 'Department Unassigned'}
              </p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
            <span>Status</span>
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Active Student
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Portal Menu
          </p>
          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon
              const active = location.pathname === link.path
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-500'}`} />
                    <span>{link.name}</span>
                  </div>
                  {active && <ChevronRight className="w-4 h-4 text-white/80" />}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Security & Sign Out footer */}
      <div className="mt-6 pt-6 border-t border-slate-200 space-y-3">
        <div className="px-3 py-2 bg-blue-50/70 border border-blue-100 rounded-lg text-[11px] text-blue-900 flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-700 shrink-0" />
          <span>Encrypted Session Active</span>
        </div>

        <button
          onClick={() => signOut()}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          End Session (Log Out)
        </button>
      </div>
    </aside>
  )
}
