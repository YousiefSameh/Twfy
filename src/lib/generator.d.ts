import { ParsedTheme, ConversionOptions, ConversionResult } from './types';
export declare class CssGenerator {
    generate(theme: ParsedTheme, options?: ConversionOptions): ConversionResult;
    private generateMainCss;
    private generateDarkCss;
    private generateAnimationsCss;
    generateReport(theme: ParsedTheme): string;
}
//# sourceMappingURL=generator.d.ts.map