// Export tokens from JavaScript files (single source of truth)
export { colors, badgeColors } from './colors.js';
export { typography, getTypography } from './typography.js';
export { shadows } from './shadows.js';
export { borderRadius } from './borderRadius.js';
export { spacing } from './spacing.js';
export { chartTokens, getChartColors } from './charts.js';

// Export TypeScript types for type safety
export type {
  Colors,
  ColorScale,
  DataVizColors,
  BadgeColor,
  BadgeColors,
  Typography,
  FontSize,
  Spacing,
  BorderRadius,
  Shadows,
  FontSizeKey,
  FontWeightKey,
  FontFamilyKey,
  LineHeightKey,
  LetterSpacingKey,
  GetTypography,
} from './types'; 