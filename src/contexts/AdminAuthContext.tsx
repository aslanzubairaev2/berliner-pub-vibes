import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdminUser {
  id: string;
  name: string;
  email: string;
}

interface AdminAuthContextType {
  user: AdminUser | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

interface AdminAuthProviderProps {
  children: ReactNode;
}

export const AdminAuthProvider = ({ children }: AdminAuthProviderProps) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const token = localStorage.getItem('admin_session_token');
    if (token) {
      verifySession(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifySession = async (token: string) => {
    try {
      const { data, error } = await supabase.rpc('verify_admin_session', { token });
      
      if (error || !data || data.length === 0) {
        localStorage.removeItem('admin_session_token');
        setUser(null);
      } else {
        const userData = data[0];
        setUser({
          id: userData.user_id,
          name: userData.user_name,
          email: userData.user_email
        });
      }
    } catch (error) {
      console.error('Session verification error:', error);
      localStorage.removeItem('admin_session_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('authenticate_admin', {
        admin_email: email,
        admin_password: password
      });

      if (error || !data || data.length === 0) {
        return { success: false, error: 'Invalid email or password' };
      }

      const userData = data[0];
      const adminUser = {
        id: userData.user_id,
        name: userData.user_name,
        email: email
      };

      setUser(adminUser);
      localStorage.setItem('admin_session_token', userData.session_token);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_session_token');
    setUser(null);
  };

  return (
    <AdminAuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};