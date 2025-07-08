# Fix Tailwind CSS Configuration in @company/core-ui Package

The `@company/core-ui` design system package has configuration issues that need to be fixed:

## Problem Summary

1. The package has duplicate `tailwind.preset.js` files - one at root and one in `dist/`
2. The root `tailwind.preset.js` has incorrect import paths that cause build failures
3. The package appears to be built with Tailwind CSS v4 but needs to work with v3 consumers
4. Source map warnings indicate missing source files in the distributed package

## Required Changes

### 1. Fix the root `tailwind.preset.js` file

Update all import paths at the top of the root `tailwind.preset.js` from:

```javascript
const { colors, badgeColors } = require('./foundations/tokens/colors.js');
const { typography } = require('./foundations/tokens/typography.js');
const { spacing } = require('./foundations/tokens/spacing.js');
const { borderRadius } = require('./foundations/tokens/borderRadius.js');
const { shadows } = require('./foundations/tokens/shadows.js');
```

To:

```javascript
const { colors, badgeColors } = require('./dist/foundations/tokens/colors.js');
const { typography } = require('./dist/foundations/tokens/typography.js');
const { spacing } = require('./dist/foundations/tokens/spacing.js');
const { borderRadius } = require('./dist/foundations/tokens/borderRadius.js');
const { shadows } = require('./dist/foundations/tokens/shadows.js');
```

### 2. Ensure Tailwind v3 compatibility

Since consumers are using Tailwind CSS v3, ensure the package's devDependencies uses:

```json
"tailwindcss": "^3.4.1"
```

Not v4. The preset configuration should be compatible with Tailwind v3.

### 3. Fix source map generation (optional but recommended)

Either:
- Include the source files in the package distribution, OR
- Disable source map generation in the build process, OR  
- Update the source maps to not reference non-existent source files

### 4. Consider removing the duplicate preset file

For cleaner architecture, consider having only one `tailwind.preset.js` file. Either:
- Keep it only at the root with correct paths, OR
- Keep it only in dist/ and update package.json exports to:

```json
"exports": {
    "./tailwind.preset": {
      "require": "./dist/tailwind.preset.js"
    }
}
```

## Testing

After making these changes:
1. Rebuild the package
2. Create a new .tgz file
3. Test in a consumer project using Tailwind CSS v3 with Create React App

The error "Cannot find module './foundations/tokens/colors.js'" should be resolved.
