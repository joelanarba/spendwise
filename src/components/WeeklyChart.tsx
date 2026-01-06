'use client'

type Transaction = {
  id: string
  amount: number
  transaction_date: string
}

type Props = {
  transactions: Transaction[]
  weekStart: Date
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function WeeklyChart({ transactions, weekStart }: Props) {
  // Calculate daily totals for the week
  const dailyTotals: number[] = Array(7).fill(0)
  
  transactions.forEach(tx => {
    const txDate = new Date(tx.transaction_date + 'T00:00:00')
    const dayIndex = txDate.getDay()
    dailyTotals[dayIndex] += Number(tx.amount)
  })

  const maxAmount = Math.max(...dailyTotals, 1) // Avoid division by zero
  const today = new Date().getDay()

  // Generate dates for each day
  const dates = DAY_LABELS.map((_, i) => {
    const date = new Date(weekStart)
    date.setDate(weekStart.getDate() + i)
    return date.getDate()
  })

  return (
    <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
      <div className="flex items-end justify-between gap-2 h-32 mb-2">
        {dailyTotals.map((amount, index) => {
          const height = maxAmount > 0 ? (amount / maxAmount) * 100 : 0
          const isToday = index === today

          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              {/* Bar */}
              <div className="w-full flex flex-col items-center justify-end h-full">
                {amount > 0 && (
                  <span className="text-xs text-slate-400 mb-1">
                    ${amount >= 1000 ? (amount / 1000).toFixed(1) + 'k' : amount.toFixed(0)}
                  </span>
                )}
                <div 
                  className={`w-full max-w-8 rounded-t-lg transition-all duration-300 ${
                    isToday 
                      ? 'bg-gradient-to-t from-emerald-500 to-cyan-400' 
                      : amount > 0 ? 'bg-white/30' : 'bg-white/10'
                  }`}
                  style={{ height: `${Math.max(height, amount > 0 ? 10 : 4)}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Day labels */}
      <div className="flex justify-between gap-2">
        {DAY_LABELS.map((day, index) => (
          <div 
            key={day} 
            className={`flex-1 text-center text-xs ${
              index === today ? 'text-emerald-400 font-medium' : 'text-slate-500'
            }`}
          >
            <div>{day}</div>
            <div className="text-slate-600">{dates[index]}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
