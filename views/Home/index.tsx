import ActionItems from '@/components/action-items'
import RecentActivities from '@/components/activities'
import SavingsAndWallet from '@/components/savings-and-wallet'
import SquadDisplay from '@/components/squads'
import { useGetActivities } from '@/hooks/db/useActivities'
import { useAuthUser } from '@/hooks/useUser'
import { StyleSheet, View } from 'react-native'
import Header from '../Navigation/header'
import QuickAccess from './quick-access'

const homePageStyle = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#FCFCFC' },
})

const HomePage: React.FC = () => {
  const { user, loading: pending } = useAuthUser()
  const { activities, loading } = useGetActivities()

  return (
    <View style={homePageStyle.container}>
      <Header name={user?.username} loading={pending} avatar={user?.avatar} address={user?.address} />
      <SavingsAndWallet />
      <ActionItems user={user} loading={pending} />
      <QuickAccess />
      <SquadDisplay />
      <RecentActivities data={activities} loading={loading} />
    </View>
  )
}

export default HomePage
