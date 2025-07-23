import { Button } from '@/components/ui'
import { Image, StyleSheet, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'
import Toast from 'react-native-toast-message'

const squadsPageStyle = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF7ED' },
  inner: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 32 },
  imageContainer: { marginBottom: 32, position: 'relative' },
  glow: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 9999, opacity: 0.2 },
  imageWrapper: { position: 'relative', zIndex: 10 },
  image: { width: 320, height: 320 },
  textContainer: { paddingHorizontal: 16, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '700', color: '#121212', marginBottom: 12 },
  description: { fontSize: 16, color: '#4B5563', marginBottom: 32, textAlign: 'center' },
  buttonContainer: { flexDirection: 'column', gap: 16, width: '100%', paddingHorizontal: 16 },
})

const SquadsPage: React.FC = () => {
  const containerOpacity = useSharedValue(0)
  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }))
  const itemOpacity = useSharedValue(0)
  const itemY = useSharedValue(30)
  const itemStyle = useAnimatedStyle(() => ({
    opacity: itemOpacity.value,
    transform: [{ translateY: itemY.value }],
  }))
  const imageOpacity = useSharedValue(0)
  const imageScale = useSharedValue(0.8)
  const imageY = useSharedValue(-20)
  const imageStyle = useAnimatedStyle(() => ({
    opacity: imageOpacity.value,
    transform: [{ scale: imageScale.value }, { translateY: imageY.value }],
  }))
  const floatY = useSharedValue(0)
  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }))
  const glowOpacity = useSharedValue(0.2)
  const glowScale = useSharedValue(1.1)
  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: glowScale.value }],
  }))

  containerOpacity.value = withTiming(1, { duration: 300 })
  itemOpacity.value = withSequence(withTiming(0, { duration: 300 }), withDelay(300, withTiming(1, { duration: 600 })))
  itemY.value = withSequence(withTiming(30, { duration: 300 }), withDelay(300, withTiming(0, { duration: 600 })))
  imageOpacity.value = withTiming(1, { duration: 800 })
  imageScale.value = withTiming(1, { duration: 800 })
  imageY.value = withTiming(0, { duration: 800 })
  floatY.value = withRepeat(withTiming(8, { duration: 2000 }), -1, true)
  glowOpacity.value = withRepeat(withTiming(0.3, { duration: 1500 }), -1, true)
  glowScale.value = withRepeat(withTiming(1.2, { duration: 1500 }), -1, true)

  const handleJoinSquad = () => Toast.show({ type: 'info', text1: 'Coming soon' })
  const handleCreateSquad = () => Toast.show({ type: 'info', text1: 'Coming soon' })

  return (
    <LinearGradient colors={['#FFF7ED', '#FFFFFF', '#FFF7ED']} style={squadsPageStyle.container}>
      <View style={squadsPageStyle.inner}>
        <Animated.View style={[squadsPageStyle.imageContainer, imageStyle]}>
          <Animated.View style={[squadsPageStyle.glow, glowStyle]}>
            <LinearGradient colors={['#FDBA74', '#F97316']} style={{ flex: 1, borderRadius: 9999 }} />
          </Animated.View>
          <Animated.View style={[squadsPageStyle.imageWrapper, floatStyle]}>
            <Image
              source={require('@/assets/public/koopa_clean_squad.png')}
              style={squadsPageStyle.image}
              resizeMode="contain"
            />
          </Animated.View>
        </Animated.View>
        <Animated.View style={[squadsPageStyle.textContainer, containerStyle]}>
          <Animated.Text style={[squadsPageStyle.title, itemStyle]}>Join a KooPaa squad</Animated.Text>
          <Animated.Text style={[squadsPageStyle.description, itemStyle]}>
            No available koopa squad, create one or join existing squads and start saving
          </Animated.Text>
          <Animated.View style={[squadsPageStyle.buttonContainer, itemStyle]}>
            <Button onPress={handleJoinSquad}>Join a Squad</Button>
            <Button variant="outline" onPress={handleCreateSquad}>
              Create a New Squad
            </Button>
          </Animated.View>
        </Animated.View>
      </View>
    </LinearGradient>
  )
}

export default SquadsPage
