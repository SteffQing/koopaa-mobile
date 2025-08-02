import getTheme from '@/constants/theme'
import useParticipant from '@/hooks/db/useParticipant'
import { Image, ImageSourcePropType, StyleSheet, useColorScheme, View } from 'react-native'
import avatar1 from '../../assets/avatars/1.png'
import avatar2 from '../../assets/avatars/2.png'
import avatar3 from '../../assets/avatars/3.png'
import avatar4 from '../../assets/avatars/4.png'
import avatar5 from '../../assets/avatars/5.png'
import avatar6 from '../../assets/avatars/6.png'
import avatar7 from '../../assets/avatars/7.png'
import avatar8 from '../../assets/avatars/8.png'
import avatar9 from '../../assets/avatars/9.png'

const avatarImage: Record<number, ImageSourcePropType> = {
  1: avatar1,
  2: avatar2,
  3: avatar3,
  4: avatar4,
  5: avatar5,
  6: avatar6,
  7: avatar7,
  8: avatar8,
  9: avatar9,
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
