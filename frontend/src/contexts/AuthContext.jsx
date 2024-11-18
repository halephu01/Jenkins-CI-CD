import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      validateToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const validateToken = async (token) => {
    try {
      const response = await axios.post('http://localhost:9000/api/auth/introspect', {
        token: token
      });
      
      if (response.data.result.valid) {
        setUser({
          username: localStorage.getItem('username'),
        });
      } else {
        logout();
      }
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:9000/api/auth/token', {
        username,
        password
      });

      if (response.data.result.token) {
        const token = response.data.result.token;
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        
        // Lấy role từ response
        const role = response.data.result.role[0].name;
        setUser({
          username: username,
          role: role,
        });

        return { success: true, role: role };
      }
    } catch (error) {
      throw new Error('Đăng nhập thất bại');
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post('http://localhost:9000/api/auth/logout', {
          token: token
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);