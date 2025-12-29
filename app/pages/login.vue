<script setup lang="ts">
definePageMeta({
  layout: 'blank'
})

const { login } = useAuth()
const router = useRouter()

const username = ref('')
const password = ref('')
const error = ref('')

const handleLogin = () => {
  error.value = ''
  try {
    login(username.value, password.value)
    router.push('/') // Move router.push here, as login is now expected to throw on failure
  } catch (e: any) {
    error.value = e.message
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
      <div class="text-center mb-8">
        <img src="/kiki logo.jpg" alt="Kiki POS" class="h-32 w-32 mx-auto mb-4 rounded-full object-cover" />
        <p class="text-gray-500 mt-2">Sign in to Kiki Cheesecake - Market Place</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div v-if="error" class="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
          {{ error }}
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            v-model="username"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
            placeholder="Enter username"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
            placeholder="Enter password"
          >
        </div>

        <button
          type="submit"
          class="w-full bg-kiki-yellow text-black py-3 rounded-lg font-bold hover:bg-primary-500 transition-colors"
        >
          Sign In
        </button>
      </form>
    </div>
  </div>
</template>
