'use client'

import { getKoopaProgram, getKoopaProgramId } from '@/lib/solana/koopa-exports'
import { useAnchorProvider } from '@/providers/solana-provider'
import { useMemo } from 'react'

export default function useKoopaProgram() {
  const provider = useAnchorProvider()

  const programId = getKoopaProgramId()

  const program = useMemo(() => {
    if (!provider || !programId) return null
    return getKoopaProgram(provider, programId)
  }, [provider, programId])

  return {
    program,
    programId,
  }
}
