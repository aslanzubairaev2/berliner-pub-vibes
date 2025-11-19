-- Create SECURITY DEFINER function for deleting news
-- This allows admins to delete news without direct table access through RLS

CREATE OR REPLACE FUNCTION public.delete_news(
  admin_token TEXT,
  p_news_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  session_user_id UUID;
BEGIN
  -- Verify admin session
  SELECT user_id INTO session_user_id
  FROM public.verify_admin_session(admin_token)
  LIMIT 1;

  -- If session is invalid, raise exception
  IF session_user_id IS NULL THEN
    RAISE EXCEPTION 'Invalid admin session';
  END IF;

  -- Delete news
  DELETE FROM public.news
  WHERE id = p_news_id;

  RETURN TRUE;
END;
$$;

-- Create SECURITY DEFINER function for updating news
CREATE OR REPLACE FUNCTION public.update_news(
  admin_token TEXT,
  p_news_id UUID,
  p_title_de TEXT,
  p_title_en TEXT,
  p_excerpt_de TEXT,
  p_excerpt_en TEXT,
  p_content_de TEXT,
  p_content_en TEXT,
  p_category TEXT,
  p_image_url TEXT,
  p_is_published BOOLEAN,
  p_read_time INTEGER,
  p_slug TEXT,
  p_published_at TIMESTAMP WITH TIME ZONE
)
RETURNS TABLE (
  id UUID,
  title_de TEXT,
  title_en TEXT,
  excerpt_de TEXT,
  excerpt_en TEXT,
  content_de TEXT,
  content_en TEXT,
  author_name TEXT,
  category TEXT,
  image_url TEXT,
  is_published BOOLEAN,
  published_at TIMESTAMP WITH TIME ZONE,
  read_time INTEGER,
  slug TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  session_user_id UUID;
BEGIN
  -- Verify admin session
  SELECT user_id INTO session_user_id
  FROM public.verify_admin_session(admin_token)
  LIMIT 1;

  -- If session is invalid, raise exception
  IF session_user_id IS NULL THEN
    RAISE EXCEPTION 'Invalid admin session';
  END IF;

  -- Update news
  RETURN QUERY
  UPDATE public.news
  SET
    title_de = p_title_de,
    title_en = p_title_en,
    excerpt_de = p_excerpt_de,
    excerpt_en = p_excerpt_en,
    content_de = p_content_de,
    content_en = p_content_en,
    category = p_category::news_category,
    image_url = p_image_url,
    is_published = p_is_published,
    read_time = p_read_time,
    slug = p_slug,
    published_at = p_published_at,
    updated_at = now()
  WHERE news.id = p_news_id
  RETURNING
    news.id,
    news.title_de,
    news.title_en,
    news.excerpt_de,
    news.excerpt_en,
    news.content_de,
    news.content_en,
    news.author_name,
    news.category::TEXT,
    news.image_url,
    news.is_published,
    news.published_at,
    news.read_time,
    news.slug;
END;
$$;

-- Create SECURITY DEFINER function for creating news
CREATE OR REPLACE FUNCTION public.create_news(
  admin_token TEXT,
  p_title_de TEXT,
  p_title_en TEXT,
  p_excerpt_de TEXT,
  p_excerpt_en TEXT,
  p_content_de TEXT,
  p_content_en TEXT,
  p_category TEXT,
  p_image_url TEXT,
  p_is_published BOOLEAN,
  p_read_time INTEGER,
  p_slug TEXT,
  p_published_at TIMESTAMP WITH TIME ZONE
)
RETURNS TABLE (
  id UUID,
  title_de TEXT,
  title_en TEXT,
  excerpt_de TEXT,
  excerpt_en TEXT,
  content_de TEXT,
  content_en TEXT,
  author_name TEXT,
  category TEXT,
  image_url TEXT,
  is_published BOOLEAN,
  published_at TIMESTAMP WITH TIME ZONE,
  read_time INTEGER,
  slug TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  session_user_id UUID;
BEGIN
  -- Verify admin session
  SELECT user_id INTO session_user_id
  FROM public.verify_admin_session(admin_token)
  LIMIT 1;

  -- If session is invalid, raise exception
  IF session_user_id IS NULL THEN
    RAISE EXCEPTION 'Invalid admin session';
  END IF;

  -- Insert news
  RETURN QUERY
  INSERT INTO public.news (
    title_de,
    title_en,
    excerpt_de,
    excerpt_en,
    content_de,
    content_en,
    category,
    image_url,
    is_published,
    read_time,
    slug,
    published_at
  )
  VALUES (
    p_title_de,
    p_title_en,
    p_excerpt_de,
    p_excerpt_en,
    p_content_de,
    p_content_en,
    p_category::news_category,
    p_image_url,
    p_is_published,
    p_read_time,
    p_slug,
    p_published_at
  )
  RETURNING
    news.id,
    news.title_de,
    news.title_en,
    news.excerpt_de,
    news.excerpt_en,
    news.content_de,
    news.content_en,
    news.author_name,
    news.category::TEXT,
    news.image_url,
    news.is_published,
    news.published_at,
    news.read_time,
    news.slug;
END;
$$;
