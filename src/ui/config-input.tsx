'use client'

import { useState } from 'react'

interface ConfigInputProps {
  onConvert: (config: string, options: any) => void
  loading: boolean
}

export function ConfigInput({ onConvert, loading }: ConfigInputProps) {
  const [config, setConfig] = useState('')
  const [options, setOptions] = useState({
    dark: false,
    split: false,
    minify: false,
    report: true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (config.trim()) {
      onConvert(config, options)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target?.result as string
        setConfig(content)
      }
      reader.readAsText(file)
    }
  }

  const exampleConfig = `module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
          DEFAULT: '#3b82f6'
        },
        secondary: '#64748b'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Monaco', 'monospace']
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }]
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem'
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out'
      }
    }
  }
}`

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="config" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tailwind Config
        </label>
        <div className="space-y-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setConfig(exampleConfig)}
              className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
            >
              Load Example
            </button>
            <label className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer">
              Upload File
              <input
                type="file"
                accept=".js,.ts"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
          <textarea
            id="config"
            value={config}
            onChange={(e) => setConfig(e.target.value)}
            placeholder="Paste your tailwind.config.js or tailwind.config.ts content here..."
            className="w-full h-64 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white code-editor text-sm"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Options</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={options.dark}
                onChange={(e) => setOptions({ ...options, dark: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Generate dark mode</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={options.split}
                onChange={(e) => setOptions({ ...options, split: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Split into multiple files</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={options.minify}
                onChange={(e) => setOptions({ ...options, minify: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Minify output</span>
            </label>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !config.trim()}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
      >
        {loading ? 'Converting...' : 'Convert to CSS'}
      </button>
    </form>
  )
}
