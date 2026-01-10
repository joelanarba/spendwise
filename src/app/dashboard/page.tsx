import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import TransactionsList from '@/components/TransactionsList'
import SuccessToast from '@/components/SuccessToast'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ added?: string }>
}) {
  const supabase = await createClient()
  const params = await searchParams

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Get recent transactions
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('transaction_date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(10)

  const showSuccess = params.added === 'true'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Success Toast */}
      {showSuccess && <SuccessToast message="Transaction saved!" />}

      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-semibold text-white">SpendWise</span>
          </div>
          <form action="/auth/signout" method="post">
            <button 
              type="submit"
              className="text-slate-400 hover:text-white text-sm transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Welcome Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">
            {getGreeting()}{profile?.display_name ? `, ${profile.display_name}` : ''}!
          </h1>
          <p className="text-slate-400 text-sm">
            {transactions && transactions.length > 0 
              ? `You've logged ${transactions.length} expense${transactions.length > 1 ? 's' : ''} recently`
              : 'Start tracking your spending today'
            }
          </p>
        </div>

        {/* Quick Add CTA */}
        <Link 
          href="/add"
          className="block w-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-2xl p-5 hover:from-emerald-300 hover:to-cyan-300 transition-all shadow-lg shadow-emerald-400/20 mb-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div className="text-left">
              <div className="font-bold text-slate-900 text-lg">Add Transaction</div>
              <div className="text-slate-700 text-sm">Log what you spent today</div>
            </div>
          </div>
        </Link>

        {/* Import from SMS CTA */}
        <Link 
          href="/import-sms"
          className="block w-full bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-all mb-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-400/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div className="text-left flex-1">
              <div className="font-medium text-white">Import from SMS</div>
              <div className="text-slate-400 text-sm">Auto-detect from bank messages</div>
            </div>
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>

        {/* Recent Transactions */}
        {transactions && transactions.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Recent Expenses</h2>
              <Link href="/summary" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
                View Summary →
              </Link>
            </div>
            <TransactionsList transactions={transactions} />
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
              <svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-400 mb-2">No transactions yet</h3>
            <p className="text-slate-500 text-sm max-w-xs mx-auto">
              Add your first expense to start seeing insights about your spending.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}
