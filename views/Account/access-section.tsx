import { StyleSheet, View, Text } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'
import { SwitchButton } from '@/components/ui'
import { useUserSettings } from '@/hooks/useUserSettings'
import { VariantProps } from './types'

interface AccessSectionProps extends VariantProps {
  item?: { hidden: { opacity: number; y: number }; show: { opacity: number; y: number } }
}

const accessSectionStyle = StyleSheet.create({
  container: { marginBottom: 24 },
  title: { fontSize: 14, fontWeight: '500', color: '#333333', marginBottom: 12 },
  card: {
    backgroundColor: '#FCFCFC',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inner: { paddingHorizontal: 12 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E6E6E6',
  },
  lastRow: { borderBottomWidth: 0 },
  text: { fontSize: 12, color: '#121212' },
})

const AccessSection: React.FC<AccessSectionProps> = ({ item }) => {
  const { emergencyExitState, interestEnabledState, showBalancesState, notificationsEnabledState } = useUserSettings()

  const opacity = useSharedValue(item?.hidden.opacity ?? 0)
  const y = useSharedValue(item?.hidden.y ?? 20)
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: y.value }],
  }))

  opacity.value = withTiming(item?.show.opacity ?? 1, { duration: 300 })
  y.value = withTiming(item?.show.y ?? 0, { duration: 300 })

  return (
    <Animated.View style={[accessSectionStyle.container, animatedStyle]}>
      <Text style={accessSectionStyle.title}>Access</Text>
      <View style={accessSectionStyle.card}>
        <View style={accessSectionStyle.inner}>
          <View style={accessSectionStyle.row}>
            <Text style={accessSectionStyle.text}>Allow notification</Text>
            <SwitchButton
              setState={notificationsEnabledState.setState}
              state={notificationsEnabledState.state}
              key="notificationsEnabled"
              disabled
            />
          </View>
          <View style={accessSectionStyle.row}>
            <Text style={accessSectionStyle.text}>Show dashboard balances</Text>
            <SwitchButton setState={showBalancesState.setState} state={showBalancesState.state} key="showBalances" />
          </View>
          <View style={accessSectionStyle.row}>
            <Text style={accessSectionStyle.text}>Interest enabled on DEFI yield</Text>
            <SwitchButton
              setState={interestEnabledState.setState}
              state={interestEnabledState.state}
              key="interestEnabled"
              disabled
            />
          </View>
          <View style={[accessSectionStyle.row, accessSectionStyle.lastRow]}>
            <Text style={accessSectionStyle.text}>Emergency exit preference</Text>
            <SwitchButton
              setState={emergencyExitState.setState}
              state={emergencyExitState.state}
              key="emergencyExit"
              disabled
            />
          </View>
        </View>
      </View>
    </Animated.View>
  )
}

export default AccessSection
