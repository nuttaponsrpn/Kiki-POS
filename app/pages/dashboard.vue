<script setup lang="ts">
import { DollarSign, TrendingUp, Calendar, ShoppingBag } from 'lucide-vue-next'

const { stats, loading, fetchStats } = useAnalytics()

const getToday = () => new Date().toISOString().split('T')[0]

const startDate = ref(getToday())
const endDate = ref(getToday())
const activeFilter = ref('วันนี้')

const setQuickFilter = (filter: string) => {
  activeFilter.value = filter
  const today = new Date()
  const end = today.toISOString().split('T')[0]
  let start = end

  if (filter === 'สัปดาห์นี้') {
    const day = today.getDay()
    const diff = today.getDate() - day + (day === 0 ? -6 : 1) // adjust when day is sunday
    const monday = new Date(today.setDate(diff))
    start = monday.toISOString().split('T')[0]
  } else if (filter === 'เดือนนี้') {
    start = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0]
  }

  startDate.value = start
  endDate.value = end
  applyFilter()
}

const applyFilter = () => {
  // Auto-correct if start > end
  if (startDate.value > endDate.value) {
    const temp = startDate.value
    startDate.value = endDate.value
    endDate.value = temp
  }
  
  if (startDate.value && endDate.value) {
    fetchStats(startDate.value, endDate.value)
  } else {
    fetchStats()
  }
}

// Watch for manual date changes to clear active filter highlight if dates don't match
watch([startDate, endDate], () => {
  // Logic to keep 'Custom' or clear active filter could go here
  // For now, we just let the user see the dates they picked
})

onMounted(() => {
  applyFilter()
})

const cards = computed(() => [
  { label: 'ยอดขายวันนี้', value: `$${stats.value.today.toFixed(2)}`, icon: DollarSign, color: 'bg-green-500' },
  { label: 'สัปดาห์นี้', value: `$${stats.value.week.toFixed(2)}`, icon: TrendingUp, color: 'bg-blue-500' },
  { 
    label: startDate.value && endDate.value ? 'ช่วงเวลาที่เลือก' : 'เดือนนี้', 
    value: `$${stats.value.month.toFixed(2)}`, 
    icon: Calendar, 
    color: 'bg-purple-500' 
  },
])
</script>

<template>
  <div class="h-full overflow-y-auto">
    <div class="p-4 lg:p-10 max-w-7xl mx-auto pb-32">
      <div class="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4">
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-800">แดชบอร์ด</h1>
        
        <div class="flex flex-col w-full xl:w-auto gap-3">
          <!-- Quick Filters -->
          <div class="flex overflow-x-auto pb-1 xl:pb-0 bg-white p-1 rounded-lg shadow-sm border border-gray-200 scrollbar-hide">
            <button 
              v-for="filter in ['วันนี้', 'สัปดาห์นี้', 'เดือนนี้']" 
              :key="filter"
              @click="setQuickFilter(filter)"
              :class="[
                'flex-1 xl:flex-none px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap',
                activeFilter === filter ? 'bg-kiki-yellow text-black shadow-sm' : 'text-gray-600 hover:bg-gray-50'
              ]"
            >
              {{ filter }}
            </button>
          </div>

          <!-- Date Range Picker -->
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1">
              <div class="relative flex-1">
                <input 
                  v-model="startDate" 
                  type="date" 
                  :max="endDate"
                  class="w-full pl-8 pr-2 py-1.5 border-none bg-gray-50 rounded-md text-sm focus:ring-2 focus:ring-primary-500 text-gray-700 font-medium cursor-pointer hover:bg-gray-100 transition-colors"
                >
                <Calendar class="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              
              <span class="text-gray-400 font-medium text-center hidden sm:block">ถึง</span>
              
              <div class="relative flex-1">
                <input 
                  v-model="endDate" 
                  type="date" 
                  :min="startDate"
                  class="w-full pl-8 pr-2 py-1.5 border-none bg-gray-50 rounded-md text-sm focus:ring-2 focus:ring-primary-500 text-gray-700 font-medium cursor-pointer hover:bg-gray-100 transition-colors"
                >
                <Calendar class="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div class="hidden sm:block h-6 w-px bg-gray-200 mx-1"></div>

            <button 
              @click="applyFilter"
              class="w-full sm:w-auto bg-kiki-yellow text-black px-4 py-1.5 rounded-md text-sm font-medium hover:bg-primary-500 transition-colors shadow-sm"
            >
              ตกลง
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <div v-for="card in cards" :key="card.label" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center hover:shadow-md transition-shadow">
          <div :class="['p-4 rounded-xl text-white mr-5 shadow-sm', card.color]">
            <component :is="card.icon" class="w-7 h-7" />
          </div>
          <div>
            <p class="text-sm text-gray-500 font-medium mb-1">{{ card.label }}</p>
            <h3 class="text-3xl font-bold text-gray-900 tracking-tight">{{ loading ? '...' : card.value }}</h3>
          </div>
        </div>
      </div>

      <!-- Top Selling Items -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 class="text-lg md:text-xl font-bold text-gray-800 mb-6 flex items-start md:items-center gap-3">
          <div class="p-2 bg-primary-100 rounded-lg text-primary-600 shrink-0">
            <ShoppingBag class="w-6 h-6" />
          </div>
          <span class="leading-tight py-1">สินค้าขายดี <span class="text-gray-500 font-normal text-base block sm:inline sm:ml-1">(เดือนนี้)</span></span>
        </h2>
        
        <div v-if="loading" class="text-center py-12 text-gray-500">กำลังโหลดข้อมูล...</div>
        <div v-else-if="stats.topProducts.length === 0" class="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          ไม่มีข้อมูลการขายสำหรับเดือนนี้
        </div>
        
        <div v-else class="space-y-6">
          <div v-for="(product, index) in stats.topProducts" :key="product.name" class="flex items-center p-3 md:p-4 hover:bg-gray-50 rounded-xl transition-colors">
            <div class="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-gray-100 rounded-full font-bold text-gray-600 mr-3 md:mr-6 text-base md:text-lg shrink-0">
              {{ index + 1 }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex justify-between mb-1 md:mb-2 items-end gap-2">
                <span class="font-semibold text-gray-900 text-base md:text-lg truncate">{{ product.name }}</span>
                <span class="text-primary-600 font-bold bg-primary-100 px-2 py-0.5 md:px-3 md:py-1 rounded-full text-xs md:text-sm whitespace-nowrap">{{ product.quantity }} ชิ้น</span>
              </div>
              <div class="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div 
                  class="bg-kiki-yellow h-3 rounded-full transition-all duration-500 ease-out" 
                  :style="{ width: `${(product.quantity / stats.topProducts[0].quantity) * 100}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
