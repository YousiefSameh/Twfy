'use client'

import { useState } from 'react'
import { ConfigInput } from '@/ui/config-input'
import { PreviewPanel } from '@/ui/preview-panel'
import { Header } from '@/ui/header'
import { ConversionResult } from '@/lib/types'

export default function Home() {
  const [result, setResult] = useState<ConversionResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConvert = async (configContent: string, options: any) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          config: configContent,
          options,
        }),
      })

      if (!response.ok) {
        throw new Error(`Conversion failed: ${response.statusText}`)
      }

      const conversionResult = await response.json()
      setResult(conversionResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Input Configuration
              </h2>
              <ConfigInput onConvert={handleConvert} loading={loading} />

              {error && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  <p className="text-red-800 dark:text-red-200 text-sm">
                    {error}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Generated CSS
              </h2>
              <PreviewPanel result={result} loading={loading} />
            </div>
          </div>
        </div>

        <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-xl">
                  1
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Paste Config
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Paste your Tailwind v3 config or upload a file
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 dark:text-green-400 font-bold text-xl">
                  2
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Convert
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Generate CSS custom properties and utilities
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 dark:text-purple-400 font-bold text-xl">
                  3
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Download
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Copy or download your CSS-first tokens
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
