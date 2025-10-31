import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import Home from './pages/Home'
import Books from './pages/Books'
import BookDetail from './pages/BookDetail'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrdersPage from './pages/OrdersPage'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/AdminDashboard'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'books', element: <Books /> },
      { path: 'books/:id', element: <BookDetail /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'orders', element: <OrdersPage /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'admin/dashboard', element: <AdminDashboard /> },
    ],
  },
])

export default router

