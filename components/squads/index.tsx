import Squad from '@/assets/svgs/squad.svg'
import { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated'
import NoActiveSquad from './no-active'

const squadDisplayStyle = StyleSheet.create({
  container: { marginBottom: 16, alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  title: { fontSize: 18, fontWeight: '600', color: '#333333' },
  content: { backgroundColor: '#FCFCFC', borderRadius: 12, padding: 16, width: '100%' },
})

const SquadDisplay: React.FC = () => {
  const hasActiveSquad = false // Replace with API/database logic

  const opacity = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))

  useEffect(() => {
    opacity.value = withDelay(400, withTiming(1, { duration: 300 }))
  }, [])

  return (
    <Animated.View style={[squadDisplayStyle.container, animatedStyle]}>
      <View style={squadDisplayStyle.header}>
        <Text style={squadDisplayStyle.title}>KooPaa Squad</Text>
        <Squad width={24} height={24} fill="#FF6B00" />
      </View>

      {hasActiveSquad ? (
        <View style={squadDisplayStyle.content}>{/* Active squad content would go here */}</View>
      ) : (
        <NoActiveSquad />
      )}
    </Animated.View>
  )
}

export default SquadDisplay
