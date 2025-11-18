import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function CartPage() {
  const { cartItems, loading, removeItemFromCart, addItemToCart } = useCart();

  const handleRemove = async (bookId: number) => {
    try {
      await removeItemFromCart(bookId);
    } catch (error) {
      alert('Failed to remove item. Please try again.');
    }
  };

  // Example of how you could update quantity
  const handleQuantityChange = async (bookId: number, newQuantity: number) => {
    if (newQuantity < 1) return; // Or remove if 0
    try {
      await addItemToCart(bookId, newQuantity); // Uses our "UPSERT" endpoint
    } catch (error) {
      alert('Failed to update quantity.');
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.Price * item.Quantity), 0);

  if (loading) {
    return <div>Loading your cart...</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added any books yet.</p>
        <Link to="/books" className="btn btn-primary">Browse Books</Link>
      </div>
    );
  }

  return (
    <div className="cart-container" style={{ padding: '2rem' }}>
      <h1>Your Cart</h1>
      <div className="cart-items-list" style={{ marginBottom: '2rem' }}>
        {cartItems.map((item) => (
          <div key={item.Book_ID} className="cart-item" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '1rem 0' }}>
            <div style={{ flex: 2 }}>
              <h4 style={{ margin: 0 }}>{item.Title}</h4>
              <p style={{ margin: 0, color: '#555' }}>by {item.Author}</p>
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <label>Qty: </label>
              <input
                type="number"
                value={item.Quantity}
                onChange={(e) => handleQuantityChange(item.Book_ID, parseInt(e.target.value))}
                min="1"
                max={item.Stock} // Don't allow ordering more than stock
                style={{ width: '60px', margin: '0 1rem' }}
                className="form-input"
              />
            </div>
            <div style={{ flex: 1, textAlign: 'right' }}>
              <strong>₹{(item.Price * item.Quantity).toFixed(2)}</strong>
            </div>
            <div style={{ flex: 0.5, textAlign: 'right' }}>
              <button onClick={() => handleRemove(item.Book_ID)} className="btn btn-sm btn-danger">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary" style={{ textAlign: 'right' }}>
        <h2>Subtotal: ₹{subtotal.toFixed(2)}</h2>
        <Link to="/checkout" className="btn btn-primary">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
