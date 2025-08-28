import { Command } from 'commander'
import { convertCommand } from './commands/convert'
const packageJson = require('../../package.json')
const version = packageJson.version

const program = new Command()

program
  .name('twfy')
  .description('Convert Tailwind v3 config to CSS-first tokens for Tailwind v4 workflow')
  .version(version)

program
  .command('convert')
  .description('Convert a Tailwind config file to CSS tokens')
  .argument('<input>', 'Input Tailwind config file (tailwind.config.js/ts)')
  .option('-o, --output <file>', 'Output CSS file', 'tokens.css')
  .option('--dark', 'Generate dark mode CSS variables')
  .option('--split', 'Split output into multiple files')
  .option('--minify', 'Minify CSS output')
  .option('--report', 'Generate conversion report')
  .action(convertCommand)

program.parse()
