import Outstanding from '@/assets/svgs/user-info/outstanding-contribution.svg'
import PayoutComing from '@/assets/svgs/user-info/payout-coming.svg'
import { EnhancedInvitationModal } from '@/components/modal'
import { formatDate } from '@/lib/date'
import { useModal } from '@/providers/modal-provider'
import { Feather } from '@expo/vector-icons'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { Invite } from './Card'

interface InfoProps {
  missedRounds: number
  nextPayout: boolean
  payoutDate: Date | null
  slots: number
  pda: string
  isParticipant: boolean
  name: string
  fee: number
}

const infoStyle = StyleSheet.create({
  card: { borderRadius: 12, padding: 16, marginBottom: 24 },
  joinCard: { backgroundColor: '#121212' },
  slotsCard: { backgroundColor: '#121212' },
  missedCard: { backgroundColor: '#FFF7ED' },
  payoutCard: { backgroundColor: '#e8ffcc' },
  content: { flexDirection: 'column' },
  slotsContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  title: { fontSize: 16, fontWeight: '500', color: '#FCFCFC' },
  missedTitle: { color: '#FF6B00' },
  payoutTitle: { color: '#FF6B00' },
  subtitle: { fontSize: 14, color: '#767676' },
  missedSubtitle: { color: '#4B5563' },
  payoutSubtitle: { color: '#4B5563' },
  iconContainer: { backgroundColor: '#FFEDD5', borderRadius: 9999, padding: 8 },
  payoutIconContainer: { backgroundColor: '#F9F4F1', borderRadius: 9999, padding: 8 },
})

const JoinAjoGroup: React.FC<Pick<InfoProps, 'pda' | 'name' | 'fee'>> = ({ pda, name, fee }) => {
  const { showModal } = useModal()
  const opacity = useSharedValue(0)
  const y = useSharedValue(10)
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: y.value }],
  }))

  opacity.value = withTiming(1, { duration: 300 })
  y.value = withTiming(0, { duration: 300 })

  const openInvitationModal = () => {
    showModal(<EnhancedInvitationModal inviter="KooPaa" groupName={name} id={pda} fee={fee} />, {
      position: 'center',
      showCloseButton: true,
      closeOnClickOutside: true,
    })
  }

  return (
    <Animated.View style={[infoStyle.card, infoStyle.joinCard, animatedStyle]}>
      <TouchableOpacity onPress={openInvitationModal}>
        <View style={infoStyle.content}>
          <Text style={infoStyle.title}>Click to Join this group</Text>
          <Text style={infoStyle.subtitle}>Join this saving group and start saving</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  )
}

const OpenSlotsInvite: React.FC<Pick<InfoProps, 'slots' | 'pda'>> = ({ slots, pda }) => {
  const opacity = useSharedValue(0)
  const y = useSharedValue(10)
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: y.value }],
  }))

  opacity.value = withTiming(1, { duration: 300 })
  y.value = withTiming(0, { duration: 300 })

  return (
    <Animated.View style={[infoStyle.card, infoStyle.slotsCard, animatedStyle]}>
      <View style={infoStyle.slotsContent}>
        <View>
          <Text style={infoStyle.title}>{slots} Open Slots</Text>
          <Text style={infoStyle.subtitle}>Generate the link and invite people to join this saving group</Text>
        </View>
        <Invite pda={pda} />
      </View>
    </Animated.View>
  )
}

const MissingRounds: React.FC<Pick<InfoProps, 'missedRounds'>> = ({ missedRounds }) => {
  const opacity = useSharedValue(0)
  const y = useSharedValue(10)
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: y.value }],
  }))

  opacity.value = withTiming(1, { duration: 300 })
  y.value = withTiming(0, { duration: 300 })

  return (
    <Animated.View style={[infoStyle.card, infoStyle.missedCard, animatedStyle]}>
      <View style={infoStyle.slotsContent}>
        <View style={infoStyle.iconContainer}>
          <Outstanding width={20} height={20} />
        </View>
        <View>
          <Text style={[infoStyle.title, infoStyle.missedTitle]}>Pay your contribution now</Text>
          <Text style={[infoStyle.subtitle, infoStyle.missedSubtitle]}>
            You are set back by {missedRounds} contribution rounds. Endeavour to pay!
          </Text>
        </View>
      </View>
    </Animated.View>
  )
}

const NextPayout: React.FC<{ payoutDate: Date }> = ({ payoutDate }) => {
  const opacity = useSharedValue(0)
  const y = useSharedValue(10)
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: y.value }],
  }))

  opacity.value = withTiming(1, { duration: 300 })
  y.value = withTiming(0, { duration: 300 })

  return (
    <Animated.View style={[infoStyle.card, infoStyle.payoutCard, animatedStyle]}>
      <View style={infoStyle.slotsContent}>
        <View style={infoStyle.payoutIconContainer}>
          <PayoutComing width={20} height={20} />
        </View>
        <View>
          <Text style={[infoStyle.title, infoStyle.payoutTitle]}>Your payout is coming soon!</Text>
          <Text style={[infoStyle.subtitle, infoStyle.payoutSubtitle]}>
            You are next to receive the payout on {formatDate(payoutDate)}
          </Text>
        </View>
      </View>
    </Animated.View>
  )
}

const NextSavingDate: React.FC<{ date: Date | null }> = ({ date }) => {
  const opacity = useSharedValue(0)
  const y = useSharedValue(10)
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: y.value }],
  }))

  opacity.value = withTiming(1, { duration: 300 })
  y.value = withTiming(0, { duration: 300 })

  return (
    <Animated.View style={[infoStyle.card, { backgroundColor: '#EFF6FF' }, animatedStyle]}>
      <View style={infoStyle.slotsContent}>
        <View style={[infoStyle.iconContainer, { backgroundColor: '#DBEAFE' }]}>
          <Feather name="calendar" size={20} color="#2563EB" />
        </View>
        <View>
          <Text style={[infoStyle.subtitle, { color: '#4B5563' }]}>Your next saving date is</Text>
          <Text style={infoStyle.title}>{date ? formatDate(date) : 'Not set'}</Text>
        </View>
      </View>
    </Animated.View>
  )
}

const Info: React.FC<InfoProps> = ({ missedRounds, nextPayout, payoutDate, slots, isParticipant, ...props }) => {
  const hasMissedRounds = missedRounds > 0
  const hasPayout = nextPayout && Boolean(payoutDate)
  const hasSlots = slots > 0

  if (hasMissedRounds) return <MissingRounds missedRounds={missedRounds} />
  if (hasPayout) return <NextPayout payoutDate={payoutDate as Date} />
  if (isParticipant && hasSlots) return <OpenSlotsInvite slots={slots} pda={props.pda} />
  if (!isParticipant && hasSlots) return <JoinAjoGroup {...props} />
  return null
}

export { Info, NextSavingDate }
