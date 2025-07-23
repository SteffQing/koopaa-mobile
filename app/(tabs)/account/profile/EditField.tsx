import { Feather } from '@expo/vector-icons'
import { useState } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

interface EditFieldProps {
  label: string
  value: string
  onSave: (value: string) => Promise<void>
  disabled?: boolean
  last?: boolean
}

const editFieldStyle = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#C4C4C4',
  },
  lastContainer: { borderBottomWidth: 0 },
  label: { fontSize: 12, fontWeight: '500', color: '#121212' },
  content: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  value: { fontSize: 12, color: '#4C4C4C' },
  input: {
    height: 32,
    width: 150,
    fontSize: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  check: { color: '#16A34A' },
  cancel: { color: '#DC2626' },
  edit: { color: '#9D6D4C' },
})

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)

const EditField: React.FC<EditFieldProps> = ({ label, value, onSave, disabled = false, last = false }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState(value)
  const [isLoading, setIsLoading] = useState(false)
  const checkScale = useSharedValue(1)
  const cancelScale = useSharedValue(1)
  const editScale = useSharedValue(1)
  const checkStyle = useAnimatedStyle(() => ({ transform: [{ scale: checkScale.value }] }))
  const cancelStyle = useAnimatedStyle(() => ({ transform: [{ scale: cancelScale.value }] }))
  const editStyle = useAnimatedStyle(() => ({ transform: [{ scale: editScale.value }] }))

  const handleSave = async () => {
    if (inputValue === value) {
      setIsEditing(false)
      return
    }
    setIsLoading(true)
    try {
      await onSave(inputValue)
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to save:', error)
      setInputValue(value)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setInputValue(value)
    setIsEditing(false)
  }

  const handlePressIn = (scale: Animated.SharedValue<number>) => {
    scale.value = withTiming(0.95, { duration: 100 })
  }
  const handlePressOut = (scale: Animated.SharedValue<number>) => {
    scale.value = withTiming(1, { duration: 100 })
  }

  return (
    <View style={[editFieldStyle.container, last && editFieldStyle.lastContainer]}>
      <Text style={editFieldStyle.label}>{label}</Text>
      {isEditing ? (
        <View style={editFieldStyle.content}>
          <TextInput value={inputValue} onChangeText={setInputValue} style={editFieldStyle.input} autoFocus />
          <AnimatedTouchableOpacity
            style={checkStyle}
            onPress={handleSave}
            disabled={isLoading}
            onPressIn={() => handlePressIn(checkScale)}
            onPressOut={() => handlePressOut(checkScale)}
          >
            <Feather name="check" size={16} style={editFieldStyle.check} />
          </AnimatedTouchableOpacity>
          <AnimatedTouchableOpacity
            style={cancelStyle}
            onPress={handleCancel}
            disabled={isLoading}
            onPressIn={() => handlePressIn(cancelScale)}
            onPressOut={() => handlePressOut(cancelScale)}
          >
            <Feather name="x" size={16} style={editFieldStyle.cancel} />
          </AnimatedTouchableOpacity>
        </View>
      ) : (
        <View style={editFieldStyle.content}>
          <Text style={editFieldStyle.value}>{value}</Text>
          {!disabled && (
            <AnimatedTouchableOpacity
              style={editStyle}
              onPress={() => setIsEditing(true)}
              onPressIn={() => handlePressIn(editScale)}
              onPressOut={() => handlePressOut(editScale)}
            >
              <Feather name="edit-2" size={14} style={editFieldStyle.edit} />
            </AnimatedTouchableOpacity>
          )}
        </View>
      )}
    </View>
  )
}

export default EditField
