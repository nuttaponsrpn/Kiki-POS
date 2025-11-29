<script setup lang="ts">
import { DollarSign, TrendingUp, Calendar, ShoppingBag } from 'lucide-vue-next'

const { stats, loading, fetchStats } = useAnalytics()

const getToday = () => new Date().toISOString().split('T')[0]

const startDate = ref(getToday())
const endDate = ref(getToday())
const activeFilter = ref('Today')

const setQuickFilter = (filter: string) => {
  activeFilter.value = filter
  const today = new Date()
  const end = today.toISOString().split('T')[0]
  let start = end

  if (filter === 'This Week') {
    const day = today.getDay()
    const diff = today.getDate() - day + (day === 0 ? -6 : 1) // adjust when day is sunday
    const monday = new Date(today.setDate(diff))
    start = monday.toISOString().split('T')[0]
  } else if (filter === 'This Month') {
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
  { label: 'Today\'s Sales', value: `$${stats.value.today.toFixed(2)}`, icon: DollarSign, color: 'bg-green-500' },
  { label: 'This Week', value: `$${stats.value.week.toFixed(2)}`, icon: TrendingUp, color: 'bg-blue-500' },
  { 
    label: startDate.value && endDate.value ? 'Selected Period' : 'This Month', 
    value: `$${stats.value.month.toFixed(2)}`, 
    icon: Calendar, 
    color: 'bg-purple-500' 
  },
])
</script>

<template>
  <div class="p-6 lg:p-10 max-w-7xl mx-auto">
    <div class="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-4">
      <h1 class="text-3xl font-bold text-gray-800">Dashboard</h1>
      
      <div class="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
        <!-- Quick Filters -->
        <div class="flex bg-white p-1 rounded-lg shadow-sm border border-gray-200">
          <button 
            v-for="filter in ['Today', 'This Week', 'This Month']" 
            :key="filter"
            @click="setQuickFilter(filter)"
            :class="[
              'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
              activeFilter === filter ? 'bg-kiki-yellow text-black shadow-sm' : 'text-gray-600 hover:bg-gray-50'
            ]"
          >
            {{ filter }}
          </button>
        </div>

        <!-- Date Range Picker -->
        <div class="flex items-center gap-2 bg-white p-1.5 rounded-lg shadow-sm border border-gray-200">
          <div class="relative">
            <input 
              v-model="startDate" 
              type="date" 
              :max="endDate"
              class="pl-8 pr-2 py-1.5 border-none bg-gray-50 rounded-md text-sm focus:ring-2 focus:ring-primary-500 text-gray-700 font-medium w-36 cursor-pointer hover:bg-gray-100 transition-colors"
            >
            <Calendar class="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          
          <span class="text-gray-400 font-medium">to</span>
          
          <div class="relative">
            <input 
              v-model="endDate" 
              type="date" 
              :min="startDate"
              class="pl-8 pr-2 py-1.5 border-none bg-gray-50 rounded-md text-sm focus:ring-2 focus:ring-primary-500 text-gray-700 font-medium w-36 cursor-pointer hover:bg-gray-100 transition-colors"
            >
            <Calendar class="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div class="h-6 w-px bg-gray-200 mx-1"></div>

          <button 
            @click="applyFilter"
            class="bg-kiki-yellow text-black px-4 py-1.5 rounded-md text-sm font-medium hover:bg-primary-500 transition-colors shadow-sm"
          >
            Apply
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
      <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <div class="p-2 bg-primary-100 rounded-lg text-primary-600">
          <ShoppingBag class="w-6 h-6" />
        </div>
        Top Selling Products (This Month)
      </h2>
      
      <div v-if="loading" class="text-center py-12 text-gray-500">Loading stats...</div>
      <div v-else-if="stats.topProducts.length === 0" class="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
        No sales data available for this month.
      </div>
      
      <div v-else class="space-y-6">
        <div v-for="(product, index) in stats.topProducts" :key="product.name" class="flex items-center p-4 hover:bg-gray-50 rounded-xl transition-colors">
          <div class="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full font-bold text-gray-600 mr-6 text-lg">
            {{ index + 1 }}
          </div>
          <div class="flex-1">
            <div class="flex justify-between mb-2 items-end">
              <span class="font-semibold text-gray-900 text-lg">{{ product.name }}</span>
              <span class="text-primary-600 font-bold bg-primary-100 px-3 py-1 rounded-full text-sm">{{ product.quantity }} sold</span>
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
</template>
