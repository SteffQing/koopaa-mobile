'use client'
import { useWalletUi } from '@/components/solana/use-wallet-ui'
import toast from '@/components/toast'
import { CreateAjoGroupFormValues, CreatedAjoGroup } from '@/constants/schema'
import query from '@/lib/fetch'
import { BN } from '@coral-xyz/anchor'
import { getAssociatedTokenAddressSync, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from '@solana/web3.js'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { useCallback, useMemo } from 'react'
import { useTransactionToast } from '../../use-transaction-toast'
import { handleOnchainError } from '../helpers/errors'
import useUSDCMint from '../helpers/useUSDCMint'
import useKoopaProgram from '../useKooPaaProgram'

const DECIMALS = 10 ** 6

export default function useCreateAjoGroup() {
  const { programId, program } = useKoopaProgram()
  const { account } = useWalletUi()
  const transactionToast = useTransactionToast()
  const USDC = useUSDCMint()

  const queryClient = useQueryClient()
  const router = useRouter()

  const [globalStatePDA] = useMemo(
    () => PublicKey.findProgramAddressSync([Buffer.from('global-state')], programId),
    [programId],
  )

  const findAjoGroupPDA = useCallback(
    (name: string) => {
      return PublicKey.findProgramAddressSync([Buffer.from('ajo-group'), Buffer.from(name)], programId)
    },
    [programId],
  )

  const userPublicKey = account?.publicKey
  const { mutateAsync: blockCreate, isPending } = useMutation({
    mutationFn: async (params: CreateAjoGroupFormValues) => {
      if (!userPublicKey) throw new Error('Wallet not connected')
      if (!program) throw new Error('Program not found')

      const { name, contribution_amount, security_deposit, max_participants, contribution_interval, payout_interval } =
        params

      const [ajoGroupPDA] = findAjoGroupPDA(name)
      const contributionAmount = new BN(contribution_amount * DECIMALS)
      const securityDeposit = new BN(security_deposit * DECIMALS)

      const creatorTokenAccount = getAssociatedTokenAddressSync(USDC, userPublicKey)

      const [groupTokenVaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('group-vault'), ajoGroupPDA.toBuffer()],
        programId,
      )

      try {
        const signature = await program.methods
          .createAjoGroup(
            name,
            securityDeposit,
            contributionAmount,
            Number(contribution_interval),
            Number(payout_interval),
            max_participants,
          )
          .accountsStrict({
            ajoGroup: ajoGroupPDA,
            creator: userPublicKey,
            globalState: globalStatePDA,
            tokenMint: USDC,
            creatorTokenAccount,
            groupTokenVault: groupTokenVaultPda,
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
            rent: SYSVAR_RENT_PUBKEY,
          })
          .rpc()

        transactionToast(signature)

        return { signature, ajoGroupPDA }
      } catch (error) {
        handleOnchainError(error)
        throw error
      }
    },
    mutationKey: ['create-ajo-group-block-call', userPublicKey?.toBase58()],
  })

  const { mutateAsync: dbCreate, isPending: loading } = useMutation({
    mutationKey: ['create-ajo-group-db-call'],
    mutationFn: async (createdAjoGroup: CreatedAjoGroup) => query.post('group', { body: createdAjoGroup }),
    onSuccess({ message, error }, { pda }) {
      if (message) {
        toast.success(message)
        queryClient.invalidateQueries({
          queryKey: ['activities', userPublicKey?.toBase58()],
        })
        // router.replace('/(tabs)/savings/ajo/page', {
        //   params: {
        //     pda,
        //   },
        // })
      } else {
        toast.error(error ?? 'An error occured while trying to create Ajo Group')
      }
    },
    onError(error) {
      toast.error(error.message)
    },
  })

  async function createAjoGroup(data: CreateAjoGroupFormValues) {
    const { ajoGroupPDA, signature } = await blockCreate(data)
    const createdData = { ...data, pda: ajoGroupPDA.toBase58(), signature }
    await dbCreate(createdData)
  }

  return { createAjoGroup, isPending, loading }
}
