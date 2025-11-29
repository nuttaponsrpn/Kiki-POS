<script setup lang="ts">
import { X } from 'lucide-vue-next'

import type { Product } from '~/types'

const props = defineProps<{
  product?: Product | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', product: Omit<Product, 'id' | 'created_at'>): void
}>()

const { createProduct, updateProduct } = useProducts()

const form = ref({
  name: '',
  price: 0,
  stock: 0,
  category: '',
  barcode: '',
  image_url: ''
})

const loading = ref(false)

watch(() => props.product, (newVal) => {
  if (newVal) {
    form.value = { 
      name: newVal.name,
      price: newVal.price,
      stock: newVal.stock,
      category: newVal.category || '',
      barcode: newVal.barcode || '',
      image_url: newVal.image_url || ''
    }
  } else {
    form.value = {
      name: '',
      price: 0,
      stock: 0,
      category: '',
      barcode: '',
      image_url: ''
    }
  }
}, { immediate: true })

const handleSubmit = async () => {
  loading.value = true
  try {
    if (props.product) {
      await updateProduct(props.product.id, form.value)
    } else {
      await createProduct(form.value)
    }
    emit('save', form.value) // Changed from 'saved' to 'save' and passing form.value
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    alert('Error saving product: ' + message)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg w-full max-w-md p-6 relative">
      <button @click="$emit('close')" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
        <X class="w-5 h-5" />
      </button>
      
      <h2 class="text-xl font-bold mb-4">{{ product ? 'Edit Product' : 'New Product' }}</h2>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Name</label>
          <input v-model="form.name" required type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border p-2">
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Price</label>
            <input v-model="form.price" required type="number" step="0.01" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border p-2">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Stock</label>
            <input v-model="form.stock" required type="number" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border p-2">
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Category</label>
          <input v-model="form.category" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border p-2">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Barcode</label>
          <input v-model="form.barcode" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border p-2">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Image URL</label>
          <input v-model="form.image_url" type="url" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border p-2" placeholder="https://example.com/image.jpg">
          
          <div v-if="form.image_url" class="mt-3">
            <p class="text-xs text-gray-500 mb-1">Preview:</p>
            <div class="h-40 w-full bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
              <img :src="form.image_url" class="h-full w-full object-contain" alt="Preview" />
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-6">
          <button type="button" @click="$emit('close')" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
            Cancel
          </button>
          <button type="submit" :disabled="loading" class="px-4 py-2 text-sm font-medium text-white bg-kiki-yellow rounded-md hover:bg-primary-600 disabled:opacity-50 text-black">
            {{ loading ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
