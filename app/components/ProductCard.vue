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
    @click="product.stock > 0 ? $emit('add', product) : null"
    :class="[
      'bg-white p-3 sm:p-4 rounded-lg shadow transition-shadow border border-transparent h-full flex flex-col relative overflow-hidden',
      product.stock > 0 ? 'cursor-pointer hover:shadow-md hover:border-primary-500' : 'cursor-not-allowed opacity-75'
    ]"
  >
    <div v-if="product.stock === 0" class="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1 z-10 rounded-bl-lg">
      สินค้าหมด
    </div>
    <div class="aspect-square bg-gray-100 rounded-md mb-3 flex items-center justify-center text-gray-400 overflow-hidden">
      <img v-if="product.image_url" :src="product.image_url" class="h-full w-full object-cover" :class="{ 'grayscale': product.stock === 0 }" />
      <span v-else class="text-xs">No Image</span>
    </div>
    <h3 class="font-medium text-gray-900 text-sm sm:text-base line-clamp-2 mb-auto">{{ product.name }}</h3>
    <div class="flex justify-between items-center mt-2">
      <span class="text-kiki-red font-bold text-sm sm:text-base">฿{{ product.price }}</span>
      <span :class="['text-xs', product.stock === 0 ? 'text-red-500 font-bold' : 'text-gray-500']">
        {{ product.stock === 0 ? 'หมด' : `คงเหลือ: ${product.stock}` }}
      </span>
    </div>
  </div>
</template>
