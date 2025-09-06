-- Fix generate_session_token function to use alternative random generation
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
$function$;