-- Create storage policies for drink-images bucket
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
USING (bucket_id = 'drink-images' AND auth.role() = 'authenticated');