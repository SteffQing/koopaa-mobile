import getTheme from '@/constants/theme'
import { StyleSheet, useColorScheme, View } from 'react-native'

interface SkeletonActivityProps {
  count?: number
}

const skeletonActivityStyle = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  details: {
    flexDirection: 'column',
    gap: 4,
  },
  title: {
    width: 96,
    height: 12,
    borderRadius: 4,
  },
  time: {
    width: 64,
    height: 8,
    borderRadius: 4,
  },
  amount: {
    width: 48,
    height: 12,
    borderRadius: 4,
  },
  separator: {
    width: '100%',
    height: 1,
    marginVertical: 4,
  },
  separatorEmpty: {
    marginBottom: 4,
  },
})

const SkeletonActivity: React.FC<SkeletonActivityProps> = ({ count = 3 }) => {
  const colorScheme = useColorScheme()
  const theme = getTheme(colorScheme || 'light')

  return (
    <View style={skeletonActivityStyle.container}>
      {[...Array(count)].map((_, i) => (
        <View key={i}>
          <View style={skeletonActivityStyle.item}>
            <View style={skeletonActivityStyle.left}>
              <View style={[skeletonActivityStyle.icon, { backgroundColor: theme.skeletonBackground }]} />
              <View style={skeletonActivityStyle.details}>
                <View style={[skeletonActivityStyle.title, { backgroundColor: theme.skeletonBackground }]} />
                <View style={[skeletonActivityStyle.time, { backgroundColor: theme.skeletonSecondary }]} />
              </View>
            </View>
            <View style={[skeletonActivityStyle.amount, { backgroundColor: theme.skeletonBackground }]} />
          </View>
          {i !== count - 1 ? (
            <View style={[skeletonActivityStyle.separator, { backgroundColor: theme.separator }]} />
          ) : (
            <View style={skeletonActivityStyle.separatorEmpty} />
          )}
        </View>
      ))}
    </View>
  )
}

export default SkeletonActivity
