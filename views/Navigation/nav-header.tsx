import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

interface NavHeaderProps {
  path?: string
  header: string
  style?: ViewStyle
}

const navHeaderStyle = StyleSheet.create({
  container: {
    marginVertical: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  header: {
    fontSize: 18,
    fontWeight: '500',
    color: '#121212',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: [{ translateY: -12 }], // Half of icon size (24px)
  },
})

const NavHeader: React.FC<NavHeaderProps> = ({ path, header, style }) => {
  const router = useRouter()
  const y = useSharedValue(-20)
  const opacity = useSharedValue(0)
  const backX = useSharedValue(0)
  const backScale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }],
    opacity: opacity.value,
  }))

  const backButtonStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: backX.value }, { scale: backScale.value }],
  }))

  y.value = withTiming(0, { duration: 300 })
  opacity.value = withTiming(1, { duration: 300 })

  const handlePressIn = () => {
    backX.value = withTiming(-3, { duration: 100 })
    backScale.value = withTiming(0.9, { duration: 100 })
  }

  const handlePressOut = () => {
    backX.value = withTiming(0, { duration: 100 })
    backScale.value = withTiming(1, { duration: 100 })
  }

  return (
    <Animated.View style={[navHeaderStyle.container, style, animatedStyle]}>
      {path && (
        <TouchableOpacity onPress={() => router.back()} onPressIn={handlePressIn} onPressOut={handlePressOut}>
          <Animated.View style={[navHeaderStyle.backButton, backButtonStyle]}>
            <Feather name="chevron-left" size={24} color="#121212" />
          </Animated.View>
        </TouchableOpacity>
      )}
      <Text style={navHeaderStyle.header}>{header}</Text>
    </Animated.View>
  )
}

export default NavHeader
