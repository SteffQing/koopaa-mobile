import { PropsWithChildren } from 'react'
import AuthProvider from './auth-provider'
import ClusterProvider from './cluster-provider'
import ModalProvider from './modal-provider'
import ReactQueryProvider from './react-query-provider'
import SolanaProvider from './solana-provider'
import AppThemeProvider from './theme-provider'

export default function AppProviders({ children }: PropsWithChildren) {
  return (
    <AppThemeProvider>
      <ReactQueryProvider>
        <ClusterProvider>
          <SolanaProvider>
            <AuthProvider>
              <ModalProvider>{children}</ModalProvider>
            </AuthProvider>
          </SolanaProvider>
        </ClusterProvider>
      </ReactQueryProvider>
    </AppThemeProvider>
  )
}
