import React from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import './style.css'

const container = document.getElementById('app')!
const root = createRoot(container)
root.render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider> {/* 2. Wrap the router in CartProvider */}
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>,
)
