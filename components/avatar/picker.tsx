import { Spinner } from '@/components/skeletons'
import { Button } from '@/components/ui'
import getTheme from '@/constants/theme'
import { useModal } from '@/providers/modal-provider'
import { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native'
import Avatar from './avatar'

const avatarPickerStyle = StyleSheet.create({
  container: {
    padding: 24,
    maxWidth: 448,
    alignSelf: 'center',
    borderRadius: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  previewContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  previewWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    padding: 4,
  },
  previewInner: {
    width: '100%',
    height: '100%',
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarsHeader: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  avatarsContainer: {
    flexDirection: 'row',
    gap: 12,
    overflow: 'scroll',
    paddingVertical: 8,
  },
  avatarButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    padding: 2,
  },
  avatarInner: {
    width: '100%',
    height: '100%',
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
})

interface AvatarPickerProps {
  onSelect: (n: number) => Promise<void>
  currentAvatar?: number
}

const AvatarPicker: React.FC<AvatarPickerProps> = ({ onSelect, currentAvatar = 1 }) => {
  const colorScheme = useColorScheme()
  const theme = getTheme(colorScheme || 'light')
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar)
  const [loading, setLoading] = useState(false)
  const { hideModal } = useModal()

  const handleAvatarSelect = (avatarNumber: number) => {
    setSelectedAvatar(avatarNumber)
  }

  const confirmSelectedAvatar = async () => {
    setLoading(true)
    await onSelect(selectedAvatar)
    setLoading(false)
    hideModal()
  }

  return (
    <View style={[avatarPickerStyle.container, { backgroundColor: theme.background }]}>
      <View style={avatarPickerStyle.header}>
        <Text style={[avatarPickerStyle.title, { color: theme.textPrimary }]}>Choose Avatar</Text>
        <Text style={[avatarPickerStyle.subtitle, { color: theme.textSecondary }]}>Select your profile picture</Text>
      </View>
      <View style={avatarPickerStyle.previewContainer}>
        <View style={[avatarPickerStyle.previewWrapper, { backgroundColor: theme.blueGradientStart }]}>
          <View style={[avatarPickerStyle.previewInner, { backgroundColor: theme.background }]}>
            <Avatar number={selectedAvatar} size={88} />
          </View>
        </View>
      </View>
      <View>
        <Text style={[avatarPickerStyle.avatarsHeader, { color: theme.textPrimary }]}>Available Avatars</Text>
        <View style={avatarPickerStyle.avatarsContainer}>
          {Array.from({ length: 9 }, (_, i) => {
            const avatarNumber = i + 1
            const isSelected = selectedAvatar === avatarNumber

            return (
              <TouchableOpacity
                key={avatarNumber}
                onPress={() => handleAvatarSelect(avatarNumber)}
                style={[
                  avatarPickerStyle.avatarButton,
                  {
                    backgroundColor: isSelected ? theme.blueGradientStart : theme.gray100,
                    transform: [{ scale: isSelected ? 1.05 : 1 }],
                  },
                ]}
              >
                <View style={[avatarPickerStyle.avatarInner, { backgroundColor: theme.background }]}>
                  <Avatar number={avatarNumber} size={52} />
                </View>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
      <View style={avatarPickerStyle.buttonContainer}>
        <Button
          onPress={hideModal}
          disabled={loading}
          style={{ flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: theme.gray100 }}
        >
          <Text style={{ fontSize: 16, fontWeight: '500', color: theme.textSecondary }}>Cancel</Text>
        </Button>
        <Button
          onPress={confirmSelectedAvatar}
          disabled={loading}
          style={{ flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: theme.progressGradientStart }}
        >
          {loading ? (
            <Spinner size={16} borderWidth={2} color="#FFFFFF" />
          ) : (
            <Text style={{ fontSize: 16, fontWeight: '500', color: '#FFFFFF' }}>Confirm</Text>
          )}
        </Button>
      </View>
    </View>
  )
}

export default AvatarPicker
