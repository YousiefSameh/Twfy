/**
 * Sanitize a key to be valid CSS custom property name
 * - Convert to lowercase
 * - Replace dots and spaces with hyphens
 * - Remove invalid characters
 */
export declare function sanitizeKey(key: string): string
/**
 * Check if a value is a valid CSS value
 */
export declare function isValidCssValue(value: string): boolean
/**
 * Format CSS custom property declaration
 */
export declare function formatCssVariable(name: string, value: string): string
/**
 * Format CSS keyframes
 */
export declare function formatKeyframes(
  name: string,
  keyframes: Record<string, any>
): string
/**
 * Format animation utility class
 */
export declare function formatAnimationClass(
  name: string,
  animation: string
): string
/**
 * Minify CSS by removing unnecessary whitespace
 */
export declare function minifyCss(css: string): string
/**
 * Parse Tailwind config from string (JS/TS content)
 */
export declare function parseConfigString(content: string): any
/**
 * Detect if content is TypeScript
 */
export declare function isTypeScript(content: string): boolean
/**
 * Generate CSS comment header
 */
export declare function generateHeader(title: string): string
//# sourceMappingURL=utils.d.ts.map
