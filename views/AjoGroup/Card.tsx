import FormattedBalance from '@/components/savings-and-wallet/format-balance'
import type { Currency } from '@/components/savings-and-wallet/types'
import { Button } from '@/components/ui'
import useContribute from '@/hooks/blockchain/write/useContribute'
import useGetRate from '@/hooks/useGetRate'
import query from '@/lib/fetch'
import { Feather } from '@expo/vector-icons'
import { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withRepeat, withTiming } from 'react-native-reanimated'
import Toast from 'react-native-toast-message'

interface GroupSavingsCardProps {
  progress: number
  payout: number
  contributionAmount: number
  yourContribution: number
  started: boolean
  name: string
  pda: string
  you?: string
  disabled?: boolean
  canTopUp: boolean
  isParticipant: boolean
}

const groupSavingsCardStyle = StyleSheet.create({
  card: { backgroundColor: '#e8ffcc', borderRadius: 12, padding: 16, marginBottom: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  title: { fontSize: 16, fontWeight: '500', color: '#374151' },
  amountContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  amount: { flexDirection: 'row', alignItems: 'baseline' },
  currency: { fontSize: 14, marginRight: 4 },
  balance: { fontSize: 32, fontWeight: '700', color: '#121212' },
  convertButton: {
    backgroundColor: '#FCFCFC',
    borderRadius: 9999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  convertText: { fontSize: 12 },
  goalContainer: { backgroundColor: '#FCFCFC', borderRadius: 8, padding: 12, marginBottom: 16 },
  goalTitle: { fontSize: 14, marginBottom: 4 },
  progressBar: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 9999, marginBottom: 4 },
  progress: { height: '100%', backgroundColor: '#22C55E', borderRadius: 9999 },
  goalText: { flexDirection: 'row', justifyContent: 'space-between', fontSize: 12, color: '#6B7280' },
  stats: { fontSize: 14, color: '#4B5563' },
})

const GroupSavingsCard: React.FC<GroupSavingsCardProps> = (props) => {
  const { name, pda, contributionAmount } = props
  const [isBalanceVisible, setIsBalanceVisible] = useState(true)
  const [currency, setCurrency] = useState<Currency>('USDC')
  const [balance, setBalance] = useState(props.payout)
  const { contribute, isPending, loading } = useContribute()
  const rate = useGetRate()

  const opacity = useSharedValue(0)
  const y = useSharedValue(10)
  const cardStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: y.value }],
  }))
  const progressStyle = useAnimatedStyle(() => ({
    width: `${props.progress}%`,
  }))
  const balanceStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))

  opacity.value = withTiming(1, { duration: 300 })
  y.value = withDelay(500, withTiming(0, { duration: 300 }))

  const handleTopUp = async () => await contribute(pda, name, contributionAmount)

  const convert = () => {
    if (currency === 'USDC') {
      setBalance(props.payout * rate)
      setCurrency('NGN')
    } else {
      setBalance(props.payout)
      setCurrency('USDC')
    }
  }

  return (
    <Animated.View style={[groupSavingsCardStyle.card, cardStyle]}>
      <View style={groupSavingsCardStyle.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={groupSavingsCardStyle.title}>Rotating Payout</Text>
          <TouchableOpacity onPress={() => setIsBalanceVisible(!isBalanceVisible)}>
            <Feather name="eye" size={18} color="#4B5563" />
          </TouchableOpacity>
        </View>
        {!props.started && <Invite pda={pda} />}
      </View>
      <View style={groupSavingsCardStyle.amountContainer}>
        <View style={groupSavingsCardStyle.amount}>
          <Text style={groupSavingsCardStyle.currency}>{currency}</Text>
          <Animated.Text style={[groupSavingsCardStyle.balance, balanceStyle]}>
            {isBalanceVisible ? <FormattedBalance amount={balance} /> : '****'}
          </Animated.Text>
        </View>
        <TouchableOpacity style={groupSavingsCardStyle.convertButton} onPress={convert}>
          <Text style={groupSavingsCardStyle.convertText}>{currency}</Text>
          <Feather name="refresh-cw" size={12} color="#121212" />
        </TouchableOpacity>
      </View>
      <View style={groupSavingsCardStyle.goalContainer}>
        <Text style={groupSavingsCardStyle.goalTitle}>Goal Tracker</Text>
        <View style={groupSavingsCardStyle.progressBar}>
          <Animated.View style={[groupSavingsCardStyle.progress, progressStyle]} />
        </View>
        <View style={groupSavingsCardStyle.goalText}>
          <Text>1%</Text>
          <Text>100%</Text>
        </View>
      </View>
      {props.isParticipant && (
        <Text style={groupSavingsCardStyle.stats}>Amount you saved: ${props.yourContribution}</Text>
      )}
      <Button
        onPress={handleTopUp}
        disabled={!props.started || props.disabled || !props.canTopUp || !props.isParticipant}
        loading={isPending || loading}
      >
        Contribute
      </Button>
    </Animated.View>
  )
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)

const Invite: React.FC<{ pda: string }> = ({ pda }) => {
  const [isInviting, setIsInviting] = useState(false)
  const scale = useSharedValue(1)
  const rotation = useSharedValue(0)
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))
  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }))

  if (isInviting) {
    rotation.value = withRepeat(withTiming(360, { duration: 1000 }), -1)
  } else {
    rotation.value = withTiming(0, { duration: 100 })
  }

  const handlePressIn = () => {
    scale.value = withTiming(0.95, { duration: 100 })
  }
  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 100 })
  }

  const invite = async () => {
    setIsInviting(true)
    try {
      Toast.show({ type: 'info', text1: 'Please wait as we generate you a unique invite link' })
      const { data, error } = await query.post<string>('', { body: { pda } })
      Toast.hide()
      if (data) {
        const Clipboard = require('expo-clipboard')
        await Clipboard.setStringAsync(data)
        Toast.show({
          type: 'success',
          text1: `Invite link copied! Share with friends to join Ajo Group`,
        })
      } else {
        Toast.show({ type: 'error', text1: error || 'Failed to generate invite link' })
      }
    } catch (err) {
      console.error('failed to copy invite link: ', err)
      Toast.show({ type: 'error', text1: 'Failed to copy invite link' })
    } finally {
      setIsInviting(false)
    }
  }

  return (
    <AnimatedTouchableOpacity
      style={[groupSavingsCardStyle.convertButton, { backgroundColor: '#FCFCFC80' }, animatedStyle]}
      onPress={invite}
      disabled={isInviting}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      {isInviting ? (
        <Animated.View style={iconStyle}>
          <Feather name="refresh-cw" size={12} color="#374151" />
        </Animated.View>
      ) : (
        <Feather name="share-2" size={12} color="#374151" />
      )}
      <Text style={{ fontSize: 12, fontWeight: '500', color: '#374151' }}>Invite</Text>
    </AnimatedTouchableOpacity>
  )
}

export { GroupSavingsCard, Invite }
