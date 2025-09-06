import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Drink {
  id: string;
  name: string;
  category: 'beer' | 'alcoholic' | 'non_alcoholic';
  price: number;
  alcohol_content: string | null;
  image_url: string | null;
  description_de: string;
  description_en: string;
  full_description_de: string | null;
  full_description_en: string | null;
  is_available: boolean;
  sort_order: number;
}

export const useMenu = () => {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDrinks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('drinks')
        .select('*')
        .eq('is_available', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setDrinks(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching drinks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrinks();
  }, []);

  const getDrinksByCategory = (category: string) => {
    return drinks.filter(drink => drink.category === category);
  };

  return {
    drinks,
    loading,
    error,
    fetchDrinks,
    getDrinksByCategory
  };
};