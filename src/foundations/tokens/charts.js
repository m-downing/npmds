/**
 * Design system chart tokens
 * These tokens are specifically for styling chart components and MetricCards.
 */

import { colors } from './colors.js';
import { getTypography } from './typography.js';
import { shadows } from './shadows.js';

export const chartTokens = {
  status: {
    // Maps to dataViz colors for semantic status indicators
    error: colors.error[500],
    warning: colors.warning[500],
    success: colors.success[500],
    neutral: colors.neutral[500],
    primary: colors.primary[600],
  },
  // Keep original series array for backward compatibility (light mode)
  series: [
    // Data visualization color palette for consistent charting
    colors.dataViz.primary,    // Main data series
    colors.dataViz.secondary,  // Comparison data series
    colors.dataViz.highlight,  // Highlighting specific metrics
    colors.dataViz.alt,        // Alternative data categories
    colors.dataViz.positive,   // Positive trends
    colors.dataViz.negative,   // Negative trends
  ],
  // New theme-specific variants
  seriesVariants: {
    light: [
      // Data visualization color palette for light mode
      colors.dataViz.primary,    // Main data series - dark blue
      colors.dataViz.secondary,  // Comparison data series - blue-gray
      colors.dataViz.highlight,  // Highlighting specific metrics - orange
      colors.dataViz.alt,        // Alternative data categories - light blue-gray
      colors.dataViz.positive,   // Positive trends - green
      colors.dataViz.negative,   // Negative trends - red
    ],
    dark: [
      // Data visualization color palette for dark mode
      colors.primary[300],        // Main data series
      colors.primary[500],          // Comparison data series
      colors.teal[200],          // Highlighting specific metrics
      colors.neutral[50],         // Alternative data categories
      colors.success[500],        // Positive trends
      colors.error[500],          // Negative trends
    ]
  },
  axis: {
    light: {
      stroke: colors.neutral[500],
      strokeWidth: 1,
      fontFamily: getTypography.fontFamily('body'),
      fontSize: getTypography.fontSize('xs'),
      color: colors.neutral[700],
    },
    dark: {
      stroke: colors.neutral[400],
      strokeWidth: 1,
      fontFamily: getTypography.fontFamily('body'),
      fontSize: getTypography.fontSize('xs'),
      color: colors.neutral[300],
    }
  },
  grid: {
    light: {
      stroke: colors.neutral[200],
      dashArray: '3 3',
    },
    dark: {
      stroke: colors.neutral[600],
      dashArray: '3 3',
    }
  },
  tooltip: {
    light: {
      bg: colors.neutral[800],
      color: colors.neutral[50],
      padding: '8px 12px',
      borderRadius: '4px',
      fontSize: getTypography.fontSize('sm'),
    },
    dark: {
      bg: colors.neutral[100],
      color: colors.neutral[800],
      padding: '8px 12px',
      borderRadius: '4px',
      fontSize: getTypography.fontSize('sm'),
    }
  },
  card: {
    // Example padding values
    padding: '1rem',
    gap: '0.5rem',
    // Maps to shadows.md
    shadow: shadows.md,
  },
};

// Utility function to get theme-appropriate colors
export const getChartColors = (isDark = false) => ({
  series: isDark ? chartTokens.seriesVariants.dark : chartTokens.seriesVariants.light,
  axis: isDark ? chartTokens.axis.dark : chartTokens.axis.light,
  grid: isDark ? chartTokens.grid.dark : chartTokens.grid.light,
  tooltip: isDark ? chartTokens.tooltip.dark : chartTokens.tooltip.light,
  status: chartTokens.status,
  card: chartTokens.card,
}); 