'use client'

import { useState } from 'react'
import { ConversionResult } from '@/lib/types'

interface PreviewPanelProps {
  result: ConversionResult | null
  loading: boolean
}

export function PreviewPanel({ result, loading }: PreviewPanelProps) {
  const [activeTab, setActiveTab] = useState<
    'css' | 'dark' | 'animations' | 'report'
  >('css')

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600 dark:text-gray-300">
          Converting...
        </span>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <svg
            className="w-12 h-12 mx-auto mb-4 opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p>
            Paste your Tailwind config and click "Convert to CSS" to see the
            generated tokens
          </p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'css' as const, label: 'Main CSS', content: result.css },
    ...(result.darkCss
      ? [{ id: 'dark' as const, label: 'Dark Mode', content: result.darkCss }]
      : []),
    ...(result.animationsCss
      ? [
          {
            id: 'animations' as const,
            label: 'Animations',
            content: result.animationsCss,
          },
        ]
      : []),
    {
      id: 'report' as const,
      label: 'Report',
      content: generateReportText(result),
    },
  ]

  const activeContent = tabs.find(tab => tab.id === activeTab)?.content || ''

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/css' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      // You could add a toast notification here
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = content
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    }
  }

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => handleCopy(activeContent)}
          className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Copy
        </button>
        <button
          onClick={() => {
            const filename =
              activeTab === 'report'
                ? 'twfy-report.md'
                : activeTab === 'dark'
                  ? 'tokens-dark.css'
                  : activeTab === 'animations'
                    ? 'animations.css'
                    : 'tokens.css'
            handleDownload(activeContent, filename)
          }}
          className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
        >
          Download
        </button>
      </div>

      {/* Content */}
      <div className="relative">
        <pre className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md p-4 overflow-auto max-h-96 text-sm code-editor">
          <code
            className={
              activeTab === 'report'
                ? 'text-gray-800 dark:text-gray-200'
                : 'text-gray-800 dark:text-gray-200'
            }
          >
            {activeContent}
          </code>
        </pre>
      </div>

      {/* Stats */}
      {result.report && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {result.report.converted.colors.length}
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400">
              Colors
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {result.report.converted.fonts.length}
            </div>
            <div className="text-xs text-green-600 dark:text-green-400">
              Fonts
            </div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {result.report.converted.spacing.length}
            </div>
            <div className="text-xs text-purple-600 dark:text-purple-400">
              Spacing
            </div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {result.report.converted.keyframes.length}
            </div>
            <div className="text-xs text-orange-600 dark:text-orange-400">
              Keyframes
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function generateReportText(result: ConversionResult): string {
  const { report } = result

  let text = '# Twfy Conversion Report\n\n'

  const totalConverted = Object.values(report.converted).reduce(
    (sum, arr) => sum + arr.length,
    0
  )
  text += `**Total converted:** ${totalConverted} tokens\n\n`

  // Converted items
  Object.entries(report.converted).forEach(([category, items]) => {
    if (items.length > 0) {
      text += `## ${category.charAt(0).toUpperCase() + category.slice(1)} (${items.length})\n`
      items.forEach(item => {
        text += `- ${item}\n`
      })
      text += '\n'
    }
  })

  // Skipped items
  if (Object.keys(report.skipped).length > 0) {
    text += '## Skipped Items\n\n'
    Object.entries(report.skipped).forEach(([reason, items]) => {
      text += `### ${reason}\n`
      items.forEach(item => {
        text += `- ${item}\n`
      })
      text += '\n'
    })
  }

  // Warnings
  if (report.warnings.length > 0) {
    text += '## Warnings\n\n'
    report.warnings.forEach(warning => {
      text += `- ${warning}\n`
    })
  }

  return text
}
