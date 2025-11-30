<script setup lang="ts">
import { Calendar, ChevronDown, ChevronUp, Trash2, Filter } from 'lucide-vue-next'

const { orders, loading, fetchOrders, deleteOrder } = useOrders()
const expandedOrders = ref(new Set())
const filterPayment = ref('all') // 'all', 'cash', 'transfer'

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

const filteredOrders = computed(() => {
  if (filterPayment.value === 'all') return orders.value
  return orders.value.filter(o => o.payment_method === filterPayment.value)
})

const paymentSummary = computed(() => {
  const summary = {
    cash: 0,
    transfer: 0,
    total: 0
  }
  
  // Calculate based on ALL orders to show full context, or filteredOrders if user wants to see filtered total
  // Usually "How much transfer get" implies total accumulated.
  // Let's calculate based on ALL orders currently loaded to give a complete overview.
  orders.value.forEach(order => {
    const amount = order.total_amount || 0
    if (order.payment_method === 'cash') {
      summary.cash += amount
    } else if (order.payment_method === 'transfer') {
      summary.transfer += amount
    }
    summary.total += amount
  })
  
  return summary
})

const getPaymentColor = (method: string) => {
  if (method === 'transfer') return 'bg-blue-100 text-blue-800'
  if (method === 'cash') return 'bg-green-100 text-green-800'
  return 'bg-gray-100 text-gray-800'
}
</script>

<template>
  <div class="p-6">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <h1 class="text-2xl font-bold text-gray-800">ประวัติการขาย</h1>
      
      <!-- Summary Cards -->
      <div class="flex gap-3 text-sm">
        <div class="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
          <div class="text-gray-500 text-xs">ยอดรวมทั้งหมด</div>
          <div class="font-bold text-gray-900">฿{{ paymentSummary.total.toLocaleString() }}</div>
        </div>
        <div class="bg-blue-50 px-4 py-2 rounded-lg shadow-sm border border-blue-100">
          <div class="text-blue-600 text-xs">เงินโอน</div>
          <div class="font-bold text-blue-900">฿{{ paymentSummary.transfer.toLocaleString() }}</div>
        </div>
        <div class="bg-green-50 px-4 py-2 rounded-lg shadow-sm border border-green-100">
          <div class="text-green-600 text-xs">เงินสด</div>
          <div class="font-bold text-green-900">฿{{ paymentSummary.cash.toLocaleString() }}</div>
        </div>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="mb-4 flex gap-2">
      <button 
        @click="filterPayment = 'all'"
        class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
        :class="filterPayment === 'all' ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'"
      >
        ทั้งหมด
      </button>
      <button 
        @click="filterPayment = 'transfer'"
        class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
        :class="filterPayment === 'transfer' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-blue-50 border border-gray-200'"
      >
        <div class="w-2 h-2 rounded-full bg-blue-400" :class="filterPayment === 'transfer' ? 'bg-white' : ''"></div>
        เงินโอน
      </button>
      <button 
        @click="filterPayment = 'cash'"
        class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
        :class="filterPayment === 'cash' ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-green-50 border border-gray-200'"
      >
        <div class="w-2 h-2 rounded-full bg-green-400" :class="filterPayment === 'cash' ? 'bg-white' : ''"></div>
        เงินสด
      </button>
    </div>

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
          <tr v-else-if="filteredOrders.length === 0">
            <td colspan="3" class="px-4 py-2 text-center text-gray-500">ไม่พบรายการขาย</td>
          </tr>
          <template v-for="order in filteredOrders" :key="order.id">
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
                  <div v-if="order.payment_method === 'cash' && order.cash_received" class="text-xs text-gray-500 flex flex-col">
                    <span>รับเงิน: ฿{{ order.cash_received }}</span>
                    <span>เงินทอน: ฿{{ order.change }}</span>
                  </div>
                  <span 
                    class="px-2 py-0.5 text-[10px] font-semibold rounded-full mt-1"
                    :class="getPaymentColor(order.payment_method)"
                  >
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
