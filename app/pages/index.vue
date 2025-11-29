<script setup lang="ts">
import { Search } from 'lucide-vue-next'

const { products, fetchProducts } = useProducts()
const { addToCart, cart, total } = useCart()
const searchQuery = ref('')
const selectedCategory = ref('All')
const isCartOpen = ref(false)

onMounted(() => {
  fetchProducts()
})

const categories = computed(() => {
  const cats = new Set(products.value.map(p => p.category).filter(Boolean))
  return Array.from(cats).sort()
})

const filteredProducts = computed(() => {
  let result = products.value

  // Filter by Category
  if (selectedCategory.value !== 'All') {
    result = result.filter(p => p.category === selectedCategory.value)
  }

  // Filter by Search
  if (searchQuery.value) {
    const lower = searchQuery.value.toLowerCase()
    result = result.filter(p => 
      p.name.toLowerCase().includes(lower) || 
      p.barcode?.includes(lower)
    )
  }
  
  return result
})
</script>

<template>
  <div class="h-full flex flex-col lg:flex-row overflow-hidden relative">
    <!-- Main Area -->
    <div class="flex-1 flex flex-col min-w-0 bg-gray-100 h-full">
      <!-- Header -->
      <header class="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 space-y-4">
        <div class="relative max-w-md w-full">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search products..." 
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
        </div>

        <!-- Category Tabs -->
        <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button 
            @click="selectedCategory = 'All'"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
              selectedCategory === 'All' 
                ? 'bg-kiki-yellow text-black' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]"
          >
            All
          </button>
          <button 
            v-for="category in categories" 
            :key="category"
            @click="selectedCategory = category"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
              selectedCategory === category 
                ? 'bg-kiki-yellow text-black' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]"
          >
            {{ category }}
          </button>
        </div>
      </header>

      <!-- Product Grid -->
      <div class="flex-1 overflow-y-auto p-4 lg:p-6 pb-32 lg:pb-6">
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4">
          <ProductCard 
            v-for="product in filteredProducts" 
            :key="product.id" 
            :product="product" 
            @add="addToCart"
          />
        </div>
      </div>
    </div>

    <!-- Right Sidebar (Desktop Cart) -->
    <div class="hidden lg:flex w-96 bg-white border-l border-gray-200 flex-col shadow-xl z-10 h-full">
      <div class="p-4 border-b border-gray-200">
        <h2 class="text-lg font-bold">Current Order</h2>
      </div>
      <CartSidebar />
    </div>

    <!-- Mobile Cart Button -->
    <div class="lg:hidden fixed bottom-4 right-4 left-4 z-20">
      <button 
        @click="isCartOpen = true"
        class="w-full bg-kiki-yellow text-black p-4 rounded-xl shadow-lg flex justify-between items-center font-bold"
      >
        <span>View Cart ({{ cart.length }} items)</span>
        <span>${{ total }}</span>
      </button>
    </div>

    <!-- Mobile Cart Drawer -->
    <div v-if="isCartOpen" class="fixed inset-0 z-50 lg:hidden flex flex-col">
      <div class="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" @click="isCartOpen = false"></div>
      <div class="absolute inset-y-0 right-0 w-full max-w-sm bg-white flex flex-col shadow-2xl transform transition-transform h-full">
        <div class="p-4 border-b border-gray-200 flex justify-between items-center bg-white z-10">
          <h2 class="text-lg font-bold">Current Order</h2>
          <button 
            @click="isCartOpen = false" 
            class="p-2 -mr-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
          >
            <span class="sr-only">Close</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="flex-1 overflow-hidden relative">
          <CartSidebar />
        </div>
      </div>
    </div>
  </div>
</template>
