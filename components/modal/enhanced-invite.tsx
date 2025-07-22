import { Avatar } from '@/components/avatar'
import { Button } from '@/components/ui/'
import getTheme from '@/constants/theme'
import useJoinAjoGroup from '@/hooks/blockchain/write/useJoinAjoGroup'
import useParticipant from '@/hooks/db/useParticipant'
import { useModal } from '@/providers/modal-provider'
import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import { StyleSheet, Text, useColorScheme, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated'
import { Path, Svg } from 'react-native-svg'
import { InvitationModalSkeleton } from '../skeletons'

interface InvitationModalProps {
  inviter: string
  groupName: string
  id: string
  fee: number
}

const trimText = (text: string, maxLength = 20): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

const enhancedInvitationModalStyle = StyleSheet.create({
  container: {
    padding: 24,
  },
  avatarSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  avatarWrapper: {
    position: 'relative',
  },
  secondaryAvatarWrapper: {
    position: 'absolute',
    left: '55%',
    top: '25%',
  },
  starIcon: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  textSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  text: {
    fontSize: 18,
    lineHeight: 26,
    textAlign: 'center',
  },
  usernameBadge: {
    backgroundColor: '#FEEBC8', // theme.skeletonBadgeOrange as fallback
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  groupBadge: {
    backgroundColor: '#DBEAFE', // theme.skeletonBadgeBlue as fallback
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  buttonSection: {
    gap: 12,
  },
})

const EnhancedInvitationModal: React.FC<InvitationModalProps> = ({ inviter, groupName, id, fee }) => {
  const colorScheme = useColorScheme()
  const theme = getTheme(colorScheme || 'light')
  const { hideModal } = useModal()
  const router = useRouter()
  const { data, isLoading } = useParticipant(inviter)
  const { joinAjoGroup, loading, isPending } = useJoinAjoGroup()

  // Animation setup
  const contentOpacity = useSharedValue(0)
  const contentScale = useSharedValue(0.9)
  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ scale: contentScale.value }],
  }))

  const avatarScale = useSharedValue(0)
  const avatarRotate = useSharedValue(-180)
  const avatarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: avatarScale.value }, { rotate: `${avatarRotate.value}deg` }],
  }))

  const starScale = useSharedValue(0)
  const starRotate = useSharedValue(180)
  const starAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: starScale.value }, { rotate: `${starRotate.value}deg` }],
  }))

  const secondaryAvatarScale = useSharedValue(0)
  const secondaryAvatarX = useSharedValue(-50)
  const secondaryAvatarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: secondaryAvatarScale.value }, { translateX: secondaryAvatarX.value }],
  }))

  const textOpacity = useSharedValue(0)
  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }))

  const usernameBadgeScale = useSharedValue(0)
  const usernameBadgeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: usernameBadgeScale.value }],
  }))

  const groupBadgeScale = useSharedValue(0)
  const groupBadgeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: groupBadgeScale.value }],
  }))

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
    contentOpacity.value = withTiming(1, { duration: 500 })
    contentScale.value = withTiming(1, { duration: 500 })
    avatarScale.value = withTiming(1, { duration: 600 })
    avatarRotate.value = withTiming(0, { duration: 600 })
    starScale.value = withDelay(300, withTiming(1, { duration: 500 }))
    starRotate.value = withDelay(300, withTiming(0, { duration: 500 }))
    secondaryAvatarScale.value = withDelay(400, withTiming(1, { duration: 500 }))
    secondaryAvatarX.value = withDelay(400, withTiming(0, { duration: 500 }))
    textOpacity.value = withDelay(600, withTiming(1, { duration: 500 }))
    usernameBadgeScale.value = withDelay(800, withTiming(1, { duration: 300 }))
    groupBadgeScale.value = withDelay(1000, withTiming(1, { duration: 300 }))
    acceptButtonOpacity.value = withDelay(1200, withTiming(1, { duration: 500 }))
    acceptButtonY.value = withDelay(1200, withTiming(0, { duration: 500 }))
    declineButtonOpacity.value = withDelay(1400, withTiming(1, { duration: 500 }))
    declineButtonY.value = withDelay(1400, withTiming(0, { duration: 500 }))
  }, [])

  const handleAccept = async () => {
    await joinAjoGroup(id, groupName, fee)
    hideModal()
  }

  const handleDecline = () => {
    hideModal()
    router.replace('/')
  }

  return (
    <>
      {isLoading ? (
        <InvitationModalSkeleton />
      ) : (
        <Animated.View style={[enhancedInvitationModalStyle.container, contentAnimatedStyle]}>
          <View style={enhancedInvitationModalStyle.avatarSection}>
            <View style={enhancedInvitationModalStyle.avatarWrapper}>
              <Animated.View style={avatarAnimatedStyle}>
                <Avatar size={96} number={data?.data?.avatar} />
              </Animated.View>
              <Animated.View style={[enhancedInvitationModalStyle.starIcon, starAnimatedStyle]}>
                <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                    fill={theme.orange}
                  />
                </Svg>
              </Animated.View>
            </View>
            <Animated.View style={[enhancedInvitationModalStyle.secondaryAvatarWrapper, secondaryAvatarAnimatedStyle]}>
              <Avatar size={66} number={1} />
            </Animated.View>
          </View>
          <View style={enhancedInvitationModalStyle.textSection}>
            <Animated.Text style={[enhancedInvitationModalStyle.text, { color: theme.textPrimary }, textAnimatedStyle]}>
              <Animated.Text
                style={[
                  enhancedInvitationModalStyle.usernameBadge,
                  { backgroundColor: theme.skeletonBadgeOrange, color: theme.orange },
                  usernameBadgeAnimatedStyle,
                ]}
              >
                @{trimText(data?.data?.username || 'KooPaa', 15)}
              </Animated.Text>{' '}
              is inviting you to join{' '}
              <Animated.Text
                style={[
                  enhancedInvitationModalStyle.groupBadge,
                  { backgroundColor: theme.skeletonBadgeBlue, color: theme.progressGradientStart },
                  groupBadgeAnimatedStyle,
                ]}
              >
                {trimText(groupName, 18)}
              </Animated.Text>
              <Text>{'\n'}KooPaa Squad in your savings journey</Text>
            </Animated.Text>
          </View>
          <View style={enhancedInvitationModalStyle.buttonSection}>
            <Animated.View style={acceptButtonAnimatedStyle}>
              <Button
                onPress={handleAccept}
                disabled={loading || isPending}
                style={{ backgroundColor: theme.orange }}
                textStyle={{ color: '#FFF' }}
              >
                Accept Invitation
              </Button>
            </Animated.View>
            <Animated.View style={declineButtonAnimatedStyle}>
              <Button
                variant="outline"
                onPress={handleDecline}
                disabled={loading || isPending}
                style={{ borderColor: theme.gray300, backgroundColor: theme.gray50 }}
                textStyle={{ color: theme.textPrimary }}
              >
                Decline
              </Button>
            </Animated.View>
          </View>
        </Animated.View>
      )}
    </>
  )
}

export default EnhancedInvitationModal
