import type { Order } from '~/types'

export const useOrders = (): {
  orders: Ref<Order[]>
  loading: Ref<boolean>
  error: Ref<string | null>
  fetchOrders: () => Promise<void>
  deleteOrder: (id: string) => Promise<void>
} => {
  const supabase = useSupabase()
  const orders = ref<Order[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchOrders = async () => {
    if (!supabase) return
    loading.value = true
    
    // Fetch orders with items
    const { data, error: err } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (name)
        )
      `)
      .order('created_at', { ascending: false })
    
    if (err) error.value = err.message
    else orders.value = data as Order[]
    loading.value = false
  }

  const deleteOrder = async (id: string) => {
    if (!supabase) return
    
    // 1. Find order to get items for stock restoration
    const order = orders.value.find(o => o.id === id)
    
    if (order?.order_items) {
      // Restore stock for each item
      for (const item of order.order_items) {
        if (item.product_id) {
          const { data: product } = await supabase
            .from('products')
            .select('stock')
            .eq('id', item.product_id)
            .single()
            
          if (product) {
            await supabase
              .from('products')
              .update({ stock: product.stock + item.quantity })
              .eq('id', item.product_id)
          }
        }
      }
    }

    // 2. Delete the order
    const { error: err } = await supabase
      .from('orders')
      .delete()
      .eq('id', id)

    if (err) throw err
    orders.value = orders.value.filter(o => o.id !== id)
  }

  return {
    orders,
    loading,
    error,
    fetchOrders,
    deleteOrder
  }
}
