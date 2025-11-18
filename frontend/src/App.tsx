import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';
import './style.css'; // Make sure styles are imported

export default function App() {
  const { isAuthenticated, user, logout } = useAuth();
  const { cartItems } = useCart();

  // Calculate total items in cart
  const cartCount = cartItems.reduce((sum, item) => sum + item.Quantity, 0);

  return (
    <div className="app-shell">
      <header className="header">
        <nav className="nav">
          <NavLink to="/" className="brand">
            📚 Bookstore
          </NavLink>
          <div className="nav-links">
            <NavLink to="/books">Books</NavLink>
          </div>
          <div className="spacer"></div>
          <div className="user-menu">
            {isAuthenticated ? (
              <>
                {/* Add a link to the admin dashboard if the user is an admin */}
                {/* You might need to add role-based logic here */}
                {user?.email.endsWith('@admin.com') && ( // Example admin check
                    <NavLink to="/admin/dashboard">Admin</NavLink>
                )}
                <NavLink to="/orders">My Orders</NavLink>
                <NavLink to="/cart" className="btn btn-sm btn-secondary">
                  Cart {cartCount > 0 && `(${cartCount})`}
                </NavLink>
                <span style={{ color: 'white', marginLeft: '8px' }}>Hi, {user?.name.split(' ')[0]}</span>
                <button onClick={logout} className="btn btn-sm btn-secondary" style={{ marginLeft: '8px' }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/register">Register</NavLink>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="main">
        {/* This Outlet renders the specific page (Home, Books, Login, etc.) */}
        <Outlet />
      </main>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Bookstore Project - UE23CS351A</p>
      </footer>
    </div>
  );
}