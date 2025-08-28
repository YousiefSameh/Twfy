export interface TailwindConfig {
  theme?: {
    extend?: {
      colors?: Record<string, any>
      fontFamily?: Record<string, string | string[]>
      fontSize?: Record<string, any>
      spacing?: Record<string, string>
      borderRadius?: Record<string, string>
      keyframes?: Record<string, Record<string, any>>
      animation?: Record<string, string>
      [key: string]: any
    }
    colors?: Record<string, any>
    fontFamily?: Record<string, string | string[]>
    fontSize?: Record<string, any>
    spacing?: Record<string, string>
    borderRadius?: Record<string, string>
    keyframes?: Record<string, Record<string, any>>
    animation?: Record<string, string>
    [key: string]: any
  }
  [key: string]: any
}

export interface ParsedTheme {
  colors: Record<string, string>
  fonts: Record<string, string>
  fontSizes: Record<string, { size: string; lineHeight?: string }>
  spacing: Record<string, string>
  borderRadius: Record<string, string>
  keyframes: Record<string, Record<string, any>>
  animations: Record<string, string>
  custom: Record<string, Record<string, string>>
}

export interface ConversionOptions {
  dark?: boolean
  split?: boolean
  minify?: boolean
  report?: boolean
}

export interface ConversionResult {
  css: string
  darkCss?: string
  animationsCss?: string
  report: ConversionReport
}

export interface ConversionReport {
  converted: {
    colors: string[]
    fonts: string[]
    fontSizes: string[]
    spacing: string[]
    borderRadius: string[]
    keyframes: string[]
    animations: string[]
    custom: string[]
  }
  skipped: {
    [key: string]: string[] // reason -> keys
  }
  warnings: string[]
}
