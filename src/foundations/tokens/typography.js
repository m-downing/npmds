/**
 * Design system typography tokens
 * This is the single source of truth for all typography values in the design system.
 */

const typography = {
  fontFamily: {
    heading: ['Bahnschrift', 'Tahoma', 'Arial', 'sans-serif'],
    body: ['Bahnschrift', 'Tahoma', 'Arial', 'sans-serif'],
  },
  fontSize: {
    xxs: ['0.625rem', { lineHeight: '1' }],      // 10px
    xs: ['0.75rem', { lineHeight: '1' }],        // 12px
    sm: ['0.875rem', { lineHeight: '1.5' }],     // 14px
    base: ['1rem', { lineHeight: '1.625' }],     // 16px
    lg: ['1.125rem', { lineHeight: '1.625' }],   // 18px
    xl: ['1.25rem', { lineHeight: '1.625' }],    // 20px
    '2xl': ['1.5rem', { lineHeight: '1.5' }],    // 24px
    '3xl': ['1.875rem', { lineHeight: '1.4' }],  // 30px
    '4xl': ['2.25rem', { lineHeight: '1.3' }],   // 36px
    '5xl': ['3rem', { lineHeight: '1.2' }],      // 48px
  },
  fontWeight: {
    thin: '100',       // Will fallback to Light (300)
    light: '300',      // Bahnschrift Light
    normal: '400',     // Bahnschrift Regular
    medium: '500',     // Will use Regular (400) as fallback
    semibold: '600',   // Bahnschrift SemiBold
    bold: '700',       // Bahnschrift Bold
    black: '900',      // Will use Bold (700) as fallback
  },

  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.625',
  },
  letterSpacing: {
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
  },
};

// Utility functions for component consumption
const getTypography = {
  /**
   * Get font family as CSS-compatible string
   */
  fontFamily: (key) => {
    return typography.fontFamily[key].join(', ');
  },
  
  /**
   * Get font size value (without line height)
   */
  fontSize: (key) => {
    const value = typography.fontSize[key];
    return value[0];
  },
  
  /**
   * Get line height from fontSize token or dedicated lineHeight token
   */
  lineHeight: (fontSizeKey, lineHeightKey) => {
    if (lineHeightKey) {
      return typography.lineHeight[lineHeightKey];
    }
    
    if (fontSizeKey) {
      const value = typography.fontSize[fontSizeKey];
      if (Array.isArray(value) && typeof value[1] === 'object' && 'lineHeight' in value[1]) {
        return value[1].lineHeight;
      }
    }
    
    return typography.lineHeight.normal;
  },
  
  /**
   * Get font weight value
   */
  fontWeight: (key) => {
    return typography.fontWeight[key];
  },
  
  /**
   * Get letter spacing value
   */
  letterSpacing: (key) => {
    return typography.letterSpacing[key];
  },
  
  /**
   * Get complete typography style object for a given font size
   */
  textStyle: (fontSizeKey, fontFamilyKey = 'body') => {
    return {
      fontFamily: getTypography.fontFamily(fontFamilyKey),
      fontSize: getTypography.fontSize(fontSizeKey),
      lineHeight: getTypography.lineHeight(fontSizeKey),
      fontWeight: typography.fontWeight.normal,
      letterSpacing: typography.letterSpacing.normal,
    };
  },
};

// CommonJS default export only
module.exports = { typography, getTypography }; 