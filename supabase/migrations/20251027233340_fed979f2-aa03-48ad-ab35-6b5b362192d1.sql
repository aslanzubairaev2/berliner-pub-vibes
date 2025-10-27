-- Reset hero image URL to null so pub_hero fallback is used
UPDATE site_settings 
SET value_de = NULL, value_en = NULL, updated_at = now()
WHERE key = 'hero_image_url';