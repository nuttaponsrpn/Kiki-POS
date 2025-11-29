<script setup lang="ts">
import { Trash2, Minus, Plus } from 'lucide-vue-next'
import type { CartItem } from '~/types'

const { cart, total, updateQuantity, removeFromCart, clearCart } = useCart()
const supabase = useSupabase()

const processing = ref(false)
const showPaymentConfirm = ref(false)

const handleCheckout = () => {
  if (cart.value.length === 0) return
  showPaymentConfirm.value = true
}

const confirmPayment = async () => {
  showPaymentConfirm.value = false
  processing.value = true
  try {
    if (!supabase) throw new Error('Supabase client not initialized')

    // 1. Create Order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        total_amount: total.value,
        payment_method: 'cash' // Default for now
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

    // 3. Update Stock (Optional, but good)
    // For simplicity, we skip atomic stock updates in this batch, 
    // but in real app we should use RPC or iterate.
    for (const item of cart.value) {
      const newStock = item.product.stock - item.quantity
      await supabase.from('products').update({ stock: newStock }).eq('id', item.product.id)
    }

    clearCart()
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
          Clear All
        </button>
      </div>

      <div v-if="cart.length === 0" class="text-center text-gray-500 mt-10">
        Cart is empty
      </div>
      
      <div v-for="item in cart" :key="item.product.id" class="flex gap-4 bg-gray-50 p-3 rounded-lg">
        <div class="flex-1">
          <h4 class="font-medium text-sm">{{ item.product.name }}</h4>
          <div class="text-kiki-red font-bold text-sm">${{ item.product.price * item.quantity }}</div>
        </div>
        
        <div class="flex flex-col items-end gap-2">
          <button @click="removeFromCart(item.product.id)" class="text-gray-400 hover:text-red-500">
            <Trash2 class="w-4 h-4" />
          </button>
          
          <div class="flex items-center bg-white rounded border border-gray-200">
            <button @click="updateQuantity(item.product.id, -1)" class="p-1 hover:bg-gray-100">
              <Minus class="w-3 h-3" />
            </button>
            <span class="px-2 text-sm font-medium">{{ item.quantity }}</span>
            <button @click="updateQuantity(item.product.id, 1)" class="p-1 hover:bg-gray-100">
              <Plus class="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="p-4 border-t border-gray-200 bg-gray-50">
      <div class="flex justify-between items-center mb-4">
        <span class="text-gray-600">Total</span>
        <span class="text-2xl font-bold text-kiki-red">${{ total }}</span>
      </div>
      
      <button 
        @click="handleCheckout" 
        :disabled="cart.length === 0 || processing"
        class="w-full py-3 bg-kiki-yellow text-black rounded-lg font-bold hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ processing ? 'Processing...' : 'Charge' }}
      </button>
    </div>

    <ConfirmModal
      v-if="showPaymentConfirm"
      title="Confirm Payment"
      :message="`Are you sure you want to process the payment of $${total}?`"
      confirm-text="Confirm Payment"
      type="warning"
      @confirm="confirmPayment"
      @cancel="showPaymentConfirm = false"
    />
  </div>
</template>
