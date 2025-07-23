import { Avatar } from '@/components/avatar'
import type { GroupAndParticipants } from '@/hooks/db/useUserGroups'
import { formatDate } from '@/lib/date'
import { tagOptions } from '@/lib/static'
import { Link } from 'expo-router'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

interface GroupCardProps {
  group: GroupAndParticipants
}

const groupCardStyle = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: { height: 150 },
  headerContent: { position: 'absolute', bottom: 12, left: 12 },
  title: { fontSize: 18, fontWeight: '600', color: '#FFFFFF' },
  tagButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
    backgroundColor: '#FF6B00',
  },
  tagText: { fontSize: 12, color: '#FFFFFF' },
  content: { padding: 16 },
  description: { fontSize: 14, color: '#4B5563', marginBottom: 16, maxHeight: 40, overflow: 'hidden' },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  statLabel: { fontSize: 12, color: '#6B7280', textTransform: 'uppercase' },
  statValue: { fontSize: 14, fontWeight: '600', color: '#111827' },
  avatarContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  avatars: { flexDirection: 'row', marginLeft: -8 },
  moreText: { fontSize: 14, color: '#6B7280', marginLeft: 12 },
  // status: { paddingHorizontal: 10, paddingVertical: 2, borderRadius: 9999, backgroundColor: '#DCFCE7', color: '#166534', fontSize: 12, fontWeight: '500' },
})

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)

const GroupCard: React.FC<GroupCardProps> = ({ group }) => {
  const tag = tagOptions.find((t) => t.value === group.tag)!
  const scale = useSharedValue(1)
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scale.value === 1 ? 0 : -2 }],
    shadowOpacity: scale.value === 1 ? 0.05 : 0.1,
    elevation: scale.value === 1 ? 2 : 4,
  }))
  const buttonScale = useSharedValue(1)
  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }))

  const handlePressIn = () => {
    scale.value = withTiming(0.98, { duration: 100 })
    buttonScale.value = withTiming(0.95, { duration: 100 })
  }
  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 100 })
    buttonScale.value = withTiming(1, { duration: 100 })
  }

  return (
    <Link href={`/savings/ajo/${group.pda}`} asChild>
      <TouchableOpacity onPressIn={handlePressIn} onPressOut={handlePressOut}>
        <Animated.View style={[groupCardStyle.card, animatedStyle]}>
          <LinearGradient colors={['#3B82F6', '#7C3AED']} style={groupCardStyle.header}>
            <View style={groupCardStyle.headerContent}>
              <Text style={groupCardStyle.title}>{group.name}</Text>
              <AnimatedTouchableOpacity style={[groupCardStyle.tagButton, buttonStyle]}>
                <Text style={groupCardStyle.tagText}>
                  {tag.icon} {tag.label}
                </Text>
              </AnimatedTouchableOpacity>
            </View>
          </LinearGradient>
          <View style={groupCardStyle.content}>
            <Text style={groupCardStyle.description}>{group.description}</Text>
            <View style={groupCardStyle.statsContainer}>
              <View>
                <Text style={groupCardStyle.statLabel}>Created</Text>
                <Text style={groupCardStyle.statValue}>{formatDate(group.created_at)}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={groupCardStyle.statLabel}>Members</Text>
                <Text style={groupCardStyle.statValue}>{group.participants.length}</Text>
              </View>
            </View>
            <View style={groupCardStyle.avatarContainer}>
              <View style={groupCardStyle.avatars}>
                {group.participants.slice(0, 4).map((participant) => (
                  <Avatar size={32} number={participant.avatar} key={participant.address} />
                ))}
                {group.participants.length > 4 && (
                  <Text style={groupCardStyle.moreText}>+{group.participants.length - 4} more</Text>
                )}
              </View>
              {/* <Text style={groupCardStyle.status}>Active</Text> */}
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Link>
  )
}

export default GroupCard
