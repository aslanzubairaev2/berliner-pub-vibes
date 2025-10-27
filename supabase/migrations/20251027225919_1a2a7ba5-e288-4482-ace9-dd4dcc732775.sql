-- Insert settings for hero image and gallery
INSERT INTO site_settings (key, value_de, value_en, setting_type, description)
VALUES 
  ('hero_image_url', '/lovable-uploads/23fff502-778f-4c24-9cf5-900858649a7f.png', '/lovable-uploads/23fff502-778f-4c24-9cf5-900858649a7f.png', 'url', 'Main hero image on home page'),
  ('gallery_enabled', 'true', 'true', 'boolean', 'Enable/disable gallery section on home page'),
  ('gallery_images', '[]', '[]', 'json', 'Array of gallery image URLs')
ON CONFLICT (key) DO NOTHING;