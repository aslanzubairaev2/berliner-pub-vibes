-- Create storage bucket for drink images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('drink-images', 'drink-images', true);

-- Create storage policies for drink images
CREATE POLICY "Anyone can view drink images"
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'drink-images');

CREATE POLICY "Authenticated users can upload drink images"
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'drink-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update drink images"
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'drink-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete drink images"
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'drink-images' AND auth.role() = 'authenticated');