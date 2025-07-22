import Account from '@/assets/svgs/navigation/account.svg'
import Home from '@/assets/svgs/navigation/home.svg'
import Savings from '@/assets/svgs/navigation/savings.svg'
import Squads from '@/assets/svgs/squad.svg'
import { Link, usePathname } from 'expo-router'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'

const tabs = [
  { name: 'Home', icon: Home, path: '/' },
  { name: 'Savings', icon: Savings, path: '/savings' },
  { name: 'Squads', icon: Squads, path: '/squads' },
  { name: 'Account', icon: Account, path: '/account' },
] as const

const bottomNavbarStyle = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    left: '50%',
    transform: [{ translateX: -0.5 * 240 }], // Approximate width: 240px
    backgroundColor: '#F2F2F2',
    flexDirection: 'row',
    gap: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 24,
  },
  tab: { flexDirection: 'column', alignItems: 'center', gap: 5 },
  tabText: { fontSize: 12, fontWeight: '400', color: '#767676' },
  tabTextActive: { fontWeight: '500', color: '#FF6B00' },
})

const BottomNavbar: React.FC = () => {
  const pathname = usePathname()
  const activeTab =
    tabs.find((tab) => pathname === tab.path || (tab.path !== '/' && pathname.startsWith(tab.path)))?.name || 'Home'

  const y = useSharedValue(100)
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }],
  }))

  y.value = withSpring(0, { stiffness: 500, damping: 30, mass: 1 })

  return (
    <Animated.View style={[bottomNavbarStyle.container, animatedStyle]}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.name
        const Icon = tab.icon
        const tabY = useSharedValue(0)
        const tabStyle = useAnimatedStyle(() => ({
          transform: [{ translateY: tabY.value }],
        }))

        const handlePressIn = () => {
          tabY.value = withSpring(-2, { stiffness: 300, damping: 30 })
        }
        const handlePressOut = () => {
          tabY.value = withSpring(0, { stiffness: 300, damping: 30 })
        }

        return (
          <Link href={tab.path} key={tab.name} asChild>
            <TouchableOpacity onPressIn={handlePressIn} onPressOut={handlePressOut}>
              <Animated.View style={[bottomNavbarStyle.tab, tabStyle]}>
                <Icon width={24} height={24} fill={isActive ? '#FF6B00' : '#767676'} />
                <Text style={[bottomNavbarStyle.tabText, isActive && bottomNavbarStyle.tabTextActive]}>{tab.name}</Text>
              </Animated.View>
            </TouchableOpacity>
          </Link>
        )
      })}
    </Animated.View>
  )
}

export default BottomNavbar
