import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatDateForDB, getCurrentWeekRange, getPreviousWeekRange } from '@/lib/utils'
import WeeklyChart from '@/components/WeeklyChart'
import CategoryBreakdown from '@/components/CategoryBreakdown'

type CategoryTotals = Record<string, number>

export default async function SummaryPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get current week date range
  const { start: currentStart, end: currentEnd } = getCurrentWeekRange()
  const { start: prevStart, end: prevEnd } = getPreviousWeekRange()

  // Fetch current week transactions
  const { data: currentWeekTx } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .gte('transaction_date', formatDateForDB(currentStart))
    .lte('transaction_date', formatDateForDB(currentEnd))
    .order('transaction_date', { ascending: false })

  // Fetch previous week transactions
  const { data: prevWeekTx } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .gte('transaction_date', formatDateForDB(prevStart))
    .lte('transaction_date', formatDateForDB(prevEnd))

  // Calculate totals
  const currentTotal = currentWeekTx?.reduce((sum, tx) => sum + Number(tx.amount), 0) || 0
  const prevTotal = prevWeekTx?.reduce((sum, tx) => sum + Number(tx.amount), 0) || 0

  // Calculate by category
  const currentByCategory = calculateCategoryTotals(currentWeekTx || [])
  const prevByCategory = calculateCategoryTotals(prevWeekTx || [])

  // Calculate week-over-week change
  const weekChange = prevTotal > 0 ? ((currentTotal - prevTotal) / prevTotal) * 100 : 0
  const weekChangeDirection = weekChange > 0 ? 'up' : weekChange < 0 ? 'down' : 'same'

  // Format date range for display
  const weekRangeLabel = `${currentStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${currentEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <Link 
            href="/dashboard" 
            className="text-slate-400 hover:text-white transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
          <h1 className="text-white font-semibold">Weekly Summary</h1>
          <div className="w-12" />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Week Selector */}
        <div className="text-center mb-6">
          <p className="text-slate-400 text-sm">This Week</p>
          <p className="text-white font-medium">{weekRangeLabel}</p>
        </div>

        {/* Total Card */}
        <div className="bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-3xl p-6 border border-emerald-400/30 mb-6">
          <p className="text-emerald-300 text-sm mb-1">Total Spent</p>
          <p className="text-4xl font-bold text-white mb-2">
            ${currentTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          
          {/* Week-over-week comparison */}
          {prevTotal > 0 && (
            <div className={`flex items-center gap-1 text-sm ${
              weekChangeDirection === 'up' ? 'text-red-400' : 
              weekChangeDirection === 'down' ? 'text-emerald-400' : 'text-slate-400'
            }`}>
              {weekChangeDirection === 'up' && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              )}
              {weekChangeDirection === 'down' && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
              <span>
                {weekChangeDirection === 'same' 
                  ? 'Same as last week'
                  : `${Math.abs(weekChange).toFixed(0)}% ${weekChangeDirection === 'up' ? 'more' : 'less'} than last week`
                }
              </span>
            </div>
          )}
          
          {prevTotal === 0 && currentTotal > 0 && (
            <p className="text-slate-400 text-sm">First week tracking!</p>
          )}
        </div>

        {/* Category Breakdown */}
        {Object.keys(currentByCategory).length > 0 ? (
          <>
            <h2 className="text-lg font-semibold text-white mb-4">By Category</h2>
            <CategoryBreakdown 
              current={currentByCategory} 
              previous={prevByCategory}
              total={currentTotal}
            />

            {/* Daily Chart */}
            <h2 className="text-lg font-semibold text-white mt-8 mb-4">Daily Spending</h2>
            <WeeklyChart 
              transactions={currentWeekTx || []} 
              weekStart={currentStart}
            />
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
              <svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-400 mb-2">No data this week</h3>
            <p className="text-slate-500 text-sm max-w-xs mx-auto mb-6">
              Add some transactions to see your spending breakdown.
            </p>
            <Link
              href="/add"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-400 text-slate-900 font-semibold hover:bg-emerald-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Transaction
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}

function calculateCategoryTotals(transactions: { category: string; amount: number }[]): CategoryTotals {
  return transactions.reduce((acc, tx) => {
    acc[tx.category] = (acc[tx.category] || 0) + Number(tx.amount)
    return acc
  }, {} as CategoryTotals)
}
