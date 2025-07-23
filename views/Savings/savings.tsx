import type { SavingsData } from '@/components/savings-and-wallet/types'
import { Image, StyleSheet, Text, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

interface SavingsProps {
  savingsData: [SavingsData, SavingsData]
}

const savingsStyle = StyleSheet.create({
  container: { marginVertical: 24 },
  title: { fontSize: 14, fontWeight: '500', color: '#121212', marginBottom: 12 },
  card: { backgroundColor: '#FCFCFC', borderRadius: 8, paddingHorizontal: 16 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E6E6E6',
  },
  lastRow: { borderBottomWidth: 0 },
  content: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  image: { width: 32, height: 32, borderRadius: 16 },
  text: { fontSize: 14, fontWeight: '500', color: '#2E2E2E' },
  amountContainer: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8 },
  positiveAmount: { backgroundColor: '#E5FFDF', color: '#008B05' },
  amountText: { fontSize: 14 },
})

const Savings: React.FC<SavingsProps> = ({ savingsData }) => {
  const opacity = useSharedValue(0)
  const y = useSharedValue(20)
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: y.value }],
  }))

  opacity.value = withTiming(1, { duration: 300 })
  y.value = withTiming(0, { duration: 300 })

  return (
    <Animated.View style={[savingsStyle.container, animatedStyle]}>
      <Text style={savingsStyle.title}>Savings</Text>
      <View style={savingsStyle.card}>
        {savingsData.map((item, index) => (
          <View key={index} style={[savingsStyle.row, index === savingsData.length - 1 ? savingsStyle.lastRow : {}]}>
            <View style={savingsStyle.content}>
              <Image
                source={
                  item.type === 'individual'
                    ? require('@/assets/public/quick-access/solo.png')
                    : require('@/assets/public/quick-access/public-group.png')
                }
                style={savingsStyle.image}
                resizeMode="cover"
              />
              <Text style={savingsStyle.text}>
                {item.type === 'individual' ? 'Individual Savings' : 'My Ajo Savings'}
              </Text>
            </View>
            <View style={[savingsStyle.amountContainer, item.amount > 0 ? savingsStyle.positiveAmount : {}]}>
              <Text style={savingsStyle.amountText}>${item.amount.toLocaleString()}</Text>
            </View>
          </View>
        ))}
      </View>
    </Animated.View>
  )
}

export default Savings
