/**
 * Moodcoded Theme Tokens
 * Clean, restorative dark & light palettes designed for personal reflection.
 */

const lightTheme = {
  name: 'light',
  background: '#F8F9FA',
  surface: '#FFFFFF',
  cardBackground: '#FFFFFF',
  surfaceHover: '#F1F3F5',
  surfaceActive: '#E9ECEF',
  sidebarBg: '#FFFFFF',
  topbarBg: '#FFFFFF',

  text: '#1A1D20',
  textSecondary: '#6C757D',
  textDisabled: '#ADB5BD',

  border: '#E9ECEF',
  borderSubtle: '#F1F3F5',
  divider: '#E9ECEF',

  // Calming restorative indigo
  primary: '#6366F1',
  primaryHover: '#4F46E5',
  accent: '#6366F1',
  accentHover: '#4F46E5',
  accentLight: 'rgba(99, 102, 241, 0.08)',

  chipBg: '#F1F3F5',
  chipHover: '#E9ECEF',
  chipActiveBg: '#1A1D20',
  chipActiveText: '#FFFFFF',

  inputBg: '#FFFFFF',
  inputBorder: '#DEE2E6',
  inputFocusBorder: '#6366F1',

  // Natural emotional spectrum (1 = deep struggle -> 10 = thriving/peace)
  moodColors: {
    1: '#E06D6D', // Stressed / low
    2: '#E78665',
    3: '#EEA264',
    4: '#F3BE68',
    5: '#E9CD73', // Neutral steady
    6: '#C6D686',
    7: '#9AC997', // Good
    8: '#6CBBA8',
    9: '#59B1B7',
    10: '#5C9CE6' // Calm thriving
  }
};

const darkTheme = {
  name: 'dark',
  background: '#111215',      // Deep graphite
  surface: '#18191E',
  cardBackground: '#18191E',
  surfaceHover: '#21232A',
  surfaceActive: '#2A2C35',
  sidebarBg: '#141519',
  topbarBg: '#141519',

  text: '#F3F4F6',
  textSecondary: '#9CA3AF',
  textDisabled: '#6B7280',

  border: '#262830',
  borderSubtle: '#1E2026',
  divider: '#262830',

  primary: '#818CF8',
  primaryHover: '#6366F1',
  accent: '#818CF8',
  accentHover: '#6366F1',
  accentLight: 'rgba(129, 140, 248, 0.12)',

  chipBg: '#21232A',
  chipHover: '#2A2C35',
  chipActiveBg: '#F3F4F6',
  chipActiveText: '#111215',

  inputBg: '#141519',
  inputBorder: '#2E313B',
  inputFocusBorder: '#818CF8',

  moodColors: {
    1: '#F87171',
    2: '#FB923C',
    3: '#FBBF24',
    4: '#FCD34D',
    5: '#FDE047',
    6: '#BEF264',
    7: '#86EFAC',
    8: '#6EE7B7',
    9: '#5EEAD4',
    10: '#93C5FD'
  }
};

export { lightTheme, darkTheme };
