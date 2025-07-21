import getTheme from '@/constants/theme'
import { useEffect } from 'react'
import { StyleSheet, useColorScheme, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withRepeat, withTiming } from 'react-native-reanimated'

interface LoadingDotsProps {
  color?: string
  size?: number
}

const loadingDotsStyle = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    borderRadius: 50,
  },
})

const LoadingDots: React.FC<LoadingDotsProps> = ({ color = 'currentColor', size = 4 }) => {
  const colorScheme = useColorScheme()
  const theme = getTheme(colorScheme || 'light')

  const opacities = [useSharedValue(0.3), useSharedValue(0.3), useSharedValue(0.3)]
  const animatedStyles = opacities.map((opacity, index) =>
    useAnimatedStyle(() => ({
      opacity: opacity.value,
    })),
  )

  useEffect(() => {
    opacities.forEach((opacity, index) => {
      opacity.value = withDelay(
        index * 200,
        withRepeat(
          withTiming(1, { duration: 600 }, () => withTiming(0.3, { duration: 600 })),
          -1,
        ),
      )
    })
  }, [])

  return (
    <View style={loadingDotsStyle.container}>
      {[0, 1, 2].map((index) => (
        <Animated.View
          key={index}
          style={[
            loadingDotsStyle.dot,
            { width: size, height: size, backgroundColor: color === 'currentColor' ? theme.textPrimary : color },
            animatedStyles[index],
          ]}
        />
      ))}
    </View>
  )
}

export default LoadingDots
