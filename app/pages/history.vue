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
  return new Date(dateString).toLocaleDateString()
}

const formatTime = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString()
}

const showDeleteConfirm = ref(false)
const orderToDelete = ref<string | null>(null)
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">ประวัติการขาย</h1>

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
      <table class="w-full text-left">
        <thead class="bg-gray-50 text-gray-600 uppercase text-xs">
          <tr>
            <th class="pl-4 py-2 w-[130px]">วันที่</th>
            <th class="pl-4 py-2 text-left">ยอดรวม</th>
            <th class="px-4 py-2 w-[60px]"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-if="loading" class="text-center py-4">
            <td colspan="3" class="px-4 py-2">กำลังโหลดรายการ...</td>
          </tr>
          <tr v-else-if="orders.length === 0">
            <td colspan="3" class="px-4 py-2 text-center text-gray-500">ไม่พบรายการขาย</td>
          </tr>
          <template v-for="order in orders" :key="order.id">
            <tr class="hover:bg-gray-50 cursor-pointer" @click="toggleExpand(order.id)">
              <td class="pl-4 py-2 text-gray-900 align-top">
                <div class="font-medium">{{ formatDate(order.created_at) }}</div>
                <div class="text-xs text-gray-500">{{ formatTime(order.created_at) }}</div>
              </td>
              <td class="pl-4 py-2 text-left align-top">
                <div class="flex flex-col items-start gap-1">
                  <span class="font-bold text-gray-900 text-lg">฿{{ order.total_amount }}</span>
                  <span v-if="(order.discount || 0) > 0" class="text-xs text-red-500 font-medium">
                    ส่วนลด -฿{{ order.discount }}
                  </span>
                  <span class="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-green-100 text-green-800 mt-1">
                    {{ order.payment_method === 'transfer' ? 'เงินโอน' : 'เงินสด' }}
                  </span>
                </div>
              </td>
              <td class="px-4 py-2 align-middle border-l border-gray-200">
                <div class="flex items-center gap-3 justify-center">
                   <button 
                    @click="handleDelete(order.id, $event)" 
                    class="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete Order"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                  <span class="inline-block text-gray-400">
                    <ChevronUp v-if="expandedOrders.has(order.id)" class="w-4 h-4" />
                    <ChevronDown v-else class="w-4 h-4" />
                  </span>
                </div>
              </td>
            </tr>
            <!-- Expanded Details -->
            <tr v-if="expandedOrders.has(order.id)" class="bg-gray-50">
              <td colspan="3" class="px-4 py-2">
                <div class="text-sm text-gray-600 mb-2 font-medium">Order Items:</div>
                <ul class="space-y-1 pl-4">
                  <li v-for="item in order.order_items" :key="item.id" class="flex justify-between text-sm">
                    <span>
                      {{ item.quantity }}x {{ item.products?.name || 'Unknown Product' }}
                    </span>
                    <span>฿{{ item.price_at_sale * item.quantity }}</span>
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
