export default defineNuxtRouteMiddleware((to, from) => {
  const { user } = useAuth()

  if (!user.value && to.path !== '/login') {
    return navigateTo('/login')
  }

  if (user.value && to.path === '/login') {
    return navigateTo('/')
  }

  // Role-based access control
  if (user.value?.role === 'user') {
    const restrictedRoutes = ['/products', '/dashboard']
    if (restrictedRoutes.some(route => to.path.startsWith(route))) {
      return navigateTo('/')
    }
  }
})
