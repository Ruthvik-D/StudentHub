import React from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, ShieldCheck, Heart, ExternalLink } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">
                Student<span className="text-blue-400">Hub</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              The official centralized student portal platform designed for streamlined identity,
              department enrollment verification, and secure academic workflow management.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Protected by Supabase Row Level Security (RLS)</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Portal Access
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Student Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors">
                  New Student Registration
                </Link>
              </li>
              <li>
                <Link to="/forgot-password" className="hover:text-white transition-colors">
                  Password Recovery
                </Link>
              </li>
            </ul>
          </div>

          {/* Academic Services */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Student Resources
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Academic Calendar</li>
              <li>Department Advising</li>
              <li>Campus IT Services</li>
              <li>Privacy & Terms</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} StudentHub Platform. Developed for Modern Higher Education.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Powered by React, Tailwind CSS & Supabase</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
