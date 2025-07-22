import getTheme from '@/constants/theme'
import { useEffect } from 'react'
import { StyleSheet, useColorScheme, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated'
import Avatar from './avatar'

const avatarGlobStyle = StyleSheet.create({
  container: {
    width: '100%',
    height: 384,
    overflow: 'hidden',
    borderRadius: 12,
  },
  avatarWrapper: {
    position: 'absolute',
  },
})

const randomPos = () => ({
  top: Math.random() * 80 + '%',
  left: Math.random() * 80 + '%',
})

const AvatarGlob: React.FC = () => {
  const colorScheme = useColorScheme()
  const theme = getTheme(colorScheme || 'light')

  return (
    <View style={[avatarGlobStyle.container, { backgroundColor: theme.gray100 }]}>
      {Array.from({ length: 9 }, (_, i) => {
        const avatarNumber = i + 1
        const y = useSharedValue(0)
        const animatedStyle = useAnimatedStyle(() => ({
          transform: [{ translateY: y.value }],
        }))

        useEffect(() => {
          y.value = withRepeat(withTiming(10, { duration: 3000 + Math.random() * 2000 }), -1, true)
        }, [])
        const position = randomPos()

        return (
          <Animated.View key={avatarNumber} style={[avatarGlobStyle.avatarWrapper, animatedStyle]}>
            <Avatar number={avatarNumber} size={40} />
          </Animated.View>
        )
      })}
    </View>
  )
}

export default AvatarGlob
