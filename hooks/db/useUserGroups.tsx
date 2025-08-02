import { useWalletUi } from '@/components/solana/use-wallet-ui'
import query from '@/lib/fetch'
import { useQuery } from '@tanstack/react-query'

export type GroupAndParticipants = Group & { participants: User[] }

export default function useUserGroups() {
  const { account } = useWalletUi()
  const publicKey = account?.publicKey
  return useQuery({
    queryKey: ['ajo-groups', publicKey?.toBase58()],
    queryFn: async () =>
      await query.get<{
        avbl_groups: GroupAndParticipants[]
        joined_groups: GroupAndParticipants[]
      }>('group'),
    select: (data) => data.data,
    enabled: Boolean(publicKey?.toBase58()),
  })
}
