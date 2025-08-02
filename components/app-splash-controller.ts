import { useAuth } from '@/providers/auth-provider'
import { SplashScreen } from 'expo-router'

export function AppSplashController() {
  const { isLoading } = useAuth()

  if (!isLoading) {
    SplashScreen.hideAsync()
  }

  return null
}
