import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SiteSetting {
  id: string;
  key: string;
  value_de: string | null;
  value_en: string | null;
  description: string | null;
  setting_type: string;
}

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<Record<string, SiteSetting>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');

      if (error) throw error;
      
      // Convert array to object with key as index
      const settingsObj = (data || []).reduce((acc, setting) => {
        acc[setting.key] = setting;
        return acc;
      }, {} as Record<string, SiteSetting>);
      
      setSettings(settingsObj);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const getSetting = (key: string, language: 'de' | 'en' = 'de') => {
    const setting = settings[key];
    if (!setting) return null;
    
    const value = language === 'de' ? setting.value_de : setting.value_en;
    return value || setting.value_de || setting.value_en; // Fallback to other language if null
  };

  return {
    settings,
    loading,
    error,
    fetchSettings,
    getSetting
  };
};