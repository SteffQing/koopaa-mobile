import { WalletUiDropdown } from '@/components/solana/wallet-ui-dropdown'
import { Stack } from 'expo-router'

export default function Layout() {
  return (
    <Stack screenOptions={{ headerTitle: 'Account', headerRight: () => <WalletUiDropdown /> }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="profile" options={{ headerTitle: 'Profile', headerRight: () => null }} />
    </Stack>
  )
}
