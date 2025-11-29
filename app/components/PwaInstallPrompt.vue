<script setup lang="ts">
import { Download, X } from 'lucide-vue-next'

const deferredPrompt = ref<any>(null)
const showInstallPrompt = ref(false)

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault()
    // Stash the event so it can be triggered later.
    deferredPrompt.value = e
    // Update UI notify the user they can install the PWA
    showInstallPrompt.value = true
  })

  window.addEventListener('appinstalled', () => {
    // Log install to analytics
    console.log('PWA was installed')
    deferredPrompt.value = null
    showInstallPrompt.value = false
  })
})

const installPwa = async () => {
  if (!deferredPrompt.value) return

  // Show the install prompt
  deferredPrompt.value.prompt()

  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.value.userChoice
  console.log(`User response to the install prompt: ${outcome}`)

  // We've used the prompt, and can't use it again, throw it away
  deferredPrompt.value = null
  showInstallPrompt.value = false
}

const dismissPrompt = () => {
  showInstallPrompt.value = false
}
</script>

<template>
  <Transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-full opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div 
      v-if="showInstallPrompt" 
      class="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50 flex flex-col gap-3"
    >
      <div class="flex items-start justify-between">
        <div class="flex gap-3">
          <div class="p-2 bg-kiki-yellow/20 rounded-lg text-kiki-yellow-dark">
            <Download class="w-6 h-6 text-black" />
          </div>
          <div>
            <h3 class="font-bold text-gray-900">Install App</h3>
            <p class="text-sm text-gray-600 mt-1">Install Kiki POS for a better experience and offline access.</p>
          </div>
        </div>
        <button @click="dismissPrompt" class="text-gray-400 hover:text-gray-600">
          <X class="w-5 h-5" />
        </button>
      </div>
      
      <div class="flex gap-3 mt-1">
        <button 
          @click="dismissPrompt"
          class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Not now
        </button>
        <button 
          @click="installPwa"
          class="flex-1 px-4 py-2 text-sm font-bold text-black bg-kiki-yellow rounded-lg hover:bg-primary-500 transition-colors shadow-sm"
        >
          Install
        </button>
      </div>
    </div>
  </Transition>
</template>
