import { StyleSheet, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated'

interface ParticipantsListSkeletonProps {
  count?: number
}

const skeletonStyle = StyleSheet.create({
  container: { flexDirection: 'column', gap: 16 },
  card: { backgroundColor: '#FCFCFC', borderRadius: 12, padding: 16 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  avatar: { width: 40, height: 40, backgroundColor: '#E5E7EB', borderRadius: 20 },
  textContainer: { flexDirection: 'column', gap: 4 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  name: { height: 20, width: 96, backgroundColor: '#E5E7EB', borderRadius: 4 },
  adminBadge: { height: 16, width: 48, backgroundColor: '#FEEBC8', borderRadius: 4 },
  positionRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  position: { height: 12, width: 24, backgroundColor: '#E5E7EB', borderRadius: 4 },
  positionText: { height: 12, width: 128, backgroundColor: '#E5E7EB', borderRadius: 4 },
  status: { height: 28, width: 80, backgroundColor: '#E5E7EB', borderRadius: 6 },
  date: { height: 16, width: 160, backgroundColor: '#E5E7EB', borderRadius: 4 },
})

const ParticipantsListSkeleton: React.FC<ParticipantsListSkeletonProps> = ({ count = 5 }) => {
  const pulseOpacity = useSharedValue(0.5)
  const pulseStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
  }))

  pulseOpacity.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true)

  return (
    <View style={skeletonStyle.container}>
      {[...Array(count)].map((_, idx) => (
        <Animated.View key={idx} style={[skeletonStyle.card, pulseStyle]}>
          <View style={skeletonStyle.row}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={skeletonStyle.avatar} />
              <View style={skeletonStyle.textContainer}>
                <View style={skeletonStyle.nameRow}>
                  <View style={skeletonStyle.name} />
                  {idx % 3 === 0 && <View style={skeletonStyle.adminBadge} />}
                </View>
                <View style={skeletonStyle.positionRow}>
                  <View style={skeletonStyle.position} />
                  <View style={skeletonStyle.positionText} />
                </View>
              </View>
            </View>
            <View style={skeletonStyle.status} />
          </View>
          <View style={skeletonStyle.date} />
        </Animated.View>
      ))}
    </View>
  )
}

export default ParticipantsListSkeleton
