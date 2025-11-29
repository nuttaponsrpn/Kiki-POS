<script setup lang="ts">
import { X, DollarSign, Banknote, CreditCard } from 'lucide-vue-next'

const props = defineProps<{
  total: number
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'confirm', payload: { cashReceived: number, change: number, paymentMethod: 'cash' | 'transfer' }): void
  (e: 'cancel'): void
}>()

const paymentMethod = ref<'cash' | 'transfer'>('transfer')
const cashReceived = ref<number | null>(null)

const change = computed(() => {
  if (cashReceived.value === null) return 0
  return Math.max(0, cashReceived.value - props.total)
})

const isValid = computed(() => {
  if (paymentMethod.value === 'transfer') return true
  return cashReceived.value !== null && cashReceived.value >= props.total
})

const handleConfirm = () => {
  if (isValid.value) {
    emit('confirm', {
      cashReceived: cashReceived.value || 0,
      change: change.value,
      paymentMethod: paymentMethod.value
    })
  }
}

// Reset input when modal opens
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    cashReceived.value = null
    paymentMethod.value = 'transfer'
  }
})
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 transform transition-all scale-100">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-bold text-gray-900">ชำระเงิน</h3>
        <button @click="$emit('cancel')" class="text-gray-400 hover:text-gray-600">
          <X class="w-6 h-6" />
        </button>
      </div>

      <div class="space-y-6">
        <!-- Total Amount -->
        <div class="bg-gray-50 p-4 rounded-lg text-center">
          <div class="text-sm text-gray-500 mb-1">ยอดรวมทั้งหมด</div>
          <div class="text-3xl font-bold text-kiki-red">${{ total.toFixed(2) }}</div>
        </div>

        <!-- Payment Method Selection -->
        <div class="grid grid-cols-2 gap-3">
          <button 
            @click="paymentMethod = 'transfer'"
            :class="[
              'flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all',
              paymentMethod === 'transfer' 
                ? 'border-kiki-yellow bg-yellow-50 text-black' 
                : 'border-gray-200 hover:border-gray-300 text-gray-600'
            ]"
          >
            <CreditCard class="w-6 h-6 mb-1" />
            <span class="font-medium text-sm">เงินโอน</span>
          </button>
          <button 
            @click="paymentMethod = 'cash'"
            :class="[
              'flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all',
              paymentMethod === 'cash' 
                ? 'border-kiki-yellow bg-yellow-50 text-black' 
                : 'border-gray-200 hover:border-gray-300 text-gray-600'
            ]"
          >
            <Banknote class="w-6 h-6 mb-1" />
            <span class="font-medium text-sm">เงินสด</span>
          </button>
      
        </div>

        <!-- Cash Input -->
        <div v-if="paymentMethod === 'cash'">
          <label class="block text-sm font-medium text-gray-700 mb-2">รับเงินสด</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign class="h-5 w-5 text-gray-400" />
            </div>
            <input
              v-model="cashReceived"
              type="number"
              step="0.01"
              class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-kiki-yellow focus:border-kiki-yellow text-lg"
              placeholder="0.00"
              @keyup.enter="handleConfirm"
              autofocus
            />
          </div>
        </div>

        <!-- Change Display -->
        <div v-if="paymentMethod === 'cash'" class="flex justify-between items-center py-4 border-t border-gray-100">
          <span class="text-lg font-medium text-gray-700">เงินทอน</span>
          <span class="text-2xl font-bold text-green-600">${{ change.toFixed(2) }}</span>
        </div>

        <!-- Actions -->
        <div class="grid grid-cols-2 gap-3">
          <button 
            @click="$emit('cancel')"
            class="px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium transition-colors"
          >
            ยกเลิก
          </button>
          <button 
            @click="handleConfirm"
            :disabled="!isValid"
            class="px-4 py-3 bg-kiki-yellow text-black rounded-lg font-bold hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ยืนยัน
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
