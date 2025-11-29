<script setup lang="ts">
import { AlertTriangle } from 'lucide-vue-next'

defineProps<{
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
}>()

defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 transform transition-all scale-100">
      <div class="flex items-center gap-3 mb-4">
        <div :class="[
          'p-2 rounded-full',
          type === 'danger' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
        ]">
          <AlertTriangle class="w-6 h-6" />
        </div>
        <h3 class="text-lg font-bold text-gray-900">{{ title || 'ยืนยันการดำเนินการ' }}</h3>
      </div>
      
      <p class="text-gray-600 mb-6">
        {{ message || 'คุณต้องการดำเนินการหรือไม่?' }}
      </p>
      
      <div class="flex justify-end gap-3">
        <button 
          @click="$emit('cancel')"
          class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium transition-colors"
        >
          {{ cancelText || 'ยกเลิก' }}
        </button>
        <button 
          @click="$emit('confirm')"
          :class="[
            'px-4 py-2 text-white rounded-lg font-medium transition-colors',
            type === 'danger' 
              ? 'bg-red-600 hover:bg-red-700' 
              : 'bg-kiki-yellow text-black hover:bg-primary-500'
          ]"
        >
          {{ confirmText || 'ยืนยัน' }}
        </button>
      </div>
    </div>
  </div>
</template>
