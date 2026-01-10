'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { parseSMS, parseMultipleSMS, isTransactionSMS, ParsedSMS } from '@/lib/smsParser'
import { CATEGORIES, getCategoryIcon, CategoryType } from '@/lib/categories'

export default function ImportSMSPage() {
  const router = useRouter()
  const [smsText, setSmsText] = useState('')
  const [parsedResults, setParsedResults] = useState<ParsedSMS[]>([])
  const [selectedResult, setSelectedResult] = useState<ParsedSMS | null>(null)
  const [isParsing, setIsParsing] = useState(false)

  const handleParse = () => {
    if (!smsText.trim()) return
    
    setIsParsing(true)
    
    // Simulate a brief delay for UX
    setTimeout(() => {
      const results = parseMultipleSMS(smsText)
        .filter(result => result.amount !== null || result.type !== null)
      
      setParsedResults(results)
      if (results.length === 1) {
        setSelectedResult(results[0])
      }
      setIsParsing(false)
    }, 300)
  }

  const handleAddTransaction = (result: ParsedSMS) => {
    const params = new URLSearchParams()
    
    if (result.amount) {
      params.set('amount', result.amount.toString())
    }
    if (result.suggestedCategory) {
      params.set('category', result.suggestedCategory)
    }
    if (result.merchant) {
      params.set('note', result.merchant)
    }
    if (result.date) {
      params.set('date', result.date.toISOString().split('T')[0])
    }
    
    router.push(`/add?${params.toString()}`)
  }

  const getConfidenceColor = (confidence: 'high' | 'medium' | 'low') => {
    switch (confidence) {
      case 'high': return 'text-emerald-400 bg-emerald-400/20'
      case 'medium': return 'text-yellow-400 bg-yellow-400/20'
      case 'low': return 'text-red-400 bg-red-400/20'
    }
  }

  const getConfidenceIcon = (confidence: 'high' | 'medium' | 'low') => {
    switch (confidence) {
      case 'high':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      case 'medium':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        )
      case 'low':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
    }
  }

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
          <h1 className="text-white font-semibold">Import from SMS</h1>
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Instructions */}
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-400 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div>
              <h2 className="text-white font-medium mb-1">How it works</h2>
              <p className="text-slate-400 text-sm">
                Copy a bank transaction SMS from your messages app and paste it below. 
                We&apos;ll automatically detect the amount, merchant, and category.
              </p>
            </div>
          </div>
        </div>

        {/* SMS Input */}
        <div className="mb-6">
          <label className="block text-sm text-slate-400 mb-2">
            Paste your bank SMS
          </label>
          <textarea
            value={smsText}
            onChange={(e) => setSmsText(e.target.value)}
            placeholder="Example: Your A/c X1234 is debited for Rs.500.00 on 09-01-26 at AMAZON. Avl Bal Rs.10,000.00"
            className="w-full h-32 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
          />
          <p className="text-slate-500 text-xs mt-2">
            You can paste multiple SMS messages separated by blank lines
          </p>
        </div>

        {/* Parse Button */}
        <button
          onClick={handleParse}
          disabled={!smsText.trim() || isParsing}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-400 to-indigo-400 text-white font-bold text-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all mb-6 flex items-center justify-center gap-2"
        >
          {isParsing ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Parsing...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Parse SMS
            </>
          )}
        </button>

        {/* Results */}
        {parsedResults.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-white font-semibold">
              {parsedResults.length === 1 ? 'Detected Transaction' : `Found ${parsedResults.length} Transactions`}
            </h3>
            
            {parsedResults.map((result, index) => (
              <div 
                key={index}
                className={`bg-white/5 rounded-2xl p-5 border transition-all cursor-pointer ${
                  selectedResult === result 
                    ? 'border-emerald-400 bg-emerald-400/10' 
                    : 'border-white/10 hover:border-white/20'
                }`}
                onClick={() => setSelectedResult(result)}
              >
                {/* Confidence Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getConfidenceColor(result.confidence)}`}>
                    {getConfidenceIcon(result.confidence)}
                    {result.confidence.charAt(0).toUpperCase() + result.confidence.slice(1)} confidence
                  </div>
                  <span className="text-xs text-slate-500">
                    {result.type === 'expense' ? '💸 Expense' : result.type === 'income' ? '💰 Income' : '❓ Unknown'}
                  </span>
                </div>

                {/* Parsed Details */}
                <div className="space-y-3">
                  {/* Amount */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Amount</span>
                    <span className="text-2xl font-bold text-white">
                      {result.amount !== null ? `$${result.amount.toLocaleString()}` : 'Not detected'}
                    </span>
                  </div>

                  {/* Merchant */}
                  {result.merchant && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Merchant</span>
                      <span className="text-white font-medium">{result.merchant}</span>
                    </div>
                  )}

                  {/* Category */}
                  {result.suggestedCategory && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Category</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white">{getCategoryIcon(result.suggestedCategory, 'w-5 h-5')}</span>
                        <span className="text-white font-medium">
                          {CATEGORIES[result.suggestedCategory as CategoryType]?.label || result.suggestedCategory}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Date */}
                  {result.date && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Date</span>
                      <span className="text-white font-medium">
                        {result.date.toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </span>
                    </div>
                  )}
                </div>

                {/* Add Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleAddTransaction(result)
                  }}
                  className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-900 font-bold transition-all hover:from-emerald-300 hover:to-cyan-300 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add as Transaction
                </button>
              </div>
            ))}
          </div>
        )}

        {/* No Results State */}
        {parsedResults.length === 0 && smsText.trim() && !isParsing && (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-slate-400">
              No transaction details found. Try pasting a bank SMS with amount and transaction info.
            </p>
          </div>
        )}

        {/* Sample SMS Examples */}
        {parsedResults.length === 0 && !smsText.trim() && (
          <div className="mt-8">
            <h3 className="text-slate-400 text-sm font-medium mb-3">Example SMS formats we support</h3>
            <div className="space-y-2">
              {[
                'Your A/c X1234 is debited for Rs.500.00 on 09-01-26 at ATM',
                'Alert: Card XX5678 used for USD 125.50 at AMAZON on 09-Jan',
                'Paid Rs.250 to SWIGGY via UPI on 09-01-2026',
                '$1,500.00 transferred from your account to John Doe',
              ].map((example, i) => (
                <button
                  key={i}
                  onClick={() => setSmsText(example)}
                  className="w-full text-left p-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-sm hover:bg-white/10 hover:text-white transition-all"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
