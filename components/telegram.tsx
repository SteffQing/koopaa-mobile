import TelegramIcon from '@/assets/svgs/telegram.svg'
import getTheme from '@/constants/theme'
import * as WebBrowser from 'expo-web-browser'
import { useEffect } from 'react'
import { StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSpring } from 'react-native-reanimated'

const telegramStyle = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    left: '50%',
    flexDirection: 'row',
    gap: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 360,
  },
  iconContainer: {
    position: 'absolute',
    bottom: 140,
    right: 16,
  },
})

const Telegram: React.FC = () => {
  const colorScheme = useColorScheme()
  const theme = getTheme(colorScheme || 'light')

  // Animation setup
  const translateY = useSharedValue(100)
  const opacity = useSharedValue(0)
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { translateX: '-50%' }],
    opacity: opacity.value,
  }))

  useEffect(() => {
    translateY.value = withDelay(900, withSpring(0, { stiffness: 500, damping: 30 }))
    opacity.value = withDelay(900, withSpring(1))
  }, [])

  const handlePress = async () => {
    await WebBrowser.openBrowserAsync('https://t.me/+hxd5Ob1F78hkZTNk')
  }

  return (
    <Animated.View style={[telegramStyle.container, { backgroundColor: theme.background }, animatedStyle]}>
      <View style={[telegramStyle.iconContainer, { backgroundColor: theme.iconBackground.transfer }]}>
        <TouchableOpacity onPress={handlePress}>
          <TelegramIcon width={40} height={40} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  )
}

export default Telegram
