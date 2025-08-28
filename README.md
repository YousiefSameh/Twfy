# Twfy

Convert Tailwind v3 config to CSS-first tokens for Tailwind v4 workflow.

## Overview

Twfy converts a Tailwind v3 `tailwind.config.(js|ts)` into a clean, CSS-only token file (variables, @layer rules, keyframes, small utility classes) so teams can adopt Tailwind v4's CSS-first workflow quickly.

## Features

- ✅ One-step conversion from JS/TS theme config → CSS tokens
- ✅ Themeable, runtime theme switching via CSS variables
- ✅ Preserves animations, keyframes, and author intent
- ✅ CLI and Web UI interfaces
- ✅ Production-ready CSS output

## Quick Start

### CLI Usage

```bash
# Install globally
npm install -g twfy

# Convert a config file
twfy convert tailwind.config.js -o tokens.css

# With options
twfy convert tailwind.config.js -o tokens.css --dark --split --minify
```

### Web UI

Visit the web interface to paste/upload your config and preview the generated CSS.

```bash
npm run dev
```

## Installation

```bash
npm install twfy
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run CLI in development
npm run cli:dev convert <config-file>

# Run tests
npm test

# Build for production
npm run build
```

## Conversion Rules

- **Colors** → `--color-<name>-<key>` (map DEFAULT → `--color-<name>`)
- **Fonts** → `--font-<name>` (stringified list)
- **Font sizes** → `--font-size-<name>` and `--line-height-<name>`
- **Spacing, radii** → `--space-<key>`, `--radius-<key>`
- **Keyframes & animations** → `@keyframes <name>` + `.animate-<name>`
- **Keys sanitized** for CSS: lowercase, replace `.` and spaces with `-`

## CLI Options

- `--dark` - Generate `.dark` class overrides
- `--split` - Split output into multiple files
- `--minify` - Minify CSS output
- `--report` - Generate conversion report

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Run tests: `npm test`
5. Submit a pull request

## License

Made with ❤️ by Yousief Sameh.  
This project is licensed under the [MIT License](LICENSE).

© 2025 Yousief Sameh
