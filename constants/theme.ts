export interface Theme {
  background: string // Maps to bg-[#FCFCFC]
  textPrimary: string // Maps to text-[#2E2E2E]
  textSecondary: string // Maps to text-[#767676]
  textDebit: string // Maps to text-[#FF0000]
  textDefault: string // Maps to text-[#121212]
  textTertiary: string // Maps to ActionItems textTertiary
  separator: string // Maps to bg-[#E6E6E6]
  iconBackground: {
    create: string // Maps to #CFECFE
    credit: string // Maps to #D4FFAB
    debit: string // Maps to #FFD1D1
    transfer: string // Maps to #FFF0E0
  }
  skeletonBackground: string // Maps to bg-gray-200
  skeletonSecondary: string // Maps to bg-gray-100
  skeletonShimmer: string // Maps to via-white/20 or via-white/30
  skeletonBadgeOrange: string // Maps to bg-orange-100
  skeletonBadgeOrangeShimmer: string // Maps to via-orange-200/50
  skeletonBadgeBlue: string // Maps to bg-blue-100
  skeletonBadgeBlueShimmer: string // Maps to via-blue-200/50
  skeletonBorder: string // Maps to border-gray-200
  starIcon: string // Maps to text-gray-300
  cardBackground: string // Maps to ActionItems card background
  shadowColor: string // Maps to ActionItems shadow
  progressTrack: string // Maps to HalfCircleProgress track
  progressGradientStart: string // Maps to HalfCircleProgress gradient start
  progressGradientEnd: string // Maps to HalfCircleProgress gradient end
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
    textTertiary: '#4B5563', // Example for textTertiary
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
  },
}

export default function getTheme(colorScheme: 'light' | 'dark'): Theme {
  return themes[colorScheme]
}
