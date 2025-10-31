import { Link, useNavigate } from 'react-router-dom';
import type { Book } from '@/api/books';
import { useCart } from '@/context/CartContext'; // Import cart hook
import { useAuth } from '@/context/AuthContext'; // Import auth hook
import { useState } from 'react'; // Import useState
import { StarRating } from './StarRating';
const API_URL = 'http://localhost:4000';
type Props = { book: Book };

export default function BookCard({ book }: Props) {
  // --- 1. Get hooks and state ---
  const { cartItems, addItemToCart, removeItemFromCart, loading: cartLoading } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [itemLoading, setItemLoading] = useState(false); // For this specific card's loading state

  // --- 2. Check if this book is in the cart ---
  const cartItem = cartItems.find(item => item.Book_ID === book.Book_ID);
  const quantityInCart = cartItem ? cartItem.Quantity : 0;

  // --- 3. Auth check helper ---
  const handleAuthRedirect = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/books'); // Redirect to login if not authenticated
      return true;
    }
    return false;
  };

  // --- 4. Handlers for cart actions ---
  const handleAddToCart = async () => {
    if (handleAuthRedirect()) return;
    setItemLoading(true);
    try {
      await addItemToCart(book.Book_ID, 1);
    } catch (error) {
      alert('Failed to add item.');
      console.error(error);
    }
    setItemLoading(false);
  };

  const handleIncrease = async () => {
    if (handleAuthRedirect() || !cartItem) return;
    if (cartItem.Quantity >= book.Stock) {
      alert('No more stock available.');
      return;
    }
    setItemLoading(true);
    try {
      await addItemToCart(book.Book_ID, cartItem.Quantity + 1);
    } catch (error) {
      alert('Failed to update quantity.');
      console.error(error);
    }
    setItemLoading(false);
  };

  const handleDecrease = async () => {
    if (handleAuthRedirect() || !cartItem) return;
    
    setItemLoading(true);
    if (cartItem.Quantity > 1) {
      // Decrease quantity
      try {
        await addItemToCart(book.Book_ID, cartItem.Quantity - 1);
      } catch (error) {
        alert('Failed to update quantity.');
      }
    } else {
      // Remove from cart
      try {
        await removeItemFromCart(book.Book_ID);
      } catch (error) {
        alert('Failed to remove item.');
      }
    }
    setItemLoading(false);
  };

  // Disable buttons if the whole cart is loading OR this specific item is
  const isLoading = cartLoading || itemLoading;
  const imageUrl = `${API_URL}${book.ImagePath}`;
  return (
    <article className="book-card">
      <div className="book-cover">
        <Link to={`/books/${book.Book_ID}`}>
          <img
            src={imageUrl}
            alt={book.Title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = '<div class="flex items-center justify-center h-full bg-gray-100 text-gray-400 text-4xl">📚</div>';
              }
            }}
          />
        </Link>
      </div>
      <div className="book-info">
        <h3 className="book-title">
          <Link to={`/books/${book.Book_ID}`}>{book.Title}</Link>
        </h3>
        <p className="book-author">by {book.Author}</p>
        <div style={{ marginBottom: '0.5rem' }}>
          <StarRating rating={book.Average_Rating} count={book.Rating_Count} />
        </div>
        <div className="book-price">₹{book.Price.toFixed(2)}</div>
        <div className="book-stock">
          {book.Stock > 0 ? `${book.Stock} in stock` : 'Out of stock'}
        </div>

        {/* --- 5. UPDATED ACTIONS --- */}
        <div className="book-actions">
          <Link to={`/books/${book.Book_ID}`} className="btn btn-sm btn-outline-primary">
            View Details
          </Link>
          
          {book.Stock > 0 ? (
            quantityInCart === 0 ? (
              // --- "Add to Cart" Button ---
              <button 
                onClick={handleAddToCart} 
                className="btn btn-sm btn-primary"
                disabled={isLoading}
              >
                Add to Cart
              </button>
            ) : (
              // --- Quantity Selector ---
              <div className="quantity-selector-sm">
                <button 
                  onClick={handleDecrease}
                  className="btn btn-sm btn-secondary"
                  disabled={isLoading}
                >
                  -
                </button>
                <span className="quantity-display-sm">
                  {isLoading ? '...' : quantityInCart}
                </span>
                <button 
                  onClick={handleIncrease}
                  className="btn btn-sm btn-secondary"
                  disabled={isLoading || quantityInCart >= book.Stock}
                >
                  +
                </button>
              </div>
            )
          ) : (
            // --- Out of Stock Button ---
            <button className="btn btn-sm" disabled>Out of Stock</button>
          )}
        </div>
      </div>
    </article>
  );
}