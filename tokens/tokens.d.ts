/**
 * YAMI Design Tokens TypeScript 类型定义
 * 版本: 1.0.0
 * 描述: 由 tokens.json 自动生成，请勿手工编辑
 */

export interface TokenValue {
  value: string;
  description?: string;
}

type TokensRoot = {
  $schema: string;
  version: string;
  name: string;
  description: string;
  color: {
  brand: {
  primary: TokenValue;
};
  ui: {
  primary: TokenValue;
};
  background: {
  light: TokenValue;
  dark: TokenValue;
};
  surface: {
  light: TokenValue;
  dark: TokenValue;
};
  text: {
  primary: {
  light: TokenValue;
  dark: TokenValue;
};
  secondary: {
  light: TokenValue;
  dark: TokenValue;
};
  tertiary: {
  light: TokenValue;
  dark: TokenValue;
};
};
  icon: {
  primary: {
  light: TokenValue;
  dark: TokenValue;
};
  secondary: {
  light: TokenValue;
  dark: TokenValue;
};
  muted: {
  light: TokenValue;
  dark: TokenValue;
};
};
  border: {
  subtle: {
  light: TokenValue;
  dark: TokenValue;
};
  strong: {
  light: TokenValue;
  dark: TokenValue;
};
  light: TokenValue;
  dark: TokenValue;
};
  divider: {
  section: {
  light: TokenValue;
  dark: TokenValue;
};
};
  code: {
  bg: {
  light: TokenValue;
  dark: TokenValue;
};
  text: {
  light: TokenValue;
  dark: TokenValue;
};
  border: {
  light: TokenValue;
  dark: TokenValue;
};
};
  badge: {
  primary: TokenValue;
  secondary: TokenValue;
  success: TokenValue;
  warning: TokenValue;
  error: TokenValue;
};
  overlay: {
  black: TokenValue;
  white: TokenValue;
  light: TokenValue;
  dark: TokenValue;
};
  state: {
  hover: {
  light: TokenValue;
  dark: TokenValue;
};
  selected: {
  light: TokenValue;
  dark: TokenValue;
};
  pressed: {
  light: TokenValue;
  dark: TokenValue;
};
  focus: {
  light: TokenValue;
  dark: TokenValue;
};
};
  campaign: {
  primary: TokenValue;
  secondary: TokenValue;
};
  palette: {
  red: {
  '50': TokenValue;
  '100': TokenValue;
  '200': TokenValue;
  '300': TokenValue;
  '400': TokenValue;
  '500': TokenValue;
  '600': TokenValue;
  '700': TokenValue;
  '800': TokenValue;
  '900': TokenValue;
  '950': TokenValue;
};
  neutral: {
  '50': TokenValue;
  '100': TokenValue;
  '200': TokenValue;
  '300': TokenValue;
  '400': TokenValue;
  '500': TokenValue;
  '600': TokenValue;
  '700': TokenValue;
  '800': TokenValue;
  '900': TokenValue;
  '950': TokenValue;
};
  black: {
  '0': TokenValue;
  '100': TokenValue;
  '200': TokenValue;
  '300': TokenValue;
  '400': TokenValue;
  '500': TokenValue;
  '600': TokenValue;
  '700': TokenValue;
  '800': TokenValue;
  '900': TokenValue;
  '1000': TokenValue;
};
  white: {
  '0': TokenValue;
  '100': TokenValue;
  '200': TokenValue;
  '300': TokenValue;
  '400': TokenValue;
  '500': TokenValue;
  '600': TokenValue;
  '700': TokenValue;
  '800': TokenValue;
  '900': TokenValue;
  '1000': TokenValue;
};
  yellow: {
  '50': TokenValue;
  '100': TokenValue;
  '200': TokenValue;
  '300': TokenValue;
  '400': TokenValue;
  '500': TokenValue;
  '600': TokenValue;
  '700': TokenValue;
  '800': TokenValue;
  '900': TokenValue;
  '950': TokenValue;
};
  emerald: {
  '50': TokenValue;
  '100': TokenValue;
  '200': TokenValue;
  '300': TokenValue;
  '400': TokenValue;
  '500': TokenValue;
  '600': TokenValue;
  '700': TokenValue;
  '800': TokenValue;
  '900': TokenValue;
  '950': TokenValue;
};
  blue: {
  '50': TokenValue;
  '100': TokenValue;
  '200': TokenValue;
  '300': TokenValue;
  '400': TokenValue;
  '500': TokenValue;
  '600': TokenValue;
  '700': TokenValue;
  '800': TokenValue;
  '900': TokenValue;
  '950': TokenValue;
};
  purple: {
  '50': TokenValue;
  '100': TokenValue;
  '200': TokenValue;
  '300': TokenValue;
  '400': TokenValue;
  '500': TokenValue;
  '600': TokenValue;
  '700': TokenValue;
  '800': TokenValue;
  '900': TokenValue;
  '950': TokenValue;
};
};
};
  typography: {
  fontFamily: {
  brand: TokenValue;
  chinese: {
  simplified: TokenValue;
  traditional: TokenValue;
  fallback: TokenValue;
};
  japanese: TokenValue;
  korean: TokenValue;
  english: {
  primary: TokenValue;
  fallback: TokenValue;
};
  platform: {
  ios: {
  latin: TokenValue;
  chineseSimplified: TokenValue;
  chineseTraditional: TokenValue;
};
  android: {
  latin: TokenValue;
  cjk: TokenValue;
};
  web: {
  latin: TokenValue;
  chinese: TokenValue;
};
};
};
  display: {
  large: {
  fontSize: {
  mobile: TokenValue;
  tablet: TokenValue;
  desktop: TokenValue;
};
  lineHeight: {
  mobile: TokenValue;
  tablet: TokenValue;
  desktop: TokenValue;
};
  fontWeight: TokenValue;
  description: string;
};
  medium: {
  fontSize: {
  mobile: TokenValue;
  tablet: TokenValue;
  desktop: TokenValue;
};
  lineHeight: {
  mobile: TokenValue;
  tablet: TokenValue;
  desktop: TokenValue;
};
  fontWeight: TokenValue;
  description: string;
};
  small: {
  fontSize: {
  mobile: TokenValue;
  tablet: TokenValue;
  desktop: TokenValue;
};
  lineHeight: {
  mobile: TokenValue;
  tablet: TokenValue;
  desktop: TokenValue;
};
  fontWeight: TokenValue;
  description: string;
};
};
  heading: {
  large: {
  fontSize: {
  mobile: TokenValue;
  tablet: TokenValue;
  desktop: TokenValue;
};
  lineHeight: {
  mobile: TokenValue;
  tablet: TokenValue;
  desktop: TokenValue;
};
  fontWeight: TokenValue;
  description: string;
};
  medium: {
  fontSize: {
  mobile: TokenValue;
  tablet: TokenValue;
  desktop: TokenValue;
};
  lineHeight: {
  mobile: TokenValue;
  tablet: TokenValue;
  desktop: TokenValue;
};
  fontWeight: TokenValue;
  description: string;
};
  small: {
  fontSize: {
  mobile: TokenValue;
  tablet: TokenValue;
  desktop: TokenValue;
};
  lineHeight: {
  mobile: TokenValue;
  tablet: TokenValue;
  desktop: TokenValue;
};
  fontWeight: TokenValue;
  description: string;
};
};
  body: {
  large: {
  fontSize: {
  mobile: TokenValue;
  tablet: TokenValue;
  desktop: TokenValue;
};
  lineHeight: {
  mobile: TokenValue;
  tablet: TokenValue;
  desktop: TokenValue;
};
  fontWeight: TokenValue;
  description: string;
};
  medium: {
  fontSize: {
  mobile: TokenValue;
  tablet: TokenValue;
  desktop: TokenValue;
};
  lineHeight: {
  mobile: TokenValue;
  tablet: TokenValue;
  desktop: TokenValue;
};
  fontWeight: TokenValue;
  description: string;
};
};
  caption: {
  medium: {
  fontSize: {
  mobile: TokenValue;
  tablet: TokenValue;
  desktop: TokenValue;
};
  lineHeight: {
  mobile: TokenValue;
  tablet: TokenValue;
  desktop: TokenValue;
};
  fontWeight: TokenValue;
  description: string;
};
  small: {
  fontSize: {
  mobile: TokenValue;
  tablet: TokenValue;
  desktop: TokenValue;
};
  lineHeight: {
  mobile: TokenValue;
  tablet: TokenValue;
  desktop: TokenValue;
};
  fontWeight: TokenValue;
  description: string;
};
};
  link: {
  large: {
  fontSize: {
  mobile: TokenValue;
  tablet: TokenValue;
  desktop: TokenValue;
};
  lineHeight: {
  mobile: TokenValue;
  tablet: TokenValue;
  desktop: TokenValue;
};
  fontWeight: TokenValue;
  textDecoration: TokenValue;
  description: string;
};
  medium: {
  fontSize: {
  mobile: TokenValue;
  tablet: TokenValue;
  desktop: TokenValue;
};
  lineHeight: {
  mobile: TokenValue;
  tablet: TokenValue;
  desktop: TokenValue;
};
  fontWeight: TokenValue;
  textDecoration: TokenValue;
  description: string;
};
};
  fontWeight: {
  regular: TokenValue;
  medium: TokenValue;
};
};
  spacing: {
  '0': TokenValue;
  '025': TokenValue;
  '050': TokenValue;
  '100': TokenValue;
  '150': TokenValue;
  '200': TokenValue;
  '250': TokenValue;
  '300': TokenValue;
  '400': TokenValue;
  '500': TokenValue;
  '600': TokenValue;
  '800': TokenValue;
  '1000': TokenValue;
};
  layout: {
  container: {
  maxWidth: {
  desktop: TokenValue;
};
};
  grid: {
  xxs: {
  columns: TokenValue;
  gutter: TokenValue;
  margin: TokenValue;
};
  xs: {
  columns: TokenValue;
  gutter: TokenValue;
  margin: TokenValue;
};
  s: {
  columns: TokenValue;
  gutter: TokenValue;
  margin: TokenValue;
};
  m: {
  columns: TokenValue;
  gutter: TokenValue;
  margin: TokenValue;
};
  l: {
  columns: TokenValue;
  gutter: TokenValue;
  margin: TokenValue;
};
  xl: {
  columns: TokenValue;
  gutter: TokenValue;
  margin: TokenValue;
};
};
  breakpoint: {
  xxs: {
  min: TokenValue;
  max: TokenValue;
};
  xs: {
  min: TokenValue;
  max: TokenValue;
};
  s: {
  min: TokenValue;
  max: TokenValue;
};
  m: {
  min: TokenValue;
  max: TokenValue;
};
  l: {
  min: TokenValue;
  max: TokenValue;
};
  xl: {
  min: TokenValue;
  max: TokenValue;
};
};
};
  borderRadius: {
  none: TokenValue;
  small: TokenValue;
  medium: TokenValue;
  large: TokenValue;
  full: TokenValue;
};
  shadow: {
  e1: TokenValue;
  e2: TokenValue;
  e3: TokenValue;
  e4: TokenValue;
  e5: TokenValue;
};
  elevation: {
  base: TokenValue;
  elevated: {
  min: TokenValue;
  max: TokenValue;
};
  modal: {
  min: TokenValue;
  max: TokenValue;
};
};
  icon: {
  size: {
  standard: TokenValue;
  small: TokenValue;
  mini: TokenValue;
};
};
  button: {
  height: {
  large: TokenValue;
  medium: TokenValue;
  small: TokenValue;
  mini: TokenValue;
};
  padding: {
  horizontal: {
  large: TokenValue;
  medium: TokenValue;
  small: TokenValue;
  mini: TokenValue;
};
};
  borderRadius: {
  large: TokenValue;
  medium: TokenValue;
  small: TokenValue;
  mini: TokenValue;
};
};
  badge: {
  size: {
  standard: {
  height: TokenValue;
  padding: {
  horizontal: TokenValue;
};
};
  small: {
  height: TokenValue;
  padding: {
  horizontal: TokenValue;
};
};
};
  borderRadius: TokenValue;
};
  zIndex: {
  base: TokenValue;
  dropdown: TokenValue;
  sticky: TokenValue;
  fixed: TokenValue;
  modalBackdrop: TokenValue;
  modal: TokenValue;
  popover: TokenValue;
  tooltip: TokenValue;
};
  opacity: {
  '04': TokenValue;
  '08': TokenValue;
  '12': TokenValue;
  '16': TokenValue;
  '24': TokenValue;
};
  animation: {
  duration: {
  fast: TokenValue;
  normal: TokenValue;
  slow: TokenValue;
};
  easing: {
  easeIn: TokenValue;
  easeOut: TokenValue;
  easeInOut: TokenValue;
};
};
};

export interface DesignTokens extends TokensRoot {}

export type DesignTokensShape = TokensRoot;
