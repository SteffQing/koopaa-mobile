import ArrowDown from '@/assets/svgs/arrow-down.svg'
import ArrowUp from '@/assets/svgs/arrow-up.svg'
import Refresh from '@/assets/svgs/refresh.svg'
import { FaucetModal } from '@/components/modal'
import { Spinner } from '@/components/skeletons'
import { Button } from '@/components/ui/button'
import getTheme from '@/constants/theme'
import useGetRate from '@/hooks/useGetRate'
import { useModal } from '@/providers/modal-provider'
import { Feather } from '@expo/vector-icons'
import { useEffect, useState } from 'react'
import { ImageBackground, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import FormattedBalance from './format-balance'
import { Currency, SavingsType, Tab } from './types'

const bgMap: Record<SavingsType, any> = {
  total: require('@/assets/public/savings-card/total.png'),
  individual: require('@/assets/public/savings-card/individual.png'),
  ajo: require('@/assets/public/savings-card/ajo.png'),
}

const titleMap: Record<SavingsType, string> = {
  total: 'Total Savings',
  individual: 'Individual Savings',
  ajo: 'Ajo Savings',
}

interface CardProps {
  amount: number
  tab: Tab
  loading?: boolean
  onRefresh?: () => void
  type?: SavingsType
  action?: {
    text: string
    handler: () => void
  }
}

const cardStyle = StyleSheet.create({
  container: { borderRadius: 12, padding: 12, overflow: 'hidden' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12, paddingTop: 16 },
  title: { fontSize: 16, fontWeight: '500', color: '#333333' },
  balance: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  balanceText: { fontSize: 30, fontWeight: '700', color: '#333333' },
  currency: { fontSize: 18, marginRight: 8, color: '#333333' },
  hiddenBalance: { fontSize: 30, fontWeight: '700', color: '#333333' },
  currencyToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F9F4F1',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  currencyText: { fontSize: 12, color: '#333333' },
  actions: { flexDirection: 'row', gap: 12 },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
})

const Card: React.FC<CardProps> = ({ amount, tab, action, type = 'total', loading = false, onRefresh }) => {
  const colorScheme = useColorScheme()
  const theme = getTheme(colorScheme || 'light')
  const { showModal } = useModal()
  const [isVisible, setIsVisible] = useState(true)
  const [currency, setCurrency] = useState<Currency>('USDC')
  const [balance, setBalance] = useState(amount)
  const isSavings = tab === 'Savings'
  const rate = useGetRate()
  const opacity = useSharedValue(0)
  const balanceStyle = useAnimatedStyle(() => ({ opacity: opacity.value }))

  const openFaucetModal = () => {
    showModal(<FaucetModal />, { position: 'center' })
  }

  const convert = () => {
    if (currency === 'USDC') {
      setBalance(amount * rate)
      setCurrency('NGN')
    } else {
      setBalance(amount)
      setCurrency('USDC')
    }
  }

  useEffect(() => {
    setBalance(amount)
  }, [amount])

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 300 })
  }, [isVisible])

  return (
    <Animated.View style={[cardStyle.container, { transform: [{ scale: 1 }] }]}>
      <ImageBackground source={bgMap[type]} style={{ flex: 1 }}>
        <View style={cardStyle.header}>
          <Text style={cardStyle.title}>{isSavings ? titleMap[type] : 'Wallet Balances'}</Text>
          <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
            <Feather name="eye" size={18} color="#A4A4A4" />
          </TouchableOpacity>
        </View>
        <View style={cardStyle.balance}>
          <Animated.View style={balanceStyle}>
            <Text style={cardStyle.currency}>{currency}</Text>
            {loading ? (
              <Spinner size={24} borderWidth={2} color="#FF6600" />
            ) : isVisible ? (
              <FormattedBalance amount={balance} />
            ) : (
              <Text style={cardStyle.hiddenBalance}>****</Text>
            )}
          </Animated.View>
        </View>
        <View style={cardStyle.currencyToggle}>
          <TouchableOpacity onPress={convert}>
            <Text style={cardStyle.currencyText}>{currency}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onRefresh} disabled={loading}>
            <Refresh width={16} height={16} style={loading ? { transform: [{ rotate: '360deg' }] } : {}} />
          </TouchableOpacity>
        </View>
        {action ? (
          <Button onPress={action.handler} style={[cardStyle.actionButton, { backgroundColor: '#000000' }]}>
            <Text style={{ fontSize: 14, fontWeight: '500', color: '#FCFCFC' }}>{action.text}</Text>
          </Button>
        ) : (
          <View style={cardStyle.actions}>
            <Button onPress={openFaucetModal} style={[cardStyle.actionButton, { backgroundColor: '#FCFCFC' }]}>
              <Text style={{ fontSize: 14, fontWeight: '500', color: '#333333' }}>
                {isSavings ? 'Top Up' : 'Fund Wallet'}
              </Text>
              <ArrowDown width={16} height={16} />
            </Button>
            <Button style={[cardStyle.actionButton, { backgroundColor: '#000000' }]}>
              <Text style={{ fontSize: 14, fontWeight: '500', color: '#FCFCFC' }}>Withdraw</Text>
              <ArrowUp width={16} height={16} />
            </Button>
          </View>
        )}
      </ImageBackground>
    </Animated.View>
  )
}

export default Card
