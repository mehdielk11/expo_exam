// Design tokens for FlavorCraft — clean, minimalist, warm palette

export const Colors = {
  // Backgrounds
  background: '#FAF9F6',
  surface: '#FFFFFF',
  surfaceAlt: '#F5F3ED',

  // Primary accent — terracotta / warm clay
  accent: '#C87A53',
  accentLight: '#F4ECE1',
  accentDark: '#8E4A2A',

  // Text
  textPrimary: '#1E1E1C',
  textSecondary: '#5C5C5A',
  textMuted: '#8E8E8A',

  // Semantic
  success: '#4F775D',
  successLight: '#E6EFEA',
  danger: '#A94442',
  dangerLight: '#F2DEDE',

  // Category badge backgrounds
  categoryBreakfast: '#F9F2E6',
  categoryLunch: '#E2ECE9',
  categoryDinner: '#EBE5ED',
  categoryDessert: '#F2E2E6',

  // Category badge text
  categoryBreakfastText: '#9E6F3E',
  categoryLunchText: '#4C7368',
  categoryDinnerText: '#655375',
  categoryDessertText: '#8E4F5A',

  // Tab bar
  tabActive: '#C87A53',
  tabInactive: '#8E8E8A',
  tabBar: '#FFFFFF',

  // Borders
  border: '#EAE8E2',
  borderFocus: '#C87A53',

  // Input
  inputBg: '#FAF9F6',
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
