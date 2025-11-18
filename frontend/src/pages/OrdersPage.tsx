import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import axios from 'axios'
import { Link } from 'react-router-dom'

// Define your backend URL
const API_URL = 'http://localhost:4000'

// --- Define the types for our data ---
interface OrderItem {
  Book_ID: number;
  Title: string;
  ImagePath: string;
  Quantity: number;
  Price: number;
}

interface Order {
  Order_ID: number;
  Order_Date: string; // This will be a string, e.g., "2023-10-28T10:30:00.000Z"
  Total_Amount: number;
  Status: string;
  items: OrderItem[]; // The nested array from our backend query
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { token } = useAuth()

  useEffect(() => {
    if (!token) return; // Don't fetch if not logged in

    const fetchOrders = async () => {
      setLoading(true)
      setError('')
      try {
        const authAxios = axios.create({
          baseURL: API_URL,
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const { data } = await authAxios.get('/orders')
        setOrders(data)
      } catch (err) {
        console.error('Failed to fetch orders:', err)
        setError('Could not load your orders. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [token]) // Re-run when the token is available

  // Helper to format the date string
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading your orders...</div>
  }

  if (error) {
    return <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--error-500)' }}>{error}</div>
  }

  return (
    <div className="orders-container" style={{ maxWidth: '900px', margin: '2rem auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>Your Orders</h1>

      {orders.length === 0 ? (
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center' }}>
            <p>You haven't placed any orders yet.</p>
            <Link to="/books" className="btn btn-primary">Start Shopping</Link>
          </div>
        </div>
      ) : (
        <div className="orders-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map(order => (
            <div key={order.Order_ID} className="card">
              <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: 0 }}>Order #{order.Order_ID}</h3>
                  <p style={{ margin: 0, color: '#555' }}>Placed on {formatDate(order.Order_Date)}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontWeight: 'bold' }}>Total: ₹{Number(order.Total_Amount).toFixed(2)}</span>
                  <p style={{ margin: 0, color: '#0ea5e9', fontWeight: 'bold' }}>{order.Status}</p>
                </div>
              </div>
              <div className="card-body">
                {order.items.map(item => (
                  <div key={item.Book_ID} style={{ display: 'flex', gap: '1rem', padding: '1rem 0', borderBottom: '1px solid #eee' }}>
                    <img 
                      src={`${API_URL}${item.ImagePath}`} 
                      alt={item.Title} 
                      style={{ width: '60px', height: '75px', objectFit: 'cover' }} 
                    />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: 0 }}>{item.Title}</h4>
                      <p style={{ margin: 0, color: '#555' }}>Qty: {item.Quantity}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ margin: 0, fontWeight: 'bold' }}>₹{Number(item.Price).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
