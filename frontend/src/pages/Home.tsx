import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext' // 1. Import the useAuth hook

export default function Home() {
  // 2. Get the auth status and user data
  const { isAuthenticated, user } = useAuth()
  
  // Helper to get the first name
  const firstName = user?.name.split(' ')[0] || 'Reader'

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: '#1e293b', lineHeight: 1.5 }}>

      {/* Hero Section */}
      <section
        style={{
          textAlign: 'center',
          padding: '5rem 1rem',
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
          borderRadius: '1rem',
          marginBottom: '3rem',
        }}
      >
        {/* 3. Add conditional rendering */}
        {isAuthenticated ? (
          // --- LOGGED-IN VIEW ---
          <>
            <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>
              Welcome back,
              <span style={{ display: 'block', color: '#0ea5e9' }}>{firstName}!</span>
            </h1>
            <p style={{ fontSize: '1.125rem', color: '#475569', maxWidth: '600px', margin: '0 auto 2rem' }}>
              Ready to find your next adventure? Dive back into our collection and discover new worlds.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center' }}>
              <Link
                to="/books"
                style={{
                  padding: '0.75rem 2rem',
                  backgroundColor: '#0ea5e9',
                  color: 'white',
                  borderRadius: '0.5rem',
                  fontWeight: 600,
                  fontSize: '1rem',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
                onMouseOver={e => (e.currentTarget.style.backgroundColor = '#0284c7')}
                onMouseOut={e => (e.currentTarget.style.backgroundColor = '#0ea5e9')}
              >
                Browse All Books
              </Link>
            </div>
          </>
        ) : (
          // --- LOGGED-OUT (ORIGINAL) VIEW ---
          <>
            <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>
              Welcome to Our
              <span style={{ display: 'block', color: '#0ea5e9' }}>Digital Bookstore</span>
            </h1>
            <p style={{ fontSize: '1.125rem', color: '#475569', maxWidth: '600px', margin: '0 auto 2rem' }}>
              Discover thousands of books across all genres. From bestsellers to hidden gems, find your next favorite read in our curated collection.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center', alignItems: 'center' }}>
              <Link
                to="/books"
                style={{
                  padding: '0.75rem 2rem',
                  backgroundColor: '#0ea5e9',
                  color: 'white',
                  borderRadius: '0.5rem',
                  fontWeight: 600,
                  fontSize: '1rem',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
                onMouseOver={e => (e.currentTarget.style.backgroundColor = '#0284c7')}
                onMouseOut={e => (e.currentTarget.style.backgroundColor = '#0ea5e9')}
              >
                Browse Books
              </Link>
              <Link
                to="/login"
                style={{
                  padding: '0.75rem 2rem',
                  backgroundColor: 'white',
                  color: '#64748b',
                  borderRadius: '0.5rem',
                  border: '1px solid #cbd5e1',
                  fontWeight: 600,
                  fontSize: '1rem',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
                onMouseOver={e => {
                  e.currentTarget.style.backgroundColor = '#f1f5f9';
                  e.currentTarget.style.color = '#334155';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.color = '#64748b';
                }}
              >
                Sign In
              </Link>
            </div>
          </>
        )}
      </section>

      {/* Features Section (Unchanged) */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        {[
          { icon: '📚', title: 'Extensive Collection', text: 'Browse through thousands of books across all genres and categories.' },
          { icon: '🚚', title: 'Fast Delivery', text: 'Get your books delivered quickly with our reliable shipping service.' },
          { icon: '⭐', title: 'Quality Guaranteed', text: 'Every book is carefully selected and quality-checked before shipping.' },
        ].map((feature, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              padding: '2rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              textAlign: 'center',
              transition: 'all 0.2s',
              cursor: 'default',
            }}
            onMouseOver={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
            onMouseOut={e => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{feature.icon}</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>{feature.title}</h3>
            <p style={{ color: '#475569' }}>{feature.text}</p>
          </div>
        ))}
      </section>

      {/* Quick Stats (Unchanged) */}
      <section
        style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
          border: '1px solid #e2e8f0',
        }}
      >
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, textAlign: 'center', marginBottom: '2rem' }}>
          Why Choose Us?
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1.5rem', textAlign: 'center' }}>
          {[
            { value: '10K+', label: 'Books Available' },
            { value: '50K+', label: 'Happy Customers' },
            { value: '24/7', label: 'Customer Support' },
            { value: '100%', label: 'Satisfaction Guaranteed' },
          ].map((stat, idx) => (
            <div key={idx}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#0ea5e9', marginBottom: '0.25rem' }}>{stat.value}</div>
              <div style={{ color: '#64748b', fontSize: '0.875rem' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}