import StackedCoins from '@/assets/svgs/activities/stacked-coins.svg'
import Target from '@/assets/svgs/activities/target.svg'
import Transfer from '@/assets/svgs/activities/transfer.svg'
import getTheme from '@/constants/theme'
import { formatActivityTime } from '@/lib/date'
import { Fragment, useEffect } from 'react'
import { StyleSheet, Text, useColorScheme, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated'
import { SvgProps } from 'react-native-svg'
import { SkeletonActivity } from '../skeletons'
import { groupActivitiesByTimeframe } from './utils'

interface Props {
  data: Activity[] | undefined
  loading: boolean
}

interface GroupProp {
  group: Activity[]
  label: string
}

const IconByType: Record<ActivityType, React.FC<SvgProps>> = {
  create: Target,
  credit: StackedCoins,
  debit: StackedCoins,
  transfer: Transfer,
}

const labelMap: Record<string, string> = {
  today: 'Today',
  yesterday: 'Yesterday',
  lastWeek: 'This Week',
  lastMonth: 'This Month',
  older: 'Older',
}

const recentActivitiesStyle = StyleSheet.create({
  container: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 16,
    flexDirection: 'column',
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
  },
  noActivities: {
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
  },
})

const RecentActivities: React.FC<Props> = ({ data, loading }) => {
  const colorScheme = useColorScheme()
  const theme = getTheme(colorScheme || 'light')

  // Animation for container
  const containerTranslateY = useSharedValue(20)
  const containerOpacity = useSharedValue(0)
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: containerTranslateY.value }],
    opacity: containerOpacity.value,
  }))

  useEffect(() => {
    containerTranslateY.value = withDelay(500, withTiming(0, { duration: 300 }))
    containerOpacity.value = withDelay(500, withTiming(1, { duration: 300 }))
  }, [])

  return (
    <Animated.View
      style={[recentActivitiesStyle.container, { backgroundColor: theme.background }, containerAnimatedStyle]}
    >
      <View style={recentActivitiesStyle.header}>
        <Text style={[recentActivitiesStyle.headerText, { color: theme.textPrimary }]}>Recent Activities</Text>
        {/* Navigation button commented out as in original */}
        {/* <TouchableOpacity>
          {data && data.length > 0 && (
            <Text style={{ fontSize: 12, fontWeight: '500', color: '#ff6600' }}>
              See all
            </Text>
          )}
        </TouchableOpacity> */}
      </View>
      {loading || !data ? (
        <SkeletonActivity />
      ) : data.length > 0 ? (
        Object.entries(groupActivitiesByTimeframe(data)).map(([label, group]) =>
          group.length > 0 ? <GroupedActivity key={label} label={labelMap[label]} group={group} /> : null,
        )
      ) : (
        <Text style={[recentActivitiesStyle.noActivities, { color: theme.textSecondary }]}>No recent activities</Text>
      )}
    </Animated.View>
  )
}

const groupedActivityStyle = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 12,
  },
  label: {
    fontSize: 10,
    fontWeight: '400',
    marginBottom: 8,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  details: {
    flexDirection: 'column',
  },
  title: {
    fontSize: 12,
    fontWeight: '500',
  },
  time: {
    fontSize: 10,
    fontWeight: '300',
  },
  amount: {
    fontSize: 12,
    fontWeight: '500',
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

const GroupedActivity: React.FC<GroupProp> = ({ group, label }) => {
  const colorScheme = useColorScheme()
  const theme = getTheme(colorScheme || 'light')

  return (
    <View style={groupedActivityStyle.container}>
      <Text style={[groupedActivityStyle.label, { color: theme.textSecondary }]}>{label}</Text>
      {group.map((activity, index) => {
        const IconComponent = IconByType[activity.type]
        // Animation for each activity
        const translateX = useSharedValue(-20)
        const opacity = useSharedValue(0)
        const animatedStyle = useAnimatedStyle(() => ({
          transform: [{ translateX: translateX.value }],
          opacity: opacity.value,
        }))

        useEffect(() => {
          translateX.value = withDelay(100 * index + 600, withTiming(0, { duration: 300 }))
          opacity.value = withDelay(100 * index + 600, withTiming(1, { duration: 300 }))
        }, [])

        return (
          <Fragment key={activity.id}>
            <Animated.View style={[groupedActivityStyle.itemContainer, animatedStyle]}>
              <View style={groupedActivityStyle.left}>
                <View
                  style={[groupedActivityStyle.iconContainer, { backgroundColor: theme.iconBackground[activity.type] }]}
                >
                  <IconComponent width={20} height={20} />
                </View>
                <View style={groupedActivityStyle.details}>
                  <Text style={[groupedActivityStyle.title, { color: theme.textPrimary }]}>{activity.title}</Text>
                  <Text style={[groupedActivityStyle.time, { color: theme.textSecondary }]}>
                    {formatActivityTime(activity.created_at)}
                  </Text>
                </View>
              </View>
              {activity.amount && (
                <Text
                  style={[
                    groupedActivityStyle.amount,
                    { color: activity.type === 'debit' ? theme.textDebit : theme.textDefault },
                  ]}
                >
                  {activity.type === 'debit' && '-'}${activity.amount.toLocaleString()}
                </Text>
              )}
            </Animated.View>
            {index !== group.length - 1 ? (
              <View style={[groupedActivityStyle.separator, { backgroundColor: theme.separator }]} />
            ) : (
              <View style={groupedActivityStyle.separatorEmpty} />
            )}
          </Fragment>
        )
      })}
    </View>
  )
}

export default RecentActivities
