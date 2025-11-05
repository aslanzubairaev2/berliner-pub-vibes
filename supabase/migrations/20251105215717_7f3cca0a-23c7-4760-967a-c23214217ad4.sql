-- Create a security definer function to change admin password
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
$$;