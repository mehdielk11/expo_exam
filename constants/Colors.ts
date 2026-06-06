// Design tokens for FlavorCraft — clean, minimalist, warm palette

export const Colors = {
  // Backgrounds
  background: '#FAFAF8',
  surface: '#FFFFFF',
  surfaceAlt: '#F3EFE9',

  // Primary accent — warm amber
  accent: '#D4813A',
  accentLight: '#F5E6D3',
  accentDark: '#A85C1E',

  // Text
  textPrimary: '#1C1C1C',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',

  // Semantic
  success: '#4A7C59',
  successLight: '#D4EDDA',
  danger: '#C0392B',
  dangerLight: '#FADBD8',

  // Category badge backgrounds
  categoryBreakfast: '#FFF3CD',
  categoryLunch: '#D1ECF1',
  categoryDinner: '#E2D9F3',
  categoryDessert: '#FADADD',

  // Category badge text
  categoryBreakfastText: '#856404',
  categoryLunchText: '#0C5460',
  categoryDinnerText: '#4A3A72',
  categoryDessertText: '#7B2D35',

  // Tab bar
  tabActive: '#D4813A',
  tabInactive: '#9CA3AF',
  tabBar: '#FFFFFF',

  // Borders
  border: '#E5E7EB',
  borderFocus: '#D4813A',

  // Input
  inputBg: '#F9F9F8',
};

export const Typography = {
  fontSizeXs: 12,
  fontSizeSm: 14,
  fontSizeBase: 16,
  fontSizeLg: 18,
  fontSizeXl: 22,
  fontSize2xl: 28,
  fontSize3xl: 34,

  fontWeightNormal: '400' as const,
  fontWeightMedium: '500' as const,
  fontWeightSemibold: '600' as const,
  fontWeightBold: '700' as const,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};
