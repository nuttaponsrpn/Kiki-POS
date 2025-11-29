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
  
  const addToCart = (product: Product) => {
    const existing = cart.value.find(item => item.product.id === product.id)
    if (existing) {
      existing.quantity++
    } else {
      cart.value.push({ product, quantity: 1 })
    }
  }

  const removeFromCart = (productId: string) => {
    cart.value = cart.value.filter(item => item.product.id !== productId)
  }

  const updateQuantity = (productId: string, delta: number) => {
    const item = cart.value.find(item => item.product.id === productId)
    if (item) {
      item.quantity += delta
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
