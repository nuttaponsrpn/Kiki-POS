export const useAlert = () => {
  const isOpen = useState<boolean>('alert-is-open', () => false)
  const title = useState<string>('alert-title', () => '')
  const message = useState<string>('alert-message', () => '')
  const type = useState<'info' | 'success' | 'error' | 'warning'>('alert-type', () => 'info')

  const showAlert = (newTitle: string, newMessage: string, newType: 'info' | 'success' | 'error' | 'warning' = 'info') => {
    title.value = newTitle
    message.value = newMessage
    type.value = newType
    isOpen.value = true
  }

  const closeAlert = () => {
    isOpen.value = false
  }

  return {
    isOpen,
    title,
    message,
    type,
    showAlert,
    closeAlert
  }
}
