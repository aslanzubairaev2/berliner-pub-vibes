import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface NewsArticle {
  id: string;
  slug: string;
  category: 'events' | 'menu' | 'general';
  title_de: string;
  title_en: string;
  excerpt_de: string;
  excerpt_en: string;
  content_de: string;
  content_en: string;
  image_url: string | null;
  read_time: number;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  author_name: string;
}

export const useNews = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching news');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const getArticleBySlug = (slug: string) => {
    return articles.find(article => article.slug === slug);
  };

  return {
    articles,
    loading,
    error,
    fetchNews,
    getArticleBySlug
  };
};