import type { Order } from '~/types'

export const useAnalytics = () => {
  const supabase = useSupabase()
  const loading = ref(false)
  const stats = ref({
    today: 0,
    week: 0,
    month: 0,
    topProducts: [] as { name: string; quantity: number; totalIncome: number }[]
  })

  const fetchStats = async (startDate?: string, endDate?: string) => {
    if (!supabase) return
    loading.value = true
    
    let query = supabase
      .from('orders')
      .select(`
        id,
        total_amount,
        created_at,
        payment_method,
        order_items (
          quantity,
          price_at_sale,
          products (name)
        )
      `)

    if (startDate && endDate) {
      // Adjust endDate to include the full day
      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999)
      query = query.gte('created_at', startDate).lte('created_at', end.toISOString())
    } else {
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
      query = query.gte('created_at', startOfMonth)
    }
    
    const { data, error } = await query

    if (error) {
      console.error('Error fetching stats:', error)
      loading.value = false
      return
    }

    // Cast to unknown first to avoid partial overlap error, then to Order[]
    const orders = data as unknown as Order[]

    // Calculate totals
    let todayTotal = 0
    let weekTotal = 0
    let periodTotal = 0
    const productSales: Record<string, { quantity: number; totalIncome: number }> = {}

    const now = new Date()
    const todayStr = now.toISOString().split('T')[0]
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    orders.forEach(order => {
      const orderDate = new Date(order.created_at)
      const amount = Number(order.total_amount)

      // Period Total (whatever was fetched)
      periodTotal += amount

      // Week Total (only relevant if we are looking at recent data)
      if (orderDate >= oneWeekAgo) {
        weekTotal += amount
      }

      // Today Total
      if (order.created_at.startsWith(todayStr)) {
        todayTotal += amount
      }

      // Top Products
      if (order.order_items) {
        order.order_items.forEach(item => {
          const productName = item.products?.name ?? 'Unknown'
          if (!productSales[productName]) {
            productSales[productName] = { quantity: 0, totalIncome: 0 }
          }
          productSales[productName].quantity += item.quantity
          productSales[productName].totalIncome += item.quantity * (item.price_at_sale || 0)
        })
      }
    })

    // Sort top products
    const sortedProducts = Object.entries(productSales)
      .map(([name, data]) => ({ 
        name, 
        quantity: data.quantity,
        totalIncome: data.totalIncome
      }))
      .sort((a, b) => b.quantity - a.quantity)

    stats.value = {
      today: todayTotal,
      week: weekTotal,
      month: periodTotal, // We'll use 'month' property to store the total of the selected period
      topProducts: sortedProducts
    }
    
    loading.value = false
  }

  return {
    stats,
    loading,
    fetchStats
  }
}
