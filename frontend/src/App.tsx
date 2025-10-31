import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import './style.css';
import { useAuth } from './context/AuthContext'; // Import the auth hook

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth(); // Get auth state
  
  const isLoginPage = location.pathname === '/login' || location.pathname === '/register';
  const isAdminPage = location.pathname.startsWith('/admin');

  // New logout handler
  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login after logout
  };

  // Hide header/footer on login/register pages
  if (isLoginPage) {
    return <Outlet />;
  }

  return (
    <div className="app-shell">
      <header className="header">
        <nav className="nav">
          <NavLink to="/" className="brand">
            📚 Bookstore
          </NavLink>
          <div className="spacer" />
          <div className="nav-links">
            {isAdminPage ? (
              <>
                <NavLink to="/admin/dashboard">Dashboard</NavLink>
                <NavLink to="/admin/books">Books</NavLink>
                <NavLink to="/admin/orders">Orders</NavLink>
              </>
            ) : (
              <>
                <NavLink to="/books">Books</NavLink>
                <NavLink to="/orders">Orders</NavLink>
                <NavLink to="/cart">Cart</NavLink>
              </>
            )}
          </div>
          <div className="user-menu">
            {isAdminPage ? (
              // Admin view
              <>
                <span style={{ marginRight: '1rem' }}>Admin</span>
                <NavLink to="/" className="btn btn-sm btn-secondary"
                  style={{ color: '#000' }} >
                  Customer View
                </NavLink>
              </>
            ) : (
              // Customer view
              isAuthenticated ? (
                <>
                  <span style={{ marginRight: '1rem', color: 'var(--text-color)' }}>
                    Hi, {user?.name.split(' ')[0]}
                  </span>
                  <button 
                    onClick={handleLogout} 
                    className="btn btn-sm btn-secondary"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <NavLink 
                to="/login" 
                  className="btn btn-sm btn-secondary"
                  style={{ color: '#000' }} 
                >
                  Login
                </NavLink>
              )
            )}
          </div>
        </nav>
      </header>
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">
        © {new Date().getFullYear()} Bookstore - Your Gateway to Knowledge
      </footer>
    </div>
  )
}