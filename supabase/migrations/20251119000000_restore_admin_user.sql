-- Restore default admin user if deleted
INSERT INTO public.admin_users (email, password_hash, name, role, is_active)
VALUES ('admin@berlinerpub.de', public.simple_hash('admin123'), 'Administrator', 'admin', true)
ON CONFLICT (email) DO UPDATE
SET
  password_hash = public.simple_hash('admin123'),
  name = 'Administrator',
  role = 'admin',
  is_active = true,
  updated_at = now();
