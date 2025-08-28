import fs from 'fs-extra'
import path from 'path'
import chalk from 'chalk'
import { ConfigParser } from '../../lib/parser'
import { CssGenerator } from '../../lib/generator'
import { parseConfigString } from '../../lib/utils'

interface ConvertOptions {
  output: string
  dark?: boolean
  split?: boolean
  minify?: boolean
  report?: boolean
}

export async function convertCommand(input: string, options: ConvertOptions) {
  try {
    console.log(chalk.blue('🔄 Converting Tailwind config to CSS tokens...'))

    // Check if input file exists
    if (!(await fs.pathExists(input))) {
      console.error(chalk.red(`❌ Input file not found: ${input}`))
      process.exit(1)
    }

    // Read and parse the config file
    console.log(chalk.gray(`📖 Reading config from: ${input}`))
    const configContent = await fs.readFile(input, 'utf-8')

    let parsedConfig
    try {
      parsedConfig = parseConfigString(configContent)
    } catch (error) {
      console.error(chalk.red(`❌ Failed to parse config file: ${error}`))
      process.exit(1)
    }

    // Parse the Tailwind config
    const parser = new ConfigParser()
    const { theme, report: parseReport } = parser.parse(parsedConfig)

    // Generate CSS
    const generator = new CssGenerator()
    const result = generator.generate(theme, {
      dark: options.dark,
      split: options.split,
      minify: options.minify,
    })

    // Determine output paths
    const outputDir = path.dirname(options.output)
    const outputName = path.basename(
      options.output,
      path.extname(options.output)
    )
    const outputExt = path.extname(options.output) || '.css'

    await fs.ensureDir(outputDir)

    // Write main CSS file
    const mainOutputPath = path.join(outputDir, `${outputName}${outputExt}`)
    await fs.writeFile(mainOutputPath, result.css)
    console.log(chalk.green(`✅ Generated: ${mainOutputPath}`))

    // Write additional files if splitting
    if (options.split) {
      if (result.darkCss) {
        const darkOutputPath = path.join(
          outputDir,
          `${outputName}-dark${outputExt}`
        )
        await fs.writeFile(darkOutputPath, result.darkCss)
        console.log(chalk.green(`✅ Generated: ${darkOutputPath}`))
      }

      if (result.animationsCss) {
        const animationsOutputPath = path.join(
          outputDir,
          `${outputName}-animations${outputExt}`
        )
        await fs.writeFile(animationsOutputPath, result.animationsCss)
        console.log(chalk.green(`✅ Generated: ${animationsOutputPath}`))
      }
    }

    // Generate report if requested
    if (options.report) {
      const reportPath = path.join(outputDir, `${outputName}-report.md`)
      const reportContent = generator.generateReport(theme)
      await fs.writeFile(reportPath, reportContent)
      console.log(chalk.green(`📊 Generated report: ${reportPath}`))
    }

    // Display summary
    console.log(chalk.blue('\n📈 Conversion Summary:'))
    console.log(chalk.gray(`Colors: ${Object.keys(theme.colors).length}`))
    console.log(chalk.gray(`Fonts: ${Object.keys(theme.fonts).length}`))
    console.log(
      chalk.gray(`Font Sizes: ${Object.keys(theme.fontSizes).length}`)
    )
    console.log(chalk.gray(`Spacing: ${Object.keys(theme.spacing).length}`))
    console.log(
      chalk.gray(`Border Radius: ${Object.keys(theme.borderRadius).length}`)
    )
    console.log(chalk.gray(`Keyframes: ${Object.keys(theme.keyframes).length}`))
    console.log(
      chalk.gray(`Animations: ${Object.keys(theme.animations).length}`)
    )

    // Display warnings if any
    if (parseReport.warnings.length > 0) {
      console.log(chalk.yellow('\n⚠️  Warnings:'))
      parseReport.warnings.forEach(warning => {
        console.log(chalk.yellow(`  • ${warning}`))
      })
    }

    // Display skipped items if any
    const skippedCount = Object.values(parseReport.skipped).reduce(
      (sum, arr) => sum + arr.length,
      0
    )
    if (skippedCount > 0) {
      console.log(
        chalk.yellow(
          `\n⏭️  Skipped ${skippedCount} items (see report for details)`
        )
      )
    }

    console.log(chalk.green('\n🎉 Conversion completed successfully!'))
  } catch (error) {
    console.error(chalk.red(`❌ Conversion failed: ${error}`))
    process.exit(1)
  }
}
