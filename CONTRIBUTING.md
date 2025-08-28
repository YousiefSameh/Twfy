# Contributing to Twfy

Thank you for your interest in contributing to Twfy! This document provides guidelines for contributing to the project.

## Development Setup

1. **Fork and clone the repository**

   ```bash
   git clone https://github.com/yousiefsameh/twfy.git
   cd twfy
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Run tests**
   ```bash
   npm test
   ```

## Branch Workflow

We use a GitFlow-inspired branching model:

- `main` - Production-ready code, tagged releases
- `develop` - Integration branch where features merge after review
- `feature/<name>` - New features, branched from develop
- `fix/<name>` - Bug fixes targeting develop
- `hotfix/<name>` - Emergency fixes branched from main

### Branch Naming

- Use lowercase with hyphens: `feature/parser-color-mapping`
- Keep names short and descriptive
- Examples: `feature/dark-mode`, `fix/nested-colors`, `chore/update-deps`

## Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

### Examples

```
feat(parser): add color -> css var mapping
fix(cli): handle nested DEFAULT color mapping
docs(readme): add usage examples
test(parser): add unit tests for keyframes export
```

## Code Quality

Before submitting a PR, ensure:

1. **Linting passes**: `npm run lint`
2. **Formatting is correct**: `npm run format`
3. **Tests pass**: `npm test`
4. **TypeScript compiles**: `npm run typecheck`
5. **Build succeeds**: `npm run build`

## Pre-commit Hooks

We use Husky and lint-staged to automatically:

- Run ESLint and fix issues
- Format code with Prettier
- Run relevant tests

Install hooks after cloning:

```bash
npm run prepare
```

## Pull Request Process

1. **Create a feature branch** from `develop`
2. **Make your changes** following our coding standards
3. **Add tests** for new functionality
4. **Update documentation** if needed
5. **Submit a PR** to `develop` branch
6. **Address review feedback**

### PR Requirements

- [ ] All CI checks pass
- [ ] Code review approved
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes (or migration guide provided)

## Testing

- **Unit tests**: Test individual functions and components
- **Integration tests**: Test conversion workflows end-to-end
- **Coverage**: Aim for >80% code coverage on new code

Run tests:

```bash
npm test              # Run all tests
npm run test:coverage # Run with coverage report
```

## Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Extends Next.js and TypeScript recommended
- **Prettier**: Consistent formatting
- **No console.log**: Use proper logging in production code

## Project Structure

```
src/
├── cli/           # CLI commands and entry point
├── lib/           # Core parsing and generation logic
├── ui/            # Shared UI components
├── app/           # Next.js app directory
└── tests/         # Test files
```

## Adding New Features

1. **Parser changes**: Update `src/lib/parser.ts` and add tests
2. **Generator changes**: Update `src/lib/generator.ts` and add tests
3. **CLI changes**: Update `src/cli/commands/` and add tests
4. **UI changes**: Update components in `src/ui/` and add tests

## Reporting Issues

Use our issue templates:

- **Bug reports**: Provide reproduction steps and environment details
- **Feature requests**: Describe use case and expected behavior
- **Questions**: Use discussions for general questions

## Getting Help

- **GitHub Discussions**: For questions and community support
- **Issues**: For bug reports and feature requests
- **Discord**: [Community chat] (if available)

Thank you for contributing to Twfy! 🎉
