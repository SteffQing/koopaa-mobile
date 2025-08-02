import NavHeader from '@/views/Navigation/nav-header'
import { Feather } from '@expo/vector-icons'
import { useState } from 'react'
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import Toast from 'react-native-toast-message'

const createSavingGoalStyle = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: '700', color: '#FF6B00', marginBottom: 4 },
  emoji: { fontSize: 24 },
  description: { fontSize: 16, color: '#6B7280', marginBottom: 24 },
  field: { marginBottom: 16 },
  label: { fontSize: 16, fontWeight: '500', marginBottom: 8 },
  input: { width: '100%', padding: 16, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB', fontSize: 16 },
  focusedInput: { borderColor: '#FF6B00' },
  textarea: { minHeight: 100 },
  calendarContainer: { position: 'relative' },
  calendarIcon: { position: 'absolute', right: 16, top: '50%', transform: [{ translateY: -10 }], color: '#6B7280' },
  readonlyInput: { backgroundColor: '#F3F4F6' },
  dollarContainer: {
    position: 'absolute',
    left: 16,
    top: '50%',
    transform: [{ translateY: -12 }],
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dollarText: { fontSize: 16, color: '#6B7280' },
  frequencyContainer: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  frequencyButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  selectedFrequency: { borderColor: '#FF6B00', backgroundColor: '#FFF7ED' },
  frequencyText: { fontSize: 16 },
  submitButton: {
    width: '100%',
    backgroundColor: '#FF6B00',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitText: { fontSize: 16, fontWeight: '500', color: '#FFFFFF' },
})

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)

const CreateSavingGoalPage: React.FC = () => {
  const [formData, setFormData] = useState({
    goalName: '',
    goalDescription: '',
    startDate: 'Today - 07/05/2025',
    endDate: '',
    savingGoal: '',
    savingFrequency: '',
  })
  const [focusedField, setFocusedField] = useState('')

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = () => {
    Toast.show({ type: 'success', text1: 'Saving goal created successfully' })
  }

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

  const handlePressIn = (scale: Animated.SharedValue<number>) => {
    scale.value = withTiming(0.95, { duration: 100 })
  }
  const handlePressOut = (scale: Animated.SharedValue<number>) => {
    scale.value = withTiming(1, { duration: 100 })
  }

  return (
    <ScrollView style={createSavingGoalStyle.container}>
      <NavHeader path="/savings/individual" header="Individual Savings" />
      <Animated.Text style={[createSavingGoalStyle.title, itemStyle]}>
        Let's create a saving goal <Text style={createSavingGoalStyle.emoji}>🎯</Text>
      </Animated.Text>
      <Animated.Text style={[createSavingGoalStyle.description, itemStyle]}>
        Kindly enter goal details below
      </Animated.Text>
      <View style={createSavingGoalStyle.field}>
        <Text style={createSavingGoalStyle.label}>Goal Name</Text>
        <TextInput
          style={[createSavingGoalStyle.input, focusedField === 'goalName' && createSavingGoalStyle.focusedInput]}
          placeholder="name your goal"
          value={formData.goalName}
          onChangeText={(value) => handleInputChange('goalName', value)}
          onFocus={() => setFocusedField('goalName')}
          onBlur={() => setFocusedField('')}
        />
      </View>
      <View style={createSavingGoalStyle.field}>
        <Text style={createSavingGoalStyle.label}>Goal Description</Text>
        <TextInput
          style={[
            createSavingGoalStyle.input,
            createSavingGoalStyle.textarea,
            focusedField === 'goalDescription' && createSavingGoalStyle.focusedInput,
          ]}
          placeholder="add a goal description"
          value={formData.goalDescription}
          onChangeText={(value) => handleInputChange('goalDescription', value)}
          multiline
          onFocus={() => setFocusedField('goalDescription')}
          onBlur={() => setFocusedField('')}
        />
      </View>
      <View style={createSavingGoalStyle.field}>
        <Text style={createSavingGoalStyle.label}>When would you like to start?</Text>
        <View style={createSavingGoalStyle.calendarContainer}>
          <TextInput
            style={[createSavingGoalStyle.input, createSavingGoalStyle.readonlyInput]}
            value={formData.startDate}
            editable={false}
          />
          <Feather name="calendar" size={20} style={createSavingGoalStyle.calendarIcon} />
        </View>
      </View>
      <View style={createSavingGoalStyle.field}>
        <Text style={createSavingGoalStyle.label}>End date</Text>
        <View style={createSavingGoalStyle.calendarContainer}>
          <TextInput
            style={[createSavingGoalStyle.input, focusedField === 'endDate' && createSavingGoalStyle.focusedInput]}
            placeholder="select end date"
            value={formData.endDate}
            onChangeText={(value) => handleInputChange('endDate', value)}
            onFocus={() => setFocusedField('endDate')}
            onBlur={() => setFocusedField('')}
          />
          <Feather name="calendar" size={20} style={createSavingGoalStyle.calendarIcon} />
        </View>
      </View>
      <View style={createSavingGoalStyle.field}>
        <Text style={createSavingGoalStyle.label}>What is your saving goal?</Text>
        <View style={createSavingGoalStyle.calendarContainer}>
          <View style={createSavingGoalStyle.dollarContainer}>
            <Text style={createSavingGoalStyle.dollarText}>$</Text>
          </View>
          <TextInput
            style={[
              createSavingGoalStyle.input,
              { paddingLeft: 56 },
              focusedField === 'savingGoal' && createSavingGoalStyle.focusedInput,
            ]}
            placeholder="0.00"
            value={formData.savingGoal}
            onChangeText={(value) => handleInputChange('savingGoal', value)}
            keyboardType="numeric"
            onFocus={() => setFocusedField('savingGoal')}
            onBlur={() => setFocusedField('')}
          />
        </View>
      </View>
      <View style={createSavingGoalStyle.field}>
        <Text style={createSavingGoalStyle.label}>Saving Frequency</Text>
        <View style={createSavingGoalStyle.frequencyContainer}>
          {['daily', 'weekly', 'monthly'].map((freq) => (
            <AnimatedTouchableOpacity
              key={freq}
              style={[
                createSavingGoalStyle.frequencyButton,
                formData.savingFrequency === freq && createSavingGoalStyle.selectedFrequency,
                buttonStyle,
              ]}
              onPress={() => setFormData((prev) => ({ ...prev, savingFrequency: freq }))}
              onPressIn={() => handlePressIn(buttonScale)}
              onPressOut={() => handlePressOut(buttonScale)}
            >
              <Text style={createSavingGoalStyle.frequencyText}>{freq.charAt(0).toUpperCase() + freq.slice(1)}</Text>
            </AnimatedTouchableOpacity>
          ))}
        </View>
      </View>
      <AnimatedTouchableOpacity
        style={[createSavingGoalStyle.submitButton, buttonStyle]}
        onPress={handleSubmit}
        onPressIn={() => handlePressIn(buttonScale)}
        onPressOut={() => handlePressOut(buttonScale)}
      >
        <Text style={createSavingGoalStyle.submitText}>Create Goal</Text>
      </AnimatedTouchableOpacity>
    </ScrollView>
  )
}

export default CreateSavingGoalPage
