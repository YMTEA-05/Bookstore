import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios

// This is your backend API URL
const API_URL = 'http://localhost:4000'; // Assuming your backend is on port 4000

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    // --- 1. ADD ADDRESS TO STATE ---
    address: '', 
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Frontend validation
    if (!formData.name) {
      setError('Please enter your name');
      setLoading(false);
      return;
    } else if (!formData.email) {
      setError('Please enter your email');
      setLoading(false);
      return;
    } else if (!formData.password) {
      setError('Please enter a password');
      setLoading(false);
      return;
    } else if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // --- 2. SEND ADDRESS TO BACKEND ---
      // Destructure all needed fields
      const { name, email, password, address } = formData;
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
        address, // Send the address
      });

      setSuccess('Account created. Redirecting to login...');
      setTimeout(() => navigate('/login'), 1000); // Give user time to see message

    } catch (err: any) {
      // Handle errors from the backend
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Registration failed.');
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // --- 3. MAKE HANDLECHANGE WORK FOR TEXTAREA ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Create an account</h1>
          <p className="login-subtitle">Sign up to get started</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your full name"
              required
            />
          </div>
          
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

          {/* --- 4. ADD ADDRESS INPUT FIELD --- */}
          <div className="form-group">
            <label className="form-label">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your shipping address"
              rows={3}
            />
          </div>

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

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="form-input"
              placeholder="Confirm your password"
              required
            />
          </div>

          {(error || success) && (
            <div className="mb-4" style={{ fontSize: '0.875rem' }}>
              {error ? (
                <span style={{ color: 'var(--error-500)' }}>{error}</span>
              ) : (
                <span style={{ color: 'var(--success-600)' }}>{success}</span>
              )}
            </div>
          )}

          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}