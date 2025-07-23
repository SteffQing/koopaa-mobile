import { StyleSheet, View, Text, Image } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'
import NavHeader from '@/views/Navigation/nav-header'
import Card from '@/components/savings-and-wallet/card'
import GroupCard from '@/views/Savings/group/card'
import GroupCardSkeleton from '@/views/Savings/group/skeleton'
import AjoError from '@/components/error'
import { useGetUserAjoSavings } from '@/hooks/blockchain/read/useUserAjoGroups'
import useUserGroups from '@/hooks/db/useUserGroups'

const ajoSavingsStyle = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  section: { marginBottom: 24, marginTop: 12, flexDirection: 'column', gap: 16 },
  title: { fontSize: 14, fontWeight: '500', color: '#333333', marginBottom: 4 },
  emptyState: {
    flexDirection: 'column-reverse',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 32,
  },
  emptyText: { fontSize: 16, color: '#6B7280', textAlign: 'center' },
  imageContainer: { width: 100, height: 100, marginTop: 24 },
  image: { width: '100%', height: '100%' },
})

const AjoSavingsPage: React.FC = () => {
  const ajoSavings = useGetUserAjoSavings()
  const { data, isLoading, error, refetch } = useUserGroups()
  const itemOpacity = useSharedValue(0)
  const itemY = useSharedValue(20)
  const itemStyle = useAnimatedStyle(() => ({
    opacity: itemOpacity.value,
    transform: [{ translateY: itemY.value }],
  }))
  const emptyScale = useSharedValue(1)
  const emptyStyle = useAnimatedStyle(() => ({
    transform: [{ scale: emptyScale.value }],
  }))

  itemOpacity.value = withTiming(1, { duration: 300 })
  itemY.value = withTiming(0, { duration: 300 })
  emptyScale.value = withTiming(1, { duration: 300 })

  return (
    <View style={ajoSavingsStyle.container}>
      <NavHeader path="/savings" header="Ajo Savings" />
      <Card amount={ajoSavings} tab="Savings" type="ajo" />
      {error ? (
        <AjoError message={error.message} onRetry={refetch} />
      ) : (
        <>
          <Animated.View style={[ajoSavingsStyle.section, itemStyle]}>
            <Text style={ajoSavingsStyle.title}>Your Active Groups</Text>
            {isLoading ? (
              <GroupCardSkeleton />
            ) : data && data.joined_groups.length > 0 ? (
              <View style={{ flexDirection: 'column', gap: 12 }}>
                {data.joined_groups.map((group) => (
                  <GroupCard group={group} key={group.pda} />
                ))}
              </View>
            ) : (
              <Animated.View style={[ajoSavingsStyle.emptyState, emptyStyle]}>
                <Text style={ajoSavingsStyle.emptyText}>No active Ajo Group found</Text>
                <View style={ajoSavingsStyle.imageContainer}>
                  <Image
                    source={require('@/assets/public/empty-vault.png')}
                    style={ajoSavingsStyle.image}
                    resizeMode="contain"
                  />
                </View>
              </Animated.View>
            )}
          </Animated.View>
          <Animated.View style={[ajoSavingsStyle.section, itemStyle]}>
            <Text style={ajoSavingsStyle.title}>Public Groups Available</Text>
            {isLoading ? (
              <GroupCardSkeleton />
            ) : data && data.avbl_groups.length > 0 ? (
              <View style={{ flexDirection: 'column', gap: 12 }}>
                {data.avbl_groups.map((group) => (
                  <GroupCard group={group} key={group.pda} />
                ))}
              </View>
            ) : (
              <View style={ajoSavingsStyle.emptyState}>
                <Text style={ajoSavingsStyle.emptyText}>No public groups available right now!</Text>
              </View>
            )}
          </Animated.View>
        </>
      )}
    </View>
  )
}

export default AjoSavingsPage
