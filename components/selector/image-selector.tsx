import { StyleSheet, View, Image, TouchableOpacity } from 'react-native'
import { useColorScheme } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'
import getTheme from '@/constants/theme'
import Check from '@/assets/svgs/check.svg'

interface ImageSelectorProps {
  images: any[]
  value: number
  onChange: (value: number) => void
}

const imageSelectorStyle = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  imageWrapper: {
    aspectRatio: 16 / 9,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  selectedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ff66001a', // #ff6600 with 10% opacity
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIconWrapper: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ff6600',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

const ImageSelector: React.FC<ImageSelectorProps> = ({ images, value, onChange }) => {
  const colorScheme = useColorScheme()
  const theme = getTheme(colorScheme || 'light')

  return (
    <View style={imageSelectorStyle.container}>
      {images.map((image, index) => {
        const isSelected = value === index + 1
        const scale = useSharedValue(1)
        const animatedStyle = useAnimatedStyle(() => ({
          transform: [{ scale: scale.value }],
        }))

        return (
          <TouchableOpacity
            key={index + 1}
            onPress={() => {
              scale.value = withTiming(0.98, { duration: 100 }, () => {
                scale.value = withTiming(1.02, { duration: 100 })
                onChange(index + 1)
              })
            }}
            activeOpacity={1}
          >
            <Animated.View
              style={[
                imageSelectorStyle.imageWrapper,
                { borderColor: isSelected ? '#ff6600' : 'transparent' },
                animatedStyle,
              ]}
            >
              <Image source={image || require('@/assets/images/placeholder.png')} style={imageSelectorStyle.image} />
              {isSelected && (
                <View style={imageSelectorStyle.selectedOverlay}>
                  <View style={imageSelectorStyle.checkIconWrapper}>
                    <Check width={14} height={14} stroke="#FFFFFF" strokeWidth={3} />
                  </View>
                </View>
              )}
            </Animated.View>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

export default ImageSelector
