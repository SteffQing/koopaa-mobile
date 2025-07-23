import { StyleSheet, View, Text } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'
import LinearGradient from 'react-native-linear-gradient'
import { useState } from 'react'
import { Button, SwitchButton } from '@/components/ui'
import useCreateAjoGroup from '@/hooks/blockchain/write/useCreateAjoGroup'
import { CreateAjoGroupFormValues } from './schema'

interface ViewAndSubmitFormProps extends CreateAjoGroupFormValues {}

const viewAndSubmitStyle = StyleSheet.create({
  container: { flexDirection: 'column', gap: 16 },
  imageContainer: { marginBottom: 16, borderRadius: 12, overflow: 'hidden', height: 160 },
  detailsContainer: {
    flexDirection: 'column',
    backgroundColor: '#FCFCFC',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  agreementContainer: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  agreementTextContainer: { flexDirection: 'column', gap: 12, flex: 1 },
  agreementTitle: { fontSize: 12, fontWeight: '500', color: '#121212' },
  agreementText: { fontSize: 12, fontWeight: '400', color: '#4C4C4C' },
})

const Entry: React.FC<{ title: string; content: string; isLast?: boolean }> = ({ title, content, isLast }) => {
  return (
    <>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <Text style={{ fontSize: 14, fontWeight: '500', color: '#4C4C4C' }}>{title}</Text>
        <Text style={{ fontSize: 12, fontWeight: '500', color: '#121212' }}>{content}</Text>
      </View>
      {!isLast && <View style={{ width: '100%', height: 1, backgroundColor: '#E6E6E6', marginVertical: 8 }} />}
    </>
  )
}

const ViewAndSubmitForm: React.FC<ViewAndSubmitFormProps> = (data) => {
  const interval = Number(data.payout_interval) / Number(data.contribution_interval)
  const goal = data.contribution_amount * data.max_participants * Math.ceil(interval)
  const [agree, setAgree] = useState(false)
  const { createAjoGroup, isPending, loading } = useCreateAjoGroup()

  const create = async () => {
    await createAjoGroup(data)
  }

  const itemOpacity = useSharedValue(0)
  const itemY = useSharedValue(20)
  const itemStyle = useAnimatedStyle(() => ({
    opacity: itemOpacity.value,
    transform: [{ translateY: itemY.value }],
  }))

  itemOpacity.value = withTiming(1, { duration: 300 })
  itemY.value = withTiming(0, { duration: 300 })

  return (
    <Animated.View style={[viewAndSubmitStyle.container, itemStyle]}>
      <View style={viewAndSubmitStyle.imageContainer}>
        <LinearGradient colors={['#3B82F6', '#7C3AED']} style={{ flex: 1 }} />
      </View>
      <View style={viewAndSubmitStyle.detailsContainer}>
        <Entry title="Group Name" content={data.name} />
        <Entry title="Group Description" content={data.description} />
        <Entry title="Est. Saving Goal" content={`$${goal}`} />
        <Entry title="Participants Slots" content={data.max_participants.toString()} />
        <Entry title="Saving Interval" content={`${data.contribution_interval} day(s)`} />
        <Entry title="Payout Interval" content={`${data.payout_interval} days`} />
        <Entry title="Security Deposit" content={data.security_deposit.toString()} />
        <Entry title="Contribution Amount" content={`$${data.contribution_amount}`} isLast />
      </View>
      <View style={viewAndSubmitStyle.agreementContainer}>
        <View style={viewAndSubmitStyle.agreementTextContainer}>
          <Text style={viewAndSubmitStyle.agreementTitle}>Kindly read carefully</Text>
          <Text style={viewAndSubmitStyle.agreementText}>
            I agree that I adhere to all the rules of the group and making payments when due.
          </Text>
        </View>
        <SwitchButton setState={setAgree} state={agree} />
      </View>
      <Button loading={isPending || loading} disabled={!agree} onPress={create}>
        Create Ajo Group
      </Button>
    </Animated.View>
  )
}

export default ViewAndSubmitForm
