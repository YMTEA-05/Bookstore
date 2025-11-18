import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import axios from 'axios'

// Define your backend URL
const API_URL = 'http://localhost:4000'

export default function CheckoutPage() {
  const { cartItems, fetchCart } = useCart() // Get cart and the fetch function
  const { user, token } = useAuth() // Get user info and auth token
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const subtotal = cartItems.reduce((acc, item) => acc + (item.Price * item.Quantity), 0)
  const tax = subtotal * 0.05 // Example: 5% tax
  const shipping = 5.00 // Example: $5 flat shipping
  const total = subtotal + tax + shipping

  const handlePayNow = async () => {
    setLoading(true)
    setError('')

    try {
      // Create the auth'd axios instance
      const authAxios = axios.create({
        baseURL: API_URL,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Call the new checkout endpoint
      await authAxios.post('/orders/checkout');

      alert('Payment successful! Your order has been placed.');

      // Refresh the cart (it's now empty)
      await fetchCart(); 

      // Send user to their orders page
      navigate('/orders');

    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Payment failed. Please try again.');
      } else {
        setError('An unexpected error occurred.');
      }
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="checkout-container" style={{ maxWidth: '800px', margin: '2rem auto' }}>
      <h1 style={{ textAlign: 'center' }}>Complete Your Order</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* --- Left Column: Summary --- */}
        <div>
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Shipping Information</h3>
              <p><strong>{user?.name}</strong></p>
              <p>{user?.email}</p>
              <p>{user?.Address || 'No address provided.'}</p>
              {/* In a real app, you'd have a button here to "Change Address" */}
            </div>
          </div>
          <div className="card" style={{ marginTop: '1rem' }}>
            <div className="card-body">
              <h3 className="card-title">Items in Cart</h3>
              {cartItems.map(item => (
                <div key={item.Book_ID} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                  <span>{item.Title} (x{item.Quantity})</span>
                  <strong>₹{(item.Price * item.Quantity).toFixed(2)}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- Right Column: Payment --- */}
        <div className="card">
          <div className="card-body">
            <h3 className="card-title">Order Summary</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Subtotal:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Tax (5%):</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span>Shipping:</span>
              <span>₹{shipping.toFixed(2)}</span>
            </div>
            <hr style={{ marginBottom: '1rem' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.25rem' }}>
              <span>Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

            <p style={{ fontSize: '0.8rem', color: '#555', margin: '1rem 0' }}>
              This is a simulated payment. No card is required.
            </p>

            {error && (
              <div style={{ color: 'var(--error-500)', marginBottom: '1rem' }}>
                {error}
              </div>
            )}

            <button 
              className="btn btn-primary w-full"
              onClick={handlePayNow}
              disabled={loading || cartItems.length === 0}
            >
              {loading ? 'Processing...' : `Pay Now (₹${total.toFixed(2)})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
