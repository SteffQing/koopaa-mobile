import { StyleSheet, View } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'
import LinearGradient from 'react-native-linear-gradient'
import NavHeader from '@/views/Navigation/nav-header'
import AjoGroup from '@/views/AjoGroup'
import AjoError from '@/components/error'
import useGetAjoGroup from '@/hooks/blockchain/read/useFetchAjoGroup'

interface AjoGroupPageProps {
  params: { id: string }
}

const ajoGroupPageStyle = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  imageContainer: { marginBottom: 16, borderRadius: 12, overflow: 'hidden', height: 160 },
})

const AjoGroupPage: React.FC<AjoGroupPageProps> = ({ params }) => {
  const { id } = params
  const { data, isLoading, error, refetch } = useGetAjoGroup(id)
  const itemOpacity = useSharedValue(0)
  const itemY = useSharedValue(10)
  const itemStyle = useAnimatedStyle(() => ({
    opacity: itemOpacity.value,
    transform: [{ translateY: itemY.value }],
  }))

  itemOpacity.value = withTiming(1, { duration: 300 })
  itemY.value = withTiming(0, { duration: 300 })

  return (
    <View style={ajoGroupPageStyle.container}>
      <NavHeader path="/savings" header={data?.name ?? 'Ajo Group'} />
      <Animated.View style={[ajoGroupPageStyle.imageContainer, itemStyle]}>
        <LinearGradient colors={['#3B82F6', '#7C3AED']} style={{ flex: 1 }} />
      </Animated.View>
      {error ? (
        <AjoError onRetry={refetch} message={error.message} />
      ) : (
        <AjoGroup id={id} data={data} loading={isLoading} />
      )}
    </View>
  )
}

export default AjoGroupPage
