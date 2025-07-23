import { Link } from 'expo-router'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

const savingOptions = [
  {
    title: 'Save towards a Goal',
    description: 'Achieve your goals with this saving method',
    color: ['#D4FFAB', '#D4FFAB'],
    path: '#',
    image: require('@/assets/public/coins/piggybank.png'),
  },
  {
    title: 'Create an Ajo Group',
    description: 'Achieve your goals faster with group saving method',
    color: ['#ABEBFF', '#ABEBFF'],
    path: '/savings/create-ajo',
    image: require('@/assets/public/koopaa-squad.png'),
  },
  {
    title: 'Defi Yield savings',
    description: 'View your active Ajo groups and track progress',
    color: ['#F3BD9A', '#F3BD9A'],
    path: '/savings/ajo',
    image: require('@/assets/public/vault.png'),
  },
] as const

const startSavingStyle = StyleSheet.create({
  container: { marginVertical: 24 },
  title: { fontSize: 14, fontWeight: '500', color: '#121212', marginBottom: 12 },
  section: { flexDirection: 'column', gap: 16 },
  card: {
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxHeight: 104,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  content: { flex: 3, paddingLeft: 12, paddingVertical: 24 },
  cardTitle: { fontSize: 16, fontWeight: '500', color: '#2E2E2E' },
  description: { fontSize: 12, color: '#4C4C4C' },
  imageContainer: { flex: 2 },
  image: { height: '100%', width: '100%' },
})

const StartSaving: React.FC = () => {
  const opacity = useSharedValue(0)
  const y = useSharedValue(20)
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: y.value }],
  }))

  opacity.value = withTiming(1, { duration: 300 })
  y.value = withTiming(0, { duration: 300 })

  return (
    <Animated.View style={[startSavingStyle.container, animatedStyle]}>
      <Text style={startSavingStyle.title}>Start Saving</Text>
      <View style={startSavingStyle.section}>
        {savingOptions.map((option, index) => {
          const scale = useSharedValue(1)
          const animatedCardStyle = useAnimatedStyle(() => ({
            transform: [{ translateY: scale.value === 1 ? 0 : -2 }],
            shadowOpacity: scale.value === 1 ? 0.05 : 0.1,
            elevation: scale.value === 1 ? 2 : 4,
          }))

          const handlePressIn = () => {
            scale.value = withTiming(0.95, { duration: 100 })
          }
          const handlePressOut = () => {
            scale.value = withTiming(1, { duration: 100 })
          }

          return (
            <Link key={index} href={option.path} asChild>
              <TouchableOpacity disabled={option.path === '#'} onPressIn={handlePressIn} onPressOut={handlePressOut}>
                <Animated.View style={[startSavingStyle.card, animatedCardStyle]}>
                  <LinearGradient colors={option.color} style={{ flex: 1, borderRadius: 8 }}>
                    <View style={startSavingStyle.content}>
                      <Text style={startSavingStyle.cardTitle}>{option.title}</Text>
                      <Text style={startSavingStyle.description}>{option.description}</Text>
                    </View>
                    <View style={startSavingStyle.imageContainer}>
                      <Image source={option.image} style={startSavingStyle.image} resizeMode="contain" />
                    </View>
                  </LinearGradient>
                </Animated.View>
              </TouchableOpacity>
            </Link>
          )
        })}
      </View>
    </Animated.View>
  )
}

export default StartSaving
