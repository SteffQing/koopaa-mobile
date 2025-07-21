import { useColorScheme, StyleSheet, View, Text, TouchableOpacity, Image, Linking } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'
import { useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Button } from '@/components/ui/button' // Assume this is your React Native Button component
import getTheme from '@/constants/theme'

const connectWalletModalStyle = StyleSheet.create({
  container: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 32,
  },
  walletButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  walletContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  walletIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  walletText: {
    fontSize: 16,
    fontWeight: '500',
  },
  noWalletSection: {
    gap: 12,
  },
  noWalletCard: {
    padding: 16,
    backgroundColor: '#F9FAFB', // theme.gray50 as fallback
    borderRadius: 12,
  },
  noWalletText: {
    fontSize: 14,
    textAlign: 'center',
  },
  infoSection: {
    marginBottom: 32,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
  },
  connectedCard: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  connectedText: {
    fontSize: 14,
    fontFamily: 'monospace',
    textAlign: 'center',
  },
})

const ConnectWalletModal: React.FC = () => {
  const colorScheme = useColorScheme()
  const theme = getTheme(colorScheme || 'light')
  const { select, wallets, publicKey, disconnect } = useWallet()

  const buttonY = useSharedValue(-2)
  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: buttonY.value }],
  }))

  useEffect(() => {
    buttonY.value = withTiming(0, { duration: 200 })
  }, [])

  if (publicKey) {
    return (
      <View style={connectWalletModalStyle.container}>
        <Text style={[connectWalletModalStyle.title, { color: theme.textPrimary }]}>Wallet Connected</Text>
        <View style={[connectWalletModalStyle.connectedCard, { backgroundColor: theme.gray100 }]}>
          <Text style={[connectWalletModalStyle.connectedText, { color: theme.textPrimary }]} numberOfLines={1}>
            {publicKey.toBase58()}
          </Text>
        </View>
        <Button
          onPress={disconnect}
          variant="destructive"
          style={{ backgroundColor: theme.destructive, color: '#FFFFFF' }}
        >
          Disconnect Wallet
        </Button>
      </View>
    )
  }

  const installedWallets = wallets.filter((wallet) => wallet.readyState === 'Installed')

  return (
    <View style={connectWalletModalStyle.container}>
      <Text style={[connectWalletModalStyle.title, { color: theme.textPrimary }]}>Connect a Wallet</Text>
      <Text style={[connectWalletModalStyle.subtitle, { color: theme.textSecondary }]}>
        Get started by connecting your preferred wallet below.
      </Text>
      <View style={{ marginBottom: 16 }}>
        {installedWallets.length > 0 ? (
          installedWallets.map((wallet) => (
            <Animated.View
              key={wallet.adapter.name}
              style={[
                connectWalletModalStyle.walletButton,
                { borderColor: theme.gray300, backgroundColor: theme.cardBackground },
                buttonAnimatedStyle,
              ]}
            >
              <TouchableOpacity
                onPress={() => select(wallet.adapter.name)}
                style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}
              >
                <View style={connectWalletModalStyle.walletContent}>
                  {wallet.adapter.icon && (
                    <Image
                      source={{ uri: wallet.adapter.icon || 'placeholder.svg' }}
                      style={connectWalletModalStyle.walletIcon}
                    />
                  )}
                  <Text style={[connectWalletModalStyle.walletText, { color: theme.textPrimary }]}>
                    Connect with {wallet.adapter.name}
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))
        ) : (
          <View style={connectWalletModalStyle.noWalletSection}>
            <View style={connectWalletModalStyle.noWalletCard}>
              <Text style={[connectWalletModalStyle.noWalletText, { color: theme.textSecondary }]}>
                No wallets found
              </Text>
              <Text style={[connectWalletModalStyle.noWalletText, { color: theme.textSecondary }]}>
                Please install a Solana wallet to continue
              </Text>
            </View>
            <Animated.View style={buttonAnimatedStyle}>
              <Button
                onPress={() => Linking.openURL('https://solana.com/ecosystem/wallets')}
                style={{ borderColor: theme.gray300, backgroundColor: theme.cardBackground, color: theme.textPrimary }}
              >
                Get a Wallet
              </Button>
            </Animated.View>
          </View>
        )}
      </View>
      <View style={connectWalletModalStyle.infoSection}>
        <Text style={[connectWalletModalStyle.infoTitle, { color: theme.textPrimary }]}>What is a wallet?</Text>
        <Text style={[connectWalletModalStyle.infoText, { color: theme.textSecondary }]}>
          A wallet is a digital tool that stores and manages your private keys, allowing you to access and control your
          cryptocurrency and other assets on the Solana blockchain. It's a crucial component for interacting with the
          Solana ecosystem, including decentralized applications (dApps) and managing your digital assets.
        </Text>
      </View>
    </View>
  )
}

export default ConnectWalletModal
