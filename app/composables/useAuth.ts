import type { User } from '~/types'

export const useAuth = () => {
  const user = useCookie<User | null>('user', { maxAge: 60 * 60 * 24 * 7 }) // 7 days
  const router = useRouter()

  const login = (username: string, password: string) => {
    if (username === 'kikiadmin' && password === 'kiki@admin') {
      user.value = { username, role: 'admin' }
      router.push('/')
    } else if (username === 'kikishop' && password === 'kiki@user') {
      user.value = { username, role: 'user' }
      router.push('/')
    } else {
      throw new Error('Invalid credentials')
    }
  }

  const logout = () => {
    user.value = null
    router.push('/login')
  }

  return {
    user,
    login,
    logout
  }
}
