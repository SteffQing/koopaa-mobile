import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'
import { Link } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import Profile from '@/assets/svgs/account/security-support/profile.svg'
import { VariantProps } from './types'

interface PersonalSectionProps extends VariantProps {
  item?: { hidden: { opacity: number; y: number }; show: { opacity: number; y: number } }
}

const personalSectionStyle = StyleSheet.create({
  container: { marginBottom: 24 },
  title: { fontSize: 14, fontWeight: '500', color: '#333333', marginBottom: 12 },
  card: {
    backgroundColor: '#FCFCFC',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inner: { paddingHorizontal: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  content: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconContainer: { backgroundColor: '#DADADA', padding: 6, borderRadius: 14 },
  text: { fontSize: 12, color: '#121212' },
  chevron: { color: '#9CA3AF' },
})

const PersonalSection: React.FC<PersonalSectionProps> = ({ item }) => {
  const opacity = useSharedValue(item?.hidden.opacity ?? 0)
  const y = useSharedValue(item?.hidden.y ?? 20)
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: y.value }],
  }))

  opacity.value = withTiming(item?.show.opacity ?? 1, { duration: 300 })
  y.value = withTiming(item?.show.y ?? 0, { duration: 300 })

  return (
    <Animated.View style={[personalSectionStyle.container, animatedStyle]}>
      <Text style={personalSectionStyle.title}>Personal</Text>
      <View style={personalSectionStyle.card}>
        <View style={personalSectionStyle.inner}>
          <Link href="/account/profile" asChild>
            <TouchableOpacity>
              <View style={personalSectionStyle.row}>
                <View style={personalSectionStyle.content}>
                  <View style={personalSectionStyle.iconContainer}>
                    <Profile width={20} height={20} />
                  </View>
                  <Text style={personalSectionStyle.text}>Profile details</Text>
                </View>
                <Feather name="chevron-right" size={20} style={personalSectionStyle.chevron} />
              </View>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </Animated.View>
  )
}

export default PersonalSection
