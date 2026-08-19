import { Platform, StyleSheet } from 'react-native';

// Brand palette: #3A0519 (primary maroon) / #C08A2E (gold accent) / #F6E2B4 (pale gold)
export const Brand = {
  darkest: '#06042a',
  primary: '#06042a',
  accent: '#C08A2E',
  light: '#F6E2B4',
  cream: '#EAE5DB',
  whatsapp: '#25D366',
};

export type ColorScheme = 'light' | 'dark';

export type ThemeColors = {
  base: string;
  surface: string;
  text: string;
  textMuted: string;
  placeholder: string;
  divider: string;
  accentText: string;
  danger: string;
  tabInactive: string;
  shadowColor: string;
  highlightBorder: string;
  shadowBorder: string;
  pressedHighlight: string;
  pressedShadow: string;
};

// Neumorphic (soft-UI) surface tokens per color scheme. Elements are the same
// base tone as the page and read as raised/pressed through a light highlight +
// dark shadow pair rather than borders or flat color blocks.
export const Themes: Record<ColorScheme, ThemeColors> = {
  light: {
    base: '#FFFFFF',
    surface: '#FFFFFF',
    text: '#24201A',
    textMuted: '#6E6455',
    placeholder: '#9A907C',
    divider: 'rgba(36,32,26,0.08)',
    accentText: Brand.primary,
    danger: '#B3261E',
    tabInactive: '#A0967F',
    shadowColor: '#968A76',
    highlightBorder: 'rgba(255,255,255,0.6)',
    shadowBorder: 'rgba(36,32,26,0.14)',
    pressedHighlight: 'rgba(255,255,255,0.5)',
    pressedShadow: 'rgba(36,32,26,0.16)',
  },
  dark: {
    base: '#161D19',
    surface: '#161D19',
    text: '#F1EAD9',
    textMuted: '#B9AE95',
    placeholder: '#8C8270',
    divider: 'rgba(255,255,255,0.08)',
    accentText: Brand.light,
    danger: '#FF7A70',
    tabInactive: '#7C8A80',
    shadowColor: '#000000',
    highlightBorder: 'rgba(255,255,255,0.14)',
    shadowBorder: 'rgba(0,0,0,0.4)',
    pressedHighlight: 'rgba(0,0,0,0.3)',
    pressedShadow: 'rgba(255,255,255,0.08)',
  },
};

export type EdgeStyles = ReturnType<typeof createEdgeStyles>;

// Shared raised/pressed edge treatment, reusable directly on any surface
// (cards, rows, badges) without wrapping in the Neumorphic component.
export function createEdgeStyles(colors: ThemeColors) {
  return StyleSheet.create({
    raised: {
      borderWidth: 1,
      borderTopColor: colors.highlightBorder,
      borderLeftColor: colors.highlightBorder,
      borderBottomColor: colors.shadowBorder,
      borderRightColor: colors.shadowBorder,
      shadowColor: colors.shadowColor,
      shadowOffset: { width: 5, height: 7 },
      shadowOpacity: 0.65,
      shadowRadius: 14,
      elevation: 6,
    },
    pressed: {
      borderWidth: 1,
      borderTopColor: colors.pressedShadow,
      borderLeftColor: colors.pressedShadow,
      borderBottomColor: colors.pressedHighlight,
      borderRightColor: colors.pressedHighlight,
    },
  });
}

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
