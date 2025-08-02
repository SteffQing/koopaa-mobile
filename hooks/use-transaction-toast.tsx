import Toast from 'react-native-toast-message'

export function useTransactionToast() {
  return (signature: string) => {
    Toast.show({
      type: 'success',
      text1: 'Transaction sent',
      //   description: <ExplorerLink transaction={signature} label="View Transaction" />,
    })
  }
}
