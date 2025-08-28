'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.CssGenerator = void 0
const utils_1 = require('./utils')
class CssGenerator {
  generate(theme, options = {}) {
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
      mainCss = (0, utils_1.minifyCss)(mainCss)
      if (darkCss) darkCss = (0, utils_1.minifyCss)(darkCss)
      if (animationsCss) animationsCss = (0, utils_1.minifyCss)(animationsCss)
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
  generateMainCss(theme) {
    let css = (0, utils_1.generateHeader)('Twfy Tokens - Main CSS Variables')
    // Root variables
    css += ':root {\n'
    // Colors
    for (const [name, value] of Object.entries(theme.colors)) {
      css += (0, utils_1.formatCssVariable)(name, value) + '\n'
    }
    // Fonts
    for (const [name, value] of Object.entries(theme.fonts)) {
      css += (0, utils_1.formatCssVariable)(name, value) + '\n'
    }
    // Font sizes
    for (const [name, config] of Object.entries(theme.fontSizes)) {
      css +=
        (0, utils_1.formatCssVariable)(`font-size-${name}`, config.size) + '\n'
      if (config.lineHeight) {
        css +=
          (0, utils_1.formatCssVariable)(
            `line-height-${name}`,
            config.lineHeight
          ) + '\n'
      }
    }
    // Spacing
    for (const [name, value] of Object.entries(theme.spacing)) {
      css += (0, utils_1.formatCssVariable)(name, value) + '\n'
    }
    // Border radius
    for (const [name, value] of Object.entries(theme.borderRadius)) {
      css += (0, utils_1.formatCssVariable)(name, value) + '\n'
    }
    // Custom properties
    for (const [category, properties] of Object.entries(theme.custom)) {
      for (const [name, value] of Object.entries(properties)) {
        css +=
          (0, utils_1.formatCssVariable)(`${category}-${name}`, value) + '\n'
      }
    }
    css += '}\n'
    return css
  }
  generateDarkCss(theme) {
    let css = (0, utils_1.generateHeader)('Twfy Tokens - Dark Mode Overrides')
    // Only generate dark overrides for colors that have dark variants
    const darkColors = Object.entries(theme.colors).filter(
      ([name]) => name.includes('-dark-') || name.endsWith('-dark')
    )
    if (darkColors.length === 0) {
      return css + '/* No dark mode color overrides found */\n'
    }
    css += '.dark {\n'
    for (const [name, value] of darkColors) {
      // Convert dark variant names back to base names
      const baseName = name.replace(/-dark(-|$)/, '$1').replace('-dark', '')
      css += (0, utils_1.formatCssVariable)(baseName, value) + '\n'
    }
    css += '}\n'
    return css
  }
  generateAnimationsCss(theme) {
    let css = (0, utils_1.generateHeader)(
      'Twfy Tokens - Animations & Keyframes'
    )
    // Keyframes
    if (Object.keys(theme.keyframes).length > 0) {
      for (const [name, keyframes] of Object.entries(theme.keyframes)) {
        css += (0, utils_1.formatKeyframes)(name, keyframes) + '\n\n'
      }
    }
    // Animation utility classes
    if (Object.keys(theme.animations).length > 0) {
      css += '@layer components {\n'
      for (const [name, animation] of Object.entries(theme.animations)) {
        css +=
          '  ' +
          (0, utils_1.formatAnimationClass)(name, animation).replace(
            /\n/g,
            '\n  '
          ) +
          '\n\n'
      }
      css += '}\n'
    }
    return css
  }
  generateReport(theme) {
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
exports.CssGenerator = CssGenerator
//# sourceMappingURL=generator.js.map
