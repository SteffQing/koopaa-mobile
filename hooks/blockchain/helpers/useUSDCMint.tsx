import { useCluster } from '@/providers/cluster-provider'
import { PublicKey } from '@solana/web3.js'
import { useMemo } from 'react'

export default function useUSDCMint(): PublicKey {
  const { selectedCluster: cluster } = useCluster()
  return useMemo(() => {
    return cluster.network === 'mainnet-beta'
      ? new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v') // Mainnet
      : new PublicKey('Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr') // Devnet
  }, [cluster.network])
}
