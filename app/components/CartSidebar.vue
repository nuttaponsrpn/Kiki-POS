<script setup lang="ts">
import { Trash2, Minus, Plus } from 'lucide-vue-next'
import type { CartItem } from '~/types'

const { cart, total, updateQuantity, removeFromCart, clearCart } = useCart()
const supabase = useSupabase()

const processing = ref(false)
const showPaymentConfirm = ref(false)

const emit = defineEmits(['close'])

const handleCheckout = () => {
  if (cart.value.length === 0) return
  showPaymentConfirm.value = true
}

const confirmPayment = async (payload: { cashReceived: number, change: number, paymentMethod: 'cash' | 'transfer', discount: number }) => {
  showPaymentConfirm.value = false
  processing.value = true
  try {
    if (!supabase) throw new Error('Supabase client not initialized')

    // Calculate final amount after discount
    const finalAmount = Math.max(0, total.value - payload.discount)

    // 1. Create Order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        total_amount: finalAmount,
        payment_method: payload.paymentMethod,
        discount: payload.discount,
        cash_received: payload.cashReceived,
        change: payload.change
      })
      .select()
      .single()

    if (orderError) throw orderError

    // 2. Create Order Items
    const items = cart.value.map(item => ({
      order_id: order.id,
      product_id: item.product.id,
      quantity: item.quantity,
      price_at_sale: item.product.price
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(items)

    if (itemsError) throw itemsError

    // 3. Update Stock
    for (const item of cart.value) {
      // Fetch latest stock to ensure accuracy
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('stock')
        .eq('id', item.product.id)
        .single()
      
      if (productError) {
        console.error(`Failed to fetch stock for product ${item.product.id}`, productError)
        continue
      }

      const currentStock = productData?.stock || 0
      const newStock = Math.max(0, currentStock - item.quantity)

      const { error: updateError } = await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', item.product.id)
      
      if (updateError) {
        console.error(`Failed to update stock for product ${item.product.id}`, updateError)
      }
    }

    // 4. Refresh Products & Clear Cart
    const { fetchProducts } = useProducts()
    await fetchProducts()
    
    clearCart()
    emit('close')
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    alert('Checkout failed: ' + message)
  } finally {
    processing.value = false
  }
}
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex-1 overflow-auto p-4 space-y-4">
      <div v-if="cart.length > 0" class="flex justify-end mb-2">
        <button 
          @click="clearCart" 
          class="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1"
        >
          <Trash2 class="w-3 h-3" />
          ล้างตะกร้า
        </button>
      </div>

      <div v-if="cart.length === 0" class="text-center text-gray-500 mt-10">
        ตะกร้าว่างเปล่า
      </div>
      
      <div v-for="item in cart" :key="item.product.id" class="flex gap-3 bg-gray-50 p-3 rounded-lg">
        <div class="flex-1 min-w-0">
          <h4 class="font-medium text-sm truncate">{{ item.product.name }}</h4>
          <div class="text-kiki-red font-bold text-sm mt-1">฿{{ item.product.price * item.quantity }}</div>
        </div>
        
        <div class="flex flex-col items-end gap-2">
          <button @click="removeFromCart(item.product.id)" class="text-gray-400 hover:text-red-500 p-1 -mr-1">
            <Trash2 class="w-4 h-4" />
          </button>
          
          <div class="flex items-center bg-white rounded-lg border border-gray-200 shadow-sm">
            <button @click="updateQuantity(item.product.id, -1)" class="p-2 hover:bg-gray-100 active:bg-gray-200 rounded-l-lg touch-manipulation">
              <Minus class="w-4 h-4" />
            </button>
            <span class="px-2 text-sm font-medium min-w-[1.5rem] text-center">{{ item.quantity }}</span>
            <button 
              @click="updateQuantity(item.product.id, 1)" 
              :disabled="item.quantity >= item.product.stock"
              :class="[
                'p-2 rounded-r-lg touch-manipulation',
                item.quantity >= item.product.stock ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100 active:bg-gray-200'
              ]"
            >
              <Plus class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="p-4 border-t border-gray-200 bg-gray-50">
      <div class="flex justify-between items-center mb-4">
        <span class="text-gray-600">รวม</span>
        <span class="text-2xl font-bold text-kiki-red">฿{{ total }}</span>
      </div>
      
      <button 
        @click="handleCheckout" 
        :disabled="cart.length === 0 || processing"
        class="w-full py-3 bg-kiki-yellow text-black rounded-lg font-bold hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ processing ? 'กำลังดำเนินการ...' : 'ชำระเงิน' }}
      </button>
    </div>

    <PaymentModal
      :is-open="showPaymentConfirm"
      :total="total"
      @confirm="confirmPayment"
      @cancel="showPaymentConfirm = false"
    />
  </div>
</template>
