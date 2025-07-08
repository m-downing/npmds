//src/design-system/foundations/tokens/types.ts

/**
 * TypeScript type definitions for design tokens
 */

// Color types
export interface ColorScale {
  50?: string;
  100?: string;
  200?: string;
  300?: string;
  400?: string;
  500?: string;
  600?: string;
  700?: string;
  800?: string;
  900?: string;
  950?: string;
}

export interface DataVizColors {
  primary: string;
  secondary: string;
  positive: string;
  negative: string;
  alt: string;
  highlight: string;
}

export interface Colors {
  primary: ColorScale;
  neutral: ColorScale;
  success: ColorScale;
  warning: ColorScale;
  error: ColorScale;
  red: ColorScale;
  purple: ColorScale;
  green: ColorScale;
  teal: ColorScale;
  amber: ColorScale;
  yellow: ColorScale;
  brown: ColorScale;
  orange: ColorScale;
  magenta: ColorScale;
  blue: ColorScale;
  slate: ColorScale;
  dataViz: DataVizColors;
}

export interface BadgeColor {
  bg: string;
  text: string;
  border?: string;
}

export interface BadgeColors {
  forecast: BadgeColor;
  forecastInverted: BadgeColor;
  sop: BadgeColor;
  sopInverted: BadgeColor;
  businessCase: BadgeColor;
  businessCaseInverted: BadgeColor;
  purchaseReq: BadgeColor;
  purchaseReqInverted: BadgeColor;
  purchaseOrder: BadgeColor;
  purchaseOrderInverted: BadgeColor;
  integrator: BadgeColor;
  integratorInverted: BadgeColor;
  networkBuild: BadgeColor;
  networkBuildInverted: BadgeColor;
  logicalBuild: BadgeColor;
  logicalBuildInverted: BadgeColor;
  completed: BadgeColor;
  completedInverted: BadgeColor;
  unassigned1: BadgeColor;
  unassigned1Inverted: BadgeColor;
  unassigned2: BadgeColor;
  unassigned2Inverted: BadgeColor;
  critical: BadgeColor;
  highPriority: BadgeColor;
  standard: BadgeColor;
  atRisk: BadgeColor;
}

// Typography types
export interface FontSize {
  xxs: [string, { lineHeight: string }];
  xs: [string, { lineHeight: string }];
  sm: [string, { lineHeight: string }];
  base: [string, { lineHeight: string }];
  lg: [string, { lineHeight: string }];
  xl: [string, { lineHeight: string }];
  '2xl': [string, { lineHeight: string }];
  '3xl': [string, { lineHeight: string }];
  '4xl': [string, { lineHeight: string }];
  '5xl': [string, { lineHeight: string }];
}

export interface Typography {
  fontFamily: {
    heading: string[];
    body: string[];
  };
  fontSize: FontSize;
  fontWeight: {
    normal: string;
    medium: string;
    semibold: string;
    bold: string;
  };
  lineHeight: {
    tight: string;
    normal: string;
    relaxed: string;
  };
  letterSpacing: {
    tight: string;
    normal: string;
    wide: string;
  };
}

// Spacing types
export interface Spacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

// Border radius types
export interface BorderRadius {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

// Shadow types
export interface Shadows {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

// Utility function types
export type FontSizeKey = keyof FontSize;
export type FontWeightKey = keyof Typography['fontWeight'];
export type FontFamilyKey = keyof Typography['fontFamily'];
export type LineHeightKey = keyof Typography['lineHeight'];
export type LetterSpacingKey = keyof Typography['letterSpacing'];

export interface GetTypography {
  fontFamily: (key: FontFamilyKey) => string;
  fontSize: (key: FontSizeKey) => string;
  lineHeight: (fontSizeKey?: FontSizeKey, lineHeightKey?: LineHeightKey) => string;
  fontWeight: (key: FontWeightKey) => string;
  letterSpacing: (key: LetterSpacingKey) => string;
  textStyle: (fontSizeKey: FontSizeKey, fontFamilyKey?: FontFamilyKey) => {
    fontFamily: string;
    fontSize: string;
    lineHeight: string;
    fontWeight: string;
    letterSpacing: string;
  };
} 