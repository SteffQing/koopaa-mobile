import { useEffect, useRef, useState } from 'react'
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import Card from './card'
import { SavingsData } from './types'

interface SavingsCardProps {
  savingsData: SavingsData[]
  action?: { text: string; handler: () => void }[]
}

const savingsCardStyle = StyleSheet.create({
  container: { overflow: 'hidden' },
  cards: { flexDirection: 'row' },
  card: { width: Dimensions.get('window').width - 32, flexShrink: 0 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 16 },
  dot: { width: 8, height: 8, borderRadius: 4 },
})

const SavingsCard: React.FC<SavingsCardProps> = ({ savingsData, action }) => {
  const [activeCardIndex, setActiveCardIndex] = useState(0)
  const containerRef = useRef<View>(null)
  const x = useSharedValue(0)
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }))

  const navigateToCard = (index: number) => {
    if (index < 0 || index >= savingsData.length) return
    setActiveCardIndex(index)
    const cardWidth = Dimensions.get('window').width - 32
    x.value = withSpring(-index * cardWidth, { stiffness: 300, damping: 30 })
  }

  const handleDragEnd = () => {
    const cardWidth = Dimensions.get('window').width - 32
    const currentX = x.get()
    const targetIndex = Math.round(Math.abs(currentX) / cardWidth)
    navigateToCard(targetIndex)
  }

  useEffect(() => {
    const cardWidth = Dimensions.get('window').width - 32
    x.value = -activeCardIndex * cardWidth
  }, [activeCardIndex, savingsData.length])

  return (
    <View style={savingsCardStyle.container}>
      <View ref={containerRef}>
        <Animated.View style={[savingsCardStyle.cards, animatedStyle]}>
          {savingsData.map((data, index) => {
            const distance = Math.abs(index - activeCardIndex)
            const opacity = distance === 0 ? 1 : 0.5

            return (
              <View key={index} style={[savingsCardStyle.card, { opacity }]}>
                <Card tab="Savings" amount={data.amount} type={data.type} action={action?.[index]} />
              </View>
            )
          })}
        </Animated.View>
      </View>
      <View style={savingsCardStyle.dots}>
        {savingsData.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => navigateToCard(index)}
            style={[savingsCardStyle.dot, { backgroundColor: index === activeCardIndex ? '#FF6B00' : '#A4A4A4' }]}
          />
        ))}
      </View>
    </View>
  )
}

export default SavingsCard
