import { GetAvatar } from '@/components/avatar'
import { formatDate, formatDateTS } from '@/lib/date'
import { getPosition } from '@/lib/numbers'
import { Feather } from '@expo/vector-icons'
import { Link } from 'expo-router'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

interface GroupInfoProps {
  payoutRound: number
  payoutInterval: number
  contributionInterval: number
  contributionAmount: number
  pda: string
  participants: string[]
  createdAt: Date
  startTimestamp: null | number
  disabled?: boolean
}

const groupInfoStyle = StyleSheet.create({
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 24 },
  gridItem: {
    backgroundColor: '#FCFCFC',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    width: '47%',
  },
  text: { fontSize: 14, color: '#6B7280', marginBottom: 4 },
  value: { fontSize: 16, fontWeight: '500', color: '#121212' },
  membersContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  avatars: { flexDirection: 'row', marginLeft: -8 },
  moreText: { fontSize: 14, marginRight: 4 },
})

const GroupInfo: React.FC<GroupInfoProps> = (props) => {
  const participantsCount = props.participants.length
  const participantsShown = props.participants.slice(0, 3)
  const opacity = useSharedValue(0)
  const y = useSharedValue(10)
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: y.value }],
  }))

  opacity.value = withTiming(1, { duration: 300 })
  y.value = withTiming(0, { duration: 300 })

  return (
    <>
      <Animated.View style={[groupInfoStyle.gridContainer, animatedStyle]}>
        <View style={groupInfoStyle.gridItem}>
          <Text style={groupInfoStyle.text}>Creation Date</Text>
          <Text style={groupInfoStyle.value}>{formatDate(props.createdAt)}</Text>
        </View>
        <View style={groupInfoStyle.gridItem}>
          <Text style={groupInfoStyle.text}>Start Date</Text>
          <Text style={groupInfoStyle.value}>
            {props.startTimestamp ? formatDateTS(props.startTimestamp) : 'Not yet!'}
          </Text>
        </View>
      </Animated.View>
      <Animated.View style={[groupInfoStyle.gridContainer, animatedStyle]}>
        <View style={groupInfoStyle.gridItem}>
          <Text style={groupInfoStyle.text}>Contribution Amount</Text>
          <Text style={groupInfoStyle.value}>{props.contributionAmount} USDC</Text>
        </View>
        <View style={groupInfoStyle.gridItem}>
          <Text style={groupInfoStyle.text}>Contribution interval</Text>
          <Text style={groupInfoStyle.value}>{props.contributionInterval} days</Text>
        </View>
      </Animated.View>
      <Animated.View style={[groupInfoStyle.gridContainer, animatedStyle]}>
        <View style={groupInfoStyle.gridItem}>
          <Text style={groupInfoStyle.text}>Payout Round</Text>
          <Text style={groupInfoStyle.value}>{getPosition(props.payoutRound + 1)} round</Text>
        </View>
        <View style={groupInfoStyle.gridItem}>
          <Text style={groupInfoStyle.text}>Payout interval</Text>
          <Text style={groupInfoStyle.value}>{props.payoutInterval} days</Text>
        </View>
      </Animated.View>
      <Animated.View style={[groupInfoStyle.gridContainer, animatedStyle]}>
        <View style={groupInfoStyle.gridItem}>
          <Text style={groupInfoStyle.text}>Group Type</Text>
          <Text style={groupInfoStyle.value}>Public Group</Text>
        </View>
        <Link href={props.disabled ? '#' : `/savings/ajo/${props.pda}/participants`} asChild>
          <TouchableOpacity disabled={props.disabled}>
            <View style={[groupInfoStyle.gridItem, { borderWidth: 0 }]}>
              <Text style={groupInfoStyle.text}>Group Members</Text>
              <View style={groupInfoStyle.membersContainer}>
                <View style={groupInfoStyle.avatars}>
                  {participantsShown.map((address, idx) => (
                    <GetAvatar address={address} size={24} key={idx + address} />
                  ))}
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={groupInfoStyle.moreText}>
                    {participantsCount > 3 ? `+ ${participantsCount - 3}` : ''}
                  </Text>
                  <Feather name="chevron-right" size={16} color="#9CA3AF" />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Link>
      </Animated.View>
    </>
  )
}

export default GroupInfo
