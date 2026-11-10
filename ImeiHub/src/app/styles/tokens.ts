/**
 * Design Tokens for Colors and Typography
 */

export const colors = {
  primary: "#2457e6",
  primaryDark: "#173ca8",
  primarySoft: "#edf2ff",
  ink: "#172033",
  inkSecondary: "#3b4861",
  muted: "#718096",
  mutedLight: "#9ba7bc",
  line: "#e4e8ee",
  soft: "#f4f6f8",
  surface: "#ffffff",
  darkBg: "#111b2f",
  darkCard: "#26344e",
  darkBorder: "#26334a",
  success: "#15966b",
  successSoft: "#e9f8f2",
  warning: "#e66c38",
  warningSoft: "#fff0e9",
  danger: "#d94a4a",
  dangerSoft: "#fff0f0",
} as const;

export const typography = {
  fontFamily: '"Manrope", ui-sans-serif, system-ui, sans-serif',
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
} as const;
