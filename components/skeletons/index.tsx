import getTheme from '@/constants/theme'
import { StyleSheet, useColorScheme, View, ViewProps } from 'react-native'
import SkeletonActivity from './activities'
import InvitationModalSkeleton from './invite-modal'
import LoadingDots from './loading-dots'
import Spinner from './spinner'

const skeletonStyle = StyleSheet.create({
  container: {
    borderRadius: 6,
  },
})

const Skeleton: React.FC<ViewProps> = ({ style, ...props }) => {
  const colorScheme = useColorScheme()
  const theme = getTheme(colorScheme || 'light')

  return <View style={[skeletonStyle.container, { backgroundColor: theme.skeletonBackground }, style]} {...props} />
}

export { InvitationModalSkeleton, LoadingDots, Skeleton, SkeletonActivity, Spinner }
