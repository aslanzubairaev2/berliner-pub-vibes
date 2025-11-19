-- Add additional contact and opening hours settings
-- This migration adds missing settings that were previously hardcoded in the frontend

INSERT INTO public.site_settings (key, value_de, value_en, setting_type, description) VALUES
  -- Additional email for reservations
  ('email_reservations', 'reservations@berlinerpub.de', 'reservations@berlinerpub.de', 'email', 'Reservations email address'),

  -- Detailed opening hours by day type
  ('hours_monday_friday', '12:00 - 02:00', '12:00 - 02:00', 'text', 'Opening hours Monday to Friday'),
  ('hours_saturday_sunday', '12:00 - 06:00', '12:00 - 06:00', 'text', 'Opening hours Saturday and Sunday')

ON CONFLICT (key) DO UPDATE SET
  value_de = EXCLUDED.value_de,
  value_en = EXCLUDED.value_en,
  setting_type = EXCLUDED.setting_type,
  description = EXCLUDED.description,
  updated_at = now();
