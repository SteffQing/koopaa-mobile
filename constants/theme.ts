export interface Theme {
  background: string
  textPrimary: string
  textSecondary: string
  textDebit: string
  textDefault: string
  textTertiary: string
  separator: string
  iconBackground: {
    create: string
    credit: string
    debit: string
    transfer: string
  }
  skeletonBackground: string
  skeletonSecondary: string
  skeletonShimmer: string
  skeletonBadgeOrange: string
  skeletonBadgeOrangeShimmer: string
  skeletonBadgeBlue: string
  skeletonBadgeBlueShimmer: string
  skeletonBorder: string
  starIcon: string
  cardBackground: string
  shadowColor: string
  progressTrack: string
  progressGradientStart: string
  progressGradientEnd: string
  orange: string // #ff6b00
  orangeHover: string // #e55a00
  orangeGradientStart: string // #ff6b00
  orangeGradientEnd: string // #ff8533
  green: string // green-500
  greenDark: string // green-800
  greenLight: string // green-600
  purpleGradientStart: string // purple-50
  purpleGradientEnd: string // pink-50
  purpleBorder: string // purple-200
  blueGradientStart: string // blue-50
  blueGradientEnd: string // cyan-50
  blueBorder: string // blue-200
  amber: string // amber-50
  amberDark: string // amber-700
  gray100: string // bg-gray-100
  gray50: string // bg-gray-50
  gray300: string // border-gray-200
  destructive: string // destructive button
}

export interface ThemeConfig {
  light: Theme
  dark: Theme
}

export const themes: ThemeConfig = {
  light: {
    background: '#FCFCFC',
    textPrimary: '#2E2E2E',
    textSecondary: '#767676',
    textDebit: '#FF0000',
    textDefault: '#121212',
    textTertiary: '#4B5563',
    separator: '#E6E6E6',
    iconBackground: {
      create: '#CFECFE',
      credit: '#D4FFAB',
      debit: '#FFD1D1',
      transfer: '#FFF0E0',
    },
    skeletonBackground: '#E5E7EB',
    skeletonSecondary: '#F3F4F6',
    skeletonShimmer: 'rgba(255, 255, 255, 0.2)',
    skeletonBadgeOrange: '#FEEBC8',
    skeletonBadgeOrangeShimmer: 'rgba(253, 186, 116, 0.5)',
    skeletonBadgeBlue: '#DBEAFE',
    skeletonBadgeBlueShimmer: 'rgba(96, 165, 250, 0.5)',
    skeletonBorder: '#E5E7EB',
    starIcon: '#D1D5DB',
    cardBackground: '#FFFFFF',
    shadowColor: '#000000',
    progressTrack: '#E5E7EB',
    progressGradientStart: '#3B82F6',
    progressGradientEnd: '#10B981',
    orange: '#FF6B00',
    orangeHover: '#E55A00',
    orangeGradientStart: '#FF6B00',
    orangeGradientEnd: '#FF8533',
    green: '#22C55E',
    greenDark: '#166534',
    greenLight: '#16A34A',
    purpleGradientStart: '#F3E8FF',
    purpleGradientEnd: '#FCE7F3',
    purpleBorder: '#EDE9FE',
    blueGradientStart: '#EFF6FF',
    blueGradientEnd: '#CFFAFE',
    blueBorder: '#DBEAFE',
    amber: '#FEF3C7',
    amberDark: '#B45309',
    gray100: '#F3F4F6',
    gray50: '#F9FAFB',
    gray300: '#E5E7EB',
    destructive: '#EF4444',
  },
  dark: {
    background: '#1F1F1F',
    textPrimary: '#E4E4E7',
    textSecondary: '#A1A1AA',
    textDebit: '#FF6666',
    textDefault: '#FFFFFF',
    textTertiary: '#9CA3AF',
    separator: '#3F3F46',
    iconBackground: {
      create: '#1E3A8A',
      credit: '#365314',
      debit: '#7F1D1D',
      transfer: '#7C2D12',
    },
    skeletonBackground: '#4B5563',
    skeletonSecondary: '#6B7280',
    skeletonShimmer: 'rgba(255, 255, 255, 0.1)',
    skeletonBadgeOrange: '#7C2D12',
    skeletonBadgeOrangeShimmer: 'rgba(253, 186, 116, 0.3)',
    skeletonBadgeBlue: '#1E3A8A',
    skeletonBadgeBlueShimmer: 'rgba(96, 165, 250, 0.3)',
    skeletonBorder: '#4B5563',
    starIcon: '#9CA3AF',
    cardBackground: '#27272A',
    shadowColor: '#000000',
    progressTrack: '#4B5563',
    progressGradientStart: '#60A5FA',
    progressGradientEnd: '#34D399',
    orange: '#FF6B00',
    orangeHover: '#E55A00',
    orangeGradientStart: '#FF6B00',
    orangeGradientEnd: '#FF8533',
    green: '#4ADE80',
    greenDark: '#15803D',
    greenLight: '#22C55E',
    purpleGradientStart: '#6B46C1',
    purpleGradientEnd: '#BE185D',
    purpleBorder: '#6B46C1',
    blueGradientStart: '#1E40AF',
    blueGradientEnd: '#155E75',
    blueBorder: '#1E40AF',
    amber: '#78350F',
    amberDark: '#F59E0B',
    gray100: '#4B5563',
    gray50: '#374151',
    gray300: '#6B7280',
    destructive: '#B91C1C',
  },
}

export default function getTheme(colorScheme: 'light' | 'dark'): Theme {
  return themes[colorScheme]
}
