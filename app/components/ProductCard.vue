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
    class="bg-white p-3 sm:p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow border border-transparent hover:border-primary-500 h-full flex flex-col"
  >
    <div class="aspect-square bg-gray-100 rounded-md mb-3 flex items-center justify-center text-gray-400 overflow-hidden">
      <img v-if="product.image_url" :src="product.image_url" class="h-full w-full object-cover" />
      <span v-else class="text-xs">No Image</span>
    </div>
    <h3 class="font-medium text-gray-900 text-sm sm:text-base line-clamp-2 mb-auto">{{ product.name }}</h3>
    <div class="flex justify-between items-center mt-2">
      <span class="text-kiki-red font-bold text-sm sm:text-base">${{ product.price }}</span>
      <span class="text-xs text-gray-500">คงเหลือ: {{ product.stock }}</span>
    </div>
  </div>
</template>
