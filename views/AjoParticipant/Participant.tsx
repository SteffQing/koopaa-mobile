import { Avatar } from '@/components/avatar'
import useParticipant from '@/hooks/db/useParticipant'
import { formatDate } from '@/lib/date'
import { getPosition } from '@/lib/numbers'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

interface ParticipantProps {
  participant: string
  index: number
  isNext: boolean
  nextPayoutDate: Date | null
  isYou: boolean
}

const participantStyle = StyleSheet.create({
  card: { backgroundColor: '#FCFCFC', borderRadius: 12, padding: 16 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  avatarContainer: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  textContainer: { flexDirection: 'column', gap: 4 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { fontSize: 16, fontWeight: '500', color: '#121212' },
  adminBadge: {
    fontSize: 12,
    backgroundColor: '#FEEBC8',
    color: '#FF6B00',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  positionRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  position: { fontSize: 12, color: '#F97316', fontWeight: '500' },
  positionText: { fontSize: 12, color: '#6B7280' },
  statusButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, fontSize: 14, fontWeight: '500' },
  nextStatus: { backgroundColor: '#F3E8FF', color: '#6B21A8' },
  paidStatus: { backgroundColor: '#CFFED1', color: '#007B04' },
  outstandingStatus: { backgroundColor: '#FFF7C4', color: '#7F6200' },
  divider: { backgroundColor: '#E6E6E6', height: 1, width: '100%', marginVertical: 8 },
  date: { fontSize: 14, color: '#6B7280', marginLeft: 52 },
  skeleton: { height: 20, width: 96, backgroundColor: '#E5E7EB', borderRadius: 4 },
})

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)

const Participant: React.FC<ParticipantProps> = ({ participant, index, isNext, nextPayoutDate, isYou }) => {
  const { data, isLoading } = useParticipant(participant)
  const cardOpacity = useSharedValue(0)
  const cardY = useSharedValue(10)
  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ translateY: cardY.value }],
  }))
  const buttonScale = useSharedValue(1)
  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }))

  cardOpacity.value = withTiming(1, { duration: 300 })
  cardY.value = withTiming(0, { duration: 300 })

  const handlePressIn = () => {
    buttonScale.value = withTiming(0.95, { duration: 100 })
  }
  const handlePressOut = () => {
    buttonScale.value = withTiming(1, { duration: 100 })
  }

  return (
    <Animated.View style={[participantStyle.card, cardStyle]}>
      <View style={participantStyle.row}>
        <View style={participantStyle.avatarContainer}>
          <Avatar number={data?.data?.avatar} />
          <View style={participantStyle.textContainer}>
            <View style={participantStyle.nameRow}>
              {isLoading || !data?.data ? (
                <View style={participantStyle.skeleton} />
              ) : (
                <Text style={participantStyle.name}>{isYou ? 'You' : data.data.username}</Text>
              )}
              {index === 0 && <Text style={participantStyle.adminBadge}>Admin</Text>}
            </View>
            <View style={participantStyle.positionRow}>
              <Text style={participantStyle.position}>@{getPosition(index + 1)}</Text>
              <Text style={participantStyle.positionText}>to collect contribution</Text>
            </View>
          </View>
        </View>
        {isNext ? (
          <AnimatedTouchableOpacity
            style={[participantStyle.statusButton, participantStyle.nextStatus, buttonStyle]}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <Text style={{ color: '#6B21A8' }}>Next</Text>
          </AnimatedTouchableOpacity>
        ) : nextPayoutDate && nextPayoutDate < new Date() ? (
          <Text style={[participantStyle.statusButton, participantStyle.paidStatus]}>Paid</Text>
        ) : (
          <Text style={[participantStyle.statusButton, participantStyle.outstandingStatus]}>Outstanding</Text>
        )}
      </View>
      <View style={participantStyle.divider} />
      {nextPayoutDate && <Text style={participantStyle.date}>Date of collection: {formatDate(nextPayoutDate)}</Text>}
    </Animated.View>
  )
}

export default Participant
