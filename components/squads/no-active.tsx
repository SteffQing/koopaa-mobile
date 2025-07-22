import { StyleSheet, Text, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated'
import { Avatar } from '../avatar'

const noActiveSquadStyle = StyleSheet.create({
  container: { borderRadius: 12, padding: 24, alignItems: 'center' },
  avatarWrapper: {
    backgroundColor: '#FCFCFC',
    borderRadius: 9999,
    padding: 28,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarContainer: { width: 64, height: 64, position: 'relative' },
  avatar: { position: 'absolute' },
  message: { fontSize: 14, fontWeight: '400', color: '#767676', textAlign: 'center' },
})

const NoActiveSquad: React.FC = () => {
  const rotate = useSharedValue(0)
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
  }))

  // Continuous rotation
  rotate.value = withRepeat(
    withTiming(360, { duration: 20000 }),
    -1, // Infinite repeat
    false,
  )

  return (
    <Animated.View style={[noActiveSquadStyle.container, { transform: [{ scale: 1 }], opacity: 1 }]}>
      <View style={noActiveSquadStyle.avatarWrapper}>
        <Animated.View style={[noActiveSquadStyle.avatarContainer, animatedStyle]}>
          <View
            style={[
              noActiveSquadStyle.avatar,
              { top: 0, left: '50%', transform: [{ translateX: -20 }, { translateY: -20 }] },
            ]}
          >
            <Avatar number={6} />
          </View>
          <View
            style={[
              noActiveSquadStyle.avatar,
              { bottom: 0, left: '50%', transform: [{ translateX: -20 }, { translateY: 20 }] },
            ]}
          >
            <Avatar number={9} />
          </View>
          <View
            style={[
              noActiveSquadStyle.avatar,
              { left: 0, top: '50%', transform: [{ translateY: -20 }, { translateX: -20 }] },
            ]}
          >
            <Avatar number={5} />
          </View>
          <View
            style={[
              noActiveSquadStyle.avatar,
              { right: 0, top: '50%', transform: [{ translateY: -20 }, { translateX: 20 }] },
            ]}
          >
            <Avatar number={3} />
          </View>
        </Animated.View>
      </View>
      <Text style={noActiveSquadStyle.message}>No squad active, your active squad will appear here.</Text>
    </Animated.View>
  )
}

export default NoActiveSquad
