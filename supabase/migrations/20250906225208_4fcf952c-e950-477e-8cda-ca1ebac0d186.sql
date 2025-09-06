-- Drop existing restrictive policies
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
USING (bucket_id = 'drink-images');