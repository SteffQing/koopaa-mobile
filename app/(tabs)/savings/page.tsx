import { GroupTargetModal } from '@/components/modal'
import SavingsCard from '@/components/savings-and-wallet/savings-card'
import type { SavingsData } from '@/components/savings-and-wallet/types'
import { useGetUserAjoSavings } from '@/hooks/blockchain/read/useUserAjoGroups'
import { useModal } from '@/providers/modal-provider'
import NavHeader from '@/views/Navigation/nav-header'
import Savings from '@/views/Savings/savings'
import StartSaving from '@/views/Savings/start-saving'
import { useRouter } from 'expo-router'
import { StyleSheet, View } from 'react-native'
import Toast from 'react-native-toast-message'

const savingsPageStyle = StyleSheet.create({
  container: { flex: 1, padding: 16 },
})

const SavingsPage: React.FC = () => {
  const router = useRouter()
  const { showModal } = useModal()
  const ajoSavings = useGetUserAjoSavings()

  const openGroupTargetModal = () => {
    showModal(<GroupTargetModal />, { position: 'bottom' })
  }

  const savingsData: SavingsData[] = [
    { type: 'total', amount: ajoSavings + 0 },
    { type: 'individual', amount: 0 },
    { type: 'ajo', amount: ajoSavings },
  ]

  const savingsAction = [
    { text: 'Start Saving', handler: openGroupTargetModal },
    {
      text: 'Coming Soon',
      handler: () => Toast.show({ type: 'info', text1: 'Individual Savings is coming soon' }),
    },
    { text: 'Topup Saving', handler: () => router.push('/savings/ajo') },
  ]

  return (
    <View style={savingsPageStyle.container}>
      <NavHeader header="Savings" />
      <SavingsCard savingsData={savingsData} action={savingsAction} />
      <Savings savingsData={[savingsData[1], savingsData[2]]} />
      <StartSaving />
    </View>
  )
}

export default SavingsPage
