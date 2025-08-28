import { TailwindConfig, ParsedTheme, ConversionReport } from './types'
export declare class ConfigParser {
  private report
  parse(config: TailwindConfig): {
    theme: ParsedTheme
    report: ConversionReport
  }
  private parseColors
  private parseNestedColors
  private parseFontFamilies
  private parseFontSizes
  private parseSpacing
  private parseBorderRadius
  private parseKeyframes
  private parseAnimations
  private addSkipped
}
//# sourceMappingURL=parser.d.ts.map
