# Contributing to Bitter & Sweet Co.

Thank you for your interest in contributing to Bitter & Sweet Co.! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help create a positive environment

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Create a new branch for your feature/fix
4. Make your changes
5. Test thoroughly
6. Submit a pull request

## Development Workflow

### Branch Naming

- `feature/` - New features (e.g., `feature/payment-integration`)
- `fix/` - Bug fixes (e.g., `fix/cart-calculation`)
- `refactor/` - Code refactoring (e.g., `refactor/admin-panel`)
- `docs/` - Documentation updates (e.g., `docs/setup-guide`)

### Commit Messages

Use clear, descriptive commit messages:

```
Add user favorites feature

- Implement favorites table and RLS policies
- Add save/delete favorite functionality
- Create favorites UI component
- Add reorder from favorites
```

### Code Style

- Follow the existing code style
- Use TypeScript for type safety
- Write meaningful variable and function names
- Add comments for complex logic
- Keep components focused and modular

### Testing Checklist

Before submitting a PR, ensure:

- [ ] Code builds without errors (`npm run build`)
- [ ] TypeScript checks pass (`npm run typecheck`)
- [ ] ESLint passes (`npm run lint`)
- [ ] All features work in development mode
- [ ] No console errors or warnings
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Authentication flows work correctly
- [ ] Database operations complete successfully

## Pull Request Process

1. **Update Documentation**: If you've added features, update the README.md
2. **Describe Changes**: Provide a clear description of what your PR does
3. **Link Issues**: Reference any related issues
4. **Screenshots**: Include screenshots for UI changes
5. **Test Results**: Describe your testing process

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How did you test these changes?

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code builds successfully
- [ ] TypeScript checks pass
- [ ] ESLint passes
- [ ] Tested on multiple screen sizes
- [ ] Documentation updated
```

## Database Changes

If your contribution involves database changes:

1. Create a new migration file in `supabase/migrations/`
2. Use timestamp naming: `YYYYMMDDHHMMSS_description.sql`
3. Include detailed comments explaining the changes
4. Always include RLS policies for new tables
5. Test the migration on a development database first

## Component Guidelines

### File Organization

- One component per file
- Co-locate related components in subdirectories
- Keep files under 300 lines when possible

### Component Structure

```tsx
// Imports
import { useState } from 'react';
import { Icon } from 'lucide-react';

// Types
interface MyComponentProps {
  title: string;
  onAction: () => void;
}

// Component
export default function MyComponent({ title, onAction }: MyComponentProps) {
  const [state, setState] = useState('');

  // Event handlers
  const handleClick = () => {
    // logic
  };

  // Render
  return (
    <div>
      {/* content */}
    </div>
  );
}
```

### Styling Guidelines

- Use Tailwind CSS utility classes
- Follow existing design patterns
- Maintain consistent spacing and colors
- Ensure accessibility (ARIA labels, keyboard navigation)
- Test dark mode compatibility

## Adding New Features

When adding new features:

1. **Plan First**: Discuss major features in an issue first
2. **Database Schema**: Design schema with RLS in mind
3. **User Experience**: Consider mobile users
4. **Performance**: Optimize queries and components
5. **Security**: Never expose sensitive data
6. **Documentation**: Update relevant docs

## Bug Reports

When reporting bugs, include:

- Clear description of the issue
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Browser/device information
- Console errors

## Feature Requests

When suggesting features:

- Explain the use case
- Describe expected behavior
- Consider implementation complexity
- Discuss potential drawbacks

## Questions?

If you have questions about contributing:

- Open an issue with the `question` label
- Check existing issues and documentation first
- Be specific about what you need help with

## Recognition

Contributors will be recognized in the project documentation. Thank you for helping make Bitter & Sweet Co. better!
