'use client'
import { useWalletUi } from '@/components/solana/use-wallet-ui'
import toast from '@/components/toast'
import { AddActivityData } from '@/constants/schema'
import query from '@/lib/fetch'
import { getKoopaProgram, getKoopaProgramId } from '@/lib/solana/koopa-exports'
import { useAnchorProvider } from '@/providers/solana-provider'
import { getAssociatedTokenAddressSync, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { PublicKey } from '@solana/web3.js'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useTransactionToast } from '../../use-transaction-toast'
import { handleOnchainError } from '../helpers/errors'
import useUSDCMint from '../helpers/useUSDCMint'

export default function useClaimRefund() {
  const provider = useAnchorProvider()
  const { account } = useWalletUi()
  const USDC = useUSDCMint()

  const transactionToast = useTransactionToast()
  const queryClient = useQueryClient()

  const programId = getKoopaProgramId()
  const program = useMemo(() => getKoopaProgram(provider, programId), [provider, programId])

  const userPublicKey = account?.publicKey
  const { mutateAsync: requestRefund, isPending } = useMutation({
    mutationFn: async (ajoGroup: string) => {
      if (!userPublicKey) throw new Error('Wallet not connected')

      const participantTokenAccount = getAssociatedTokenAddressSync(USDC, userPublicKey)
      const ajoGroupPDA = new PublicKey(ajoGroup)
      const [groupTokenVaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('group-vault'), ajoGroupPDA.toBuffer()],
        programId,
      )
      try {
        const signature = await program.methods
          .claimRefund()
          .accountsStrict({
            ajoGroup: ajoGroupPDA,
            participant: userPublicKey,
            tokenMint: USDC,
            participantTokenAccount,
            groupTokenVault: groupTokenVaultPda,
            tokenProgram: TOKEN_PROGRAM_ID,
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

  const { mutateAsync: refundActivity, isPending: loading } = useMutation({
    mutationKey: ['refund-activity-db-call'],
    mutationFn: async (data: AddActivityData) => query.post('activities', { body: data }),
    onSuccess({ ok, error }) {
      if (ok) {
        toast.success('Refund has been successfully claimed')
        queryClient.invalidateQueries({
          queryKey: ['activities', userPublicKey?.toBase58()],
        })
      } else {
        toast.error(error ?? 'An error occured while trying to claim refund')
      }
    },
    onError(error) {
      toast.error(error.message)
    },
  })

  async function claimRefund(pda: string, name: string, amount: number) {
    const { signature } = await requestRefund(pda)
    const joinData: AddActivityData = {
      title: `Received refunds from ${name}`,
      type: ActivityType.credit,
      sig: signature,
      amount,
      group_pda: pda,
    }
    await refundActivity(joinData)
  }

  return { claimRefund, isPending, loading }
}
