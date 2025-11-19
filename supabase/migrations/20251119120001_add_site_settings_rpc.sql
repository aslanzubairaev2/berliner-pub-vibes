-- Create RPC functions for site settings management with admin token verification

-- Function to update site settings
CREATE OR REPLACE FUNCTION update_site_setting(
  token TEXT,
  setting_id UUID,
  new_key TEXT,
  new_value_de TEXT,
  new_value_en TEXT,
  new_setting_type TEXT,
  new_description TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Verify admin session
  SELECT user_id INTO v_user_id
  FROM admin_sessions
  WHERE session_token = token
    AND expires_at > now()
    AND is_active = true
  LIMIT 1;

  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid or expired session');
  END IF;

  -- Update the setting
  UPDATE site_settings
  SET
    key = new_key,
    value_de = new_value_de,
    value_en = new_value_en,
    setting_type = new_setting_type,
    description = new_description,
    updated_at = now()
  WHERE id = setting_id;

  RETURN jsonb_build_object('success', true);
END;
$$;

-- Function to insert site settings
CREATE OR REPLACE FUNCTION insert_site_setting(
  token TEXT,
  new_key TEXT,
  new_value_de TEXT,
  new_value_en TEXT,
  new_setting_type TEXT,
  new_description TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_setting_id UUID;
BEGIN
  -- Verify admin session
  SELECT user_id INTO v_user_id
  FROM admin_sessions
  WHERE session_token = token
    AND expires_at > now()
    AND is_active = true
  LIMIT 1;

  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid or expired session');
  END IF;

  -- Insert the setting
  INSERT INTO site_settings (key, value_de, value_en, setting_type, description)
  VALUES (new_key, new_value_de, new_value_en, new_setting_type, new_description)
  RETURNING id INTO v_setting_id;

  RETURN jsonb_build_object('success', true, 'id', v_setting_id);
END;
$$;

-- Function to delete site settings
CREATE OR REPLACE FUNCTION delete_site_setting(
  token TEXT,
  setting_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Verify admin session
  SELECT user_id INTO v_user_id
  FROM admin_sessions
  WHERE session_token = token
    AND expires_at > now()
    AND is_active = true
  LIMIT 1;

  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid or expired session');
  END IF;

  -- Delete the setting
  DELETE FROM site_settings WHERE id = setting_id;

  RETURN jsonb_build_object('success', true);
END;
$$;
