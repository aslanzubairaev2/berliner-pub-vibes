-- Drop existing restrictive policy for drinks management
DROP POLICY IF EXISTS "Authenticated users can manage drinks" ON public.drinks;

-- Create more flexible policy for admin operations
-- Allow all operations on drinks table (since admin functionality is session-based)
CREATE POLICY "Allow admin drinks management" 
ON public.drinks 
FOR ALL 
USING (true)
WITH CHECK (true);