import { claimSOL, claimUSDC } from '@/actions/faucet'
import SOL from '@/assets/coins/solana.png'
import USDC from '@/assets/coins/usdc.png'
import Refresh from '@/assets/svgs/refresh.svg'
import { FormattedBalance } from '@/components/savings-and-wallet/card' // Assume this is your React Native component
import { Button, Checkbox } from '@/components/ui'
import getTheme from '@/constants/theme'
import useFaucetBalance, { useATA } from '@/hooks/blockchain/useFaucet'
import { useTransactionToast } from '@/hooks/use-transaction-toast'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useSession } from '@/hooks/useSession'
import query from '@/lib/fetch'
import { useModal } from '@/providers/modal-provider'
import { Feather } from '@expo/vector-icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native'
import Toast from 'react-native-toast-message'
import { Spinner } from '../skeletons'

interface Claim {
  claimedUSDC: boolean
  claimedSOL: boolean
}

const faucetBalanceStyle = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
  },
  cardContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  card: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  cardText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
})

const FaucetBalance: React.FC = () => {
  const colorScheme = useColorScheme()
  const theme = getTheme(colorScheme || 'light')
  const { data, isLoading, refetch } = useFaucetBalance()
  const [isBalanceCollapsed, setIsBalanceCollapsed] = useState(true)

  return (
    <View style={faucetBalanceStyle.container}>
      <View style={faucetBalanceStyle.header}>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
          onPress={() => setIsBalanceCollapsed(!isBalanceCollapsed)}
        >
          <Text style={[faucetBalanceStyle.headerText, { color: theme.textPrimary }]}>Faucet Balance</Text>

          <Feather
            name="chevron-down"
            size={16}
            style={{ transform: [{ rotate: isBalanceCollapsed ? '-90deg' : '0deg' }] }}
          />
        </TouchableOpacity>
        {!isBalanceCollapsed && (
          <Button variant="ghost" onPress={() => refetch()} disabled={isLoading} style={{ padding: 4 }}>
            <Refresh width={16} height={16} />
          </Button>
        )}
      </View>
      {!isBalanceCollapsed && (
        <>
          {isLoading ? (
            <View style={{ alignItems: 'center' }}>
              <Spinner />
            </View>
          ) : data ? (
            <View style={faucetBalanceStyle.cardContainer}>
              <View
                style={[
                  faucetBalanceStyle.card,
                  { backgroundColor: theme.purpleGradientStart, borderColor: theme.purpleBorder, borderWidth: 1 },
                ]}
              >
                <Image source={SOL} style={{ width: 32, height: 32, borderRadius: 16 }} />
                <Text style={[faucetBalanceStyle.cardText, { color: theme.textPrimary }]}>
                  <FormattedBalance amount={data.solbalance} style={{ fontSize: 12 }} /> SOL
                </Text>
              </View>
              <View
                style={[
                  faucetBalanceStyle.card,
                  { backgroundColor: theme.blueGradientStart, borderColor: theme.blueBorder, borderWidth: 1 },
                ]}
              >
                <Image source={USDC} style={{ width: 32, height: 32, borderRadius: 16 }} />
                <Text style={[faucetBalanceStyle.cardText, { color: theme.textPrimary }]}>
                  <FormattedBalance amount={data.usdcbalance} style={{ fontSize: 12 }} /> USDC
                </Text>
              </View>
            </View>
          ) : (
            <Text style={[faucetBalanceStyle.errorText, { color: theme.textSecondary }]}>Unable to load balance</Text>
          )}
        </>
      )}
    </View>
  )
}

const faucetModalStyle = StyleSheet.create({
  container: {
    padding: 24,
    maxWidth: 448,
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  tokenSection: {
    gap: 16,
    marginBottom: 16,
  },
  tokenHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  tokenCard: {
    padding: 16,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tokenContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tokenText: {
    fontSize: 16,
    fontWeight: '500',
  },
  tokenDescription: {
    fontSize: 14,
  },
  alertSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  claimButton: {
    paddingVertical: 12,
    borderRadius: 8,
  },
  claimedCard: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  claimedTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  claimedText: {
    fontSize: 14,
    textAlign: 'center',
  },
})

const FaucetModal: React.FC = () => {
  const colorScheme = useColorScheme()
  const theme = getTheme(colorScheme || 'light')
  const { session } = useSession()
  const { hideModal } = useModal()
  const transactionToast = useTransactionToast()
  const queryClient = useQueryClient()
  const [, showFaucetGiftIcon] = useLocalStorage('faucet', true)
  const [selectedTokens, setSelectedTokens] = useState<{ usdc: boolean; sol: boolean }>({
    usdc: false,
    sol: false,
  })
  const [claiming, setClaiming] = useState(false)

  const handleTokenSelection = (token: 'usdc' | 'sol', checked: boolean) => {
    setSelectedTokens((prev) => ({ ...prev, [token]: checked }))
  }

  const { data, isLoading } = useQuery({
    queryKey: ['faucet', session],
    queryFn: async () => query.get<Claim>('faucet'),
    select: (data) => {
      if (data.error) hideModal()
      return data.data
    },
  })

  const { data: ok } = useATA()

  const { isPending, mutateAsync } = useMutation({
    mutationKey: ['faucet', selectedTokens.sol, selectedTokens.usdc],
    mutationFn: async (txHashes: [string | false, string | false]) =>
      query.post('faucet', {
        body: {
          claimedUSDC: Boolean(txHashes[1]),
          claimedSOL: Boolean(txHashes[0]),
        },
      }),
    onSuccess: (response, txHashes) => {
      Toast.show({
        type: 'success',
        text1: response.message,
      })
      const [solHash, usdcHash] = txHashes
      if (solHash) transactionToast(solHash)
      if (usdcHash) transactionToast(usdcHash)
    },
  })

  const handleClaim = async () => {
    const { sol, usdc } = selectedTokens
    if (!usdc && !sol) {
      Toast.show({
        type: 'error',
        text1: 'Please select at least one token to claim',
      })
      return
    }
    const to = session!
    try {
      setClaiming(true)
      const hashes = await Promise.all([sol && claimSOL(to, 0.01), usdc && Boolean(ok) && claimUSDC(to, 1000)])
      await mutateAsync(hashes)
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['faucet', session] }),
        queryClient.invalidateQueries({ queryKey: ['usdcBalance', to] }),
      ])
      hideModal()
      showFaucetGiftIcon(false)
      Toast.show({
        type: 'info',
        text1: 'Faucet can always be accessed from the Top up button of your Wallet and Savings card!',
      })
    } catch (error) {
      console.error('Error claiming tokens:', error)
      Toast.show({
        type: 'error',
        text1: 'Failed to claim tokens',
      })
    } finally {
      setClaiming(false)
    }
  }

  return (
    <View style={faucetModalStyle.container}>
      <View style={faucetModalStyle.header}>
        <View style={[faucetModalStyle.iconWrapper, { backgroundColor: theme.orangeGradientStart }]}>
          <Feather name="droplet" size={32} color="white" />
        </View>
        <Text style={[faucetModalStyle.title, { color: theme.textPrimary }]}>KooPaa Solana Faucet</Text>
        <Text style={[faucetModalStyle.subtitle, { color: theme.textSecondary }]}>
          Claim free tokens to get started on KooPaa devnet app
        </Text>
      </View>
      <FaucetBalance />
      {isLoading ? (
        <View style={{ padding: 24, alignItems: 'center' }}>
          <Spinner />
          <Text style={{ color: theme.textSecondary }}>Checking claim status...</Text>
        </View>
      ) : data && data.claimedSOL && data.claimedUSDC ? (
        <View
          style={[
            faucetModalStyle.claimedCard,
            { backgroundColor: theme.greenLight, borderColor: theme.green, borderWidth: 1 },
          ]}
        >
          <Feather name="check-circle" size={48} color={theme.green} />
          <Text style={[faucetModalStyle.claimedTitle, { color: theme.greenDark }]}>Already Claimed!</Text>
          <Text style={[faucetModalStyle.claimedText, { color: theme.green }]}>
            You have already claimed tokens from this faucet. Each wallet can only claim once.
          </Text>
        </View>
      ) : (
        <>
          <View style={faucetModalStyle.tokenSection}>
            <Text style={[faucetModalStyle.tokenHeader, { color: theme.textPrimary }]}>Select tokens to claim:</Text>
            <View
              style={[
                faucetModalStyle.tokenCard,
                {
                  backgroundColor: selectedTokens.usdc ? theme.skeletonBadgeOrange : theme.gray50,
                  borderColor: selectedTokens.usdc ? theme.orange : theme.gray300,
                  borderWidth: 1,
                },
              ]}
            >
              <View style={faucetModalStyle.tokenContent}>
                <Checkbox
                  id="usdc"
                  checked={selectedTokens.usdc}
                  onCheckedChange={(checked) => handleTokenSelection('usdc', checked as boolean)}
                  disabled={data?.claimedUSDC}
                />
                <Image source={USDC} style={{ width: 32, height: 32, borderRadius: 16 }} />
                <View>
                  <Text style={[faucetModalStyle.tokenText, { color: theme.textPrimary }]}>1000 USDC</Text>
                  <Text style={[faucetModalStyle.tokenDescription, { color: theme.textSecondary }]}>
                    USD Coin on Solana
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={[
                faucetModalStyle.tokenCard,
                {
                  backgroundColor: selectedTokens.sol ? theme.skeletonBadgeOrange : theme.gray50,
                  borderColor: selectedTokens.sol ? theme.orange : theme.gray300,
                  borderWidth: 1,
                },
              ]}
            >
              <View style={faucetModalStyle.tokenContent}>
                <Checkbox
                  id="sol"
                  checked={selectedTokens.sol}
                  onCheckedChange={(checked) => handleTokenSelection('sol', checked as boolean)}
                  disabled={data?.claimedSOL}
                />
                <Image source={SOL} style={{ width: 32, height: 32, borderRadius: 16 }} />
                <View>
                  <Text style={[faucetModalStyle.tokenText, { color: theme.textPrimary }]}>0.01 SOL</Text>
                  <Text style={[faucetModalStyle.tokenDescription, { color: theme.textSecondary }]}>
                    Native Solana token
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={[faucetModalStyle.alertSection, { backgroundColor: theme.amber }]}>
            <Feather name="alert-circle" size={18} color={theme.amberDark} />
            <Text style={{ fontSize: 14, color: theme.amberDark }}>
              Each wallet address can only claim either tokens, once. Make sure your wallet is connected to receive the
              tokens.
            </Text>
          </View>
          <Button
            onPress={handleClaim}
            disabled={!session || (!selectedTokens.usdc && !selectedTokens.sol) || !ok}
            loading={isLoading || isPending || claiming}
            style={[faucetModalStyle.claimButton, { backgroundColor: theme.orange, color: '#FFFFFF' }]}
          >
            {`Claim ${selectedTokens.usdc ? '1000 USDC' : ''}${selectedTokens.usdc && selectedTokens.sol ? ' + ' : ''}${selectedTokens.sol ? '0.01 SOL' : ''}`}
          </Button>
        </>
      )}
    </View>
  )
}

export default FaucetModal
