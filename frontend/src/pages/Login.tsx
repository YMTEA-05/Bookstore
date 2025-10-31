import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios
import { useAuth } from '../context/AuthContext'; // Import our hook

const API_URL = 'http://localhost:4000'; // Backend API URL

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'customer'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // Get the login function from our context

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (formData.userType === 'admin') {
        // --- We leave your mock admin logic for now ---
        // (You would build a separate /auth/admin/login endpoint for this)
        await new Promise(resolve => setTimeout(resolve, 500)); 
        if (formData.password === '123') {
          navigate('/admin/dashboard');
        } else {
          setError('Incorrect admin password');
        }
      } else {
        // --- This is the new Customer Login logic ---
        const { email, password } = formData;
        if (!email || !password) {
          setError('Please enter email and password');
          setLoading(false);
          return;
        }

        const response = await axios.post(`${API_URL}/auth/login`, {
          email,
          password,
        });
        
        // Use the context to save token and user
        login(response.data.token, response.data.user);

        // Redirect to home page
        navigate('/');
      }
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Login failed.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // ... rest of your JSX ...
  // (No changes needed to your JSX)
  
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">User Type</label>
            <select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              className="form-input form-select"
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Only show email for customers */}
          {formData.userType !== 'admin' && (
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your email"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div className="mb-4" style={{ color: 'var(--error-500)', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}