import AjoError from '@/components/error'
import useGetAjoGroup from '@/hooks/blockchain/read/useFetchAjoGroup'
import NavHeader from '@/views/Navigation/nav-header'
import { useWallet } from '@solana/wallet-adapter-react'
import { StyleSheet, View } from 'react-native'
import Participant from './Participant'
import ParticipantsListSkeleton from './Skeleton'

interface GroupMembersPageProps {
  params: { id: string }
}

const groupMembersStyle = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F2F2F2' },
  list: { flexDirection: 'column', gap: 16 },
})

function calculatePayoutDate(
  date: Date | null,
  interval: number,
  nextPayoutIndex: number,
  position: number,
  totalMembers: number,
) {
  if (!date) return null
  const roundsAway = (position - nextPayoutIndex + totalMembers) % totalMembers
  const daysUntilPayout = roundsAway * interval

  const payoutDate = new Date(date)
  payoutDate.setDate(payoutDate.getDate() + daysUntilPayout)
  return payoutDate
}

const GroupMembersPage: React.FC<GroupMembersPageProps> = ({ params }) => {
  const { id } = params
  const { data, isLoading, error, refetch } = useGetAjoGroup(id)
  const { publicKey } = useWallet()

  return (
    <View style={groupMembersStyle.container}>
      <NavHeader path={`/savings/ajo/${id}`} header="Group Participants" />
      <View style={groupMembersStyle.list}>
        {isLoading || !data ? (
          <ParticipantsListSkeleton />
        ) : error ? (
          <AjoError message={error.message} onRetry={refetch} />
        ) : (
          data.participants.map(({ participant }, idx) => (
            <Participant
              participant={participant}
              nextPayoutDate={calculatePayoutDate(
                data.next_payout_date(),
                data.payoutInterval,
                data.payoutRound % data.numParticipants,
                idx,
                data.numParticipants,
              )}
              isNext={data.payoutRound % data.numParticipants === idx}
              isYou={publicKey?.toBase58() === participant}
              index={idx}
              key={participant}
            />
          ))
        )}
      </View>
    </View>
  )
}

export default GroupMembersPage
