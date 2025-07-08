const { colors, badgeColors } = require('./dist/foundations/tokens/colors.js');
const { typography } = require('./dist/foundations/tokens/typography.js');
const { spacing } = require('./dist/foundations/tokens/spacing.js');
const { borderRadius } = require('./dist/foundations/tokens/borderRadius.js');
const { shadows } = require('./dist/foundations/tokens/shadows.js');



module.exports = {
  content: [
    "./**/*.{js,ts,jsx,tsx}",  // Scan all folders from root
    "./index.ts"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ...colors,
        // Badge colors with proper naming for Tailwind classes
        'badge-forecast-bg': badgeColors.forecast.bg,
        'badge-forecast-text': badgeColors.forecast.text,
        'badge-forecastInverted-bg': badgeColors.forecastInverted.bg,
        'badge-forecastInverted-text': badgeColors.forecastInverted.text,
        'badge-forecastInverted-border': badgeColors.forecastInverted.border,
        'badge-sop-bg': badgeColors.sop.bg,
        'badge-sop-text': badgeColors.sop.text,
        'badge-sopInverted-bg': badgeColors.sopInverted.bg,
        'badge-sopInverted-text': badgeColors.sopInverted.text,
        'badge-sopInverted-border': badgeColors.sopInverted.border,
        'badge-businessCase-bg': badgeColors.businessCase.bg,
        'badge-businessCase-text': badgeColors.businessCase.text,
        'badge-businessCaseInverted-bg': badgeColors.businessCaseInverted.bg,
        'badge-businessCaseInverted-text': badgeColors.businessCaseInverted.text,
        'badge-businessCaseInverted-border': badgeColors.businessCaseInverted.border,
        'badge-purchaseReq-bg': badgeColors.purchaseReq.bg,
        'badge-purchaseReq-text': badgeColors.purchaseReq.text,
        'badge-purchaseReqInverted-bg': badgeColors.purchaseReqInverted.bg,
        'badge-purchaseReqInverted-text': badgeColors.purchaseReqInverted.text,
        'badge-purchaseReqInverted-border': badgeColors.purchaseReqInverted.border,
        'badge-purchaseOrder-bg': badgeColors.purchaseOrder.bg,
        'badge-purchaseOrder-text': badgeColors.purchaseOrder.text,
        'badge-purchaseOrderInverted-bg': badgeColors.purchaseOrderInverted.bg,
        'badge-purchaseOrderInverted-text': badgeColors.purchaseOrderInverted.text,
        'badge-purchaseOrderInverted-border': badgeColors.purchaseOrderInverted.border,
        'badge-integrator-bg': badgeColors.integrator.bg,
        'badge-integrator-text': badgeColors.integrator.text,
        'badge-integratorInverted-bg': badgeColors.integratorInverted.bg,
        'badge-integratorInverted-text': badgeColors.integratorInverted.text,
        'badge-integratorInverted-border': badgeColors.integratorInverted.border,
        'badge-networkBuild-bg': badgeColors.networkBuild.bg,
        'badge-networkBuild-text': badgeColors.networkBuild.text,
        'badge-networkBuildInverted-bg': badgeColors.networkBuildInverted.bg,
        'badge-networkBuildInverted-text': badgeColors.networkBuildInverted.text,
        'badge-networkBuildInverted-border': badgeColors.networkBuildInverted.border,
        'badge-logicalBuild-bg': badgeColors.logicalBuild.bg,
        'badge-logicalBuild-text': badgeColors.logicalBuild.text,
        'badge-logicalBuildInverted-bg': badgeColors.logicalBuildInverted.bg,
        'badge-logicalBuildInverted-text': badgeColors.logicalBuildInverted.text,
        'badge-logicalBuildInverted-border': badgeColors.logicalBuildInverted.border,
        'badge-completed-bg': badgeColors.completed.bg,
        'badge-completed-text': badgeColors.completed.text,
        'badge-completedInverted-bg': badgeColors.completedInverted.bg,
        'badge-completedInverted-text': badgeColors.completedInverted.text,
        'badge-completedInverted-border': badgeColors.completedInverted.border,
        'badge-unassigned1-bg': badgeColors.unassigned1.bg,
        'badge-unassigned1-text': badgeColors.unassigned1.text,
        'badge-unassigned1Inverted-bg': badgeColors.unassigned1Inverted.bg,
        'badge-unassigned1Inverted-text': badgeColors.unassigned1Inverted.text,
        'badge-unassigned1Inverted-border': badgeColors.unassigned1Inverted.border,
        'badge-unassigned2-bg': badgeColors.unassigned2.bg,
        'badge-unassigned2-text': badgeColors.unassigned2.text,
        'badge-unassigned2Inverted-bg': badgeColors.unassigned2Inverted.bg,
        'badge-unassigned2Inverted-text': badgeColors.unassigned2Inverted.text,
        'badge-unassigned2Inverted-border': badgeColors.unassigned2Inverted.border,
        'badge-critical-bg': badgeColors.critical.bg,
        'badge-critical-text': badgeColors.critical.text,
        'badge-highPriority-bg': badgeColors.highPriority.bg,
        'badge-highPriority-text': badgeColors.highPriority.text,
        'badge-standard-bg': badgeColors.standard.bg,
        'badge-standard-text': badgeColors.standard.text,
        'badge-atRisk-bg': badgeColors.atRisk.bg,
        'badge-atRisk-text': badgeColors.atRisk.text,
        // Chart colors
        'chart-status-error': colors.error[500],
        'chart-status-warning': colors.warning[500],
        'chart-status-success': colors.success[500],
        'chart-status-neutral': colors.neutral[500],
        'chart-status-primary': colors.primary[600],
      },
      fontFamily: {
        heading: typography.fontFamily.heading,
        body: typography.fontFamily.body,
      },
      fontSize: Object.entries(typography.fontSize).reduce((acc, [key, [size, { lineHeight }]]) => {
        acc[key] = [size, { lineHeight }];
        return acc;
      }, {}),
      fontWeight: typography.fontWeight,
      lineHeight: typography.lineHeight,
      letterSpacing: typography.letterSpacing,
      spacing: spacing,
      borderRadius: borderRadius,
      boxShadow: {
        ...shadows,
        chart: shadows.md,
      },
      // Custom animations for the design system
      animation: {
        'spin': 'spin 1s linear infinite',
        'bounce': 'bounce 1s infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'fade-out': 'fadeOut 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-out': 'slideOut 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideOut: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      // Custom transitions for theme switching
      transitionProperty: {
        'colors': 'color, background-color, border-color, text-decoration-color, fill, stroke',
        'theme': 'color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform',
      },
      transitionDuration: {
        '0': '0ms',
        '150': '150ms',
        '300': '300ms',
        '500': '500ms',
        '700': '700ms',
        '1000': '1000ms',
      },
      // Z-index scale for layering
      zIndex: {
        '0': 0,
        '10': 10,
        '20': 20,
        '30': 30,
        '40': 40,
        '50': 50,
        '60': 60,
        '70': 70,
        '80': 80,
        '90': 90,
        '100': 100,
        '1000': 1000,
        '1100': 1100,
        '9999': 9999,
      },
    },
  },
  plugins: [
    // Custom plugin for design system utilities
    function({ addUtilities, theme }) {
      // Add theme transition utilities
      addUtilities({
        '.theme-transition-enhanced': {
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        '.theme-transition-stable': {
          transition: 'color 0.3s ease, background-color 0.3s ease, border-color 0.3s ease',
        },
        '.no-transitions': {
          transition: 'none !important',
          '& *': {
            transition: 'none !important',
          },
        },
      });

      // Add custom scrollbar utilities
      addUtilities({
        '.scrollbar-hide': {
          /* Hide scrollbar for Chrome, Safari and Opera */
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          /* Hide scrollbar for IE, Edge and Firefox */
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
        },
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: theme('colors.neutral.100'),
          },
          '&::-webkit-scrollbar-thumb': {
            background: theme('colors.neutral.400'),
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: theme('colors.neutral.500'),
          },
          '&.dark::-webkit-scrollbar-track': {
            background: theme('colors.neutral.800'),
          },
          '&.dark::-webkit-scrollbar-thumb': {
            background: theme('colors.neutral.600'),
          },
          '&.dark::-webkit-scrollbar-thumb:hover': {
            background: theme('colors.neutral.500'),
          },
        },
      });

      // Add focus-visible utilities
      addUtilities({
        '.focus-ring': {
          '&:focus-visible': {
            outline: '2px solid transparent',
            'outline-offset': '2px',
            'box-shadow': `0 0 0 2px ${theme('colors.primary.500')}`,
          },
          '&.dark:focus-visible': {
            'box-shadow': `0 0 0 2px ${theme('colors.primary.400')}`,
          },
        },
      });
    },
  ],
}; 