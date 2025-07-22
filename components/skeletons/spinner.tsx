import { useEffect } from 'react'
import { StyleSheet } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated'

interface SpinnerProps {
  size?: number
  borderWidth?: number
  color?: string
  duration?: number
}

const spinnerStyle = StyleSheet.create({
  spinner: {
    borderRadius: 9999,
  },
})

const Spinner: React.FC<SpinnerProps> = ({ size = 16, borderWidth = 2, color = '#FF6B00', duration = 1000 }) => {
  const spinnerRotation = useSharedValue(0)

  const spinnerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spinnerRotation.value}deg` }],
  }))

  useEffect(() => {
    spinnerRotation.value = withRepeat(withTiming(360, { duration }), -1)
  }, [duration])

  return (
    <Animated.View
      style={[
        spinnerStyle.spinner,
        {
          width: size,
          height: size,
          borderWidth,
          borderColor: color,
          borderTopColor: 'transparent',
        },
        spinnerAnimatedStyle,
      ]}
    />
  )
}

export default Spinner
