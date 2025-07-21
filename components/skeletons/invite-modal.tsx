import getTheme from '@/constants/theme'
import { useEffect } from 'react'
import { StyleSheet, useColorScheme, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'
import { Path, Svg, SvgProps } from 'react-native-svg'

const Star: React.FC<SvgProps> = (props) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
      fill="currentColor"
    />
  </Svg>
)

const invitationModalSkeletonStyle = StyleSheet.create({
  container: {
    padding: 24,
  },
  avatarSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  avatarWrapper: {
    position: 'relative',
  },
  mainAvatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    overflow: 'hidden',
  },
  secondaryAvatarWrapper: {
    position: 'absolute',
    left: '55%',
    top: '25%',
  },
  secondaryAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
  },
  starIcon: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  textSection: {
    alignItems: 'center',
    marginBottom: 32,
    gap: 12,
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  usernameBadge: {
    height: 24,
    width: 80,
    borderRadius: 6,
    overflow: 'hidden',
  },
  inviteText: {
    height: 20,
    width: 96,
    borderRadius: 4,
    overflow: 'hidden',
  },
  groupBadge: {
    height: 24,
    width: 64,
    borderRadius: 6,
    overflow: 'hidden',
  },
  secondLine: {
    height: 20,
    width: 192,
    borderRadius: 4,
    overflow: 'hidden',
  },
  buttonSection: {
    gap: 12,
  },
  acceptButton: {
    height: 40,
    borderRadius: 6,
    overflow: 'hidden',
  },
  declineButton: {
    height: 40,
    borderRadius: 6,
    borderWidth: 1,
    overflow: 'hidden',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
})

const InvitationModalSkeleton: React.FC = () => {
  const colorScheme = useColorScheme()
  const theme = getTheme(colorScheme || 'light')

  // Container animation
  const containerOpacity = useSharedValue(0)
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }))

  // Avatar pulse animation
  const mainAvatarScale = useSharedValue(1)
  const mainAvatarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: mainAvatarScale.value }],
  }))

  const secondaryAvatarScale = useSharedValue(1)
  const secondaryAvatarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: secondaryAvatarScale.value }],
  }))

  // Star rotation animation
  const starRotate = useSharedValue(0)
  const starAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${starRotate.value}deg` }],
  }))

  // Secondary avatar float animation
  const secondaryAvatarY = useSharedValue(0)
  //   const secondaryAvatarAnimatedStyle = useAnimatedStyle(() => ({
  //     transform: [{ translateY: secondaryAvatarY.value }],
  //   }))

  // Shimmer animations
  const shimmerX = useSharedValue(-100)
  const shimmerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerX.value }],
  }))

  // Text animations
  const usernameBadgeOpacity = useSharedValue(0)
  const usernameBadgeScale = useSharedValue(0.8)
  const usernameBadgeAnimatedStyle = useAnimatedStyle(() => ({
    opacity: usernameBadgeOpacity.value,
    transform: [{ scale: usernameBadgeScale.value }],
  }))

  const inviteTextOpacity = useSharedValue(0)
  const inviteTextX = useSharedValue(-20)
  const inviteTextAnimatedStyle = useAnimatedStyle(() => ({
    opacity: inviteTextOpacity.value,
    transform: [{ translateX: inviteTextX.value }],
  }))

  const groupBadgeOpacity = useSharedValue(0)
  const groupBadgeScale = useSharedValue(0.8)
  const groupBadgeAnimatedStyle = useAnimatedStyle(() => ({
    opacity: groupBadgeOpacity.value,
    transform: [{ scale: groupBadgeScale.value }],
  }))

  const secondLineOpacity = useSharedValue(0)
  const secondLineY = useSharedValue(10)
  const secondLineAnimatedStyle = useAnimatedStyle(() => ({
    opacity: secondLineOpacity.value,
    transform: [{ translateY: secondLineY.value }],
  }))

  // Button animations
  const acceptButtonOpacity = useSharedValue(0)
  const acceptButtonY = useSharedValue(20)
  const acceptButtonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: acceptButtonOpacity.value,
    transform: [{ translateY: acceptButtonY.value }],
  }))

  const declineButtonOpacity = useSharedValue(0)
  const declineButtonY = useSharedValue(20)
  const declineButtonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: declineButtonOpacity.value,
    transform: [{ translateY: declineButtonY.value }],
  }))

  useEffect(() => {
    // Container fade-in
    containerOpacity.value = withDelay(200, withTiming(1, { duration: 300 }))

    // Avatar pulse
    mainAvatarScale.value = withRepeat(
      withSequence(withTiming(1.05, { duration: 750 }), withTiming(1, { duration: 750 })),
      -1,
    )
    secondaryAvatarScale.value = withDelay(
      300,
      withRepeat(withSequence(withTiming(1.05, { duration: 750 }), withTiming(1, { duration: 750 })), -1),
    )

    // Star rotation
    starRotate.value = withRepeat(
      withSequence(
        withTiming(10, { duration: 1000 }),
        withTiming(-10, { duration: 1000 }),
        withTiming(0, { duration: 1000 }),
      ),
      -1,
    )

    // Secondary avatar float
    secondaryAvatarY.value = withRepeat(
      withSequence(
        withTiming(-2, { duration: 1000 }),
        withTiming(2, { duration: 1000 }),
        withTiming(-2, { duration: 1000 }),
      ),
      -1,
    )

    // Shimmer
    shimmerX.value = withRepeat(withTiming(100, { duration: 1500 }), -1)

    // Text animations
    usernameBadgeOpacity.value = withDelay(400, withTiming(1, { duration: 500 }))
    usernameBadgeScale.value = withDelay(400, withTiming(1, { duration: 500 }))
    inviteTextOpacity.value = withDelay(600, withTiming(1, { duration: 500 }))
    inviteTextX.value = withDelay(600, withTiming(0, { duration: 500 }))
    groupBadgeOpacity.value = withDelay(800, withTiming(1, { duration: 500 }))
    groupBadgeScale.value = withDelay(800, withTiming(1, { duration: 500 }))
    secondLineOpacity.value = withDelay(1000, withTiming(1, { duration: 500 }))
    secondLineY.value = withDelay(1000, withTiming(0, { duration: 500 }))

    // Button animations
    acceptButtonOpacity.value = withDelay(1200, withTiming(1, { duration: 500 }))
    acceptButtonY.value = withDelay(1200, withTiming(0, { duration: 500 }))
    declineButtonOpacity.value = withDelay(1400, withTiming(1, { duration: 500 }))
    declineButtonY.value = withDelay(1400, withTiming(0, { duration: 500 }))
  }, [])

  return (
    <Animated.View style={[invitationModalSkeletonStyle.container, containerAnimatedStyle]}>
      {/* Avatar Section */}
      <View style={invitationModalSkeletonStyle.avatarSection}>
        <View style={invitationModalSkeletonStyle.avatarWrapper}>
          <Animated.View
            style={[
              invitationModalSkeletonStyle.mainAvatar,
              { backgroundColor: theme.skeletonBackground },
              mainAvatarAnimatedStyle,
            ]}
          >
            <Animated.View
              style={[
                invitationModalSkeletonStyle.shimmer,
                { backgroundColor: theme.skeletonShimmer },
                shimmerAnimatedStyle,
              ]}
            />
          </Animated.View>
          <Animated.View style={[invitationModalSkeletonStyle.starIcon, starAnimatedStyle]}>
            <Star width={24} height={24} fill={theme.starIcon} />
          </Animated.View>
        </View>
        <Animated.View style={[invitationModalSkeletonStyle.secondaryAvatarWrapper, secondaryAvatarAnimatedStyle]}>
          <Animated.View
            style={[
              invitationModalSkeletonStyle.secondaryAvatar,
              { backgroundColor: theme.skeletonBackground },
              secondaryAvatarAnimatedStyle,
            ]}
          >
            <Animated.View
              style={[
                invitationModalSkeletonStyle.shimmer,
                { backgroundColor: theme.skeletonShimmer },
                shimmerAnimatedStyle,
              ]}
            />
          </Animated.View>
        </Animated.View>
      </View>

      {/* Text Section */}
      <View style={invitationModalSkeletonStyle.textSection}>
        <View style={invitationModalSkeletonStyle.textRow}>
          <Animated.View
            style={[
              invitationModalSkeletonStyle.usernameBadge,
              { backgroundColor: theme.skeletonBadgeOrange },
              usernameBadgeAnimatedStyle,
            ]}
          >
            <Animated.View
              style={[
                invitationModalSkeletonStyle.shimmer,
                { backgroundColor: theme.skeletonBadgeOrangeShimmer },
                shimmerAnimatedStyle,
              ]}
            />
          </Animated.View>
          <Animated.View
            style={[
              invitationModalSkeletonStyle.inviteText,
              { backgroundColor: theme.skeletonBackground },
              inviteTextAnimatedStyle,
            ]}
          >
            <Animated.View
              style={[
                invitationModalSkeletonStyle.shimmer,
                { backgroundColor: theme.skeletonShimmer },
                shimmerAnimatedStyle,
              ]}
            />
          </Animated.View>
          <Animated.View
            style={[
              invitationModalSkeletonStyle.groupBadge,
              { backgroundColor: theme.skeletonBadgeBlue },
              groupBadgeAnimatedStyle,
            ]}
          >
            <Animated.View
              style={[
                invitationModalSkeletonStyle.shimmer,
                { backgroundColor: theme.skeletonBadgeBlueShimmer },
                shimmerAnimatedStyle,
              ]}
            />
          </Animated.View>
        </View>
        <Animated.View
          style={[
            invitationModalSkeletonStyle.secondLine,
            { backgroundColor: theme.skeletonBackground },
            secondLineAnimatedStyle,
          ]}
        >
          <Animated.View
            style={[
              invitationModalSkeletonStyle.shimmer,
              { backgroundColor: theme.skeletonShimmer },
              shimmerAnimatedStyle,
            ]}
          />
        </Animated.View>
      </View>

      {/* Button Section */}
      <View style={invitationModalSkeletonStyle.buttonSection}>
        <Animated.View
          style={[
            invitationModalSkeletonStyle.acceptButton,
            { backgroundColor: theme.skeletonBackground },
            acceptButtonAnimatedStyle,
          ]}
        >
          <Animated.View
            style={[
              invitationModalSkeletonStyle.shimmer,
              { backgroundColor: theme.skeletonShimmer },
              shimmerAnimatedStyle,
            ]}
          />
        </Animated.View>
        <Animated.View
          style={[
            invitationModalSkeletonStyle.declineButton,
            { backgroundColor: theme.skeletonSecondary, borderColor: theme.skeletonBorder },
            declineButtonAnimatedStyle,
          ]}
        >
          <Animated.View
            style={[
              invitationModalSkeletonStyle.shimmer,
              { backgroundColor: theme.skeletonShimmer },
              shimmerAnimatedStyle,
            ]}
          />
        </Animated.View>
      </View>
    </Animated.View>
  )
}

export default InvitationModalSkeleton
