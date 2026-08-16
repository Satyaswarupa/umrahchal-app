import { Platform, StyleSheet } from 'react-native';

// Brand palette: #040D12 (dominant/dark) / #183D3D (primary) / #5C8374 (accent) / #93B1A6 (light)
export const Brand = {
  darkest: '#040D12',
  primary: '#183D3D',
  accent: '#5C8374',
  light: '#93B1A6',
  cream: '#F4F1EA',
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
    base: '#E7EDE9',
    surface: '#E7EDE9',
    text: Brand.darkest,
    textMuted: '#5C6E6A',
    placeholder: '#8A9A95',
    divider: 'rgba(4,13,18,0.08)',
    accentText: Brand.primary,
    danger: '#B3261E',
    tabInactive: '#8A9A95',
    shadowColor: '#AEBCB4',
    highlightBorder: 'rgba(255,255,255,0.55)',
    shadowBorder: 'rgba(4,13,18,0.14)',
    pressedHighlight: 'rgba(255,255,255,0.45)',
    pressedShadow: 'rgba(4,13,18,0.16)',
  },
  dark: {
    base: '#1A211E',
    surface: '#1A211E',
    text: '#EDF2F0',
    textMuted: '#9AA8A4',
    placeholder: '#71827D',
    divider: 'rgba(255,255,255,0.08)',
    accentText: Brand.light,
    danger: '#FF7A70',
    tabInactive: '#5C6E6A',
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
