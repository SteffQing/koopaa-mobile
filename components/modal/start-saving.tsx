import { useColorScheme, StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'
import { useEffect } from 'react'
import { useModal } from '@/providers/modal-provider'
import { useRouter } from 'expo-router'
import { toast } from 'react-native-toast-message'
import { Svg, Circle } from 'react-native-svg'
import getTheme from '@/constants/theme'
import ChevronRight from '@/assets/svgs/chevron-right.svg'
import Globe from '@/assets/svgs/globe.svg'
import Lock from '@/assets/svgs/lock.svg'

const groupTargetModalStyle = StyleSheet.create({
  container: {
    padding: 24,
  },
  iconSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    position: 'relative',
  },
  innerIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 32,
    height: 32,
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  cardIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '500',
  },
  cardDescription: {
    fontSize: 14,
  },
})

const GroupTargetModal: React.FC = () => {
  const colorScheme = useColorScheme()
  const theme = getTheme(colorScheme || 'light')
  const { hideModal } = useModal()
  const router = useRouter()

  const card1Y = useSharedValue(-2)
  const card1AnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: card1Y.value }],
  }))

  const card2Y = useSharedValue(-2)
  const card2AnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: card2Y.value }],
  }))

  useEffect(() => {
    card1Y.value = withTiming(0, { duration: 200 })
    card2Y.value = withTiming(0, { duration: 200 })
  }, [])

  return (
    <View style={groupTargetModalStyle.container}>
      <View style={groupTargetModalStyle.iconSection}>
        <View style={groupTargetModalStyle.iconWrapper}>
          <View style={[groupTargetModalStyle.innerIconWrapper, { backgroundColor: theme.textPrimary }]}>
            <View style={groupTargetModalStyle.colorGrid}>
              <View style={[groupTargetModalStyle.colorDot, { backgroundColor: theme.green }]} />
              <View style={[groupTargetModalStyle.colorDot, { backgroundColor: theme.progressGradientStart }]} />
              <View style={[groupTargetModalStyle.colorDot, { backgroundColor: '#FBBF24' }]} /> {/* yellow-400 */}
              <View style={[groupTargetModalStyle.colorDot, { backgroundColor: theme.purpleGradientStart }]} />
            </View>
          </View>
        </View>
      </View>
      <Text style={[groupTargetModalStyle.title, { color: theme.textPrimary }]}>Start a KooPaa Savings target</Text>
      <Animated.View
        style={[
          groupTargetModalStyle.card,
          { borderColor: theme.gray300, backgroundColor: theme.cardBackground },
          card1AnimatedStyle,
        ]}
      >
        <TouchableOpacity
          style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}
          onPress={() => {
            hideModal()
            router.push('/savings/create-ajo')
          }}
        >
          <View style={groupTargetModalStyle.cardContent}>
            <View style={[groupTargetModalStyle.cardIconWrapper, { backgroundColor: theme.gray100 }]}>
              <Globe width={24} height={24} />
            </View>
            <View>
              <Text style={[groupTargetModalStyle.cardTitle, { color: theme.textPrimary }]}>Create an Ajo group</Text>
              <Text style={[groupTargetModalStyle.cardDescription, { color: theme.textSecondary }]}>
                Use this option to create a public ajo for everyone.
              </Text>
            </View>
          </View>
          <ChevronRight width={20} height={20} fill={theme.textSecondary} />
        </TouchableOpacity>
      </Animated.View>
      <Animated.View
        style={[
          groupTargetModalStyle.card,
          { borderColor: theme.gray300, backgroundColor: theme.cardBackground },
          card2AnimatedStyle,
        ]}
      >
        <TouchableOpacity
          style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}
          onPress={() => {
            hideModal()
            toast.info('Individual Savings is coming soon...')
          }}
        >
          <View style={groupTargetModalStyle.cardContent}>
            <View style={[groupTargetModalStyle.cardIconWrapper, { backgroundColor: theme.gray100 }]}>
              <Lock width={24} height={24} />
            </View>
            <View>
              <Text style={[groupTargetModalStyle.cardTitle, { color: theme.textPrimary }]}>
                Create an Individual pool
              </Text>
              <Text style={[groupTargetModalStyle.cardDescription, { color: theme.textSecondary }]}>
                Use this option to create a private savings for your self.
              </Text>
            </View>
          </View>
          <ChevronRight width={20} height={20} fill={theme.textSecondary} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
}

export default GroupTargetModal
