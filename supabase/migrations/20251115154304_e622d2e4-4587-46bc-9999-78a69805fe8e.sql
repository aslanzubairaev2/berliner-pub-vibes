-- Security Definer Functions for API Key Management
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
$$;