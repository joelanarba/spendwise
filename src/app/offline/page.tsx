'use client'

import Link from 'next/link'

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* Offline Icon */}
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center">
          <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-white mb-3">You're Offline</h1>
        <p className="text-slate-400 mb-8">
          It looks like you've lost your internet connection. Don't worry — your data is safe.
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-900 font-semibold hover:from-emerald-300 hover:to-cyan-300 transition-all"
          >
            Try Again
          </button>
          <Link 
            href="/dashboard"
            className="block w-full py-3 px-6 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-all"
          >
            Go to Dashboard
          </Link>
        </div>

        {/* Tip */}
        <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
          <p className="text-sm text-slate-400">
            <strong className="text-slate-300">Tip:</strong> Transactions you add while offline will sync automatically when you're back online.
          </p>
        </div>
      </div>
    </div>
  )
}
