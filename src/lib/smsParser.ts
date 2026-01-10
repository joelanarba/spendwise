import { CategoryType } from './categories'

export interface ParsedSMS {
  amount: number | null
  type: 'expense' | 'income' | null
  merchant: string | null
  date: Date | null
  suggestedCategory: CategoryType | null
  confidence: 'high' | 'medium' | 'low'
  rawText: string
}

// Keywords that indicate money going out (expense)
const EXPENSE_KEYWORDS = [
  'debited', 'debit', 'paid', 'spent', 'withdrawn', 'withdrawal',
  'purchase', 'bought', 'charged', 'payment', 'transferred to',
  'sent to', 'used for', 'transaction at', 'pos', 'atm withdrawal'
]

// Keywords that indicate money coming in (income)
const INCOME_KEYWORDS = [
  'credited', 'credit', 'received', 'deposited', 'deposit',
  'refund', 'cashback', 'transferred from', 'salary', 'bonus'
]

// Merchant to category mapping
const MERCHANT_CATEGORY_MAP: Record<string, CategoryType> = {
  // Food & Restaurants
  'swiggy': 'food',
  'zomato': 'food',
  'uber eats': 'food',
  'doordash': 'food',
  'grubhub': 'food',
  'mcdonalds': 'food',
  'starbucks': 'food',
  'dominos': 'food',
  'pizza hut': 'food',
  'kfc': 'food',
  'subway': 'food',
  'restaurant': 'food',
  'cafe': 'food',
  'diner': 'food',
  'food': 'food',
  
  // Transport
  'uber': 'transport',
  'lyft': 'transport',
  'ola': 'transport',
  'grab': 'transport',
  'taxi': 'transport',
  'metro': 'transport',
  'bus': 'transport',
  'fuel': 'transport',
  'petrol': 'transport',
  'gas station': 'transport',
  'shell': 'transport',
  'chevron': 'transport',
  'parking': 'transport',
  
  // Shopping
  'amazon': 'shopping',
  'flipkart': 'shopping',
  'walmart': 'shopping',
  'target': 'shopping',
  'ebay': 'shopping',
  'bestbuy': 'shopping',
  'costco': 'shopping',
  'ikea': 'shopping',
  'mall': 'shopping',
  'store': 'shopping',
  
  // Bills & Utilities
  'electric': 'bills',
  'electricity': 'bills',
  'water bill': 'bills',
  'gas bill': 'bills',
  'internet': 'bills',
  'wifi': 'bills',
  'broadband': 'bills',
  'phone bill': 'bills',
  'mobile recharge': 'bills',
  'insurance': 'bills',
  'rent': 'bills',
  
  // Entertainment
  'netflix': 'entertainment',
  'spotify': 'entertainment',
  'disney': 'entertainment',
  'hulu': 'entertainment',
  'prime video': 'entertainment',
  'youtube': 'entertainment',
  'cinema': 'entertainment',
  'movie': 'entertainment',
  'theater': 'entertainment',
  'gaming': 'entertainment',
  'playstation': 'entertainment',
  'xbox': 'entertainment',
  'steam': 'entertainment',
  
  // Health
  'pharmacy': 'health',
  'hospital': 'health',
  'clinic': 'health',
  'doctor': 'health',
  'medical': 'health',
  'medicine': 'health',
  'drug store': 'health',
  'cvs': 'health',
  'walgreens': 'health',
  'gym': 'health',
  'fitness': 'health',
}

// Amount extraction patterns
const AMOUNT_PATTERNS = [
  // USD formats: $100, $100.00, USD 100, USD100.00
  /\$\s*([\d,]+(?:\.\d{2})?)/i,
  /USD\s*([\d,]+(?:\.\d{2})?)/i,
  
  // INR formats: Rs. 100, Rs.100, INR 100, ₹100
  /(?:Rs\.?|INR|₹)\s*([\d,]+(?:\.\d{2})?)/i,
  
  // EUR formats: €100, EUR 100
  /(?:€|EUR)\s*([\d,]+(?:\.\d{2})?)/i,
  
  // GBP formats: £100, GBP 100
  /(?:£|GBP)\s*([\d,]+(?:\.\d{2})?)/i,
  
  // Generic amount patterns (fallback)
  /(?:amount|amt|for|of)\s*(?:rs\.?|inr|usd|\$|₹|€|£)?\s*([\d,]+(?:\.\d{2})?)/i,
  /(?:debited|credited|paid|received|withdrawn|transferred)\s*(?:for|of|with|rs\.?|inr|usd|\$|₹|€|£)?\s*([\d,]+(?:\.\d{2})?)/i,
]

// Date patterns
const DATE_PATTERNS = [
  // DD-MM-YYYY, DD/MM/YYYY, DD-MM-YY
  /(\d{1,2})[-\/](\d{1,2})[-\/](\d{2,4})/,
  
  // DD-Mon-YYYY, DD Mon YYYY (e.g., 09-Jan-2026, 09 Jan 2026)
  /(\d{1,2})[-\s](Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[-\s]?(\d{2,4})?/i,
  
  // Mon DD, YYYY (e.g., Jan 09, 2026)
  /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2})(?:,?\s*(\d{4}))?/i,
]

const MONTH_MAP: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
}

/**
 * Parse an SMS message to extract transaction details
 */
export function parseSMS(text: string): ParsedSMS {
  const rawText = text.trim()
  const lowerText = rawText.toLowerCase()
  
  // Extract amount
  const amount = extractAmount(rawText)
  
  // Determine transaction type
  const type = determineTransactionType(lowerText)
  
  // Extract merchant
  const merchant = extractMerchant(rawText)
  
  // Extract date
  const date = extractDate(rawText)
  
  // Suggest category based on merchant and keywords
  const suggestedCategory = suggestCategory(lowerText, merchant)
  
  // Calculate confidence
  const confidence = calculateConfidence(amount, type, merchant)
  
  return {
    amount,
    type,
    merchant,
    date,
    suggestedCategory,
    confidence,
    rawText,
  }
}

function extractAmount(text: string): number | null {
  for (const pattern of AMOUNT_PATTERNS) {
    const match = text.match(pattern)
    if (match && match[1]) {
      // Remove commas and parse as float
      const amountStr = match[1].replace(/,/g, '')
      const amount = parseFloat(amountStr)
      if (!isNaN(amount) && amount > 0) {
        return amount
      }
    }
  }
  return null
}

function determineTransactionType(lowerText: string): 'expense' | 'income' | null {
  // Check for expense keywords first (more common)
  for (const keyword of EXPENSE_KEYWORDS) {
    if (lowerText.includes(keyword)) {
      return 'expense'
    }
  }
  
  // Check for income keywords
  for (const keyword of INCOME_KEYWORDS) {
    if (lowerText.includes(keyword)) {
      return 'income'
    }
  }
  
  return null
}

function extractMerchant(text: string): string | null {
  // Common patterns for merchant extraction
  const merchantPatterns = [
    // "at MERCHANT" or "to MERCHANT"
    /(?:at|to|from|via)\s+([A-Z][A-Za-z0-9\s&'-]+?)(?:\s+on|\s+for|\s+ref|\s*\.|$)/i,
    
    // "MERCHANT via UPI" or "MERCHANT through"
    /(?:paid|sent|transferred)\s+(?:to\s+)?([A-Z][A-Za-z0-9\s&'-]+?)(?:\s+via|\s+through|\s+using)/i,
    
    // Transaction at MERCHANT
    /transaction\s+(?:at|for)\s+([A-Z][A-Za-z0-9\s&'-]+?)(?:\s+on|\.|$)/i,
    
    // Purchase at MERCHANT
    /purchase\s+(?:at|from)\s+([A-Z][A-Za-z0-9\s&'-]+?)(?:\s+on|\.|$)/i,
  ]
  
  for (const pattern of merchantPatterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      const merchant = match[1].trim()
      // Filter out common false positives
      if (merchant.length > 2 && merchant.length < 50 && 
          !merchant.match(/^(atm|upi|neft|imps|ref|your|the|a|an)$/i)) {
        return merchant
      }
    }
  }
  
  return null
}

function extractDate(text: string): Date | null {
  const currentYear = new Date().getFullYear()
  
  for (const pattern of DATE_PATTERNS) {
    const match = text.match(pattern)
    if (match) {
      try {
        // Handle different date formats
        if (pattern.source.includes('Jan|Feb')) {
          // Month name format
          const monthStr = match[1].toLowerCase().slice(0, 3)
          const month = MONTH_MAP[monthStr]
          
          if (month !== undefined) {
            let day: number, year: number
            
            if (match[2] && !isNaN(parseInt(match[2]))) {
              // DD-Mon-YYYY format
              day = parseInt(match[1])
              year = match[3] ? parseYear(match[3]) : currentYear
            } else {
              // Mon DD, YYYY format
              day = parseInt(match[2])
              year = match[3] ? parseYear(match[3]) : currentYear
            }
            
            // Validate date
            if (day >= 1 && day <= 31) {
              return new Date(year, month, day)
            }
          }
        } else {
          // Numeric format DD-MM-YYYY
          const day = parseInt(match[1])
          const month = parseInt(match[2]) - 1 // JS months are 0-indexed
          const year = match[3] ? parseYear(match[3]) : currentYear
          
          if (day >= 1 && day <= 31 && month >= 0 && month <= 11) {
            return new Date(year, month, day)
          }
        }
      } catch {
        continue
      }
    }
  }
  
  return null
}

function parseYear(yearStr: string): number {
  const year = parseInt(yearStr)
  if (year < 100) {
    // Two-digit year: assume 2000s
    return 2000 + year
  }
  return year
}

function suggestCategory(lowerText: string, merchant: string | null): CategoryType | null {
  // First, check merchant against known mappings
  if (merchant) {
    const lowerMerchant = merchant.toLowerCase()
    for (const [key, category] of Object.entries(MERCHANT_CATEGORY_MAP)) {
      if (lowerMerchant.includes(key)) {
        return category
      }
    }
  }
  
  // Then check the full text for category keywords
  for (const [key, category] of Object.entries(MERCHANT_CATEGORY_MAP)) {
    if (lowerText.includes(key)) {
      return category
    }
  }
  
  // ATM withdrawal is typically for general spending (other)
  if (lowerText.includes('atm')) {
    return 'other'
  }
  
  return null
}

function calculateConfidence(
  amount: number | null,
  type: 'expense' | 'income' | null,
  merchant: string | null
): 'high' | 'medium' | 'low' {
  let score = 0
  
  if (amount !== null) score += 2
  if (type !== null) score += 1
  if (merchant !== null) score += 1
  
  if (score >= 3) return 'high'
  if (score >= 2) return 'medium'
  return 'low'
}

/**
 * Parse multiple SMS messages (batch processing)
 */
export function parseMultipleSMS(text: string): ParsedSMS[] {
  // Split by common SMS separators or double newlines
  const messages = text
    .split(/\n{2,}|(?=(?:Your|Alert|Dear|Txn|Transaction|A\/c|Acc))/i)
    .map(msg => msg.trim())
    .filter(msg => msg.length > 10)
  
  return messages.map(parseSMS)
}

/**
 * Check if text looks like a bank transaction SMS
 */
export function isTransactionSMS(text: string): boolean {
  const lowerText = text.toLowerCase()
  
  // Must contain at least one amount pattern
  const hasAmount = AMOUNT_PATTERNS.some(pattern => pattern.test(text))
  
  // Must contain transaction-related keywords
  const hasTransactionKeyword = [
    ...EXPENSE_KEYWORDS,
    ...INCOME_KEYWORDS,
    'transaction', 'txn', 'a/c', 'account', 'balance', 'bal'
  ].some(keyword => lowerText.includes(keyword))
  
  return hasAmount && hasTransactionKeyword
}
