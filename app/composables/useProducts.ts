import type { Product } from '~/types'

export const useProducts = (): {
  products: Ref<Product[]>
  loading: Ref<boolean>
  error: Ref<string | null>
  fetchProducts: () => Promise<void>
  createProduct: (product: Omit<Product, 'id' | 'created_at'>) => Promise<Product | undefined>
  updateProduct: (id: string, updates: Partial<Product>) => Promise<Product | undefined>
  deleteProduct: (id: string) => Promise<void>
} => {
  const supabase = useSupabase()
  const products = useState<Product[]>('products', () => [])
  const loading = useState<boolean>('products-loading', () => false)
  const error = useState<string | null>('products-error', () => null)

  const fetchProducts = async () => {
    if (!supabase) return
    loading.value = true
    const { data, error: err } = await supabase
      .from('products')
      .select('*')
      .order('name')
    
    if (err) error.value = err.message
    else products.value = data as Product[]
    loading.value = false
  }

  const createProduct = async (product: Omit<Product, 'id' | 'created_at'>) => {
    if (!supabase) return
    const { data, error: err } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single()
    
    if (err) throw err
    products.value.push(data as Product)
    return data
  }

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    if (!supabase) return
    const { data, error: err } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (err) throw err
    const index = products.value.findIndex(p => p.id === id)
    if (index !== -1) {
      products.value[index] = data as Product
    }
    return data
  }

  const deleteProduct = async (id: string) => {
    if (!supabase) return
    const { error: err } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (err) throw err
    products.value = products.value.filter(p => p.id !== id)
  }

  return {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct
  }
}
