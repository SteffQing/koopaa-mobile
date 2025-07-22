import { useGetUserAjoSavings } from '@/hooks/blockchain/read/useUserAjoGroups'
import useUSDCBalance from '@/hooks/blockchain/useGetBalance'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import Toast from 'react-native-toast-message'
import Card from './card'
import SavingsCard from './savings-card'
import { SavingsData, Tab } from './types'

const tabs: [Tab, Tab] = ['Savings', 'Wallet']

interface SavingsAndWalletProps {}

const savingsAndWalletStyle = StyleSheet.create({
  container: { marginBottom: 16 },
  tabs: { flexDirection: 'row', gap: 8, marginTop: 12, marginBottom: 20, justifyContent: 'center' },
  tabButton: { paddingVertical: 8, paddingHorizontal: 24, borderRadius: 9999 },
  tabText: { fontSize: 14, fontWeight: '500' },
})

const SavingsAndWallet: React.FC<SavingsAndWalletProps> = () => {
  const [activeTab, setActiveTab] = useState<Tab>('Savings')
  const { data, isLoading, refetch } = useUSDCBalance()
  const ajoSavings = useGetUserAjoSavings()
  const router = useRouter()
  const scale = useSharedValue(1)
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }))

  const savingsAction = [
    { text: 'Start Saving', handler: () => router.push('/savings') },
    {
      text: 'Coming Soon',
      handler: () => Toast.show({ type: 'info', text1: 'Individual Savings is coming soon' }),
    },
    { text: 'Topup Savings', handler: () => router.push('/savings/ajo') },
  ]

  const savingsData: SavingsData[] = [
    { type: 'total', amount: ajoSavings + 0 },
    { type: 'individual', amount: 0 },
    { type: 'ajo', amount: ajoSavings },
  ]

  const handleTabPress = (tab: Tab) => {
    scale.value = withTiming(0.95, { duration: 100 }, () => {
      scale.value = withTiming(1, { duration: 100 })
      setActiveTab(tab)
    })
  }

  return (
    <Animated.View style={[savingsAndWalletStyle.container, animatedStyle]}>
      <View style={savingsAndWalletStyle.tabs}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => handleTabPress(tab)}
            style={[savingsAndWalletStyle.tabButton, { backgroundColor: activeTab === tab ? '#FF6B00' : '#FCFCFC' }]}
          >
            <Text style={[savingsAndWalletStyle.tabText, { color: activeTab === tab ? '#FCFCFC' : '#A4A4A4' }]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {activeTab === 'Savings' ? (
        <SavingsCard savingsData={savingsData} action={savingsAction} />
      ) : (
        <Card tab={activeTab} amount={data || 0} loading={isLoading} onRefresh={refetch} />
      )}
    </Animated.View>
  )
}

export default SavingsAndWallet
