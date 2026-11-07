import React from 'react'
import { GraduationCap, Loader2 } from 'lucide-react'

export default function Loading({ text = 'Loading StudentHub...' }) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="relative flex items-center justify-center mb-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 shadow-sm animate-pulse">
          <GraduationCap className="w-8 h-8" />
        </div>
        <div className="absolute -inset-1 rounded-2xl border-2 border-blue-600 border-t-transparent animate-spin" />
      </div>
      <p className="text-sm font-medium text-slate-700 tracking-wide">{text}</p>
      <p className="text-xs text-slate-400 mt-1">Connecting to Student Services</p>
    </div>
  )
}
