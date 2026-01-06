import { formatDistanceToNow } from '@/lib/utils'

type Transaction = {
  id: string
  amount: number
  category: string
  note: string | null
  transaction_date: string
  created_at: string
}

const CATEGORY_META: Record<string, { icon: string; label: string }> = {
  food: { icon: '🍔', label: 'Food' },
  transport: { icon: '🚗', label: 'Transport' },
  bills: { icon: '📄', label: 'Bills' },
  shopping: { icon: '🛍️', label: 'Shopping' },
  entertainment: { icon: '🎬', label: 'Fun' },
  health: { icon: '💊', label: 'Health' },
  other: { icon: '📦', label: 'Other' },
}

export default function TransactionsList({ transactions }: { transactions: Transaction[] }) {
  // Group transactions by date
  const grouped = transactions.reduce((acc, tx) => {
    const date = tx.transaction_date
    if (!acc[date]) acc[date] = []
    acc[date].push(tx)
    return acc
  }, {} as Record<string, Transaction[]>)

  const sortedDates = Object.keys(grouped).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  )

  return (
    <div className="space-y-6">
      {sortedDates.map((date) => (
        <div key={date}>
          <h3 className="text-sm text-slate-400 mb-3 font-medium">
            {formatDateLabel(date)}
          </h3>
          <div className="space-y-2">
            {grouped[date].map((tx) => (
              <div 
                key={tx.id}
                className="bg-white/5 rounded-xl p-4 flex items-center gap-4 border border-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="text-2xl">
                  {CATEGORY_META[tx.category]?.icon || '📦'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium">
                    {CATEGORY_META[tx.category]?.label || tx.category}
                  </div>
                  {tx.note && (
                    <div className="text-slate-400 text-sm truncate">
                      {tx.note}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold">
                    ${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-slate-500 text-xs">
                    {formatDistanceToNow(new Date(tx.created_at))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.getTime() === today.getTime()) return 'Today'
  if (date.getTime() === yesterday.getTime()) return 'Yesterday'
  
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  })
}
