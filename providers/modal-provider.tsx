import { useState, useEffect } from 'react'
import { StyleSheet, View, TouchableOpacity, Keyboard } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated'
import Modal from 'react-native-modal'
import { createContext, useContext } from 'react'
import getTheme from '@/constants/theme'
import XIcon from '@/assets/svgs/x.svg'

type ModalContextType = {
  showModal: (content: React.ReactNode, options?: ModalOptions) => void
  hideModal: () => void
  isOpen: boolean
}

type ModalOptions = {
  closeOnClickOutside?: boolean
  showCloseButton?: boolean
  position?: 'bottom' | 'center'
  onClose?: () => void
}

const defaultOptions: ModalOptions = {
  closeOnClickOutside: true,
  showCloseButton: true,
  position: 'center',
  onClose: undefined,
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export const useModal = () => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider')
  }
  return context
}

const modalProviderStyle = StyleSheet.create({
  container: {
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modal: {
    margin: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    padding: 4,
    borderRadius: 24,
  },
})

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modalContent, setModalContent] = useState<React.ReactNode | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState<ModalOptions>(defaultOptions)
  const theme = getTheme('light') // Adjust based on useColorScheme if needed

  const backdropOpacity = useSharedValue(0)
  const modalY = useSharedValue(options.position === 'bottom' ? 100 : 0)
  const modalScale = useSharedValue(options.position === 'center' ? 0.8 : 1)

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }))

  const modalAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: modalY.value }, { scale: modalScale.value }],
  }))

  const showModal = (content: React.ReactNode, customOptions?: ModalOptions) => {
    setModalContent(content)
    setOptions({ ...defaultOptions, ...customOptions })
    setIsOpen(true)
    backdropOpacity.value = withTiming(1, { duration: 200 })
    modalY.value = withSpring(customOptions?.position === 'bottom' ? 0 : 0, { damping: 25, stiffness: 300 })
    modalScale.value = withSpring(customOptions?.position === 'center' ? 1 : 1, { damping: 25, stiffness: 300 })
  }

  const hideModal = () => {
    backdropOpacity.value = withTiming(0, { duration: 200 })
    modalY.value = withTiming(options.position === 'bottom' ? 100 : 0, { duration: 200 })
    modalScale.value = withTiming(options.position === 'center' ? 0.8 : 1, { duration: 200 })
    setTimeout(() => {
      setIsOpen(false)
      setModalContent(null)
      if (options.onClose) {
        options.onClose()
      }
    }, 300)
  }

  useEffect(() => {
    const handleEscape = Keyboard.addListener('keyboardDidHide', () => {
      if (isOpen) {
        hideModal()
      }
    })
    return () => handleEscape.remove()
  }, [isOpen])

  return (
    <ModalContext.Provider value={{ showModal, hideModal, isOpen }}>
      <View style={modalProviderStyle.container}>
        {children}
        <Modal
          isVisible={isOpen}
          onBackdropPress={options.closeOnClickOutside ? hideModal : undefined}
          style={[modalProviderStyle.modal, { justifyContent: options.position === 'bottom' ? 'flex-end' : 'center' }]}
          backdropOpacity={0} // Controlled by Animated.View
        >
          <Animated.View style={[modalProviderStyle.backdrop, backdropAnimatedStyle]}>
            <Animated.View
              style={[modalProviderStyle.modal, { backgroundColor: theme.background }, modalAnimatedStyle]}
            >
              {options.showCloseButton && (
                <TouchableOpacity
                  onPress={hideModal}
                  style={[modalProviderStyle.closeButton, { backgroundColor: theme.gray100 }]}
                >
                  <XIcon width={24} height={24} />
                </TouchableOpacity>
              )}
              {modalContent}
            </Animated.View>
          </Animated.View>
        </Modal>
      </View>
    </ModalContext.Provider>
  )
}
