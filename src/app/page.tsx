import Link from 'next/link'
import { QuickAddIcon, InsightsIcon, BudgetsIcon } from '@/lib/categories'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg text-center">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-400 to-cyan-400 mb-8 shadow-2xl shadow-emerald-400/30">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            See where your money{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              really goes
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg text-slate-400 mb-8 max-w-md mx-auto">
            Track spending in seconds. Get weekly insights. Make better decisions with your money.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-900 font-bold text-lg hover:from-emerald-300 hover:to-cyan-300 transition-all shadow-lg shadow-emerald-400/30"
            >
              Get Started Free
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 rounded-2xl border border-white/20 text-white font-medium hover:bg-white/10 transition-all"
            >
              I have an account
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex items-center justify-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Private and secure
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Takes 10 seconds
            </div>
          </div>
        </div>
      </main>

      {/* Features Preview */}
      <section className="px-4 pb-16">
        <div className="max-w-lg mx-auto grid grid-cols-3 gap-4">
          <div className="bg-white/5 backdrop-blur rounded-2xl p-4 text-center border border-white/10">
            <div className="w-8 h-8 mx-auto mb-2 text-emerald-400">
              <QuickAddIcon className="w-8 h-8" />
            </div>
            <div className="text-white font-medium text-sm">Quick Add</div>
            <div className="text-slate-500 text-xs mt-1">Log in 5 sec</div>
          </div>
          <div className="bg-white/5 backdrop-blur rounded-2xl p-4 text-center border border-white/10">
            <div className="w-8 h-8 mx-auto mb-2 text-emerald-400">
              <InsightsIcon className="w-8 h-8" />
            </div>
            <div className="text-white font-medium text-sm">Insights</div>
            <div className="text-slate-500 text-xs mt-1">Weekly trends</div>
          </div>
          <div className="bg-white/5 backdrop-blur rounded-2xl p-4 text-center border border-white/10">
            <div className="w-8 h-8 mx-auto mb-2 text-emerald-400">
              <BudgetsIcon className="w-8 h-8" />
            </div>
            <div className="text-white font-medium text-sm">Budgets</div>
            <div className="text-slate-500 text-xs mt-1">Stay on track</div>
          </div>
        </div>
      </section>
    </div>
  )
}
