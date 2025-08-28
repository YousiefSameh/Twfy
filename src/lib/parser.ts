import { TailwindConfig, ParsedTheme, ConversionReport } from './types'
import { sanitizeKey, isValidCssValue } from './utils'

export class ConfigParser {
  private report: ConversionReport = {
    converted: {
      colors: [],
      fonts: [],
      fontSizes: [],
      spacing: [],
      borderRadius: [],
      keyframes: [],
      animations: [],
      custom: [],
    },
    skipped: {},
    warnings: [],
  }

  parse(config: TailwindConfig): { theme: ParsedTheme; report: ConversionReport } {
    const theme: ParsedTheme = {
      colors: {},
      fonts: {},
      fontSizes: {},
      spacing: {},
      borderRadius: {},
      keyframes: {},
      animations: {},
      custom: {},
    }

    // Parse base theme and extended theme
    const baseTheme = config.theme || {}
    const extendedTheme = config.theme?.extend || {}

    // Colors
    this.parseColors(baseTheme.colors, theme.colors, 'base')
    this.parseColors(extendedTheme.colors, theme.colors, 'extend')

    // Font families
    this.parseFontFamilies(baseTheme.fontFamily, theme.fonts, 'base')
    this.parseFontFamilies(extendedTheme.fontFamily, theme.fonts, 'extend')

    // Font sizes
    this.parseFontSizes(baseTheme.fontSize, theme.fontSizes, 'base')
    this.parseFontSizes(extendedTheme.fontSize, theme.fontSizes, 'extend')

    // Spacing
    this.parseSpacing(baseTheme.spacing, theme.spacing, 'base')
    this.parseSpacing(extendedTheme.spacing, theme.spacing, 'extend')

    // Border radius
    this.parseBorderRadius(baseTheme.borderRadius, theme.borderRadius, 'base')
    this.parseBorderRadius(extendedTheme.borderRadius, theme.borderRadius, 'extend')

    // Keyframes
    this.parseKeyframes(baseTheme.keyframes, theme.keyframes, 'base')
    this.parseKeyframes(extendedTheme.keyframes, theme.keyframes, 'extend')

    // Animations
    this.parseAnimations(baseTheme.animation, theme.animations, 'base')
    this.parseAnimations(extendedTheme.animation, theme.animations, 'extend')

    return { theme, report: this.report }
  }

  private parseColors(colors: any, target: Record<string, string>, source: string) {
    if (!colors || typeof colors !== 'object') return

    for (const [key, value] of Object.entries(colors)) {
      try {
        if (typeof value === 'string' && isValidCssValue(value)) {
          const sanitizedKey = sanitizeKey(key)
          target[`color-${sanitizedKey}`] = value
          this.report.converted.colors.push(`${key} (${source})`)
        } else if (typeof value === 'object' && value !== null) {
          this.parseNestedColors(key, value, target, source)
        } else {
          this.addSkipped('colors', key, 'Invalid color value type')
        }
      } catch (error) {
        this.addSkipped('colors', key, `Parse error: ${error}`)
      }
    }
  }

  private parseNestedColors(prefix: string, colors: any, target: Record<string, string>, source: string) {
    for (const [key, value] of Object.entries(colors)) {
      try {
        if (typeof value === 'string' && isValidCssValue(value)) {
          const sanitizedPrefix = sanitizeKey(prefix)
          const sanitizedKey = key === 'DEFAULT' ? sanitizedPrefix : sanitizeKey(key)
          const varName = key === 'DEFAULT' ? `color-${sanitizedPrefix}` : `color-${sanitizedPrefix}-${sanitizedKey}`
          target[varName] = value
          this.report.converted.colors.push(`${prefix}.${key} (${source})`)
        } else {
          this.addSkipped('colors', `${prefix}.${key}`, 'Invalid nested color value')
        }
      } catch (error) {
        this.addSkipped('colors', `${prefix}.${key}`, `Parse error: ${error}`)
      }
    }
  }

  private parseFontFamilies(fonts: any, target: Record<string, string>, source: string) {
    if (!fonts || typeof fonts !== 'object') return

    for (const [key, value] of Object.entries(fonts)) {
      try {
        const sanitizedKey = sanitizeKey(key)
        if (Array.isArray(value)) {
          target[`font-${sanitizedKey}`] = value.map(f => f.includes(' ') ? `"${f}"` : f).join(', ')
          this.report.converted.fonts.push(`${key} (${source})`)
        } else if (typeof value === 'string') {
          target[`font-${sanitizedKey}`] = value.includes(' ') ? `"${value}"` : value
          this.report.converted.fonts.push(`${key} (${source})`)
        } else {
          this.addSkipped('fonts', key, 'Invalid font family type')
        }
      } catch (error) {
        this.addSkipped('fonts', key, `Parse error: ${error}`)
      }
    }
  }

  private parseFontSizes(fontSizes: any, target: Record<string, { size: string; lineHeight?: string }>, source: string) {
    if (!fontSizes || typeof fontSizes !== 'object') return

    for (const [key, value] of Object.entries(fontSizes)) {
      try {
        const sanitizedKey = sanitizeKey(key)
        if (typeof value === 'string') {
          target[sanitizedKey] = { size: value }
          this.report.converted.fontSizes.push(`${key} (${source})`)
        } else if (Array.isArray(value) && value.length >= 1) {
          const [size, lineHeight] = value
          target[sanitizedKey] = { 
            size: size,
            lineHeight: lineHeight || undefined
          }
          this.report.converted.fontSizes.push(`${key} (${source})`)
        } else {
          this.addSkipped('fontSizes', key, 'Invalid font size format')
        }
      } catch (error) {
        this.addSkipped('fontSizes', key, `Parse error: ${error}`)
      }
    }
  }

  private parseSpacing(spacing: any, target: Record<string, string>, source: string) {
    if (!spacing || typeof spacing !== 'object') return

    for (const [key, value] of Object.entries(spacing)) {
      try {
        if (typeof value === 'string' && isValidCssValue(value)) {
          const sanitizedKey = sanitizeKey(key)
          target[`space-${sanitizedKey}`] = value
          this.report.converted.spacing.push(`${key} (${source})`)
        } else {
          this.addSkipped('spacing', key, 'Invalid spacing value')
        }
      } catch (error) {
        this.addSkipped('spacing', key, `Parse error: ${error}`)
      }
    }
  }

  private parseBorderRadius(borderRadius: any, target: Record<string, string>, source: string) {
    if (!borderRadius || typeof borderRadius !== 'object') return

    for (const [key, value] of Object.entries(borderRadius)) {
      try {
        if (typeof value === 'string' && isValidCssValue(value)) {
          const sanitizedKey = sanitizeKey(key)
          target[`radius-${sanitizedKey}`] = value
          this.report.converted.borderRadius.push(`${key} (${source})`)
        } else {
          this.addSkipped('borderRadius', key, 'Invalid border radius value')
        }
      } catch (error) {
        this.addSkipped('borderRadius', key, `Parse error: ${error}`)
      }
    }
  }

  private parseKeyframes(keyframes: any, target: Record<string, Record<string, any>>, source: string) {
    if (!keyframes || typeof keyframes !== 'object') return

    for (const [key, value] of Object.entries(keyframes)) {
      try {
        if (typeof value === 'object' && value !== null) {
          target[key] = value
          this.report.converted.keyframes.push(`${key} (${source})`)
        } else {
          this.addSkipped('keyframes', key, 'Invalid keyframe definition')
        }
      } catch (error) {
        this.addSkipped('keyframes', key, `Parse error: ${error}`)
      }
    }
  }

  private parseAnimations(animations: any, target: Record<string, string>, source: string) {
    if (!animations || typeof animations !== 'object') return

    for (const [key, value] of Object.entries(animations)) {
      try {
        if (typeof value === 'string') {
          target[key] = value
          this.report.converted.animations.push(`${key} (${source})`)
        } else {
          this.addSkipped('animations', key, 'Invalid animation definition')
        }
      } catch (error) {
        this.addSkipped('animations', key, `Parse error: ${error}`)
      }
    }
  }

  private addSkipped(category: string, key: string, reason: string) {
    if (!this.report.skipped[reason]) {
      this.report.skipped[reason] = []
    }
    this.report.skipped[reason].push(`${category}.${key}`)
  }
}
