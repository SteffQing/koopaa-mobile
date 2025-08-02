'use client'
import { useWalletUi } from '@/components/solana/use-wallet-ui'
import toast from '@/components/toast'
import { AddActivityDataForPayout } from '@/constants/schema'
import query from '@/lib/fetch'
import { getKoopaProgram, getKoopaProgramId } from '@/lib/solana/koopa-exports'
import { useAnchorProvider } from '@/providers/solana-provider'
import { ellipsify } from '@/utils/ellipsify'
import { getAssociatedTokenAddressSync, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { PublicKey } from '@solana/web3.js'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useTransactionToast } from '../../use-transaction-toast'
import { handleOnchainError } from '../helpers/errors'
import useUSDCMint from '../helpers/useUSDCMint'

type Params = {
  ajoGroup: string
  recipient: string
}

export default function usePayout() {
  const provider = useAnchorProvider()
  const { account } = useWalletUi()
  const USDC = useUSDCMint()

  const transactionToast = useTransactionToast()
  const queryClient = useQueryClient()

  const programId = getKoopaProgramId()
  const program = useMemo(() => getKoopaProgram(provider, programId), [provider, programId])

  const userPublicKey = account?.publicKey
  const { mutateAsync: onchainPayout, isPending } = useMutation({
    mutationFn: async (params: Params) => {
      if (!userPublicKey) throw new Error('Wallet not connected')
      const { ajoGroup, recipient } = params

      const recipientPublicKey = new PublicKey(recipient)
      const recipientTokenAccount = getAssociatedTokenAddressSync(USDC, recipientPublicKey)
      const ajoGroupPDA = new PublicKey(ajoGroup)
      const [groupTokenVaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('group-vault'), ajoGroupPDA.toBuffer()],
        programId,
      )

      try {
        // Using the direct Anchor pattern
        const signature = await program.methods
          .payout()
          .accountsStrict({
            ajoGroup: ajoGroupPDA,
            caller: userPublicKey,
            tokenMint: USDC,
            recipient: recipientTokenAccount,
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

  const { mutateAsync: payoutActivity, isPending: loading } = useMutation({
    mutationKey: ['payout-activity-db-call'],
    mutationFn: async (data: AddActivityDataForPayout) => query.patch('activities', { body: data }),
    onSuccess({ ok, error }, { recipient }) {
      if (ok) {
        toast.success(`You have successfully requested a payout to ${ellipsify(recipient)}`)
        queryClient.invalidateQueries({ queryKey: ['activities', recipient] })
      } else {
        toast.error(error ?? 'An error occured while trying to request payout')
      }
    },
    onError(error) {
      toast.error(error.message)
    },
  })

  async function reqestPayout(pda: string, name: string, amount: number, recipient: string) {
    const { signature } = await onchainPayout({ ajoGroup: pda, recipient })
    const joinData: AddActivityDataForPayout = {
      title: `Received contribution from ${name}`,
      type: ActivityType.credit,
      sig: signature,
      amount,
      recipient,
    }
    await payoutActivity(joinData)
  }

  return { reqestPayout, isPending, loading }
}
