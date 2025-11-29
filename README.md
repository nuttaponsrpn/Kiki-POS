# Kiki POS

A modern, lightweight Point of Sale (POS) system built with **Nuxt 4**, **Vue 3**, **Tailwind CSS**, and **Supabase**.

## 🚀 Features

- **Point of Sale (POS)**: Efficient interface for processing orders with a cart system.
- **Product Management**: Add, edit, and delete products with image support.
- **Dashboard**: Real-time sales analytics with date range filtering and top-selling products.
- **Sales History**: View past orders and details, with the ability to delete orders (restoring stock).
- **Authentication**: Secure login system with role-based access (Admin/User).
- **Custom Theme**: Branded "Kiki Yellow" UI with a responsive design.
- **PWA Ready**: Optimized for performance and mobile usage.

## 🛠️ Tech Stack

- **Framework**: [Nuxt 4](https://nuxt.com/) (Vue 3)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Lucide Icons](https://lucide.dev/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **State Management**: Nuxt Composables (`useCart`, `useProducts`, `useAuth`, `useAnalytics`)

## 📦 Setup & Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd Kiki-POS
    ```

2.  **Install dependencies**
    ```bash
    yarn install
    # or npm install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the root directory and add your Supabase credentials:
    ```env
    SUPABASE_URL=your_supabase_url
    SUPABASE_KEY=your_supabase_anon_key
    ```

4.  **Database Setup**
    Run the SQL scripts provided in `supabase_schema.sql` in your Supabase SQL Editor to create the necessary tables (`products`, `orders`, `order_items`, `users`) and policies.

5.  **Run Development Server**
    ```bash
    yarn dev
    ```
    The app will be available at `http://localhost:3000`.

## 📂 Project Structure

- `app/pages`: Application routes (Dashboard, POS, Products, History, Login).
- `app/components`: Reusable Vue components (ProductModal, CartSidebar, ConfirmModal).
- `app/composables`: Business logic and state management.
- `app/layouts`: Main application layouts.
- `app/types`: TypeScript interfaces.

## 🎨 Theme

The application uses a custom color palette defined in `tailwind.config.js`:
- **Primary**: `kiki-yellow` (#F4C430)
- **Secondary**: `kiki-red` (#E32636)

## 📄 License

[MIT](LICENSE)
