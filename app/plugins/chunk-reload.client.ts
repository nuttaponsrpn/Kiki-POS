export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()

  router.onError((error, to) => {
    if (
      error.message.includes('Failed to fetch dynamically imported module') ||
      error.message.includes('Importing a module script failed')
    ) {
      if (!to?.fullPath) return
      
      // Prevent infinite reload loop
      const reloadKey = 'chunk_reload_' + to.fullPath
      const reloaded = sessionStorage.getItem(reloadKey)
      
      if (!reloaded) {
        sessionStorage.setItem(reloadKey, 'true')
        window.location.reload()
      } else {
        console.error('Chunk load error persisted after reload:', error)
        sessionStorage.removeItem(reloadKey) // Clear for next attempt
      }
    }
  })
})
