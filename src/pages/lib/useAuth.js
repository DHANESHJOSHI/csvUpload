import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/admin/login', { email, password });
      setUser(response.data.user);
      router.push('/admin/dashboard');
    } catch (error) {
      console.error('Login failed:', error.message);
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/admin/logout');
      setUser(null);
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('/api/admin/user');
        setUser(response.data.user);
      } catch (error) {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
