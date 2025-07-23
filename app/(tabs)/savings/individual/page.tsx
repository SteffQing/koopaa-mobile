import Card from '@/components/savings-and-wallet/card'
import NavHeader from '@/views/Navigation/nav-header'
import { Feather } from '@expo/vector-icons'
import { Link } from 'expo-router'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming } from 'react-native-reanimated'

const individualSavingsStyle = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  emptyState: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 48,
    textAlign: 'center',
  },
  imageContainer: { marginBottom: 24, width: 150, height: 150 },
  image: { width: '100%', height: '100%' },
  description: { fontSize: 16, color: '#6B7280', maxWidth: 300, textAlign: 'center' },
  fab: {
    position: 'absolute',
    bottom: 60,
    right: 16,
    width: 64,
    height: 64,
    backgroundColor: '#FF6B00',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
})

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)

const IndividualSavingsPage: React.FC = () => {
  const emptyOpacity = useSharedValue(0)
  const emptyY = useSharedValue(20)
  const emptyStyle = useAnimatedStyle(() => ({
    opacity: emptyOpacity.value,
    transform: [{ translateY: emptyY.value }],
  }))
  const imageOpacity = useSharedValue(0)
  const imageScale = useSharedValue(0.8)
  const imageStyle = useAnimatedStyle(() => ({
    opacity: imageOpacity.value,
    transform: [{ scale: imageScale.value }],
  }))
  const fabOpacity = useSharedValue(0)
  const fabScale = useSharedValue(0)
  const fabStyle = useAnimatedStyle(() => ({
    opacity: fabOpacity.value,
    transform: [{ scale: fabScale.value }],
  }))
  const fabButtonScale = useSharedValue(1)
  const fabButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fabButtonScale.value }],
  }))

  emptyOpacity.value = withDelay(300, withTiming(1, { duration: 300 }))
  emptyY.value = withDelay(300, withTiming(0, { duration: 300 }))
  imageOpacity.value = withDelay(400, withSpring(1))
  imageScale.value = withDelay(400, withSpring(1))
  fabOpacity.value = withDelay(600, withSpring(1))
  fabScale.value = withDelay(600, withSpring(1))

  const handlePressIn = () => {
    fabButtonScale.value = withTiming(0.9, { duration: 100 })
  }
  const handlePressOut = () => {
    fabButtonScale.value = withTiming(1, { duration: 100 })
  }

  return (
    <View style={individualSavingsStyle.container}>
      <NavHeader path="/savings" header="Individual savings" />
      <Card amount={0} tab="Savings" type="individual" />
      <Animated.View style={[individualSavingsStyle.emptyState, emptyStyle]}>
        <Animated.View style={[individualSavingsStyle.imageContainer, imageStyle]}>
          <Image
            source={require('@/assets/public/empty-vault.png')}
            style={individualSavingsStyle.image}
            resizeMode="contain"
          />
        </Animated.View>
        <Text style={individualSavingsStyle.description}>
          You haven't created any solo saving goal. Click on the plus button to get started
        </Text>
      </Animated.View>
      <Animated.View style={[individualSavingsStyle.fab, fabStyle]}>
        <Link href="/savings/create-goal" asChild>
          <AnimatedTouchableOpacity style={fabButtonStyle} onPressIn={handlePressIn} onPressOut={handlePressOut}>
            <Feather name="plus" size={24} color="#FFFFFF" />
          </AnimatedTouchableOpacity>
        </Link>
      </Animated.View>
    </View>
  )
}

export default IndividualSavingsPage
