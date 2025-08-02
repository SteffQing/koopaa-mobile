import { useConnection } from '@/providers/solana-provider'
import { getAccount, getAssociatedTokenAddress } from '@solana/spl-token'
import { PublicKey } from '@solana/web3.js'
import useUSDCMint from './useUSDCMint'

export default function useGetAccociatedTokenAccountAndAddress() {
  const connection = useConnection()
  const usdcMint = useUSDCMint()

  const getATAandAccount = async (publicKey: PublicKey) => {
    const ata = await getAssociatedTokenAddress(usdcMint, publicKey)
    const tokenAccount = await getAccount(connection, ata)

    return {
      ata,
      tokenAccount,
    }
  }

  return { usdcMint, getATAandAccount }
}
