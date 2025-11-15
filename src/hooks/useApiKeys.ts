import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Helper to get admin session token
const getAdminToken = () => {
  return localStorage.getItem('adminSessionToken') || '';
};

export interface ApiKey {
  id: string;
  key_name: string;
  api_key: string;
  is_active: boolean;
  created_by: string | null;
  permissions: string[];
  rate_limit: number;
  last_used: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApiLog {
  id: string;
  api_key_id: string;
  endpoint: string;
  method: string;
  request_data: any;
  response_status: number;
  response_data: any;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export const useApiKeys = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [apiLogs, setApiLogs] = useState<ApiLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApiKeys = async () => {
    try {
      setLoading(true);
      const adminToken = getAdminToken();
      
      const { data, error } = await supabase
        .rpc('get_api_keys', { admin_token: adminToken });

      if (error) throw error;
      setApiKeys(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching API keys');
    } finally {
      setLoading(false);
    }
  };

  const fetchApiLogs = async (apiKeyId?: string) => {
    try {
      const adminToken = getAdminToken();
      
      const { data, error } = await supabase
        .rpc('get_api_logs', { 
          admin_token: adminToken,
          filter_api_key_id: apiKeyId || null
        });

      if (error) throw error;
      setApiLogs(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching API logs');
    }
  };

  const createApiKey = async (keyData: {
    key_name: string;
    permissions?: string[];
    rate_limit?: number;
    expires_at?: string;
  }) => {
    try {
      const adminToken = getAdminToken();
      
      const { data, error } = await supabase
        .rpc('create_api_key', {
          admin_token: adminToken,
          p_key_name: keyData.key_name,
          p_permissions: keyData.permissions || ['news:create'],
          p_rate_limit: keyData.rate_limit || 100,
          p_expires_at: keyData.expires_at || null
        });

      if (error) throw error;
      await fetchApiKeys();
      return { data: data?.[0] || null, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error creating API key';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    }
  };

  const updateApiKey = async (id: string, updates: Partial<ApiKey>) => {
    try {
      const adminToken = getAdminToken();
      
      const { data, error } = await supabase
        .rpc('update_api_key', {
          admin_token: adminToken,
          p_key_id: id,
          p_key_name: updates.key_name || null,
          p_is_active: updates.is_active !== undefined ? updates.is_active : null,
          p_permissions: updates.permissions || null,
          p_rate_limit: updates.rate_limit || null,
          p_expires_at: updates.expires_at || null
        });

      if (error) throw error;
      await fetchApiKeys();
      return { data: data?.[0] || null, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error updating API key';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    }
  };

  const deleteApiKey = async (id: string) => {
    try {
      const adminToken = getAdminToken();
      
      const { error } = await supabase
        .rpc('delete_api_key', {
          admin_token: adminToken,
          p_key_id: id
        });

      if (error) throw error;
      await fetchApiKeys();
      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error deleting API key';
      setError(errorMessage);
      return { error: errorMessage };
    }
  };

  const toggleApiKey = async (id: string, isActive: boolean) => {
    return updateApiKey(id, { is_active: isActive });
  };

  useEffect(() => {
    fetchApiKeys();
  }, []);

  return {
    apiKeys,
    apiLogs,
    loading,
    error,
    fetchApiKeys,
    fetchApiLogs,
    createApiKey,
    updateApiKey,
    deleteApiKey,
    toggleApiKey
  };
};