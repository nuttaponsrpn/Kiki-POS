<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import type { Product } from '~/types'

defineProps<{
  product: Product
}>()

defineEmits(['add'])
</script>

<template>
  <div 
    @click="$emit('add', product)"
    class="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow border border-transparent hover:border-primary-500"
  >
    <div class="h-32 bg-gray-100 rounded-md mb-3 flex items-center justify-center text-gray-400">
      <img v-if="product.image_url" :src="product.image_url" class="h-full w-full object-cover rounded-md" />
      <span v-else>No Image</span>
    </div>
    <h3 class="font-medium text-gray-900 truncate">{{ product.name }}</h3>
    <div class="flex justify-between items-center mt-2">
      <span class="text-kiki-red font-bold">${{ product.price }}</span>
      <span class="text-xs text-gray-500">Stock: {{ product.stock }}</span>
    </div>
  </div>
</template>
