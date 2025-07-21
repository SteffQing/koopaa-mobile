import AlertCircle from '@/assets/svgs/alert-circle.svg'
import Copy from '@/assets/svgs/copy.svg'
import getTheme from '@/constants/theme'
import Clipboard from '@react-native-clipboard/clipboard'
import { useWallet } from '@solana/wallet-adapter-react'
import { StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native'
import { Circle, Svg, Text as SvgText } from 'react-native-svg'
import { ErrorToast, SuccessToast } from 'react-native-toast-message'
// import { toast } from 'react-native-toast-message'

const fundWalletModalStyle = StyleSheet.create({
  container: {
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  copyButton: {
    padding: 12,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  networkWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  networkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  networkText: {
    fontSize: 16,
    fontWeight: '500',
  },
  alertSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  alertText: {
    fontSize: 14,
  },
})

const FundWalletModal: React.FC = () => {
  const colorScheme = useColorScheme()
  const theme = getTheme(colorScheme || 'light')
  const { publicKey } = useWallet()

  const copyWalletAddress = () => {
    if (!publicKey) {
      ErrorToast({
        text1: 'No wallet seems to be connected',
      })
    } else {
      Clipboard.setString(publicKey.toBase58())
      SuccessToast({
        text1: 'Wallet address copied to clipboard',
      })
    }
  }

  return (
    <View style={fundWalletModalStyle.container}>
      <Text style={[fundWalletModalStyle.title, { color: theme.textPrimary }]}>Fund your wallet</Text>
      <Text style={[fundWalletModalStyle.subtitle, { color: theme.textSecondary }]}>
        Use any convenient method to funding your wallet below
      </Text>
      <View style={fundWalletModalStyle.section}>
        <Text style={[fundWalletModalStyle.label, { color: theme.textSecondary }]}>USDC Deposit</Text>
        <Text style={[fundWalletModalStyle.subtitle, { color: theme.textSecondary, marginBottom: 16 }]}>
          Deposit USDC to your wallet address from a DEX or CEX
        </Text>
        <View style={fundWalletModalStyle.section}>
          <Text style={[fundWalletModalStyle.label, { color: theme.textSecondary }]}>Wallet address</Text>
          <View style={fundWalletModalStyle.inputWrapper}>
            <TextInput
              value={publicKey?.toBase58()}
              editable={false}
              style={[
                fundWalletModalStyle.input,
                { borderColor: theme.gray300, backgroundColor: theme.gray50, color: theme.textPrimary },
              ]}
            />
            <TouchableOpacity
              onPress={copyWalletAddress}
              style={[fundWalletModalStyle.copyButton, { backgroundColor: theme.orange }]}
            >
              <Copy width={20} height={20} fill="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={fundWalletModalStyle.section}>
          <Text style={[fundWalletModalStyle.label, { color: theme.textSecondary }]}>Network</Text>
          <View
            style={[fundWalletModalStyle.networkWrapper, { borderColor: theme.gray300, backgroundColor: theme.gray50 }]}
          >
            <View style={[fundWalletModalStyle.networkIcon, { backgroundColor: theme.textPrimary }]}>
              <Svg width={24} height={24} viewBox="0 0 24 24">
                <Circle cx="12" cy="12" r="12" fill={theme.textPrimary} />
                <SvgText x="12" y="16" fontSize="12" fill="#FFFFFF" textAnchor="middle">
                  S
                </SvgText>
              </Svg>
            </View>
            <Text style={[fundWalletModalStyle.networkText, { color: theme.textPrimary }]}>SOLANA(SOL)</Text>
          </View>
        </View>
        <View
          style={[
            fundWalletModalStyle.alertSection,
            { backgroundColor: theme.skeletonBadgeOrange /* color: theme.destructive */ },
          ]}
        >
          <AlertCircle width={18} height={18} fill={theme.destructive} />
          <Text style={[fundWalletModalStyle.alertText, { color: theme.destructive }]}>
            Make sure the network is SOLANA(SOL), using other network will result to lost of funds
          </Text>
        </View>
      </View>
    </View>
  )
}

export default FundWalletModal
