import { describe, it, expect } from 'vitest'
import { CssGenerator } from '../generator'
import { ParsedTheme } from '../types'

describe('CssGenerator', () => {
  const generator = new CssGenerator()

  it('should generate CSS variables from theme', () => {
    const theme: ParsedTheme = {
      colors: {
        'color-primary': '#3b82f6',
        'color-secondary-500': '#64748b',
      },
      fonts: {
        'font-sans': 'Inter, sans-serif',
      },
      fontSizes: {
        xl: { size: '1.25rem', lineHeight: '1.75rem' },
      },
      spacing: {
        'space-18': '4.5rem',
      },
      borderRadius: {
        'radius-xl': '0.75rem',
      },
      keyframes: {},
      animations: {},
      custom: {},
    }

    const result = generator.generate(theme)

    expect(result.css).toContain('--color-primary: #3b82f6;')
    expect(result.css).toContain('--color-secondary-500: #64748b;')
    expect(result.css).toContain('--font-sans: Inter, sans-serif;')
    expect(result.css).toContain('--font-size-xl: 1.25rem;')
    expect(result.css).toContain('--line-height-xl: 1.75rem;')
    expect(result.css).toContain('--space-18: 4.5rem;')
    expect(result.css).toContain('--radius-xl: 0.75rem;')
  })

  it('should generate keyframes and animation classes', () => {
    const theme: ParsedTheme = {
      colors: {},
      fonts: {},
      fontSizes: {},
      spacing: {},
      borderRadius: {},
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animations: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
      custom: {},
    }

    const result = generator.generate(theme)

    expect(result.css).toContain('@keyframes fadeIn')
    expect(result.css).toContain('0% {\n    opacity: 0;\n  }')
    expect(result.css).toContain('100% {\n    opacity: 1;\n  }')
    expect(result.css).toContain('.animate-fade-in')
    expect(result.css).toContain('animation: fadeIn 0.5s ease-in-out;')
  })

  it('should split files when requested', () => {
    const theme: ParsedTheme = {
      colors: { 'color-primary': '#3b82f6' },
      fonts: {},
      fontSizes: {},
      spacing: {},
      borderRadius: {},
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animations: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
      custom: {},
    }

    const result = generator.generate(theme, { split: true })

    expect(result.animationsCss).toBeDefined()
    expect(result.animationsCss).toContain('@keyframes fadeIn')
    expect(result.css).not.toContain('@keyframes fadeIn')
  })

  it('should minify CSS when requested', () => {
    const theme: ParsedTheme = {
      colors: { 'color-primary': '#3b82f6' },
      fonts: {},
      fontSizes: {},
      spacing: {},
      borderRadius: {},
      keyframes: {},
      animations: {},
      custom: {}
    }

    const result = generator.generate(theme, { minify: true })
    
    // Minified CSS should have less whitespace
    expect(result.css).not.toContain('\n  --color-primary')
    expect(result.css).toContain('--color-primary: #3b82f6')
  })
})
