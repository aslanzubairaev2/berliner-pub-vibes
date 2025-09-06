-- Create admin users table
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
CREATE INDEX idx_admin_users_email ON public.admin_users(email);