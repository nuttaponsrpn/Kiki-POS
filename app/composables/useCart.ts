import type { CartItem, Product } from '~/types'

export const useCart = (): {
  cart: Ref<CartItem[]>
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, delta: number) => void
  clearCart: () => void
  total: ComputedRef<number>
} => {
  const cart = useState<CartItem[]>('cart', () => [])
  
  const { showAlert } = useAlert()

  const addToCart = (product: Product) => {
    const existing = cart.value.find(item => item.product.id === product.id)
    if (existing) {
      if (existing.quantity < product.stock) {
        existing.quantity++
      } else {
        showAlert('สินค้าหมด', 'สินค้าหมดสต็อกแล้ว', 'error')
      }
    } else {
      if (product.stock > 0) {
        cart.value.push({ product, quantity: 1 })
      } else {
        showAlert('สินค้าหมด', 'สินค้าหมดสต็อกแล้ว', 'error')
      }
    }
  }

  const removeFromCart = (productId: string) => {
    cart.value = cart.value.filter(item => item.product.id !== productId)
  }

  const updateQuantity = (productId: string, delta: number) => {
    const item = cart.value.find(item => item.product.id === productId)
    if (item) {
      const newQuantity = item.quantity + delta
      if (newQuantity > item.product.stock) {
        showAlert('สินค้าหมด', 'สินค้าหมดสต็อกแล้ว', 'error')
        return
      }
      
      item.quantity = newQuantity
      if (item.quantity <= 0) {
        removeFromCart(productId)
      }
    }
  }

  const clearCart = () => {
    cart.value = []
  }

  const total = computed(() => {
    return cart.value.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  })

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total
  }
}
