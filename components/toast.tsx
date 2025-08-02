import Toast, { ToastProps } from 'react-native-toast-message'

const toast = {
  error: (message: string, options: ToastProps = {}) => {
    Toast.show({
      type: 'error',
      text1: message,
      ...options,
    })
  },
  success: (message: string, options: ToastProps = {}) => {
    Toast.show({
      type: 'success',
      text1: message,
      ...options,
    })
  },
  info: (message: string, options: ToastProps = {}) => {
    Toast.show({
      type: 'info',
      text1: message,
      ...options,
    })
  },
}

export default toast
