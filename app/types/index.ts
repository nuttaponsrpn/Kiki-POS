export interface Product {
  id: string
  name: string
  price: number
  stock: number
  category: string | null
  image_url: string | null
  barcode: string | null
  created_at: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  quantity: number
  price_at_sale: number
  created_at: string
  products?: {
    name: string
  } | null
}

export interface Order {
  id: string
  total_amount: number
  payment_method: string
  created_at: string
  order_items?: OrderItem[]
}

export interface User {
  username: string
  role: 'admin' | 'user'
}
