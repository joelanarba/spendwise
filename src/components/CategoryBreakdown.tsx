import { getCategoryIcon, getCategoryMeta } from '@/lib/categories'

type Props = {
  current: Record<string, number>
  previous: Record<string, number>
  total: number
}

export default function CategoryBreakdown({ current, previous, total }: Props) {
  // Sort by amount (highest first)
  const sortedCategories = Object.entries(current)
    .sort(([, a], [, b]) => b - a)

  return (
    <div className="space-y-3">
      {sortedCategories.map(([category, amount]) => {
        const meta = getCategoryMeta(category)
        const percentage = total > 0 ? (amount / total) * 100 : 0
        const prevAmount = previous[category] || 0
        const change = prevAmount > 0 ? ((amount - prevAmount) / prevAmount) * 100 : 0

        return (
          <div 
            key={category}
            className="bg-white/5 rounded-xl p-4 border border-white/5"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 text-slate-300">
                {getCategoryIcon(category, 'w-8 h-8')}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">{meta.label}</span>
                  <span className="text-white font-semibold">
                    ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">{percentage.toFixed(0)}% of total</span>
                  {prevAmount > 0 && (
                    <span className={change > 0 ? 'text-red-400' : change < 0 ? 'text-emerald-400' : 'text-slate-400'}>
                      {change > 0 ? '+' : ''}{change.toFixed(0)}%
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className={`h-full ${meta.bgColor} rounded-full transition-all duration-500`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
