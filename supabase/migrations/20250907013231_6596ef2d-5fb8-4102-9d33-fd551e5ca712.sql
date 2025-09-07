-- Fix security warnings by setting search_path for functions

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
$$;