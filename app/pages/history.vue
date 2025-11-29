<script setup lang="ts">
import { Calendar, ChevronDown, ChevronUp, Trash2 } from 'lucide-vue-next'

const { orders, loading, fetchOrders, deleteOrder } = useOrders()
const expandedOrders = ref(new Set())

onMounted(() => {
  fetchOrders()
})

const toggleExpand = (id: string) => {
  if (expandedOrders.value.has(id)) {
    expandedOrders.value.delete(id)
  } else {
    expandedOrders.value.add(id)
  }
}

// Modified handleDelete to open the modal
const handleDelete = (id: string, event: Event) => {
  event.stopPropagation() // Prevent row expansion
  orderToDelete.value = id
  showDeleteConfirm.value = true
}

// New function to confirm deletion
const confirmDelete = async () => {
  if (orderToDelete.value) {
    try {
      await deleteOrder(orderToDelete.value)
      showDeleteConfirm.value = false
      orderToDelete.value = null
    } catch (e: any) {
      alert('Failed to delete order: ' + e.message)
    }
  }
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString()
}

const showDeleteConfirm = ref(false)
const orderToDelete = ref<string | null>(null)
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Sales History</h1>

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left min-w-[600px]">
        <thead class="bg-gray-50 text-gray-600 uppercase text-xs">
          <tr>
            <th class="px-6 py-3">Date</th>
            <th class="px-6 py-3">Order ID</th>
            <th class="px-6 py-3">Payment</th>
            <th class="px-6 py-3 text-right">Total</th>
            <th class="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-if="loading" class="text-center py-4">
            <td colspan="5" class="px-6 py-4">Loading...</td>
          </tr>
          <tr v-else-if="orders.length === 0">
            <td colspan="5" class="px-6 py-4 text-center text-gray-500">ไม่พบรายการขาย</td>
          </tr>
          <template v-for="order in orders" :key="order.id">
            <tr class="hover:bg-gray-50 cursor-pointer" @click="toggleExpand(order.id)">
              <td class="px-6 py-4 text-gray-900">
                {{ formatDate(order.created_at) }}
              </td>
              <td class="px-6 py-4 text-gray-500 font-mono text-xs">
                {{ order.id.slice(0, 8) }}...
              </td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  {{ order.payment_method }}
                </span>
              </td>
              <td class="px-6 py-4 text-right font-bold text-gray-900">
                ${{ order.total_amount }}
              </td>
              <td class="px-6 py-4 text-right text-gray-400 space-x-2">
                <button 
                  @click="handleDelete(order.id, $event)" 
                  class="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete Order"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
                <span class="inline-block">
                  <ChevronUp v-if="expandedOrders.has(order.id)" class="w-4 h-4" />
                  <ChevronDown v-else class="w-4 h-4" />
                </span>
              </td>
            </tr>
            <!-- Expanded Details -->
            <tr v-if="expandedOrders.has(order.id)" class="bg-gray-50">
              <td colspan="5" class="px-6 py-4">
                <div class="text-sm text-gray-600 mb-2 font-medium">Order Items:</div>
                <ul class="space-y-1 pl-4">
                  <li v-for="item in order.order_items" :key="item.id" class="flex justify-between text-sm">
                    <span>
                      {{ item.quantity }}x {{ item.products?.name || 'Unknown Product' }}
                    </span>
                    <span>${{ item.price_at_sale * item.quantity }}</span>
                  </li>
                </ul>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
      </div>
    </div>

    <ConfirmModal
      v-if="showDeleteConfirm"
      title="ลบรายการขาย"
      message="คุณต้องการลบรายการขายหรือไม่?"
      confirm-text="ลบ"
      type="danger"
      @confirm="confirmDelete"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>
