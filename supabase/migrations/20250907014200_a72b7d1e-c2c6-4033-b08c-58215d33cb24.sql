-- Remove pgcrypto extension
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
$$;