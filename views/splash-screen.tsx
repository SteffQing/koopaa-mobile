import { ImageBackground, StyleSheet } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import splash from '../assets/public/splash-screen.png'

const splashScreenStyle = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
})

const SplashScreen: React.FC = () => {
  const opacity = useSharedValue(0)
  const scale = useSharedValue(0.98)
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }))

  opacity.value = withTiming(1, { duration: 700 })
  scale.value = withTiming(1, { duration: 700 })

  return (
    <ImageBackground source={splash} style={splashScreenStyle.container} resizeMode="contain">
      <Animated.View style={[splashScreenStyle.container, animatedStyle]}>
        {/* Inner content placeholder (empty in original) */}
      </Animated.View>
    </ImageBackground>
  )
}

export default SplashScreen
