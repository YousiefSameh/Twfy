import { describe, it, expect } from 'vitest'
import { ConfigParser } from '../parser'
import { TailwindConfig } from '../types'

describe('ConfigParser', () => {
  const parser = new ConfigParser()

  it('should parse basic colors', () => {
    const config: TailwindConfig = {
      theme: {
        extend: {
          colors: {
            primary: '#3b82f6',
            secondary: {
              50: '#f8fafc',
              500: '#64748b',
              DEFAULT: '#64748b',
            },
          },
        },
      },
    }

    const { theme } = parser.parse(config)

    expect(theme.colors['color-primary']).toBe('#3b82f6')
    expect(theme.colors['color-secondary-50']).toBe('#f8fafc')
    expect(theme.colors['color-secondary-500']).toBe('#64748b')
    expect(theme.colors['color-secondary']).toBe('#64748b')
  })

  it('should parse font families', () => {
    const config: TailwindConfig = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
            mono: 'Monaco',
          },
        },
      },
    }

    const { theme } = parser.parse(config)

    expect(theme.fonts['font-sans']).toBe('Inter, sans-serif')
    expect(theme.fonts['font-mono']).toBe('Monaco')
  })

  it('should parse font sizes with line heights', () => {
    const config: TailwindConfig = {
      theme: {
        extend: {
          fontSize: {
            'xs': ['0.75rem', '1rem'],
            'xl': '1.25rem'
          }
        }
      }
    }

    const { theme } = parser.parse(config)

    expect(theme.fontSizes['xs'].size).toBe('0.75rem')
    expect(theme.fontSizes['xs'].lineHeight).toBe('1rem')
    expect(theme.fontSizes['xl'].size).toBe('1.25rem')
    expect(theme.fontSizes['xl'].lineHeight).toBeUndefined()
  })

  it('should parse keyframes and animations', () => {
    const config: TailwindConfig = {
      theme: {
        extend: {
          keyframes: {
            fadeIn: {
              '0%': { opacity: '0' },
              '100%': { opacity: '1' },
            },
          },
          animation: {
            'fade-in': 'fadeIn 0.5s ease-in-out',
          },
        },
      },
    }

    const { theme } = parser.parse(config)

    expect(theme.keyframes['fadeIn']).toEqual({
      '0%': { opacity: '0' },
      '100%': { opacity: '1' },
    })
    expect(theme.animations['fade-in']).toBe('fadeIn 0.5s ease-in-out')
  })

  it('should sanitize keys properly', () => {
    const config: TailwindConfig = {
      theme: {
        extend: {
          colors: {
            'my.color': '#ff0000',
            'my color': '#00ff00',
            'my-color': '#0000ff'
          }
        }
      }
    }

    const { theme } = parser.parse(config)
    
    // All three should be sanitized to the same key 'my-color'
    expect(theme.colors['color-my-color']).toBeDefined()
    expect(Object.keys(theme.colors)).toHaveLength(1)
  })
})
