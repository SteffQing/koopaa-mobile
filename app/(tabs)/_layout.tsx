import BottomNavbar from '@/views/Navigation/navigation'
import { Slot } from 'expo-router'
import { StyleSheet, View } from 'react-native'
// import AuthGuard from './AuthGuard'
// import Faucet from "@/components/faucet";
import Telegram from '@/components/telegram'

// export default function MobileLayout({ children }: Readonly<{ children: ReactNode }>) {
//   return (
//     <Suspense fallback={<SplashScreen />}>
//       {/* <AuthGuard> */}
//       {children}
//       <BottomNavbar />
//       {/* <Faucet /> */}
//       <Telegram />
//       {/* </AuthGuard> */}
//     </Suspense>

//   )
// }

const layoutStyle = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F2' },
})

export default function TabLayout() {
  return (
    <View style={layoutStyle.container}>
      <Slot />
      <BottomNavbar />
      <Telegram />
    </View>
  )
}
