<script setup lang="ts">
import { LayoutGrid, Package, History, Settings, Menu, BarChart3, LogOut } from 'lucide-vue-next'

const { user, logout } = useAuth()
const isSidebarOpen = ref(false)

const allLinks = [
  { name: 'แดชบอร์ด', icon: BarChart3, to: '/dashboard', roles: ['admin'] },
  { name: 'POS', icon: LayoutGrid, to: '/', roles: ['admin', 'user'] },
  { name: 'รายการสินค้า', icon: Package, to: '/products', roles: ['admin'] },
  { name: 'ประวัติการขาย', icon: History, to: '/history', roles: ['admin', 'user'] },
]

const links = computed(() => {
  if (!user.value) return []
  return allLinks.filter(link => link.roles.includes(user.value.role))
})
const handleLogout = () => {
  showLogoutConfirm.value = true
}

const confirmLogout = () => {
  showLogoutConfirm.value = false
  logout()
}

const showLogoutConfirm = ref(false)
</script>

<template>
  <div class="flex h-[100dvh] bg-gray-100 overflow-hidden">
    <ConfirmModal 
      v-if="showLogoutConfirm"
      title="ลงชื่อออก"
      message="คุณต้องการลงชื่อออกหรือไม่?"
      confirm-text="ลงชื่อออก"
      type="danger"
      @confirm="confirmLogout"
      @cancel="showLogoutConfirm = false"
    />
    <!-- Mobile Header -->
    <div class="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-30">
      <div class="flex items-center gap-3">
        <img src="https://scontent.fbkk35-1.fna.fbcdn.net/v/t39.30808-6/413810278_10211154767703037_834009150123622705_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=WxNz7qE-CQsQ7kNvwEK-Hzt&_nc_oc=AdmtImNdbQLoRz-vNVOhud1_xJ2I1C1dxT9o9so3wJWAqvKrBM0sjL1Hzsmr_gfahQFd-jJ_iBugrBQDxLNrFQYn&_nc_zt=23&_nc_ht=scontent.fbkk35-1.fna&_nc_gid=qP3-meSzGy8jdcMZeV6J_g&oh=00_AfjIy_1qURIDenUkjIl-mxxJrflSwHGuRIGbbQFTF0XtQg&oe=6930846C" alt="Kiki POS" class="h-10 w-10 rounded-full object-cover" />
        <span class="font-bold text-lg text-gray-800">Kiki Cheesecake - Market Place</span>
      </div>
      <button @click="isSidebarOpen = !isSidebarOpen" class="p-2 text-gray-600">
        <Menu class="w-6 h-6" />
      </button>
    </div>

    <!-- Sidebar Overlay -->
    <div 
      v-if="isSidebarOpen" 
      @click="isSidebarOpen = false"
      class="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
    ></div>

    <!-- Sidebar -->
    <aside 
      :class="[
        'fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-200 ease-in-out',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
    >
      <div class="p-3 border-b border-gray-200 flex items-center gap-3">
        <img src="https://scontent.fbkk35-1.fna.fbcdn.net/v/t39.30808-6/413810278_10211154767703037_834009150123622705_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=WxNz7qE-CQsQ7kNvwEK-Hzt&_nc_oc=AdmtImNdbQLoRz-vNVOhud1_xJ2I1C1dxT9o9so3wJWAqvKrBM0sjL1Hzsmr_gfahQFd-jJ_iBugrBQDxLNrFQYn&_nc_zt=23&_nc_ht=scontent.fbkk35-1.fna&_nc_gid=qP3-meSzGy8jdcMZeV6J_g&oh=00_AfjIy_1qURIDenUkjIl-mxxJrflSwHGuRIGbbQFTF0XtQg&oe=6930846C" alt="Kiki POS" class="h-10 w-10 rounded-full object-cover shadow-md" />
        <h1 class="text-xl font-bold text-gray-800">Kiki Cheesecake</h1>
      </div>
      
      <nav class="flex-1 p-4 space-y-2">
        <NuxtLink 
          v-for="link in links" 
          :key="link.name" 
          :to="link.to"
          @click="isSidebarOpen = false"
          class="flex items-center gap-3 px-4 py-3 text-gray-600 rounded-lg hover:bg-primary-100 hover:text-primary-600 transition-colors"
          active-class="bg-primary-100 text-primary-600 font-medium"
        >
          <component :is="link.icon" class="w-5 h-5" />
          {{ link.name }}
        </NuxtLink>
      </nav>

      <div class="p-4 border-t border-gray-200">
        <div class="flex items-center gap-3 px-4 py-3 text-gray-500 mb-2">
          <div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold uppercase">
            {{ user?.username?.charAt(0) }}
          </div>
          <div class="flex-1 overflow-hidden">
            <p class="text-sm font-medium text-gray-900 truncate">{{ user?.username }}</p>
            <p class="text-xs text-gray-500 capitalize">{{ user?.role }}</p>
          </div>
        </div>
        <button 
          @click="handleLogout"
          class="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg w-full transition-colors text-sm font-medium"
        >
          <LogOut class="w-4 h-4" />
          ลงชื่อออก
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col min-w-0 overflow-y-auto pt-16 lg:pt-0">
      <slot />
    </main>
  </div>
</template>
