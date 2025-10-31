import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom' // 1. Added Link
import { fetchBookById, type Book } from '@/api/books'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { StarRating } from '@/components/StarRating' // 2. Import StarRating
import axios from 'axios' // 3. Import axios

// 4. Define types for reviews
interface Review {
  CustomerName: string;
  Rating: number;
  Comments: string;
  Created_at: string;
}

const API_URL = 'http://localhost:4000';

export default function BookDetail() {
  const { id } = useParams()
  const bookId = Number(id)
  const [book, setBook] = useState<Book | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // --- Your existing cart state ---
  const [quantity, setQuantity] = useState(1)
  const [itemLoading, setItemLoading] = useState(false); // For button loading

  // --- 5. Add state for reviews ---
  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComments, setReviewComments] = useState('')
  const [reviewLoading, setReviewLoading] = useState(false)
  const [reviewError, setReviewError] = useState('')
  
  // --- Your existing hooks ---
  const navigate = useNavigate()
  const { isAuthenticated, token } = useAuth() // 6. Get token
  const { 
    cartItems, 
    addItemToCart, 
    removeItemFromCart, 
    loading: cartLoading 
  } = useCart()

  // --- Your existing cart logic ---
  const cartItem = cartItems.find(item => item.Book_ID === bookId)

  // Your existing useEffect for syncing cart quantity
  useEffect(() => {
    if (cartItem) {
      setQuantity(cartItem.Quantity)
    } else {
      setQuantity(1) // Default to 1 if not in cart
    }
  }, [cartItem])

  // --- 7. Create a function to fetch ALL page data (book + reviews) ---
  const loadBookData = async () => {
    if (!Number.isFinite(bookId)) return
    try {
      setError(null);
      // Fetch book details
      const bookData = await fetchBookById(bookId);
      setBook(bookData);
      
      // Fetch book reviews
      const { data: reviewsData } = await axios.get(`${API_URL}/reviews/${bookId}`);
      setReviews(reviewsData);
    } catch (e: any) {
      setError(String(e))
    }
  }

  // Your existing useEffect for fetching the book, now calls loadBookData
  useEffect(() => {
    loadBookData()
  }, [id, bookId])

  // --- 5. Create handlers for all cart actions (YOURS, UNCHANGED) ---
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/books/' + id)
      return
    }
    if (!book) return 
    
    setItemLoading(true);
    try {
      await addItemToCart(book.Book_ID, quantity)
    } catch (error) {
      alert('Failed to add book to cart. Please try again.')
      console.error(error)
    }
    setItemLoading(false);
  }

  const handleIncrease = async () => {
    if (!book || !cartItem) return;
    if (cartItem.Quantity >= book.Stock) {
      alert('No more stock available.');
      return;
    }
    setItemLoading(true);
    try {
      await addItemToCart(book.Book_ID, cartItem.Quantity + 1);
    } catch (error) {
      alert('Failed to update quantity.');
    }
    setItemLoading(false);
  };

  const handleDecrease = async () => {
    if (!book || !cartItem) return;
    
    setItemLoading(true);
    if (cartItem.Quantity > 1) {
      try {
        await addItemToCart(book.Book_ID, cartItem.Quantity - 1);
      } catch (error) {
        alert('Failed to update quantity.');
      }
    } else {
      try {
        await removeItemFromCart(book.Book_ID);
      } catch (error) {
        alert('Failed to remove item.');
      }
    }
    setItemLoading(false);
  };
  
  // --- 8. Add handler for submitting a new review ---
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewLoading(true);
    setReviewError('');

    try {
      const authAxios = axios.create({
        baseURL: API_URL,
        headers: { Authorization: `Bearer ${token}` }
      });
      await authAxios.post(`/reviews/${bookId}`, {
        rating: reviewRating,
        comments: reviewComments,
      });
      
      setReviewRating(5);
      setReviewComments('');
      loadBookData(); // Reload all data to show new review and average
      
    } catch (err: any) {
      setReviewError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setReviewLoading(false);
    }
  }
  
  const isLoading = cartLoading || itemLoading;

  if (error) return <p style={{ color: 'crimson' }}>{error}</p>
  if (!book) return <p>Loading...</p>

  // 6. Update the JSX
  return (
    <section>
      {/* --- YOUR EXISTING BOOK DETAILS --- */}
      <h2>{book.Title}</h2>
      <p>Author: {book.Author}</p>
      
      {/* --- 9. Add StarRating component --- */}
      <div style={{ margin: '1rem 0' }}>
        <StarRating rating={book.Average_Rating} count={book.Rating_Count} />
      </div>

      <p>Genre: {book.Genre ?? '—'}</p>
      <p>Published: {book.Published}</p>
      <p>Price: ₹ {book.Price.toFixed(2)}</p>
      <p>Language: {book.Language}</p>
      <p>
        In stock: 
        <span style={{ color: book.Stock > 0 ? 'green' : 'red', marginLeft: '8px', fontWeight: 'bold' }}>
          {book.Stock > 0 ? `${book.Stock} available` : 'Out of Stock'}
        </span>
      </p>

      <hr style={{ margin: '1.5rem 0' }} />

      {/* --- YOUR EXISTING CART CONTROLS --- */}
      <div className="cart-controls" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {!cartItem ? (
          <>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ marginBottom: '0.25rem' }}>Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
                min="1"
                max={book.Stock}
                disabled={book.Stock === 0 || isLoading}
                className="form-input"
                style={{ width: '80px' }}
              />
            </div>
            
            <button 
              onClick={handleAddToCart} 
              className="btn btn-primary"
              disabled={book.Stock === 0 || isLoading}
              style={{ alignSelf: 'flex-end' }} 
            >
              {book.Stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </>
        ) : (
          <>
            <label className="form-label" style={{ marginBottom: 0 }}>Quantity</label>
            <div className="quantity-selector" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button 
                onClick={handleDecrease}
                className="btn btn-secondary"
                disabled={isLoading}
                style={{ width: '40px', height: '40px', borderRadius: '99px', padding: 0 }}
              >
                -
              </button>
              <span style={{ fontSize: '1.25rem', fontWeight: 600, minWidth: '40px', textAlign: 'center' }}>
                {isLoading ? '...' : cartItem.Quantity}
              </span>
              <button 
                onClick={handleIncrease}
                className="btn btn-secondary"
                disabled={isLoading || cartItem.Quantity >= book.Stock}
                style={{ width: '40px', height: '40px', borderRadius: '99px', padding: 0 }}
              >
                +
              </button>
            </div>
          </>
        )}
      </div>
      
      {/* --- 10. ADD REVIEW SECTION --- */}
      <hr style={{ margin: '1.5rem 0' }} />
      <div className="reviews-section">
        <h2>Customer Reviews</h2>

        {isAuthenticated ? (
          <form onSubmit={handleReviewSubmit} className="card" style={{ marginBottom: '2rem' }}>
            <div className="card-body">
              <h4 className="card-title">Write Your Review</h4>
              <div className="form-group">
                <label className="form-label">Rating</label>
                <select 
                  className="form-input form-select" 
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                >
                  <option value={5}>5 - Excellent</option>
                  <option value={4}>4 - Good</option>
                  <option value={3}>3 - Average</option>
                  <option value={2}>2 - Fair</option>
                  <option value={1}>1 - Poor</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Comments</label>
                <textarea 
                  className="form-input" 
                  rows={4}
                  value={reviewComments}
                  onChange={(e) => setReviewComments(e.target.value)}
                  placeholder="Tell us what you thought..."
                  required
                />
              </div>
              {reviewError && <p style={{ color: 'var(--error-500)' }}>{reviewError}</p>}
              <button type="submit" className="btn btn-primary" disabled={reviewLoading}>
                {reviewLoading ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        ) : (
          <p style={{ margin: '1rem 0' }}>
            <Link to={`/login?redirect=/books/${bookId}`}>Log in</Link> to write a review.
          </p>
        )}

        {/* --- REVIEW LIST --- */}
        <div className="review-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <div key={index} className="card">
                <div className="card-body">
                  <StarRating rating={review.Rating} />
                  <p style={{ margin: '0.5rem 0' }}>{review.Comments}</p>
                  <small style={{ color: '#6b7280' }}>
                    By {review.CustomerName} on {new Date(review.Created_at).toLocaleDateString()}
                  </small>
                </div>
              </div>
            ))
          ) : (
            <p>No reviews yet. Be the first to write one!</p>
          )}
        </div>
      </div>
    </section>
  )
}