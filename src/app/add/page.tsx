'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

type Category = 'food' | 'transport' | 'bills' | 'shopping' | 'entertainment' | 'health' | 'other'

const CATEGORIES: { id: Category; label: string; icon: string; color: string }[] = [
  { id: 'food', label: 'Food', icon: '🍔', color: 'from-orange-400 to-red-400' },
  { id: 'transport', label: 'Transport', icon: '🚗', color: 'from-blue-400 to-indigo-400' },
  { id: 'bills', label: 'Bills', icon: '📄', color: 'from-purple-400 to-pink-400' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️', color: 'from-pink-400 to-rose-400' },
  { id: 'entertainment', label: 'Fun', icon: '🎬', color: 'from-yellow-400 to-orange-400' },
  { id: 'health', label: 'Health', icon: '💊', color: 'from-green-400 to-emerald-400' },
  { id: 'other', label: 'Other', icon: '📦', color: 'from-slate-400 to-slate-500' },
]

export default function AddTransactionPage() {
  const router = useRouter()
  const supabase = createClient()

  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<Category | null>(null)
  const [note, setNote] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [step, setStep] = useState<'amount' | 'category' | 'details'>('amount')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleNumpadPress = (value: string) => {
    if (value === 'delete') {
      setAmount(prev => prev.slice(0, -1))
    } else if (value === '.') {
      if (!amount.includes('.')) {
        setAmount(prev => (prev || '0') + '.')
      }
    } else {
      // Limit to 2 decimal places
      const parts = amount.split('.')
      if (parts[1] && parts[1].length >= 2) return
      // Limit total length
      if (amount.replace('.', '').length >= 10) return
      setAmount(prev => prev + value)
    }
  }

  const handleCategorySelect = (cat: Category) => {
    setCategory(cat)
    setStep('details')
  }

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0 || !category) {
      setError('Please enter an amount and select a category')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      const { error: insertError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          amount: parseFloat(amount),
          category,
          note: note.trim() || null,
          transaction_date: date,
        })

      if (insertError) {
        throw insertError
      }

      // Success! Redirect to dashboard
      router.push('/dashboard?added=true')
    } catch (err) {
      console.error('Failed to add transaction:', err)
      setError('Failed to save transaction. Please try again.')
      setIsSubmitting(false)
    }
  }

  const formattedAmount = amount ? parseFloat(amount).toLocaleString('en-US', {
    minimumFractionDigits: amount.includes('.') ? amount.split('.')[1]?.length || 0 : 0,
    maximumFractionDigits: 2,
  }) : '0'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
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
            Cancel
          </Link>
          <h1 className="text-white font-semibold">Add Expense</h1>
          <div className="w-16" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Progress Indicator */}
      <div className="max-w-lg mx-auto w-full px-4 py-3">
        <div className="flex gap-2">
          {['amount', 'category', 'details'].map((s, i) => (
            <div 
              key={s}
              className={`h-1 flex-1 rounded-full transition-all ${
                step === s ? 'bg-emerald-400' : 
                ['amount', 'category', 'details'].indexOf(step) > i ? 'bg-emerald-400/50' : 'bg-white/10'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 flex flex-col">
        
        {/* STEP 1: Amount */}
        {step === 'amount' && (
          <>
            {/* Amount Display */}
            <div className="flex-1 flex flex-col items-center justify-center py-8">
              <p className="text-slate-400 text-sm mb-2">Enter amount</p>
              <div className="text-5xl font-bold text-white flex items-baseline">
                <span className="text-slate-400 text-3xl mr-1">$</span>
                <span className={amount ? 'text-white' : 'text-slate-600'}>{formattedAmount}</span>
              </div>
            </div>

            {/* Numpad */}
            <div className="grid grid-cols-3 gap-3 pb-6">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'delete'].map((key) => (
                <button
                  key={key}
                  onClick={() => handleNumpadPress(key)}
                  className={`h-16 rounded-2xl text-2xl font-medium transition-all active:scale-95 ${
                    key === 'delete' 
                      ? 'bg-white/5 text-slate-400 hover:bg-white/10' 
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {key === 'delete' ? (
                    <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
                    </svg>
                  ) : key}
                </button>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={() => amount && parseFloat(amount) > 0 && setStep('category')}
              disabled={!amount || parseFloat(amount) <= 0}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-900 font-bold text-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all mb-6"
            >
              Next
            </button>
          </>
        )}

        {/* STEP 2: Category */}
        {step === 'category' && (
          <>
            <div className="py-6">
              <p className="text-slate-400 text-sm mb-2 text-center">Amount</p>
              <p className="text-3xl font-bold text-white text-center">${formattedAmount}</p>
            </div>

            <p className="text-slate-400 text-sm mb-4 text-center">What was this for?</p>

            <div className="grid grid-cols-2 gap-3 flex-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`p-4 rounded-2xl border-2 transition-all active:scale-95 ${
                    category === cat.id 
                      ? 'border-emerald-400 bg-emerald-400/20' 
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="text-3xl mb-2">{cat.icon}</div>
                  <div className="text-white font-medium">{cat.label}</div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep('amount')}
              className="w-full py-3 text-slate-400 hover:text-white transition-colors mt-4 mb-6"
            >
              ← Back to amount
            </button>
          </>
        )}

        {/* STEP 3: Details & Submit */}
        {step === 'details' && (
          <>
            {/* Summary */}
            <div className="bg-white/5 rounded-2xl p-6 my-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-slate-400 text-sm">Amount</p>
                  <p className="text-2xl font-bold text-white">${formattedAmount}</p>
                </div>
                <div className="text-4xl">
                  {CATEGORIES.find(c => c.id === category)?.icon}
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <span className="px-3 py-1 rounded-full bg-white/10 text-sm">
                  {CATEGORIES.find(c => c.id === category)?.label}
                </span>
              </div>
            </div>

            {/* Optional Fields */}
            <div className="space-y-4 flex-1">
              {/* Note */}
              <div>
                <label className="block text-sm text-slate-400 mb-2">Note (optional)</label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="What was this for?"
                  maxLength={200}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm text-slate-400 mb-2">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-4 p-4 rounded-xl bg-red-400/20 text-red-300 border border-red-400/30 text-sm">
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 mt-6 mb-6">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-900 font-bold text-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Transaction
                  </>
                )}
              </button>

              <button
                onClick={() => setStep('category')}
                disabled={isSubmitting}
                className="w-full py-3 text-slate-400 hover:text-white transition-colors"
              >
                ← Change category
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
