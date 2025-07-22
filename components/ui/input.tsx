import getTheme from '@/constants/theme'
import { forwardRef } from 'react'
import { StyleSheet, TextInput, useColorScheme } from 'react-native'

interface InputProps {
  placeholder?: string
  value?: string
  onChangeText?: (text: string) => void
  disabled?: boolean
}

const inputStyle = StyleSheet.create({
  input: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: '#FCFCFC',
  },
  placeholder: { color: '#A4A4A4', fontSize: 12, fontWeight: '400' },
})

const Input: React.FC<InputProps> = ({ placeholder, value, onChangeText, disabled }) => {
  const colorScheme = useColorScheme()
  const theme = getTheme(colorScheme || 'light')

  return (
    <TextInput
      style={[inputStyle.input, { color: theme.textPrimary, opacity: disabled ? 0.5 : 1 }]}
      placeholder={placeholder}
      placeholderTextColor="#A4A4A4"
      value={value}
      onChangeText={onChangeText}
      editable={!disabled}
    />
  )
}

interface TextareaProps {
  placeholder?: string
  value?: string
  onChangeText?: (text: string) => void
  disabled?: boolean
}

const textareaStyle = StyleSheet.create({
  textarea: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: '#FCFCFC',
    minHeight: 100,
  },
  placeholder: { color: '#A4A4A4', fontSize: 12, fontWeight: '400' },
})

const Textarea = forwardRef<TextInput, TextareaProps>(({ placeholder, value, onChangeText, disabled }, ref) => {
  const colorScheme = useColorScheme()
  const theme = getTheme(colorScheme || 'light')

  return (
    <TextInput
      style={[textareaStyle.textarea, { color: theme.textPrimary, opacity: disabled ? 0.5 : 1 }]}
      placeholder={placeholder}
      placeholderTextColor="#A4A4A4"
      value={value}
      onChangeText={onChangeText}
      editable={!disabled}
      multiline
      ref={ref}
    />
  )
})

export { Input, Textarea }
