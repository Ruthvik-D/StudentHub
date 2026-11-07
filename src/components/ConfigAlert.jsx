import React from 'react'
import { AlertTriangle, KeyRound, ExternalLink } from 'lucide-react'
import { isSupabaseConfigured } from '../lib/supabase'

export default function ConfigAlert() {
  if (isSupabaseConfigured) return null

  return (
    <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-3 text-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="p-1.5 bg-amber-100 rounded-lg text-amber-800 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </span>
          <div>
            <p className="font-semibold text-amber-950">Supabase Connection Required</p>
            <p className="text-xs text-amber-800">
              Add your <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-amber-900">VITE_SUPABASE_URL</code> and{' '}
              <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-amber-900">VITE_SUPABASE_PUBLISHABLE_KEY</code> in{' '}
              <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-amber-900">.env</code> to activate live authentication.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-end md:self-auto">
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-900 hover:text-amber-950 bg-amber-100/80 hover:bg-amber-100 px-2.5 py-1.5 rounded-md border border-amber-300 transition-colors"
          >
            <KeyRound className="w-3.5 h-3.5" />
            Supabase Dashboard
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </a>
        </div>
      </div>
    </div>
  )
}
