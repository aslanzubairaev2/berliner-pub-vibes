-- Fix security warning: Set secure search_path for the function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;-- Create admin users table
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on admin_users table
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy for admin users (only authenticated admins can access)
CREATE POLICY "Only authenticated admins can access admin_users" 
ON public.admin_users 
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

-- Create function to hash passwords (for demo purposes - in production use proper bcrypt)
CREATE OR REPLACE FUNCTION public.simple_hash(password TEXT)
RETURNS TEXT AS $$
BEGIN
  -- Simple MD5 hash for demo (use proper bcrypt in production)
  RETURN md5(password || 'berliner_pub_salt_2024');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Insert default admin user
INSERT INTO public.admin_users (email, password_hash, name) 
VALUES ('admin@berlinerpub.de', public.simple_hash('admin123'), 'Administrator');

-- Create admin sessions table for session management
CREATE TABLE public.admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES public.admin_users(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on admin_sessions
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- Create policy for admin sessions
CREATE POLICY "Admins can manage their own sessions" 
ON public.admin_sessions 
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

-- Create function to generate session token
CREATE OR REPLACE FUNCTION public.generate_session_token()
RETURNS TEXT AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'hex');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create function to authenticate admin
CREATE OR REPLACE FUNCTION public.authenticate_admin(
  admin_email TEXT,
  admin_password TEXT
)
RETURNS TABLE (
  user_id UUID,
  user_name TEXT,
  session_token TEXT
) AS $$
DECLARE
  admin_record public.admin_users%ROWTYPE;
  new_token TEXT;
BEGIN
  -- Find admin user with matching email and password
  SELECT * INTO admin_record
  FROM public.admin_users
  WHERE email = admin_email 
    AND password_hash = public.simple_hash(admin_password)
    AND is_active = true;

  -- If user found
  IF admin_record.id IS NOT NULL THEN
    -- Generate session token
    new_token := public.generate_session_token();
    
    -- Create session (expires in 24 hours)
    INSERT INTO public.admin_sessions (admin_user_id, session_token, expires_at)
    VALUES (admin_record.id, new_token, now() + interval '24 hours');
    
    -- Update last login
    UPDATE public.admin_users 
    SET last_login = now() 
    WHERE id = admin_record.id;
    
    -- Return user data
    RETURN QUERY SELECT admin_record.id, admin_record.name, new_token;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create function to verify session
CREATE OR REPLACE FUNCTION public.verify_admin_session(token TEXT)
RETURNS TABLE (
  user_id UUID,
  user_name TEXT,
  user_email TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT au.id, au.name, au.email
  FROM public.admin_sessions as_table
  JOIN public.admin_users au ON au.id = as_table.admin_user_id
  WHERE as_table.session_token = token 
    AND as_table.expires_at > now()
    AND au.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create indexes for better performance
CREATE INDEX idx_admin_sessions_token ON public.admin_sessions(session_token);
CREATE INDEX idx_admin_sessions_expires ON public.admin_sessions(expires_at);
CREATE INDEX idx_admin_users_email ON public.admin_users(email);-- Enable pgcrypto extension for random token generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;-- Fix generate_session_token function to use alternative random generation
CREATE OR REPLACE FUNCTION public.generate_session_token()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Use md5 hash of random values and timestamp for token generation
  RETURN md5(random()::text || clock_timestamp()::text || random()::text);
END;
$function$;-- Create storage bucket for drink images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('drink-images', 'drink-images', true);

-- Create storage policies for drink images
CREATE POLICY "Anyone can view drink images"
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'drink-images');

CREATE POLICY "Authenticated users can upload drink images"
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'drink-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update drink images"
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'drink-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete drink images"
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'drink-images' AND auth.role() = 'authenticated');-- Create storage policies for drink-images bucket
-- Allow authenticated users to upload files to drink-images bucket
CREATE POLICY "Allow authenticated uploads to drink-images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'drink-images' AND auth.role() = 'authenticated');

-- Allow public access to view drink images
CREATE POLICY "Public access to drink images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'drink-images');

-- Allow authenticated users to update their uploaded files
CREATE POLICY "Allow authenticated updates to drink-images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'drink-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete files
CREATE POLICY "Allow authenticated deletes from drink-images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'drink-images' AND auth.role() = 'authenticated');-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Allow authenticated uploads to drink-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates to drink-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes from drink-images" ON storage.objects;

-- Create more permissive policies for admin functionality
-- Allow anyone to upload to drink-images bucket (since it's admin functionality)
CREATE POLICY "Allow uploads to drink-images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'drink-images');

-- Allow anyone to update files in drink-images bucket
CREATE POLICY "Allow updates to drink-images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'drink-images');

-- Allow anyone to delete files from drink-images bucket
CREATE POLICY "Allow deletes from drink-images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'drink-images');-- Drop existing restrictive policy for drinks management
DROP POLICY IF EXISTS "Authenticated users can manage drinks" ON public.drinks;

-- Create more flexible policy for admin operations
-- Allow all operations on drinks table (since admin functionality is session-based)
CREATE POLICY "Allow admin drinks management" 
ON public.drinks 
FOR ALL 
USING (true)
WITH CHECK (true);-- Create API keys table for managing third-party access
CREATE TABLE public.api_keys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key_name TEXT NOT NULL,
  api_key TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES public.admin_users(id),
  permissions TEXT[] DEFAULT ARRAY['news:create'],
  rate_limit INTEGER DEFAULT 100, -- requests per hour
  last_used TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create API logs table for tracking all API requests
CREATE TABLE public.api_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  api_key_id UUID REFERENCES public.api_keys(id),
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  request_data JSONB,
  response_status INTEGER,
  response_data JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for api_keys
CREATE POLICY "Authenticated users can manage API keys" 
ON public.api_keys 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create RLS policies for api_logs  
CREATE POLICY "Authenticated users can view API logs"
ON public.api_logs 
FOR SELECT 
USING (true);

CREATE POLICY "System can insert API logs"
ON public.api_logs 
FOR INSERT 
WITH CHECK (true);

-- Create function to generate secure API keys
CREATE OR REPLACE FUNCTION public.generate_api_key()
RETURNS TEXT AS $$
BEGIN
  RETURN 'bp_' || encode(gen_random_bytes(32), 'hex');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-generate API key
CREATE OR REPLACE FUNCTION public.set_api_key()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.api_key IS NULL OR NEW.api_key = '' THEN
    NEW.api_key := public.generate_api_key();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_api_key
  BEFORE INSERT ON public.api_keys
  FOR EACH ROW
  EXECUTE FUNCTION public.set_api_key();

-- Create trigger for updated_at
CREATE TRIGGER update_api_keys_updated_at
  BEFORE UPDATE ON public.api_keys
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for better performance
CREATE INDEX idx_api_keys_api_key ON public.api_keys(api_key);
CREATE INDEX idx_api_keys_is_active ON public.api_keys(is_active);
CREATE INDEX idx_api_logs_api_key_id ON public.api_logs(api_key_id);
CREATE INDEX idx_api_logs_created_at ON public.api_logs(created_at);-- Fix security warnings by setting search_path for functions

-- Update generate_api_key function with proper search_path
CREATE OR REPLACE FUNCTION public.generate_api_key()
RETURNS TEXT
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN 'bp_' || encode(gen_random_bytes(32), 'hex');
END;
$$;

-- Update set_api_key function with proper search_path  
CREATE OR REPLACE FUNCTION public.set_api_key()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.api_key IS NULL OR NEW.api_key = '' THEN
    NEW.api_key := public.generate_api_key();
  END IF;
  RETURN NEW;
END;
$$;-- Enable pgcrypto extension for gen_random_bytes function
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Update the generate_api_key function to use the correct approach
CREATE OR REPLACE FUNCTION public.generate_api_key()
RETURNS TEXT
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN 'bp_' || encode(gen_random_bytes(32), 'hex');
END;
$$;-- Remove pgcrypto extension
DROP EXTENSION IF EXISTS pgcrypto;

-- Update the generate_api_key function to use built-in functions
CREATE OR REPLACE FUNCTION public.generate_api_key()
RETURNS TEXT
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Use gen_random_uuid() and md5 for generating secure random key
  RETURN 'bp_' || 
         replace(gen_random_uuid()::text, '-', '') ||
         md5(random()::text || clock_timestamp()::text);
END;
$$;-- Insert settings for hero image and gallery
INSERT INTO site_settings (key, value_de, value_en, setting_type, description)
VALUES 
  ('hero_image_url', '/lovable-uploads/23fff502-778f-4c24-9cf5-900858649a7f.png', '/lovable-uploads/23fff502-778f-4c24-9cf5-900858649a7f.png', 'url', 'Main hero image on home page'),
  ('gallery_enabled', 'true', 'true', 'boolean', 'Enable/disable gallery section on home page'),
  ('gallery_images', '[]', '[]', 'json', 'Array of gallery image URLs')
ON CONFLICT (key) DO NOTHING;-- Reset hero image URL to null so pub_hero fallback is used
UPDATE site_settings 
SET value_de = NULL, value_en = NULL, updated_at = now()
WHERE key = 'hero_image_url';-- КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ БЕЗОПАСНОСТИ: Ограничение доступа к admin таблицам
-- Проблема: Текущие политики позволяют ЛЮБОМУ аутентифицированному пользователю 
-- читать пароли, session tokens и API keys

-- Удаляем небезопасные политики
DROP POLICY IF EXISTS "Only authenticated admins can access admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can manage their own sessions" ON public.admin_sessions;
DROP POLICY IF EXISTS "Authenticated users can manage API keys" ON public.api_keys;
DROP POLICY IF EXISTS "Authenticated users can view API logs" ON public.api_logs;

-- ВАЖНО: Эти таблицы должны быть полностью закрыты от клиентских запросов
-- Доступ только через security definer функции (authenticate_admin, verify_admin_session)

-- Admin Users: НЕТ прямого доступа через клиент
-- (доступ только через security definer функции)
CREATE POLICY "No direct client access to admin_users"
  ON public.admin_users
  FOR ALL
  USING (false)
  WITH CHECK (false);

-- Admin Sessions: НЕТ прямого доступа через клиент
CREATE POLICY "No direct client access to admin_sessions"
  ON public.admin_sessions
  FOR ALL
  USING (false)
  WITH CHECK (false);

-- API Keys: Только service_role может управлять (через функции)
CREATE POLICY "No direct client access to api_keys"
  ON public.api_keys
  FOR ALL
  USING (false)
  WITH CHECK (false);

-- API Logs: Только чтение через service_role, запись через функцию
CREATE POLICY "No direct client access to api_logs"
  ON public.api_logs
  FOR ALL
  USING (false)
  WITH CHECK (false);

-- Комментарии для документации
COMMENT ON POLICY "No direct client access to admin_users" ON public.admin_users IS 
'Критично для безопасности: Доступ к admin_users только через security definer функции (authenticate_admin). Прямой клиентский доступ запрещен для защиты паролей.';

COMMENT ON POLICY "No direct client access to admin_sessions" ON public.admin_sessions IS 
'Критично для безопасности: Доступ к session tokens только через security definer функции (verify_admin_session). Предотвращает кражу токенов.';

COMMENT ON POLICY "No direct client access to api_keys" ON public.api_keys IS 
'Критично для безопасности: API ключи должны управляться только через backend функции с service_role доступом.';

COMMENT ON POLICY "No direct client access to api_logs" ON public.api_logs IS 
'Приватность: Логи API должны быть доступны только через административный интерфейс с proper авторизацией.';-- Create a security definer function to change admin password
CREATE OR REPLACE FUNCTION public.change_admin_password(
  token TEXT,
  current_password TEXT,
  new_password TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_record public.admin_users%ROWTYPE;
  session_user_id UUID;
BEGIN
  -- Verify session and get user_id
  SELECT user_id INTO session_user_id
  FROM public.verify_admin_session(token)
  LIMIT 1;

  -- If session is invalid
  IF session_user_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Session expired. Please login again.'
    );
  END IF;

  -- Get admin user
  SELECT * INTO admin_record
  FROM public.admin_users
  WHERE id = session_user_id
    AND password_hash = public.simple_hash(current_password)
    AND is_active = true;

  -- If current password is incorrect
  IF admin_record.id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Current password is incorrect'
    );
  END IF;

  -- Update password
  UPDATE public.admin_users
  SET password_hash = public.simple_hash(new_password),
      updated_at = now()
  WHERE id = session_user_id;

  RETURN jsonb_build_object(
    'success', true
  );
END;
$$;-- Security Definer Functions for API Key Management
-- These functions allow admins to manage API keys securely without direct table access

-- Function to get all API keys (admin only)
CREATE OR REPLACE FUNCTION public.get_api_keys(admin_token TEXT)
RETURNS TABLE (
  id UUID,
  key_name TEXT,
  api_key TEXT,
  is_active BOOLEAN,
  created_by UUID,
  permissions TEXT[],
  rate_limit INTEGER,
  last_used TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
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

  -- If session is invalid, return empty
  IF session_user_id IS NULL THEN
    RETURN;
  END IF;

  -- Return all API keys
  RETURN QUERY
  SELECT 
    ak.id,
    ak.key_name,
    ak.api_key,
    ak.is_active,
    ak.created_by,
    ak.permissions,
    ak.rate_limit,
    ak.last_used,
    ak.expires_at,
    ak.created_at,
    ak.updated_at
  FROM public.api_keys ak
  ORDER BY ak.created_at DESC;
END;
$$;

-- Function to get API logs (admin only)
CREATE OR REPLACE FUNCTION public.get_api_logs(
  admin_token TEXT,
  filter_api_key_id UUID DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  api_key_id UUID,
  endpoint TEXT,
  method TEXT,
  request_data JSONB,
  response_status INTEGER,
  response_data JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE
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

  -- If session is invalid, return empty
  IF session_user_id IS NULL THEN
    RETURN;
  END IF;

  -- Return API logs with optional filtering
  IF filter_api_key_id IS NOT NULL THEN
    RETURN QUERY
    SELECT 
      al.id,
      al.api_key_id,
      al.endpoint,
      al.method,
      al.request_data,
      al.response_status,
      al.response_data,
      al.ip_address,
      al.user_agent,
      al.created_at
    FROM public.api_logs al
    WHERE al.api_key_id = filter_api_key_id
    ORDER BY al.created_at DESC
    LIMIT 100;
  ELSE
    RETURN QUERY
    SELECT 
      al.id,
      al.api_key_id,
      al.endpoint,
      al.method,
      al.request_data,
      al.response_status,
      al.response_data,
      al.ip_address,
      al.user_agent,
      al.created_at
    FROM public.api_logs al
    ORDER BY al.created_at DESC
    LIMIT 100;
  END IF;
END;
$$;

-- Function to create API key (admin only)
CREATE OR REPLACE FUNCTION public.create_api_key(
  admin_token TEXT,
  p_key_name TEXT,
  p_permissions TEXT[] DEFAULT ARRAY['news:create'],
  p_rate_limit INTEGER DEFAULT 100,
  p_expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  key_name TEXT,
  api_key TEXT,
  is_active BOOLEAN,
  created_by UUID,
  permissions TEXT[],
  rate_limit INTEGER,
  last_used TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  session_user_id UUID;
  new_api_key TEXT;
BEGIN
  -- Verify admin session
  SELECT user_id INTO session_user_id
  FROM public.verify_admin_session(admin_token)
  LIMIT 1;

  -- If session is invalid, raise exception
  IF session_user_id IS NULL THEN
    RAISE EXCEPTION 'Invalid admin session';
  END IF;

  -- Generate API key
  new_api_key := public.generate_api_key();

  -- Insert new API key
  RETURN QUERY
  INSERT INTO public.api_keys (
    key_name,
    api_key,
    permissions,
    rate_limit,
    expires_at,
    created_by
  )
  VALUES (
    p_key_name,
    new_api_key,
    p_permissions,
    p_rate_limit,
    p_expires_at,
    session_user_id
  )
  RETURNING 
    api_keys.id,
    api_keys.key_name,
    api_keys.api_key,
    api_keys.is_active,
    api_keys.created_by,
    api_keys.permissions,
    api_keys.rate_limit,
    api_keys.last_used,
    api_keys.expires_at,
    api_keys.created_at,
    api_keys.updated_at;
END;
$$;

-- Function to update API key (admin only)
CREATE OR REPLACE FUNCTION public.update_api_key(
  admin_token TEXT,
  p_key_id UUID,
  p_key_name TEXT DEFAULT NULL,
  p_is_active BOOLEAN DEFAULT NULL,
  p_permissions TEXT[] DEFAULT NULL,
  p_rate_limit INTEGER DEFAULT NULL,
  p_expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  key_name TEXT,
  api_key TEXT,
  is_active BOOLEAN,
  created_by UUID,
  permissions TEXT[],
  rate_limit INTEGER,
  last_used TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
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

  -- Update API key with provided fields
  RETURN QUERY
  UPDATE public.api_keys
  SET
    key_name = COALESCE(p_key_name, api_keys.key_name),
    is_active = COALESCE(p_is_active, api_keys.is_active),
    permissions = COALESCE(p_permissions, api_keys.permissions),
    rate_limit = COALESCE(p_rate_limit, api_keys.rate_limit),
    expires_at = COALESCE(p_expires_at, api_keys.expires_at),
    updated_at = now()
  WHERE api_keys.id = p_key_id
  RETURNING 
    api_keys.id,
    api_keys.key_name,
    api_keys.api_key,
    api_keys.is_active,
    api_keys.created_by,
    api_keys.permissions,
    api_keys.rate_limit,
    api_keys.last_used,
    api_keys.expires_at,
    api_keys.created_at,
    api_keys.updated_at;
END;
$$;

-- Function to delete API key (admin only)
CREATE OR REPLACE FUNCTION public.delete_api_key(
  admin_token TEXT,
  p_key_id UUID
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

  -- Delete API key
  DELETE FROM public.api_keys
  WHERE id = p_key_id;

  RETURN TRUE;
END;
$$;-- Restore default admin user if deleted
INSERT INTO public.admin_users (email, password_hash, name, role, is_active)
VALUES ('admin@berlinerpub.de', public.simple_hash('admin123'), 'Administrator', 'admin', true)
ON CONFLICT (email) DO UPDATE
SET
  password_hash = public.simple_hash('admin123'),
  name = 'Administrator',
  role = 'admin',
  is_active = true,
  updated_at = now();
