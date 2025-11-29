<script setup lang="ts">
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-vue-next'

const { isOpen, title, message, type, closeAlert } = useAlert()

const icon = computed(() => {
  switch (type.value) {
    case 'success': return CheckCircle
    case 'error': return XCircle
    case 'warning': return AlertTriangle
    default: return Info
  }
})

const colorClass = computed(() => {
  switch (type.value) {
    case 'success': return 'text-green-600 bg-green-100'
    case 'error': return 'text-red-600 bg-red-100'
    case 'warning': return 'text-yellow-600 bg-yellow-100'
    default: return 'text-blue-600 bg-blue-100'
  }
})

const buttonClass = computed(() => {
  switch (type.value) {
    case 'success': return 'bg-green-600 hover:bg-green-700'
    case 'error': return 'bg-red-600 hover:bg-red-700'
    case 'warning': return 'bg-yellow-600 hover:bg-yellow-700'
    default: return 'bg-blue-600 hover:bg-blue-700'
  }
})
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 transform transition-all scale-100 animate-fade-in-up">
      <div class="flex items-center gap-3 mb-4">
        <div :class="['p-2 rounded-full', colorClass]">
          <component :is="icon" class="w-6 h-6" />
        </div>
        <h3 class="text-lg font-bold text-gray-900">{{ title }}</h3>
      </div>
      
      <p class="text-gray-600 mb-6">
        {{ message }}
      </p>
      
      <div class="flex justify-end">
        <button 
          @click="closeAlert"
          :class="['px-4 py-2 text-white rounded-lg font-medium transition-colors w-full sm:w-auto', buttonClass]"
        >
          ตกลง
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.2s ease-out;
}
</style>
