'use client'
import { useQuery } from '@tanstack/react-query'
// import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletUi } from '@/components/solana/use-wallet-ui'
import useGetAccociatedTokenAccountAndAddress from './helpers/useGetATA'

export default function useUSDCBalance() {
  // const { publicKey } = useWallet()
  const { account } = useWalletUi()
  const { getATAandAccount } = useGetAccociatedTokenAccountAndAddress()

  return useQuery({
    queryKey: ['usdcBalance', account?.publicKey?.toBase58()],
    enabled: !!account?.publicKey,
    queryFn: async () => {
      if (!account?.publicKey) throw new Error('Wallet not connected')

      const { tokenAccount } = await getATAandAccount(account?.publicKey)
      const balance = Number(tokenAccount.amount) / 10 ** 6

      return balance
    },
  })
}
