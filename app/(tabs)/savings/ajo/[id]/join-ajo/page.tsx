import AjoError from '@/components/error'
import { EnhancedInvitationModal } from '@/components/modal'
import useGetAjoGroup from '@/hooks/blockchain/read/useFetchAjoGroup'
import { useSession } from '@/hooks/useSession'
import { useModal } from '@/providers/modal-provider'
import AjoGroup from '@/views/AjoGroup'
import NavHeader from '@/views/Navigation/nav-header'
import { useWallet } from '@solana/wallet-adapter-react'
import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

interface JoinAjoGroupPageProps {
  params: { id: string }
  searchParams: { inviter: string }
}

const joinAjoGroupPageStyle = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  imageContainer: { marginBottom: 16, borderRadius: 12, overflow: 'hidden', height: 160 },
})

const JoinAjoGroupPage: React.FC<JoinAjoGroupPageProps> = ({ params, searchParams }) => {
  const { id } = params
  const { inviter } = searchParams
  const router = useRouter()
  const { data, isLoading, error, refetch } = useGetAjoGroup(id)
  const { session } = useSession()
  const { publicKey } = useWallet()
  const { showModal, hideModal } = useModal()

  const openInvitationModal = (name: string, fee: number) => {
    showModal(<EnhancedInvitationModal inviter={inviter} groupName={name} id={id} fee={fee} />, {
      position: 'center',
      showCloseButton: false,
      closeOnClickOutside: false,
    })
  }

  useEffect(() => {
    if (data) {
      if (data.participants.some((p) => p.participant === session)) {
        hideModal()
        router.replace('/')
      } else {
        openInvitationModal(data.name, data.securityDeposit)
      }
    }
  }, [data, session, publicKey])

  const itemOpacity = useSharedValue(0)
  const itemY = useSharedValue(10)
  const itemStyle = useAnimatedStyle(() => ({
    opacity: itemOpacity.value,
    transform: [{ translateY: itemY.value }],
  }))

  itemOpacity.value = withTiming(1, { duration: 300 })
  itemY.value = withTiming(0, { duration: 300 })

  return (
    <View style={joinAjoGroupPageStyle.container}>
      <NavHeader path="/savings" header={data?.name ?? 'Ajo Group'} />
      <Animated.View style={[joinAjoGroupPageStyle.imageContainer, itemStyle]}>
        <LinearGradient colors={['#3B82F6', '#7C3AED']} style={{ flex: 1 }} />
      </Animated.View>
      {error ? (
        <AjoError onRetry={refetch} message={error.message} />
      ) : (
        <AjoGroup id={id} data={data} loading={isLoading} disabled />
      )}
    </View>
  )
}

export default JoinAjoGroupPage
