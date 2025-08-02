import { useWalletUi } from '@/components/solana/use-wallet-ui'
import { PublicKey } from '@solana/web3.js'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { AjoParticipant } from '../types'
import useKoopaProgram from '../useKooPaaProgram'

const DECIMALS = 1_000_000

type ParsedAjoGroup = {
  pda: PublicKey
  name: string
  securityDeposit: number
  contributionAmount: number
  contributionInterval: number
  payoutInterval: number
  numParticipants: number
  isClosed: boolean
  payoutRound: number
  contributionRound: number
  startTimestamp: number
}

export function useUserAjoGroups() {
  const { account } = useWalletUi()
  const { program } = useKoopaProgram()
  const publicKey = account?.publicKey

  return useQuery({
    queryKey: ['userAjoGroups', publicKey?.toString()],
    queryFn: async () => {
      if (!publicKey || !program) return []

      const allGroups = await program.account.ajoGroup.all()

      const userGroupsWithParticipant = allGroups.map((group) => {
        const participant: AjoParticipant = group.account.participants.find(
          (p: AjoParticipant) => p.pubkey.toBase58() === publicKey.toBase58(),
        )
        if (participant) {
          return {
            group,
            participant,
          }
        }

        return null
      })

      const userGroup = userGroupsWithParticipant.filter((group) => group !== null)

      const parsedGroups: ParsedAjoGroup[] = userGroup.map(({ group, participant }) => {
        const {
          name,
          securityDeposit,
          contributionAmount,
          contributionInterval,
          payoutInterval,
          numParticipants,
          isClosed,
          payoutRound,
          startTimestamp,
        } = group.account

        return {
          pda: group.publicKey,
          name,
          securityDeposit: Number(securityDeposit) / DECIMALS,
          contributionAmount: Number(contributionAmount) / DECIMALS,
          contributionInterval,
          payoutInterval,
          numParticipants,
          isClosed,
          payoutRound,
          contributionRound: participant.contributionRound,
          startTimestamp: Number(startTimestamp), // assuming it's a BN or something castable
        }
      })

      return parsedGroups
    },
    enabled: !!publicKey && !!program,
  })
}

export function useGetUserAjoSavings() {
  const { data } = useUserAjoGroups()
  return useMemo(() => {
    if (!data) return 0
    return data.reduce((acc, group) => acc + group.contributionAmount * group.contributionRound, 0)
  }, [data])
}
