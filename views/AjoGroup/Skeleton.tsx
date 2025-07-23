import { Feather } from '@expo/vector-icons'
import { StyleSheet, Text, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated'

const skeletonStyle = StyleSheet.create({
  card: { borderRadius: 12, padding: 16, marginBottom: 24 },
  savingsCard: { backgroundColor: '#e8ffcc' },
  infoCard: { backgroundColor: '#FFF7ED' },
  nextSavingCard: { backgroundColor: '#EFF6FF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  title: { height: 20, backgroundColor: '#D1D5DB', borderRadius: 4, width: 128 },
  icon: { color: '#9CA3AF' },
  amountContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  amount: { flexDirection: 'row', alignItems: 'baseline' },
  smallBox: { height: 16, backgroundColor: '#D1D5DB', borderRadius: 4, width: 48, marginRight: 4 },
  largeBox: { height: 32, backgroundColor: '#D1D5DB', borderRadius: 4, width: 80 },
  currencyBox: {
    backgroundColor: '#FCFCFC',
    borderRadius: 9999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  currencyText: { height: 12, backgroundColor: '#E5E7EB', borderRadius: 4, width: 32 },
  goalContainer: { backgroundColor: '#FCFCFC', borderRadius: 8, padding: 12, marginBottom: 16 },
  goalTitle: { height: 16, backgroundColor: '#E5E7EB', borderRadius: 4, width: 96, marginBottom: 4 },
  progressBar: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 9999, marginBottom: 4 },
  progress: { height: '100%', backgroundColor: '#D1D5DB', borderRadius: 9999, width: '25%' },
  goalText: { height: 12, backgroundColor: '#E5E7EB', borderRadius: 4 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  statsBox: { height: 16, backgroundColor: '#D1D5DB', borderRadius: 4, width: 112 },
  actionContainer: {
    backgroundColor: '#FCFCFC',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionText: { height: 16, backgroundColor: '#E5E7EB', borderRadius: 4, width: 48 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 24 },
  gridItem: {
    backgroundColor: '#FCFCFC',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    width: '47%',
  },
  nextSavingContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconContainer: { backgroundColor: '#DBEAFE', borderRadius: 9999, padding: 8 },
  infoIconContainer: { backgroundColor: '#FFEDD5', borderRadius: 9999, padding: 8 },
  infoContent: { flex: 1 },
  infoTitle: { height: 20, backgroundColor: '#FFEDD5', borderRadius: 4, width: 192, marginBottom: 4 },
  infoSubtitle: { height: 16, backgroundColor: '#FFEDD5', borderRadius: 4, width: 256 },
  membersContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  avatar: { width: 24, height: 24, backgroundColor: '#E5E7EB', borderRadius: 9999 },
  membersText: { height: 12, backgroundColor: '#E5E7EB', borderRadius: 4, width: 24, marginRight: 4 },
})

const GroupSavingsCardSkeleton: React.FC = () => {
  const opacity = useSharedValue(1)
  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }))
  opacity.value = withRepeat(withTiming(0.5, { duration: 1000 }), -1, true)

  return (
    <Animated.View style={[skeletonStyle.card, skeletonStyle.savingsCard, animatedStyle]}>
      <View style={skeletonStyle.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={skeletonStyle.title} />
          <Feather name="eye" size={18} style={skeletonStyle.icon} />
        </View>
        <View style={[skeletonStyle.currencyBox, { backgroundColor: '#FCFCFC80' }]}>
          <Feather name="share-2" size={12} style={skeletonStyle.icon} />
          <Text>Invite</Text>
        </View>
      </View>
      <View style={skeletonStyle.amountContainer}>
        <View style={skeletonStyle.amount}>
          <View style={skeletonStyle.smallBox} />
          <View style={skeletonStyle.largeBox} />
        </View>
        <View style={skeletonStyle.currencyBox}>
          <View style={skeletonStyle.currencyText} />
          <Feather name="refresh-cw" size={12} style={skeletonStyle.icon} />
        </View>
      </View>
      <View style={skeletonStyle.goalContainer}>
        <View style={skeletonStyle.goalTitle} />
        <View style={skeletonStyle.progressBar}>
          <View style={skeletonStyle.progress} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={[skeletonStyle.goalText, { width: 16 }]} />
          <View style={[skeletonStyle.goalText, { width: 32 }]} />
        </View>
      </View>
      <View style={skeletonStyle.statsContainer}>
        <View style={[skeletonStyle.statsBox, { marginBottom: 4 }]} />
      </View>
      <View style={skeletonStyle.actionContainer}>
        <View style={skeletonStyle.actionText} />
        <Feather name="arrow-down" size={16} style={skeletonStyle.icon} />
      </View>
    </Animated.View>
  )
}

const GroupInfoSkeleton: React.FC = () => {
  const opacity = useSharedValue(1)
  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }))
  opacity.value = withRepeat(withTiming(0.5, { duration: 1000 }), -1, true)

  return (
    <>
      <View style={skeletonStyle.gridContainer}>
        {[...Array(6)].map((_, index) => (
          <Animated.View
            key={index}
            style={[skeletonStyle.gridItem, animatedStyle, { width: index === 5 ? '47%' : '47%' }]}
          >
            <View style={[skeletonStyle.goalTitle, { width: index % 2 === 0 ? 64 : 80 }]} />
            <View style={[skeletonStyle.goalText, { width: index % 2 === 0 ? 96 : 112 }]} />
            {index === 5 && (
              <View style={skeletonStyle.membersContainer}>
                <View style={{ flexDirection: 'row', marginLeft: -8 }}>
                  <View style={skeletonStyle.avatar} />
                  <View style={skeletonStyle.avatar} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={skeletonStyle.membersText} />
                  <Feather name="chevron-right" size={16} style={skeletonStyle.icon} />
                </View>
              </View>
            )}
          </Animated.View>
        ))}
      </View>
    </>
  )
}

const InfoSkeleton: React.FC = () => {
  const opacity = useSharedValue(1)
  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }))
  opacity.value = withRepeat(withTiming(0.5, { duration: 1000 }), -1, true)

  return (
    <Animated.View style={[skeletonStyle.card, skeletonStyle.infoCard, animatedStyle]}>
      <View style={skeletonStyle.nextSavingContent}>
        <View style={skeletonStyle.infoIconContainer}>
          <View style={{ width: 20, height: 20, backgroundColor: '#FFEDD5', borderRadius: 4 }} />
        </View>
        <View style={skeletonStyle.infoContent}>
          <View style={skeletonStyle.infoTitle} />
          <View style={skeletonStyle.infoSubtitle} />
        </View>
      </View>
    </Animated.View>
  )
}

const NextSavingDateSkeleton: React.FC = () => {
  const opacity = useSharedValue(1)
  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }))
  opacity.value = withRepeat(withTiming(0.5, { duration: 1000 }), -1, true)

  return (
    <Animated.View style={[skeletonStyle.card, skeletonStyle.nextSavingCard, animatedStyle]}>
      <View style={skeletonStyle.nextSavingContent}>
        <View style={skeletonStyle.iconContainer}>
          <Feather name="calendar" size={20} color="#2563EB" />
        </View>
        <View>
          <View style={[skeletonStyle.goalTitle, { width: 144 }]} />
          <View style={[skeletonStyle.goalText, { width: 64 }]} />
        </View>
      </View>
    </Animated.View>
  )
}

const GroupDetailsSkeleton: React.FC<{ showInfo?: boolean }> = ({ showInfo = true }) => {
  return (
    <View style={{ marginBottom: 0 }}>
      <GroupSavingsCardSkeleton />
      {showInfo && <InfoSkeleton />}
      <GroupInfoSkeleton />
      <NextSavingDateSkeleton />
    </View>
  )
}

export { GroupDetailsSkeleton, GroupInfoSkeleton, GroupSavingsCardSkeleton, InfoSkeleton, NextSavingDateSkeleton }
