import { StyleSheet, View, Text, ImageBackground } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'
import ActionItems from '@/components/action-items'
import { Avatar } from '@/components/avatar'
import AccessSection from './access-section'
import SecurityAndSupport from './security-support'
import { PersonalSection } from './personal'
import { useAuthUser } from '@/hooks/useUser'

const accountPageStyle = StyleSheet.create({
  container: { flex: 1 },
  banner: { width: '100%', height: 200 },
  bannerContent: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    alignItems: 'center',
  },
  username: { fontSize: 20, fontWeight: '500', color: '#FF6B00' },
  section: { paddingHorizontal: 16, marginTop: 16, flexDirection: 'column', gap: 24 },
  footer: { textAlign: 'center', fontSize: 14, color: '#6B7280', marginTop: 32, marginBottom: 80 },
})

const AccountPage: React.FC = () => {
  const { user, loading } = useAuthUser()
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }
  const opacity = useSharedValue(0)
  const y = useSharedValue(-20)
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: y.value }],
  }))

  opacity.value = withTiming(1, { duration: 300 })
  y.value = withTiming(0, { duration: 300 })

  return (
    <View style={accountPageStyle.container}>
      <Animated.View style={animatedStyle}>
        <ImageBackground
          source={require('@/assets/public/savings-card/total.png')}
          style={accountPageStyle.banner}
          resizeMode="cover"
        >
          <View style={accountPageStyle.bannerContent}>
            <Avatar size={86} number={user?.avatar} />
            <Text style={accountPageStyle.username}>{user?.username}</Text>
          </View>
        </ImageBackground>
      </Animated.View>
      <View style={accountPageStyle.section}>
        <ActionItems user={user} loading={loading} />
        <AccessSection item={item} />
        <PersonalSection item={item} />
        <SecurityAndSupport item={item} />
        <Animated.View style={[item, { opacity: opacity.value, transform: [{ translateY: y.value }] }]}>
          <Text style={accountPageStyle.footer}>@2025 KooPaa Tech.</Text>
        </Animated.View>
      </View>
    </View>
  )
}

export default AccountPage
