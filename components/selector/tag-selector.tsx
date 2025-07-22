import getTheme from '@/constants/theme'
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

interface TagSelectorProps {
  tags: { value: string; label: string; icon: string }[]
  value: string
  onChange: (value: string) => void
}

const tagSelectorStyle = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 9999,
  },
  icon: {
    fontSize: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
})

const TagSelector: React.FC<TagSelectorProps> = ({ tags, value, onChange }) => {
  const colorScheme = useColorScheme()
  const theme = getTheme(colorScheme || 'light')

  return (
    <View style={tagSelectorStyle.container}>
      {tags.map((tag) => {
        const isSelected = value === tag.value
        const scale = useSharedValue(1)
        const animatedStyle = useAnimatedStyle(() => ({
          transform: [{ scale: scale.value }],
        }))

        return (
          <TouchableOpacity
            key={tag.value}
            onPress={() => {
              scale.value = withTiming(0.95, { duration: 100 }, () => {
                scale.value = withTiming(1.05, { duration: 100 })
                onChange(tag.value)
              })
            }}
            activeOpacity={1}
          >
            <Animated.View
              style={[
                tagSelectorStyle.button,
                {
                  backgroundColor: isSelected ? theme.orange : theme.gray100,
                },
                animatedStyle,
              ]}
            >
              <Text style={[tagSelectorStyle.icon, { color: isSelected ? '#FFFFFF' : theme.textSecondary }]}>
                {tag.icon}
              </Text>
              <Text style={[tagSelectorStyle.label, { color: isSelected ? '#FFFFFF' : theme.textSecondary }]}>
                {tag.label}
              </Text>
            </Animated.View>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

export default TagSelector
