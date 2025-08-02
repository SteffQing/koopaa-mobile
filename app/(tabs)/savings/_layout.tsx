import { WalletUiDropdown } from '@/components/solana/wallet-ui-dropdown'
import { Stack } from 'expo-router'

export default function Layout() {
  return (
    <Stack screenOptions={{ headerTitle: 'Savings', headerRight: () => <WalletUiDropdown /> }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="individual" options={{ headerTitle: 'Individual Savings', headerRight: () => null }} />
      <Stack.Screen name="create-goal" options={{ headerTitle: 'Create Goal', headerRight: () => null }} />
      <Stack.Screen name="create-ajo" options={{ headerTitle: 'Create Ajo', headerRight: () => null }} />
      <Stack.Screen name="ajo" options={{ headerTitle: 'Ajo', headerRight: () => null }} />
    </Stack>
  )
}
