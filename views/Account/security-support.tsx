import { StyleSheet, View, Text, TouchableOpacity, Linking } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'
import { Link, useRouter } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import HelpCenter from '@/assets/svgs/account/security-support/help-center.svg'
import ContactUs from '@/assets/svgs/account/security-support/contact-us.svg'
import LogOut from '@/assets/svgs/account/security-support/log-out.svg'
import { useWallet } from '@solana/wallet-adapter-react-native'
import query from '@/lib/fetch'
import { VariantProps } from './types'

interface SecurityAndSupportProps extends VariantProps {
  item?: { hidden: { opacity: number; y: number }; show: { opacity: number; y: number } }
}

const securityAndSupportStyle = StyleSheet.create({
  container: { marginBottom: 24 },
  title: { fontSize: 14, fontWeight: '500', color: '#333333', marginBottom: 12 },
  card: {
    backgroundColor: '#FCFCFC',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inner: { paddingHorizontal: 12 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E6E6E6',
  },
  lastRow: { borderBottomWidth: 0 },
  content: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconContainer: { backgroundColor: '#DADADA', padding: 6, borderRadius: 14 },
  text: { fontSize: 12, color: '#121212' },
  logoutText: { color: '#FF0000' },
  chevron: { color: '#9CA3AF' },
})

const SecurityAndSupport: React.FC<SecurityAndSupportProps> = ({ item }) => {
  const { disconnect } = useWallet()
  const router = useRouter()
  const opacity = useSharedValue(item?.hidden.opacity ?? 0)
  const y = useSharedValue(item?.hidden.y ?? 20)
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: y.value }],
  }))

  opacity.value = withTiming(item?.show.opacity ?? 1, { duration: 300 })
  y.value = withTiming(item?.show.y ?? 0, { duration: 300 })

  const signout = () => query.delete('auth').then(() => router.replace('/login'))
  const logout = () => disconnect().finally(() => signout())

  const handleExternalLink = async () => {
    const url = 'https://t.me/+hxd5Ob1F78hkZTNk'
    const supported = await Linking.canOpenURL(url)
    if (supported) {
      await Linking.openURL(url)
    }
  }

  return (
    <Animated.View style={[securityAndSupportStyle.container, animatedStyle]}>
      <Text style={securityAndSupportStyle.title}>Security & Support</Text>
      <View style={securityAndSupportStyle.card}>
        <View style={securityAndSupportStyle.inner}>
          <TouchableOpacity onPress={handleExternalLink}>
            <View style={securityAndSupportStyle.row}>
              <View style={securityAndSupportStyle.content}>
                <View style={securityAndSupportStyle.iconContainer}>
                  <ContactUs width={20} height={20} />
                </View>
                <Text style={securityAndSupportStyle.text}>Contact us</Text>
              </View>
              <Feather name="chevron-right" size={20} style={securityAndSupportStyle.chevron} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleExternalLink}>
            <View style={securityAndSupportStyle.row}>
              <View style={securityAndSupportStyle.content}>
                <View style={securityAndSupportStyle.iconContainer}>
                  <HelpCenter width={20} height={20} />
                </View>
                <Text style={securityAndSupportStyle.text}>Help center</Text>
              </View>
              <Feather name="chevron-right" size={20} style={securityAndSupportStyle.chevron} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={logout}>
            <View style={[securityAndSupportStyle.row, securityAndSupportStyle.lastRow]}>
              <View style={securityAndSupportStyle.content}>
                <View style={securityAndSupportStyle.iconContainer}>
                  <LogOut width={20} height={20} />
                </View>
                <Text style={[securityAndSupportStyle.text, securityAndSupportStyle.logoutText]}>Log Out</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  )
}

export default SecurityAndSupport
