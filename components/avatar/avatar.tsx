import getTheme from '@/constants/theme'
import useParticipant from '@/hooks/db/useParticipant'
import { Image, StyleSheet, useColorScheme, View } from 'react-native'

// Import avatar images using require (adjust paths if needed)
const avatarImage: Record<number, any> = {
  1: require('@/assets/avatars/1.png'),
  2: require('@/assets/avatars/2.png'),
  3: require('@/assets/avatars/3.png'),
  4: require('@/assets/avatars/4.png'),
  5: require('@/assets/avatars/5.png'),
  6: require('@/assets/avatars/6.png'),
  7: require('@/assets/avatars/7.png'),
  8: require('@/assets/avatars/8.png'),
  9: require('@/assets/avatars/9.png'),
}

const avatarColors: Record<number, string> = {
  1: '#71927C',
  2: '#FFB1AB',
  3: '#D4FFAB',
  4: '#D2ABFF',
  5: '#534DFF',
  6: '#DCDDDA',
  7: '#FFE95A',
  8: '#FB9A2C',
  9: '#ABFFFC',
}

const avatarStyle = StyleSheet.create({
  container: {
    borderRadius: 9999,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  image: {
    width: '100%',
    height: '100%',
  },
})

interface AvatarProps {
  number?: number
  size?: number
}

const Avatar: React.FC<AvatarProps> = ({ number = 1, size = 40 }) => {
  const colorScheme = useColorScheme()
  const theme = getTheme(colorScheme || 'light')
  const src = avatarImage[number] || avatarImage[1]
  const bgColor = avatarColors[number] || '#ddd'

  return (
    <View
      style={[
        avatarStyle.container,
        { width: size, height: size, backgroundColor: bgColor, borderColor: theme.background },
      ]}
    >
      <Image source={src} style={avatarStyle.image} />
    </View>
  )
}

export default Avatar

export const GetAvatar = ({ address, size = 40 }: { address: string; size: number }) => {
  const { data } = useParticipant(address)
  return <Avatar number={data?.data?.avatar} size={size} />
}
