import { StyleSheet, View, Text } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import { Avatar } from '@/components/avatar'

interface HeaderProps {
  name?: string | null
  avatar?: number
  loading: boolean
  address?: string
}

const headerStyle = StyleSheet.create({
  container: {
    backgroundColor: '#FCFCFC',
    borderRadius: 32,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 7,
    elevation: 2,
  },
  avatarContainer: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  greeting: { fontSize: 16, fontWeight: '500', color: '#121212', flexDirection: 'row', alignItems: 'center', gap: 4 },
  subtext: { fontSize: 12, fontWeight: '400', color: '#767676' },
})

const Header: React.FC<HeaderProps> = ({ name, loading, avatar, address }) => {
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const parseName = () => {
    if (loading) return ''
    if (name) {
      const firstName = name.split(' ')[0]
      return firstName.length > 10 ? `${firstName.slice(0, 7)}...` : firstName
    }
    return 'Anon'
  }

  const y = useSharedValue(-50)
  const opacity = useSharedValue(0)
  const avatarScale = useSharedValue(1)
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }],
    opacity: opacity.value,
  }))
  const avatarStyle = useAnimatedStyle(() => ({
    transform: [{ scale: avatarScale.value }],
  }))

  y.value = withSpring(0, { stiffness: 300, damping: 30 })
  opacity.value = withSpring(1, { stiffness: 300, damping: 30 })

  const handlePressIn = () => {
    avatarScale.value = withSpring(0.95, { stiffness: 300, damping: 30 })
  }
  const handlePressOut = () => {
    avatarScale.value = withSpring(1, { stiffness: 300, damping: 30 })
  }

  return (
    <Animated.View style={[headerStyle.container, animatedStyle]}>
      <View style={headerStyle.avatarContainer}>
        <Animated.View
          style={avatarStyle}
          onStartShouldSetResponder={() => true}
          onResponderGrant={handlePressIn}
          onResponderRelease={handlePressOut}
        >
          <Avatar number={avatar} />
        </Animated.View>
        <View>
          <Text style={headerStyle.greeting}>
            {getGreeting()}, {parseName()} 😊
          </Text>
          <Text style={headerStyle.subtext}>How is your day going</Text>
        </View>
      </View>
      {/* {address && <NovuInbox subscriberId={address} />} */}
    </Animated.View>
  )
}

export default Header
