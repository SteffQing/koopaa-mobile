'use client'
import { useWalletUi } from '@/components/solana/use-wallet-ui'
import toast from '@/components/toast'
import { JoinAjoGroup } from '@/constants/schema'
import query from '@/lib/fetch'
import { getKoopaProgram, getKoopaProgramId } from '@/lib/solana/koopa-exports'
import { useAnchorProvider } from '@/providers/solana-provider'
import { getAssociatedTokenAddressSync, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { PublicKey, SystemProgram } from '@solana/web3.js'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { useMemo } from 'react'
import { useTransactionToast } from '../../use-transaction-toast'
import { handleOnchainError } from '../helpers/errors'
import useUSDCMint from '../helpers/useUSDCMint'

export default function useJoinAjoGroup() {
  const provider = useAnchorProvider()
  const { account } = useWalletUi()
  const USDC = useUSDCMint()

  const router = useRouter()
  const transactionToast = useTransactionToast()
  const queryClient = useQueryClient()

  const programId = getKoopaProgramId()
  const program = useMemo(() => getKoopaProgram(provider, programId), [provider, programId])

  const [globalStatePDA] = useMemo(
    () => PublicKey.findProgramAddressSync([Buffer.from('global-state')], programId),
    [programId],
  )

  const userPublicKey = account?.publicKey
  // Join an existing Ajo group
  const { mutateAsync: joinOnchain, isPending } = useMutation({
    mutationFn: async (ajoGroup: string) => {
      if (!userPublicKey) throw new Error('Wallet not connected')

      const participantTokenAccount = getAssociatedTokenAddressSync(USDC, userPublicKey)
      const ajoGroupPDA = new PublicKey(ajoGroup)
      const [groupTokenVaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('group-vault'), ajoGroupPDA.toBuffer()],
        programId,
      )

      try {
        // Using the direct Anchor pattern
        const signature = await program.methods
          .joinAjoGroup()
          .accountsStrict({
            ajoGroup: ajoGroupPDA,
            participant: userPublicKey,
            globalState: globalStatePDA,
            tokenMint: USDC,
            participantTokenAccount,
            groupTokenVault: groupTokenVaultPda,
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          })
          .rpc()

        // Show toast notification
        transactionToast(signature)
        queryClient.invalidateQueries({
          queryKey: ['ajo-group', ajoGroup],
        })

        return { signature }
      } catch (error) {
        handleOnchainError(error)
        throw error
      }
    },
  })

  const { mutateAsync: dbJoin, isPending: loading } = useMutation({
    mutationKey: ['join-ajo-group-db-call'],
    mutationFn: async (ajoGroupdata: JoinAjoGroup) => query.put('group', { body: ajoGroupdata }),
    onSuccess({ message, error }, { pda }) {
      if (message) {
        toast.success(message)
        queryClient.invalidateQueries({ queryKey: ['ajo-group', pda] })
        queryClient.invalidateQueries({ queryKey: ['ajo-group-members', pda] })
        // router.replace(`/(tabs)/savings/ajo/page`, {
        //   params: {
        //     pda,
        //   },
        // })
      } else {
        toast.error(error ?? 'An error occured while trying to join Ajo Group')
      }
    },
    onError(error) {
      toast.error(error.message)
    },
  })

  async function joinAjoGroup(pda: string, name: string, amount: number) {
    const { signature } = await joinOnchain(pda)
    const joinData: JoinAjoGroup = {
      name,
      pda,
      signature,
      security_deposit: amount,
    }
    await dbJoin(joinData)
  }

  return { joinAjoGroup, isPending, loading }
}
