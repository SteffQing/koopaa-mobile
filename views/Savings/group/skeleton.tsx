import { StyleSheet, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated'

interface GroupCardSkeletonProps {
  count?: number
}

const groupCardSkeletonStyle = StyleSheet.create({
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
    marginBottom: 16,
  },
  header: { height: 96 },
  headerContent: { position: 'absolute', bottom: 12, left: 12 },
  title: { height: 20, backgroundColor: '#E5E7EB', borderRadius: 4, width: 128, marginBottom: 8 },
  tag: { height: 16, backgroundColor: '#E5E7EB', borderRadius: 4, width: 64 },
  content: { padding: 16 },
  description: { marginBottom: 16 },
  descriptionLine1: { height: 16, backgroundColor: '#E5E7EB', borderRadius: 4, width: '100%', marginBottom: 8 },
  descriptionLine2: { height: 16, backgroundColor: '#E5E7EB', borderRadius: 4, width: '75%' },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  statLabel: { height: 12, backgroundColor: '#E5E7EB', borderRadius: 4, width: 64, marginBottom: 4 },
  statValue: { height: 20, backgroundColor: '#E5E7EB', borderRadius: 4, width: 80 },
  avatarContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  avatars: { flexDirection: 'row', marginLeft: -8 },
  avatar: {
    width: 32,
    height: 32,
    backgroundColor: '#E5E7EB',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  moreText: { height: 16, backgroundColor: '#E5E7EB', borderRadius: 4, width: 64, marginLeft: 12 },
  // status: { height: 24, backgroundColor: '#E5E7EB', borderRadius: 9999, width: 64 },
})

const Skeleton: React.FC = () => {
  const opacity = useSharedValue(1)
  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }))
  opacity.value = withRepeat(withTiming(0.5, { duration: 1000 }), -1, true)

  return (
    <Animated.View style={[groupCardSkeletonStyle.card, animatedStyle]}>
      <LinearGradient colors={['#D1D5DB', '#D1D5DB']} style={groupCardSkeletonStyle.header}>
        <View style={groupCardSkeletonStyle.headerContent}>
          <View style={groupCardSkeletonStyle.title} />
          <View style={groupCardSkeletonStyle.tag} />
        </View>
      </LinearGradient>
      <View style={groupCardSkeletonStyle.content}>
        <View style={groupCardSkeletonStyle.description}>
          <View style={groupCardSkeletonStyle.descriptionLine1} />
          <View style={groupCardSkeletonStyle.descriptionLine2} />
        </View>
        <View style={groupCardSkeletonStyle.statsContainer}>
          <View>
            <View style={groupCardSkeletonStyle.statLabel} />
            <View style={groupCardSkeletonStyle.statValue} />
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <View style={[groupCardSkeletonStyle.statLabel, { width: 64 }]} />
            <View style={[groupCardSkeletonStyle.statValue, { width: 32 }]} />
          </View>
        </View>
        <View style={groupCardSkeletonStyle.avatarContainer}>
          <View style={groupCardSkeletonStyle.avatars}>
            {[...Array(3)].map((_, i) => (
              <View key={i} style={groupCardSkeletonStyle.avatar} />
            ))}
            <View style={groupCardSkeletonStyle.moreText} />
          </View>
          {/* <View style={groupCardSkeletonStyle.status} /> */}
        </View>
      </View>
    </Animated.View>
  )
}

const GroupCardSkeleton: React.FC<GroupCardSkeletonProps> = ({ count = 3 }) => {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <Skeleton key={i} />
      ))}
    </>
  )
}

export default GroupCardSkeleton
