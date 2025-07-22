import { StyleSheet, Text } from 'react-native'

interface FormattedBalanceProps {
  amount?: number
  cStyle?: any
}

const formattedBalanceStyle = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'baseline' },
  whole: { fontSize: 30, fontWeight: '700', color: '#333333' },
  decimal: { fontSize: 20, color: '#333333' },
})

const FormattedBalance: React.FC<FormattedBalanceProps> = ({ amount = 0, cStyle }) => {
  const [whole, decimal] = amount
    .toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    .split('.')

  return (
    <Text style={formattedBalanceStyle.container}>
      <Text style={formattedBalanceStyle.whole}>{whole}</Text>
      <Text style={[formattedBalanceStyle.decimal, cStyle]}>.{decimal}</Text>
    </Text>
  )
}

export default FormattedBalance
