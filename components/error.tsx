import { Spinner } from '@/components/skeletons'
import { Button } from '@/components/ui/button'
import getTheme from '@/constants/theme'
import { Feather } from '@expo/vector-icons'
import { useState } from 'react'
import { StyleSheet, Text, useColorScheme, View } from 'react-native'

interface ErrorStateProps {
  title?: string
  message?: string
  buttonText?: string
  onRetry?: () => Promise<void> | void
  errorCode?: string
}

const errorStyle = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 8 },
  message: { fontSize: 16, textAlign: 'center', maxWidth: 256, marginBottom: 16 },
  errorCode: { fontSize: 14, marginBottom: 16, color: '#9CA3AF' },
  buttonContent: { flexDirection: 'row', alignItems: 'center', gap: 8 },
})

const Error: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = "We couldn't load this page. Please try again.",
  buttonText = 'Try again',
  onRetry,
  errorCode,
}) => {
  const colorScheme = useColorScheme()
  const theme = getTheme(colorScheme || 'light')
  const [loading, setLoading] = useState(false)

  const handleRetry = async () => {
    if (!onRetry) return
    setLoading(true)
    try {
      await onRetry()
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={errorStyle.container}>
      <View style={errorStyle.iconWrapper}>
        <Feather name="alert-triangle" size={32} color="#EF4444" />
      </View>
      <Text style={[errorStyle.title, { color: theme.textPrimary }]}>{title}</Text>
      <Text style={[errorStyle.message, { color: theme.textSecondary }]}>{message}</Text>
      {errorCode && <Text style={[errorStyle.errorCode]}>Error code: {errorCode}</Text>}
      <Button
        onPress={handleRetry}
        disabled={loading}
        style={{ paddingVertical: 12, paddingHorizontal: 16, backgroundColor: theme.gray100 }}
      >
        <View style={errorStyle.buttonContent}>
          {loading ? (
            <Spinner size={16} borderWidth={2} color={theme.textPrimary} />
          ) : (
            <Feather name="refresh-cw" size={16} color={theme.textPrimary} />
          )}
          <Text style={{ fontSize: 16, color: theme.textPrimary }}>{buttonText}</Text>
        </View>
      </Button>
    </View>
  )
}

export default Error
