import { Spinner } from '@/components/skeletons'
import getTheme from '@/constants/theme'
import React from 'react'
import { StyleSheet, Text, TextStyle, TouchableOpacity, useColorScheme, ViewStyle } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'
import Toast from 'react-native-toast-message'

interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  asChild?: boolean
  loading?: boolean
  disabled?: boolean
  onPress?: () => void
  children?: React.ReactNode
  style?: ViewStyle | ViewStyle[]
  textStyle?: TextStyle | TextStyle[]
}

const buttonStyle = StyleSheet.create({
  base: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 8 },
  defaultSize: { minHeight: 48, paddingVertical: 12, paddingHorizontal: 16 },
  sm: { height: 32, paddingHorizontal: 12, paddingVertical: 8 },
  lg: { height: 40, paddingHorizontal: 24 },
  icon: { width: 36, height: 36 },
  text: { fontSize: 14, fontWeight: '500', color: '#FCFCFC' },
  linkText: { fontSize: 14, color: '#FF6600', textDecorationLine: 'underline' },
})

const variantStyles: Record<string, ViewStyle> = {
  default: { backgroundColor: '#FF6600' },
  destructive: { backgroundColor: '#E11D48' },
  outline: { backgroundColor: '#F9F4F1' },
  secondary: { backgroundColor: '#FFF0E0' },
  ghost: { backgroundColor: 'transparent' },
  link: { backgroundColor: 'transparent' },
}

const sizeStyles: Record<string, ViewStyle> = {
  default: buttonStyle.defaultSize,
  sm: buttonStyle.sm,
  lg: buttonStyle.lg,
  icon: buttonStyle.icon,
}

const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'default',
  asChild = false,
  loading = false,
  disabled = false,
  onPress,
  children,
  style,
  textStyle,
}) => {
  const colorScheme = useColorScheme()
  const theme = getTheme(colorScheme || 'light')
  const scale = useSharedValue(1)
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }))

  const handlePressIn = () => {
    scale.value = withTiming(0.95, { duration: 100 })
  }
  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 100 })
  }

  const styles = [
    buttonStyle.base,
    variantStyles[variant],
    sizeStyles[size],
    ...(Array.isArray(style) ? style : [style || {}]),
    { opacity: loading || disabled ? 0.5 : 1 },
  ]

  const textColor =
    variant === 'outline' || variant === 'secondary'
      ? { color: theme.textPrimary }
      : variant === 'link'
        ? buttonStyle.linkText
        : buttonStyle.text

  if (asChild) {
    return (
      <Animated.View style={[styles, animatedStyle]}>
        {React.Children.map(children, (child) =>
          React.isValidElement(child)
            ? React.cloneElement(child, {
                // @ts-ignore
                style: [child.props.style, styles],
                onPress: loading || disabled ? undefined : onPress,
                onPressIn: handlePressIn,
                onPressOut: handlePressOut,
              })
            : child,
        )}
        {loading && <Spinner size={16} borderWidth={2} color="#FFFFFF" />}
      </Animated.View>
    )
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading || disabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles}
      activeOpacity={0.8}
    >
      <Animated.View style={animatedStyle}>
        {React.isValidElement(children) ? children : <Text style={[textColor, textStyle]}>{children}</Text>}
        {loading && <Spinner size={16} borderWidth={2} color="#FFFFFF" />}
      </Animated.View>
    </TouchableOpacity>
  )
}

interface SwitchButtonProps {
  state: boolean
  setState: (value: boolean) => void
  disabled?: boolean
}

const switchButtonStyle = StyleSheet.create({
  container: { width: 32, height: 15, borderRadius: 9999, justifyContent: 'center' },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FCFCFC',
    borderWidth: 2,
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -10 }],
  },
})

const SwitchButton: React.FC<SwitchButtonProps> = ({ state, setState, disabled }) => {
  const translateX = useSharedValue(state ? 12 : 0)
  const scale = useSharedValue(1)
  const animatedContainerStyle = useAnimatedStyle(() => ({
    backgroundColor: state ? '#FF6600' : '#A4A4A4',
  }))
  const animatedThumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: -10 }],
    borderColor: state ? '#FF6600' : '#A4A4A4',
  }))

  const handlePress = () => {
    if (disabled) {
      Toast.show({
        type: 'error',
        text1: 'This setting has been disabled!',
        text2: 'Please reach out to KooPaa support team for any questions',
      })
      return
    }
    const newState = !state
    setState(newState)
    translateX.value = withSpring(newState ? 12 : 0, { stiffness: 500, damping: 30 })
    scale.value = withTiming(0.9, { duration: 100 }, () => {
      scale.value = withTiming(1, { duration: 100 })
    })
  }

  return (
    <TouchableOpacity onPress={handlePress} disabled={disabled} activeOpacity={0.8}>
      <Animated.View style={[switchButtonStyle.container, animatedContainerStyle]}>
        <Animated.View style={[switchButtonStyle.thumb, animatedThumbStyle]} />
      </Animated.View>
    </TouchableOpacity>
  )
}

export { Button, SwitchButton }
