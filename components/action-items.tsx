import Clock from '@/assets/svgs/clock.svg'
import getTheme from '@/constants/theme'
import { useRouter } from 'expo-router'
import { useEffect, useMemo } from 'react'
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native'
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated'
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg'

interface ActionItem {
  title: string
  description: string
  action: () => void
}

interface ActionItemsProps {
  user: User | null
  loading: boolean
}

interface HalfCircleProgressProps {
  progress: number
  total: number
}

const actionItemsStyle = StyleSheet.create({
  container: {
    marginBottom: 16, // theme.spacing[4]
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // theme.spacing[2]
    marginBottom: 12, // theme.spacing[3]
  },
  headerText: {
    fontSize: 18, // theme.fontSizes.lg
    fontWeight: '600',
  },
  card: {
    borderRadius: 12,
    padding: 12, // theme.spacing[3]
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'column',
    gap: 8, // theme.spacing[2]
  },
  cardTitle: {
    fontSize: 14, // theme.fontSizes.sm
    fontWeight: '500',
  },
  cardDescription: {
    fontSize: 12, // theme.fontSizes.sm - 2
    fontWeight: '400',
  },
})

const ActionItems: React.FC<ActionItemsProps> = ({ user, loading }) => {
  const colorScheme = useColorScheme()
  const theme = getTheme(colorScheme || 'light')
  const router = useRouter()

  const PROGRESS = useMemo(() => {
    if (!user) return 0
    let score = 0
    if (user.username) score += 1
    if (user.email) score += 1
    return score
  }, [user])

  const items: ActionItem[] = [
    {
      title: 'Add a username',
      description: 'Get easily identified. Please add a username',
      action: () => router.push('/account/profile'),
    },
    {
      title: 'Add an email',
      description: 'Make it easier for us to notify you',
      action: () => router.push('/account/profile'),
    },
  ]

  // Animation setup for outer container
  const outerTranslateY = useSharedValue(20)
  const outerOpacity = useSharedValue(0)
  const outerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: outerTranslateY.value }],
    opacity: outerOpacity.value,
  }))

  // Animation setup for card
  const cardTranslateX = useSharedValue(-20)
  const cardOpacity = useSharedValue(0)
  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: cardTranslateX.value }],
    opacity: cardOpacity.value,
  }))

  useEffect(() => {
    outerTranslateY.value = withDelay(200, withTiming(0, { duration: 300 }))
    outerOpacity.value = withDelay(200, withTiming(1, { duration: 300 }))
    cardTranslateX.value = withDelay(300, withTiming(0, { duration: 300 }))
    cardOpacity.value = withDelay(300, withTiming(1, { duration: 300 }))
  }, [])

  if (loading || PROGRESS === items.length) {
    return null
  }

  return (
    <Animated.View style={[actionItemsStyle.container, { backgroundColor: theme.background }, outerAnimatedStyle]}>
      <View style={actionItemsStyle.header}>
        <Text style={[actionItemsStyle.headerText, { color: theme.textPrimary }]}>Take Action</Text>
        <Clock width={20} height={20} />
      </View>
      <TouchableOpacity onPress={items[PROGRESS].action}>
        <Animated.View
          style={[
            actionItemsStyle.card,
            { backgroundColor: theme.cardBackground, shadowColor: theme.shadowColor },
            cardAnimatedStyle,
          ]}
        >
          <View style={actionItemsStyle.cardContent}>
            <Text style={[actionItemsStyle.cardTitle, { color: theme.textPrimary }]}>{items[PROGRESS].title}</Text>
            <Text style={[actionItemsStyle.cardDescription, { color: theme.textSecondary }]}>
              {items[PROGRESS].description}
            </Text>
          </View>
          <HalfCircleProgress progress={PROGRESS} total={items.length} />
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  )
}

const halfCircleProgressStyle = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 70, // theme.sizes.progressWidth
    position: 'relative',
  },
  text: {
    position: 'absolute',
    bottom: -4,
    fontSize: 16, // theme.fontSizes.base
    fontWeight: '500',
    textAlign: 'center',
  },
})

const AnimatedPath = Animated.createAnimatedComponent(Path)

const HalfCircleProgress: React.FC<HalfCircleProgressProps> = ({ progress, total }) => {
  const colorScheme = useColorScheme()
  const theme = getTheme(colorScheme || 'light')
  const radius = 45
  const circumference = Math.PI * radius
  const percentage = (progress / total) * 100
  const strokeDashoffset = useSharedValue(circumference)

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: strokeDashoffset.value,
  }))

  useEffect(() => {
    strokeDashoffset.value = withTiming(circumference - (percentage / 100) * circumference, {
      duration: 1000,
    })
  }, [progress, total, strokeDashoffset])

  return (
    <View style={halfCircleProgressStyle.container}>
      <Svg width={70} height={40} viewBox="0 0 100 50">
        <Path d="M 5 50 A 45 45 0 0 1 95 50" fill="none" stroke={theme.progressTrack} strokeWidth={10} />
        <AnimatedPath
          d="M 5 50 A 45 45 0 0 1 95 50"
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={10}
          strokeDasharray={circumference}
          animatedProps={animatedProps}
        />
        <Defs>
          <LinearGradient id="progressGradient" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor={theme.progressGradientStart} />
            <Stop offset="100%" stopColor={theme.progressGradientEnd} />
          </LinearGradient>
        </Defs>
      </Svg>
      <Text style={[halfCircleProgressStyle.text, { color: theme.textTertiary }]}>
        {progress}/{total}
      </Text>
    </View>
  )
}

export default ActionItems
