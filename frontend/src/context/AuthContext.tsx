import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// Define the shape of the user object
interface User {
  id: number;
  name: string;
  email: string;
  Address?: string | null;
}

// Define the shape of the context
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Check sessionStorage for token on initial load
  useEffect(() => {
    const storedToken = sessionStorage.getItem('token'); // Changed from localStorage
    const storedUser = sessionStorage.getItem('user'); // Changed from localStorage
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    sessionStorage.setItem('token', newToken); // Changed from localStorage
    sessionStorage.setItem('user', JSON.stringify(newUser)); // Changed from localStorage
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    sessionStorage.removeItem('token'); // Changed from localStorage
    sessionStorage.removeItem('user'); // Changed from localStorage
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      logout, 
      isAuthenticated: !!token 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};