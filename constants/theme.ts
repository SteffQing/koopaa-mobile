export interface Theme {
  background: string
  iconBackground: string
}

export interface ThemeConfig {
  light: Theme
  dark: Theme
  spacing: { [key: string]: number }
  sizes: { maxWidth: number }
}

export const themes: ThemeConfig = {
  light: {
    background: '#FFFFFF',
    iconBackground: 'transparent',
  },
  dark: {
    background: '#121212',
    iconBackground: 'transparent',
  },
  spacing: {
    6: 24, // Maps to Tailwind's gap-6, bottom-6
    4: 16, // Maps to right-4
  },
  sizes: {
    maxWidth: 400, // Maps to max-w-[400px]
  },
}

export const getTheme = (colorScheme: 'light' | 'dark'): Theme => themes[colorScheme]
