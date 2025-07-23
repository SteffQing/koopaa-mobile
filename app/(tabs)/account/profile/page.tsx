import Copy from '@/assets/svgs/copy.svg'
import { Avatar, AvatarPicker } from '@/components/avatar'
import { Skeleton } from '@/components/skeletons'
import { useAuthUser } from '@/hooks/useUser'
import { useModal } from '@/providers/modal-provider'
import { ellipsify } from '@/utils/ellipsify'
import NavHeader from '@/views/Navigation/nav-header'
import { Feather } from '@expo/vector-icons'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated'
import Toast from 'react-native-toast-message'
import EditField from './EditField'

const profilePageStyle = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F2' },
  inner: { paddingHorizontal: 16, marginTop: 16, flexDirection: 'column', alignItems: 'center', gap: 24 },
  avatarContainer: { position: 'relative' },
  cameraIcon: { position: 'absolute', bottom: 8, right: 8, color: '#9D6D4C' },
  walletContainer: { flexDirection: 'row', alignItems: 'center', gap: 12, width: '86.4%', overflow: 'hidden' },
  walletInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#9D6D4C',
    borderRadius: 8,
    flexShrink: 1,
  },
  walletDivider: { height: '100%', width: 1, backgroundColor: '#4C4C4C' },
  walletLabel: { fontSize: 14, fontWeight: '500', color: '#4C4C4C', flexShrink: 0 },
  walletAddress: { fontSize: 14, fontWeight: '500', color: '#4C4C4C', maxWidth: 160 },
  card: { backgroundColor: '#FCFCFC', borderRadius: 8, width: '100%', paddingHorizontal: 12, paddingVertical: 1 },
})

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)

const ProfilePage: React.FC = () => {
  const { user, loading, updateUserProfile } = useAuthUser()
  const { showModal } = useModal()
  const walletOpacity = useSharedValue(0)
  const walletY = useSharedValue(20)
  const walletStyle = useAnimatedStyle(() => ({
    opacity: walletOpacity.value,
    transform: [{ translateY: walletY.value }],
  }))
  const cardOpacity = useSharedValue(0)
  const cardY = useSharedValue(20)
  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ translateY: cardY.value }],
  }))
  const copyScale = useSharedValue(1)
  const copyStyle = useAnimatedStyle(() => ({
    transform: [{ scale: copyScale.value }],
  }))

  walletOpacity.value = withDelay(200, withTiming(1, { duration: 300 }))
  walletY.value = withDelay(200, withTiming(0, { duration: 300 }))
  cardOpacity.value = withDelay(300, withTiming(1, { duration: 300 }))
  cardY.value = withDelay(300, withTiming(0, { duration: 300 }))

  const copyWalletAddress = async () => {
    if (user?.address) {
      const Clipboard = require('expo-clipboard')
      await Clipboard.setStringAsync(user.address)
      Toast.show({ type: 'success', text1: 'Wallet address copied to clipboard' })
    }
  }

  const handleUpdateUsername = async (newUsername: string) => {
    await updateUserProfile({ username: newUsername })
  }

  const handleUpdateEmail = async (newEmail: string) => {
    await updateUserProfile({ email: newEmail })
  }

  const handleUpdateAvatar = async (newAvatar: number) => {
    await updateUserProfile({ avatar: newAvatar })
  }

  const handleAvatarPicker = () =>
    showModal(<AvatarPicker onSelect={handleUpdateAvatar} currentAvatar={user?.avatar} />, {
      position: 'center',
    })

  return (
    <View style={profilePageStyle.container}>
      <NavHeader path="/account" header="Profile Details" style={{ marginHorizontal: 16 }} />
      <View style={profilePageStyle.inner}>
        <View style={profilePageStyle.avatarContainer}>
          <Avatar size={86} number={user?.avatar} />
          <TouchableOpacity onPress={handleAvatarPicker}>
            <Feather name="camera" size={18} style={profilePageStyle.cameraIcon} />
          </TouchableOpacity>
        </View>
        <Animated.View style={[profilePageStyle.walletContainer, walletStyle]}>
          <View style={profilePageStyle.walletInner}>
            <Text style={profilePageStyle.walletLabel}>Wallet Address</Text>
            <View style={profilePageStyle.walletDivider} />
            <Text style={profilePageStyle.walletAddress}>
              {!loading && user?.address ? ellipsify(user.address, 7) : '~ ~ ~'}
            </Text>
          </View>
          <AnimatedTouchableOpacity style={copyStyle} onPress={copyWalletAddress}>
            <Copy width={24} height={24} />
          </AnimatedTouchableOpacity>
        </Animated.View>
        <Animated.View style={[profilePageStyle.card, cardStyle]}>
          {loading ? (
            <>
              <View style={{ paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#C4C4C4' }}>
                <Skeleton style={{ height: 24, width: '100%' }} />
              </View>
              <View style={{ paddingVertical: 16 }}>
                <Skeleton style={{ height: 24, width: '100%' }} />
              </View>
            </>
          ) : (
            <>
              <EditField label="Username" value={user?.username || 'Not set'} onSave={handleUpdateUsername} />
              <EditField label="Email address" value={user?.email || 'Not set'} onSave={handleUpdateEmail} last />
            </>
          )}
        </Animated.View>
      </View>
    </View>
  )
}

export default ProfilePage
