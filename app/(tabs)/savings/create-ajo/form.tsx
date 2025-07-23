import { StyleSheet, View, Text, TextInput } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui'
import { ImageSelector, TagSelector } from '@/components/selector'
import { createAjoGroupSchema, type CreateAjoGroupFormValues } from './schema'
import { payoutIntervals, contributionIntervals, tagOptions } from '@/lib/static'

interface CreateAjoGroupFormProps {
  onSubmit: (data: CreateAjoGroupFormValues) => void
}

const createAjoGroupFormStyle = StyleSheet.create({
  container: { flexDirection: 'column', gap: 16 },
  field: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '500', color: '#0F172A', marginBottom: 8 },
  input: { width: '100%', padding: 16, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB', fontSize: 16 },
  textarea: { minHeight: 100 },
  error: { fontSize: 12, color: '#EF4444', marginTop: 4 },
  intervalContainer: { flexDirection: 'row', gap: 12 },
  intervalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  selectedInterval: { borderColor: '#FF6600', backgroundColor: '#FFF7ED' },
  intervalText: { fontSize: 16 },
})

const CreateAjoGroupForm: React.FC<CreateAjoGroupFormProps> = ({ onSubmit }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAjoGroupFormValues>({
    resolver: zodResolver(createAjoGroupSchema),
    defaultValues: {
      name: '',
      description: '',
      security_deposit: undefined,
      max_participants: 3,
      contribution_amount: undefined,
      contribution_interval: '30',
      payout_interval: '30',
      tag: 'lifestyle',
      group_cover_photo: 1,
    },
  })

  const itemOpacity = useSharedValue(0)
  const itemY = useSharedValue(20)
  const itemStyle = useAnimatedStyle(() => ({
    opacity: itemOpacity.value,
    transform: [{ translateY: itemY.value }],
  }))
  const buttonScale = useSharedValue(1)
  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }))

  itemOpacity.value = withTiming(1, { duration: 300 })
  itemY.value = withTiming(0, { duration: 300 })

  const handlePressIn = () => {
    buttonScale.value = withTiming(0.95, { duration: 100 })
  }
  const handlePressOut = () => {
    buttonScale.value = withTiming(1, { duration: 100 })
  }

  // Cover photo options (using indices for compatibility with ImageSelector)
  const coverPhotos = [1, 2, 3, 4]

  return (
    <Animated.View style={[createAjoGroupFormStyle.container, itemStyle]}>
      <View style={createAjoGroupFormStyle.field}>
        <Label style={createAjoGroupFormStyle.label}>Group Name</Label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextInput
              style={createAjoGroupFormStyle.input}
              placeholder="name your group"
              value={field.value}
              onChangeText={field.onChange}
            />
          )}
        />
        {errors.name && <Text style={createAjoGroupFormStyle.error}>{errors.name.message}</Text>}
      </View>

      <View style={createAjoGroupFormStyle.field}>
        <Label style={createAjoGroupFormStyle.label}>Group Description</Label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextInput
              style={[createAjoGroupFormStyle.input, createAjoGroupFormStyle.textarea]}
              placeholder="add a group description"
              value={field.value}
              onChangeText={field.onChange}
              multiline
            />
          )}
        />
        {errors.description && <Text style={createAjoGroupFormStyle.error}>{errors.description.message}</Text>}
      </View>

      <View style={createAjoGroupFormStyle.field}>
        <Label style={createAjoGroupFormStyle.label}>Group Cover Photo</Label>
        <Controller
          name="group_cover_photo"
          control={control}
          render={({ field }) => <ImageSelector images={coverPhotos} value={field.value} onChange={field.onChange} />}
        />
      </View>

      <View style={createAjoGroupFormStyle.field}>
        <Label style={createAjoGroupFormStyle.label}>Group Category</Label>
        <Controller
          name="tag"
          control={control}
          render={({ field }) => <TagSelector tags={tagOptions} value={field.value} onChange={field.onChange} />}
        />
        {errors.tag && <Text style={createAjoGroupFormStyle.error}>{errors.tag.message}</Text>}
      </View>

      <View style={createAjoGroupFormStyle.field}>
        <Label style={createAjoGroupFormStyle.label}>Contribution Amount</Label>
        <Controller
          name="contribution_amount"
          control={control}
          render={({ field }) => (
            <TextInput
              style={createAjoGroupFormStyle.input}
              placeholder="enter amount"
              value={field.value?.toString()}
              onChangeText={(value) => field.onChange(Number(value))}
              keyboardType="numeric"
            />
          )}
        />
        {errors.contribution_amount && (
          <Text style={createAjoGroupFormStyle.error}>{errors.contribution_amount.message}</Text>
        )}
      </View>

      <View style={createAjoGroupFormStyle.field}>
        <Label style={createAjoGroupFormStyle.label}>Security Deposit</Label>
        <Controller
          name="security_deposit"
          control={control}
          render={({ field }) => (
            <TextInput
              style={createAjoGroupFormStyle.input}
              placeholder="enter security deposit amount"
              value={field.value?.toString()}
              onChangeText={(value) => field.onChange(Number(value))}
              keyboardType="numeric"
            />
          )}
        />
        {errors.security_deposit && (
          <Text style={createAjoGroupFormStyle.error}>{errors.security_deposit.message}</Text>
        )}
      </View>

      <View style={createAjoGroupFormStyle.field}>
        <Label style={createAjoGroupFormStyle.label}>Maximum Participants</Label>
        <Controller
          name="max_participants"
          control={control}
          render={({ field }) => (
            <TextInput
              style={createAjoGroupFormStyle.input}
              placeholder="minimum of 3"
              value={field.value.toString()}
              onChangeText={(value) => field.onChange(Number(value))}
              keyboardType="numeric"
            />
          )}
        />
        {errors.max_participants && (
          <Text style={createAjoGroupFormStyle.error}>{errors.max_participants.message}</Text>
        )}
      </View>

      <View style={createAjoGroupFormStyle.field}>
        <Label style={createAjoGroupFormStyle.label}>Contribution Interval</Label>
        <View style={createAjoGroupFormStyle.intervalContainer}>
          <Controller
            name="contribution_interval"
            control={control}
            render={({ field }) => (
              <>
                {contributionIntervals.map((interval) => (
                  <Animated.TouchableOpacity
                    key={interval.value}
                    style={[
                      createAjoGroupFormStyle.intervalButton,
                      field.value === interval.value && createAjoGroupFormStyle.selectedInterval,
                      buttonStyle,
                    ]}
                    onPress={() => field.onChange(interval.value)}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                  >
                    <Text style={createAjoGroupFormStyle.intervalText}>{interval.label}</Text>
                  </Animated.TouchableOpacity>
                ))}
              </>
            )}
          />
        </View>
        {errors.contribution_interval && (
          <Text style={createAjoGroupFormStyle.error}>{errors.contribution_interval.message}</Text>
        )}
      </View>

      <View style={createAjoGroupFormStyle.field}>
        <Label style={createAjoGroupFormStyle.label}>Payout Interval</Label>
        <View style={createAjoGroupFormStyle.intervalContainer}>
          <Controller
            name="payout_interval"
            control={control}
            render={({ field }) => (
              <>
                {payoutIntervals.map((interval) => (
                  <Animated.TouchableOpacity
                    key={interval.value}
                    style={[
                      createAjoGroupFormStyle.intervalButton,
                      field.value === interval.value && createAjoGroupFormStyle.selectedInterval,
                      buttonStyle,
                    ]}
                    onPress={() => field.onChange(interval.value)}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                  >
                    <Text style={createAjoGroupFormStyle.intervalText}>{interval.label}</Text>
                  </Animated.TouchableOpacity>
                ))}
              </>
            )}
          />
        </View>
        {errors.payout_interval && <Text style={createAjoGroupFormStyle.error}>{errors.payout_interval.message}</Text>}
      </View>

      <Button onPress={handleSubmit(onSubmit)}>Continue</Button>
    </Animated.View>
  )
}

export default CreateAjoGroupForm
