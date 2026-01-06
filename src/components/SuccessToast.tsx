'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function SuccessToast({ message }: { message: string }) {
  const [visible, setVisible] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Remove the query param from URL without refresh
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      params.delete('added')
      router.replace(`/dashboard${params.toString() ? '?' + params.toString() : ''}`, { scroll: false })
    }, 100)

    // Hide toast after 3 seconds
    const hideTimer = setTimeout(() => setVisible(false), 3000)

    return () => {
      clearTimeout(timer)
      clearTimeout(hideTimer)
    }
  }, [router, searchParams])

  if (!visible) return null

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="bg-emerald-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        {message}
      </div>
    </div>
  )
}
