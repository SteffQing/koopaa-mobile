'use client'
import { useWalletUi } from '@/components/solana/use-wallet-ui'
import toast from '@/components/toast'
import { AddActivityData } from '@/constants/schema'
import query from '@/lib/fetch'
import { getKoopaProgram, getKoopaProgramId } from '@/lib/solana/koopa-exports'
import { useAnchorProvider } from '@/providers/solana-provider'
import { getAssociatedTokenAddressSync, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { PublicKey, SystemProgram } from '@solana/web3.js'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useTransactionToast } from '../../use-transaction-toast'
import { handleOnchainError } from '../helpers/errors'
import useUSDCMint from '../helpers/useUSDCMint'

export default function useContribute() {
  const provider = useAnchorProvider()
  const { account } = useWalletUi()
  const USDC = useUSDCMint()

  const transactionToast = useTransactionToast()
  const queryClient = useQueryClient()

  const programId = getKoopaProgramId()
  const program = useMemo(() => getKoopaProgram(provider, programId), [provider, programId])

  const userPublicKey = account?.publicKey
  const { mutateAsync: contributeOnchain, isPending } = useMutation({
    mutationFn: async (ajoGroup: string) => {
      if (!userPublicKey) throw new Error('Wallet not connected')

      const contributorTokenAccount = getAssociatedTokenAddressSync(USDC, userPublicKey)
      const ajoGroupPDA = new PublicKey(ajoGroup)
      const [groupTokenVaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('group-vault'), ajoGroupPDA.toBuffer()],
        programId,
      )

      try {
        // Using the direct Anchor pattern
        const signature = await program.methods
          .contribute()
          .accountsStrict({
            ajoGroup: ajoGroupPDA,
            contributor: userPublicKey,
            tokenMint: USDC,
            contributorTokenAccount,
            groupTokenVault: groupTokenVaultPda,
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          })
          .rpc()

        // Show toast notification
        transactionToast(signature)

        // Invalidate queries to refresh data
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

  const { mutateAsync: contributeActivity, isPending: loading } = useMutation({
    mutationKey: ['contribute-activity-db-call'],
    mutationFn: async (data: AddActivityData) => query.post('activities', { body: data }),
    onSuccess({ ok, error }) {
      if (ok) {
        toast.success('Successful contribution made')
        queryClient.invalidateQueries({
          queryKey: ['activities', userPublicKey?.toBase58()],
        })
      } else {
        toast.error(error ?? 'An error occured while trying to contribute')
      }
    },
    onError(error) {
      toast.error(error.message)
    },
  })

  async function contribute(pda: string, name: string, amount: number) {
    const { signature } = await contributeOnchain(pda)
    const joinData: AddActivityData = {
      title: `Send money to ${name}`,
      type: ActivityType.transfer,
      sig: signature,
      amount,
      group_pda: pda,
    }
    await contributeActivity(joinData)
  }

  return { contribute, isPending, loading }
}
