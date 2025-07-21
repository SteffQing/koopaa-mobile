import TelegramIcon from '@/assets/svg/telegram'
import { getTheme, themes } from '@/constants/theme'
import * as WebBrowser from 'expo-web-browser'
import { useEffect } from 'react'
import { Animated, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native'
import { useAnimatedStyle, useSharedValue, withDelay, withSpring } from 'react-native-reanimated'

const Telegram: React.FC = () => {
  const colorScheme = useColorScheme()
  const theme = getTheme(colorScheme || 'light') // Fallback to 'light' if colorScheme is null

  // Animation setup with react-native-reanimated
  const translateY = useSharedValue(100) // Matches initial y: 100
  const opacity = useSharedValue(0) // Matches initial opacity: 0

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { translateX: '-50%' }],
    opacity: opacity.value,
  }))

  useEffect(() => {
    // Animate in with delay (matches animate={{ y: 0, opacity: 1 }} with delay: 0.9s)
    translateY.value = withDelay(
      900, // 900ms delay, matches Framer Motion's delay: 0.9
      withSpring(0, {
        stiffness: 500,
        damping: 30,
      }),
    )
    opacity.value = withDelay(900, withSpring(1))
  }, [])

  const handlePress = async () => {
    await WebBrowser.openBrowserAsync('https://t.me/+hxd5Ob1F78hkZTNk')
  }

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: themes.spacing[6],
      left: '50%',
      flexDirection: 'row',
      gap: themes.spacing[6],
      alignItems: 'center',
      maxWidth: themes.sizes.maxWidth,
      width: '100%',
      backgroundColor: theme.background,
    },
    iconContainer: {
      position: 'absolute',
      bottom: 140,
      right: themes.spacing[4],
      backgroundColor: theme.iconBackground,
      maxWidth: themes.sizes.maxWidth,
    },
  })

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={handlePress}>
          <TelegramIcon width={40} height={40} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  )
}

export default Telegram
