import Bolt from '@/assets/svgs/bolt.svg'
import { Link } from 'expo-router'
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated'

const items = [
  {
    title: 'My Groups',
    image: require('@/assets/public/quick-access/my-groups.png'),
    color: '#D3D0FF',
    href: '/squads',
  },
  {
    title: 'Create Solo Savings',
    image: require('@/assets/public/quick-access/solo.png'),
    color: '#B6DEC6',
    href: '/savings',
  },
  {
    title: 'Create Ajo Group',
    image: require('@/assets/public/quick-access/public-group.png'),
    color: '#FEC1BE',
    href: '/savings/ajo',
  },
  {
    title: 'Create Private Group',
    image: require('@/assets/public/quick-access/private-group.png'),
    color: '#C2BBFF',
    href: '/savings',
  },
]

const quickAccessStyle = StyleSheet.create({
  container: { marginBottom: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  title: { fontSize: 18, fontWeight: '600', color: '#333333' },
  scrollContainer: { paddingHorizontal: 16 },
  item: { borderRadius: 8, width: 120, alignItems: 'center', overflow: 'hidden', borderWidth: 1 },
  image: { width: 120, height: 89 },
  text: { fontSize: 10, fontWeight: '500', color: '#121212', paddingHorizontal: 8, paddingVertical: 12, width: '100%' },
})

const QuickAccess: React.FC = () => {
  const y = useSharedValue(20)
  const opacity = useSharedValue(0)
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }],
    opacity: opacity.value,
  }))

  y.value = withDelay(300, withTiming(0, { duration: 300 }))
  opacity.value = withDelay(300, withTiming(1, { duration: 300 }))

  return (
    <Animated.View style={[quickAccessStyle.container, animatedStyle]}>
      <View style={quickAccessStyle.header}>
        <Text style={quickAccessStyle.title}>Quick Access</Text>
        <Bolt width={24} height={24} fill="#FF6B00" />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={quickAccessStyle.scrollContainer}>
        {items.map((item, index) => {
          const itemY = useSharedValue(20)
          const itemOpacity = useSharedValue(0)
          const itemAnimatedStyle = useAnimatedStyle(() => ({
            transform: [{ translateY: itemY.value }],
            opacity: itemOpacity.value,
          }))

          itemY.value = withDelay(400 + index * 100, withTiming(0, { duration: 300 }))
          itemOpacity.value = withDelay(400 + index * 100, withTiming(1, { duration: 300 }))

          return (
            <Animated.View
              key={index}
              style={[
                quickAccessStyle.item,
                itemAnimatedStyle,
                { backgroundColor: item.color, borderColor: item.color },
              ]}
            >
              <Link href={item.href} asChild>
                <TouchableOpacity>
                  <Image source={item.image} style={quickAccessStyle.image} />
                  <Text style={quickAccessStyle.text}>{item.title}</Text>
                </TouchableOpacity>
              </Link>
            </Animated.View>
          )
        })}
      </ScrollView>
    </Animated.View>
  )
}

export default QuickAccess
