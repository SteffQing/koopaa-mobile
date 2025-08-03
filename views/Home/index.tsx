import { useGetActivities } from '@/hooks/db/useActivities'
import { useAuthUser } from '@/hooks/useUser'
import { SafeAreaView, StyleSheet } from 'react-native'
import Header from '../Navigation/header'

const homePageStyle = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#FCFCFC' },
})

const HomePage: React.FC = () => {
  const { user, loading: pending } = useAuthUser()
  const { activities, loading } = useGetActivities()

  return (
    <SafeAreaView style={homePageStyle.container}>
      <Header name={user?.username} loading={pending} avatar={user?.avatar} address={user?.address} />
      {/* <SavingsAndWallet /> */}
      {/* <ActionItems user={user} loading={pending} />
      <QuickAccess />
      <SquadDisplay />
      <RecentActivities data={activities} loading={loading} /> */}
    </SafeAreaView>
  )
}

export default HomePage
