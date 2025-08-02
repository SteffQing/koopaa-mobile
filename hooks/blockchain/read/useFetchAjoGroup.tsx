import query from '@/lib/fetch'
import { getKoopaProgram } from '@/lib/solana/koopa-exports'
import { useAnchorProvider } from '@/providers/solana-provider'
import { PublicKey } from '@solana/web3.js'
import { useQuery } from '@tanstack/react-query'
import { AjoGroupData } from './classes'

export default function useGetAjoGroup(pda: string) {
  const provider = useAnchorProvider()
  const program = getKoopaProgram(provider)

  return useQuery({
    queryKey: ['ajo-group', pda],
    queryFn: async () => {
      const ajoGroupPDA = new PublicKey(pda)
      const [onchain, offchain] = await Promise.all([
        program.account.ajoGroup.fetch(ajoGroupPDA),
        query.get<Group>(`group/${pda}`),
      ])
      if (offchain.error) throw new Error(offchain.error)
      return new AjoGroupData(onchain, offchain.data!)
    },
    // enabled: !!pda,
  })
}
