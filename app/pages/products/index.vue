<script setup lang="ts">
import { Plus, Pencil, Trash2, Search } from 'lucide-vue-next'

const { products, loading, fetchProducts, deleteProduct } = useProducts()
const searchQuery = ref('')
const selectedCategory = ref('All')
const showModal = ref(false)
const editingProduct = ref(null)

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
      p.category?.toLowerCase().includes(lower) ||
      p.barcode?.includes(lower)
    )
  }
  return result
})

const openModal = (product = null) => {
  if (product) {
    editingProduct.value = { ...product }
  } else {
    editingProduct.value = null
  }
  showModal.value = true
}

const showDeleteConfirm = ref(false)
const productToDelete = ref<string | null>(null)

const handleDelete = (id: string) => {
  productToDelete.value = id
  showDeleteConfirm.value = true
}

const confirmDelete = async () => {
  if (productToDelete.value) {
    await deleteProduct(productToDelete.value)
    showDeleteConfirm.value = false
    productToDelete.value = null
  }
}
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">สินค้า</h1>
      <button 
        @click="openModal()"
        class="bg-kiki-yellow text-black px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-500 font-medium"
      >
        <Plus class="w-4 h-4" />
        เพิ่มสินค้า
      </button>
    </div>

    <!-- Search & Filter -->
    <div class="mb-6 space-y-4">
      <div class="relative">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="ค้นหาสินค้า..." 
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
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
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
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
          ]"
        >
          {{ category }}
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left ">
          <thead class="bg-gray-50 text-gray-600 uppercase text-xs">
          <tr>
            <th class="px-6 py-3 w-[80px]">รูปภาพ</th>
            <th class="px-6 py-3">รายละเอียดสินค้า</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-if="loading" class="text-center py-4">
            <td colspan="6" class="px-6 py-4">Loading...</td>
          </tr>
          <tr v-else-if="filteredProducts.length === 0">
            <td colspan="2" class="px-6 py-4 text-center text-gray-500">No products found</td>
          </tr>
          <tr v-for="product in filteredProducts" :key="product.id" @click="openModal(product)" class="hover:bg-gray-50 cursor-pointer">
            <td class="px-6 py-4">
              <div class="h-10 w-10 rounded bg-gray-100 flex items-center justify-center overflow-hidden">
                <img v-if="product.image_url" :src="product.image_url" class="h-full w-full object-cover" alt="" />
                <span v-else class="text-xs text-gray-400">N/A</span>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="flex flex-col gap-1">
                <div class="flex items-center gap-2 flex-wrap">
                  <div class="font-medium text-gray-900">{{ product.name }}</div>
                  <span class="px-2 py-0.5 rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                    {{ product.category }}
                  </span>
                </div>
                <div class="text-xs text-gray-500">{{ product.barcode }}</div>
                <div class="flex items-center gap-2 mt-1 text-sm">
                  <span class="font-bold text-gray-900">฿{{ product.price }}</span>
                  <span class="text-gray-300">•</span>
                  <span :class="{'text-red-600 font-bold': product.stock < 5, 'text-green-600': product.stock >= 5}">
                    {{ product.stock }} ชิ้น
                  </span>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>

    <!-- Modal Placeholder -->
    <ProductModal 
      v-if="showModal" 
      :product="editingProduct" 
      @close="showModal = false" 
      @save="fetchProducts(); showModal = false"
      @delete="handleDelete"
    />

    <ConfirmModal
      v-if="showDeleteConfirm"
      title="ลบสินค้า"
      message="คุณต้องการลบสินค้าหรือไม่?"
      confirm-text="ลบ"
      type="danger"
      @confirm="confirmDelete"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>
