import { Link } from 'expo-router'
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { Avatar } from '../avatar'

interface Squad {
  name: string
  members: number[]
  goal: number
  tag: string
}

interface SquadCardProps {
  squad: Squad
}

const squadCardStyle = StyleSheet.create({
  container: { alignItems: 'center' },
  card: {
    backgroundColor: '#FCFCFC',
    borderRadius: 9999,
    padding: 16,
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarContainer: { width: '100%', height: '100%', position: 'relative' },
  avatar: { position: 'absolute' },
  extraMembers: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF6B00',
    borderRadius: 9999,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  extraMembersText: { fontSize: 12, fontWeight: '700', color: '#FCFCFC' },
  info: { marginTop: 8, alignItems: 'center' },
  name: { fontSize: 16, fontWeight: '600', color: '#333333' },
  goal: { fontSize: 14, color: '#A4A4A4' },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
    marginTop: 4,
  },
  tagText: { fontSize: 12, fontWeight: '500', marginLeft: 4 },
})

const tagStyles = StyleSheet.create({
  lifestyle: { backgroundColor: '#F3E8FF', color: '#6B21A8' },
  finance: { backgroundColor: '#DCFCE7', color: '#15803D' },
  realEstate: { backgroundColor: '#FEF9C3', color: '#A16207' },
  friends: { backgroundColor: '#DBEAFE', color: '#1E40AF' },
  default: { backgroundColor: '#F1F5F9', color: '#1F2937' },
})

const getTagStyle = (tag: string) => {
  switch (tag.toLowerCase()) {
    case 'lifestyle':
      return tagStyles.lifestyle
    case 'finance':
      return tagStyles.finance
    case 'real estate':
      return tagStyles.realEstate
    case 'friends':
      return tagStyles.friends
    default:
      return tagStyles.default
  }
}

const getTagIcon = (tag: string) => {
  switch (tag.toLowerCase()) {
    case 'real estate':
      return '🏠'
    case 'finance':
      return '💼'
    case 'lifestyle':
      return '🌴'
    default:
      return '👥'
  }
}

const SquadCard: React.FC<SquadCardProps> = ({ squad }) => {
  const visibleMembers = squad.members.slice(0, 4)
  const extraMembers = squad.members.length > 4 ? squad.members.length - 4 : 0
  const scale = useSharedValue(1)
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }))

  const handlePressIn = () => {
    scale.value = withTiming(0.95, { duration: 100 })
  }
  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 100 })
  }

  return (
    <Animated.View style={[squadCardStyle.container, animatedStyle]}>
      <Link href={`/savings/ajo/${squad.name.toLowerCase().replace(/\s+/g, '-')}/join-ajo`} asChild>
        <TouchableOpacity onPressIn={handlePressIn} onPressOut={handlePressOut}>
          <View style={squadCardStyle.card}>
            <View style={squadCardStyle.avatarContainer}>
              {visibleMembers.map((memberId, index) => {
                let position: ViewStyle = {}
                switch (index) {
                  case 0: // Top
                    position = { top: '5%', left: '50%', transform: [{ translateX: -20 }] }
                    break
                  case 1: // Bottom
                    position = { bottom: '5%', left: '50%', transform: [{ translateX: -20 }] }
                    break
                  case 2: // Left
                    position = { left: '5%', top: '50%', transform: [{ translateY: -20 }] }
                    break
                  case 3: // Right
                    position = { right: '5%', top: '50%', transform: [{ translateY: -20 }] }
                    break
                }
                return (
                  <View key={index} style={[squadCardStyle.avatar, position]}>
                    <Avatar number={memberId} />
                  </View>
                )
              })}
              {extraMembers > 0 && (
                <View style={squadCardStyle.extraMembers}>
                  <Text style={squadCardStyle.extraMembersText}>+{extraMembers}</Text>
                </View>
              )}
            </View>
          </View>
          <View style={squadCardStyle.info}>
            <Text style={squadCardStyle.name}>{squad.name}</Text>
            <Text style={squadCardStyle.goal}>${squad.goal.toLocaleString()} goal</Text>
            <View style={[squadCardStyle.tagContainer, getTagStyle(squad.tag)]}>
              <Text>{getTagIcon(squad.tag)}</Text>
              <Text style={[squadCardStyle.tagText, { color: getTagStyle(squad.tag).color }]}>
                {squad.tag.charAt(0).toUpperCase() + squad.tag.slice(1)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Link>
    </Animated.View>
  )
}

export default SquadCard
