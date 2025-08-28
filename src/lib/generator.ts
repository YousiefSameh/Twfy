import { ParsedTheme, ConversionOptions, ConversionResult } from './types'
import {
  formatCssVariable,
  formatKeyframes,
  formatAnimationClass,
  minifyCss,
  generateHeader,
} from './utils'

export class CssGenerator {
  generate(
    theme: ParsedTheme,
    options: ConversionOptions = {}
  ): ConversionResult {
    const { dark = false, split = false, minify = false } = options

    let mainCss = this.generateMainCss(theme)
    let darkCss = dark ? this.generateDarkCss(theme) : undefined
    let animationsCss = split ? this.generateAnimationsCss(theme) : undefined

    // Add animations to main CSS if not splitting
    if (
      !split &&
      (Object.keys(theme.keyframes).length > 0 ||
        Object.keys(theme.animations).length > 0)
    ) {
      mainCss += '\n' + this.generateAnimationsCss(theme)
    }

    // Add dark mode to main CSS if not splitting
    if (!split && dark && darkCss) {
      mainCss += '\n' + darkCss
    }

    // Minify if requested
    if (minify) {
      mainCss = minifyCss(mainCss)
      if (darkCss) darkCss = minifyCss(darkCss)
      if (animationsCss) animationsCss = minifyCss(animationsCss)
    }

    return {
      css: mainCss,
      darkCss: split ? darkCss : undefined,
      animationsCss: split ? animationsCss : undefined,
      report: {
        converted: {
          colors: Object.keys(theme.colors),
          fonts: Object.keys(theme.fonts),
          fontSizes: Object.keys(theme.fontSizes),
          spacing: Object.keys(theme.spacing),
          borderRadius: Object.keys(theme.borderRadius),
          keyframes: Object.keys(theme.keyframes),
          animations: Object.keys(theme.animations),
          custom: Object.keys(theme.custom),
        },
        skipped: {},
        warnings: [],
      },
    }
  }

  private generateMainCss(theme: ParsedTheme): string {
    let css = '@import "tailwindcss";\n\n'
    css += generateHeader('Twfy Tokens - Tailwind v4 Design Tokens')

    // Root variables for compatibility
    css += ':root {\n'

    // Colors
    for (const [name, value] of Object.entries(theme.colors)) {
      css += formatCssVariable(name, value) + '\n'
    }

    // Fonts
    for (const [name, value] of Object.entries(theme.fonts)) {
      css += formatCssVariable(name, value) + '\n'
    }

    // Font sizes
    for (const [name, config] of Object.entries(theme.fontSizes)) {
      css += formatCssVariable(`font-size-${name}`, config.size) + '\n'
      if (config.lineHeight) {
        css +=
          formatCssVariable(`line-height-${name}`, config.lineHeight) + '\n'
      }
    }

    // Spacing
    for (const [name, value] of Object.entries(theme.spacing)) {
      css += formatCssVariable(name, value) + '\n'
    }

    // Border radius
    for (const [name, value] of Object.entries(theme.borderRadius)) {
      css += formatCssVariable(name, value) + '\n'
    }

    // Custom properties
    for (const [category, properties] of Object.entries(theme.custom)) {
      for (const [name, value] of Object.entries(properties)) {
        css += formatCssVariable(`${category}-${name}`, value) + '\n'
      }
    }

    css += '}\n\n'

    // Tailwind v4 @theme directive with variable references
    css += '@theme inline {\n'

    // Colors
    for (const [name] of Object.entries(theme.colors)) {
      css += formatCssVariable(name, `var(--${name})`) + '\n'
    }

    // Fonts
    for (const [name] of Object.entries(theme.fonts)) {
      css += formatCssVariable(name, `var(--${name})`) + '\n'
    }

    // Font sizes
    for (const [name] of Object.entries(theme.fontSizes)) {
      css +=
        formatCssVariable(`font-size-${name}`, `var(--font-size-${name})`) +
        '\n'
      if (theme.fontSizes[name].lineHeight) {
        css +=
          formatCssVariable(
            `line-height-${name}`,
            `var(--line-height-${name})`
          ) + '\n'
      }
    }

    // Spacing
    for (const [name] of Object.entries(theme.spacing)) {
      css += formatCssVariable(name, `var(--${name})`) + '\n'
    }

    // Border radius
    for (const [name] of Object.entries(theme.borderRadius)) {
      css += formatCssVariable(name, `var(--${name})`) + '\n'
    }

    // Custom properties
    for (const [category, properties] of Object.entries(theme.custom)) {
      for (const [name] of Object.entries(properties)) {
        css +=
          formatCssVariable(
            `${category}-${name}`,
            `var(--${category}-${name})`
          ) + '\n'
      }
    }

    css += '}\n'

    return css
  }

  private generateDarkCss(theme: ParsedTheme): string {
    let css = generateHeader('Twfy Tokens - Dark Mode Overrides')

    // Only generate dark overrides for colors that have dark variants
    const darkColors = Object.entries(theme.colors).filter(
      ([name]) => name.includes('-dark-') || name.endsWith('-dark')
    )

    if (darkColors.length === 0) {
      return css + '/* No dark mode color overrides found */\n'
    }

    css += '@media (prefers-color-scheme: dark) {\n'
    css += '  @theme inline {\n'

    for (const [name, value] of darkColors) {
      // Convert dark variant names back to base names
      const baseName = name.replace(/-dark(-|$)/, '$1').replace('-dark', '')
      css += '  ' + formatCssVariable(baseName, value) + '\n'
    }

    css += '  }\n'
    css += '}\n\n'

    css += '.dark {\n'
    css += '  @theme inline {\n'

    for (const [name, value] of darkColors) {
      // Convert dark variant names back to base names
      const baseName = name.replace(/-dark(-|$)/, '$1').replace('-dark', '')
      css += '  ' + formatCssVariable(baseName, value) + '\n'
    }

    css += '  }\n'
    css += '}\n'

    return css
  }

  private generateAnimationsCss(theme: ParsedTheme): string {
    let css = generateHeader('Twfy Tokens - Animations & Keyframes')

    // Keyframes
    if (Object.keys(theme.keyframes).length > 0) {
      for (const [name, keyframes] of Object.entries(theme.keyframes)) {
        css += formatKeyframes(name, keyframes) + '\n\n'
      }
    }

    // Animation utility classes
    if (Object.keys(theme.animations).length > 0) {
      css += '@layer components {\n'

      for (const [name, animation] of Object.entries(theme.animations)) {
        css +=
          '  ' +
          formatAnimationClass(name, animation).replace(/\n/g, '\n  ') +
          '\n\n'
      }

      css += '}\n'
    }

    return css
  }

  generateReport(theme: ParsedTheme): string {
    const totalConverted =
      Object.keys(theme.colors).length +
      Object.keys(theme.fonts).length +
      Object.keys(theme.fontSizes).length +
      Object.keys(theme.spacing).length +
      Object.keys(theme.borderRadius).length +
      Object.keys(theme.keyframes).length +
      Object.keys(theme.animations).length

    let report = '# Twfy Conversion Report\n\n'
    report += `**Total converted:** ${totalConverted} tokens\n\n`

    if (Object.keys(theme.colors).length > 0) {
      report += `## Colors (${Object.keys(theme.colors).length})\n`
      for (const name of Object.keys(theme.colors)) {
        report += `- --${name}\n`
      }
      report += '\n'
    }

    if (Object.keys(theme.fonts).length > 0) {
      report += `## Font Families (${Object.keys(theme.fonts).length})\n`
      for (const name of Object.keys(theme.fonts)) {
        report += `- --${name}\n`
      }
      report += '\n'
    }

    if (Object.keys(theme.fontSizes).length > 0) {
      report += `## Font Sizes (${Object.keys(theme.fontSizes).length})\n`
      for (const name of Object.keys(theme.fontSizes)) {
        report += `- --font-size-${name}\n`
      }
      report += '\n'
    }

    if (Object.keys(theme.spacing).length > 0) {
      report += `## Spacing (${Object.keys(theme.spacing).length})\n`
      for (const name of Object.keys(theme.spacing)) {
        report += `- --${name}\n`
      }
      report += '\n'
    }

    if (Object.keys(theme.borderRadius).length > 0) {
      report += `## Border Radius (${Object.keys(theme.borderRadius).length})\n`
      for (const name of Object.keys(theme.borderRadius)) {
        report += `- --${name}\n`
      }
      report += '\n'
    }

    if (Object.keys(theme.keyframes).length > 0) {
      report += `## Keyframes (${Object.keys(theme.keyframes).length})\n`
      for (const name of Object.keys(theme.keyframes)) {
        report += `- @keyframes ${name}\n`
      }
      report += '\n'
    }

    if (Object.keys(theme.animations).length > 0) {
      report += `## Animations (${Object.keys(theme.animations).length})\n`
      for (const name of Object.keys(theme.animations)) {
        report += `- .animate-${name}\n`
      }
      report += '\n'
    }

    return report
  }
}
