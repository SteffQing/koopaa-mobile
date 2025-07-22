import { Feather } from '@expo/vector-icons'
import { useState } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

interface CheckboxProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
}

const checkboxStyle = StyleSheet.create({
  container: { width: 16, height: 16, borderRadius: 4, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  indicator: { flex: 1, alignItems: 'center', justifyContent: 'center' },
})

const Checkbox: React.FC<CheckboxProps> = ({ checked = false, onCheckedChange, disabled = false }) => {
  const [isChecked, setIsChecked] = useState(checked)
  const opacity = useSharedValue(checked ? 1 : 0)
  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }))

  const handlePress = () => {
    if (disabled) return
    const newChecked = !isChecked
    setIsChecked(newChecked)
    opacity.value = withTiming(newChecked ? 1 : 0, { duration: 100 })
    onCheckedChange?.(newChecked)
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      style={[
        checkboxStyle.container,
        {
          borderColor: isChecked ? '#FF6600' : '#CBD5E1',
          backgroundColor: isChecked ? '#FF6600' : '#FCFCFC',
          opacity: disabled ? 0.5 : 1,
        },
      ]}
    >
      <Animated.View style={[checkboxStyle.indicator, animatedStyle]}>
        <Feather name="check" size={14} color="#FFFFFF" />
      </Animated.View>
    </TouchableOpacity>
  )
}

export default Checkbox
