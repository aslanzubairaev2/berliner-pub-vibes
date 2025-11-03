# Berliner Pub Website - Installationsanleitung

Diese Anleitung beschreibt die vollständige Installation und Konfiguration der Berliner Pub Website für einen neuen Client mit eigener Supabase-Datenbank.

## Inhaltsverzeichnis

1. [Voraussetzungen](#voraussetzungen)
2. [Supabase-Projekt erstellen](#supabase-projekt-erstellen)
3. [Datenbank-Schema einrichten](#datenbank-schema-einrichten)
4. [Row Level Security (RLS) Policies](#row-level-security-rls-policies)
5. [Storage Buckets konfigurieren](#storage-buckets-konfigurieren)
6. [Projekt-Konfiguration](#projekt-konfiguration)
7. [Lokale Entwicklung](#lokale-entwicklung)
8. [Deployment auf Hosting/Domain](#deployment-auf-hostingdomain)
9. [Admin-Zugang einrichten](#admin-zugang-einrichten)
10. [API-Keys und Secrets](#api-keys-und-secrets)

---

## Voraussetzungen

- Node.js (Version 18 oder höher)
- npm oder yarn Package Manager
- Git
- Ein Supabase-Account (kostenlos unter https://supabase.com)
- Ein Hosting-Account (z.B. Netlify, Vercel, oder eigener Server)

---

## Supabase-Projekt erstellen

1. Gehen Sie zu https://supabase.com und melden Sie sich an
2. Klicken Sie auf "New Project"
3. Geben Sie folgende Informationen ein:
   - **Project Name**: berliner-pub (oder Ihren gewünschten Namen)
   - **Database Password**: Wählen Sie ein sicheres Passwort (WICHTIG: Notieren Sie dieses Passwort!)
   - **Region**: Wählen Sie die Region am nächsten zu Ihren Nutzern (z.B. Frankfurt für Deutschland)
4. Klicken Sie auf "Create new project" und warten Sie ca. 2 Minuten

5. Notieren Sie sich folgende Werte aus Ihrem Projekt-Dashboard:
   - **Project URL**: Zu finden unter Settings → API → Project URL
   - **anon/public key**: Zu finden unter Settings → API → Project API keys → anon public
   - **Project ID**: Der Teil nach `https://` und vor `.supabase.co` in Ihrer Project URL

---

## Datenbank-Schema einrichten

### Schritt 1: SQL Editor öffnen

1. Gehen Sie in Ihrem Supabase-Projekt zum **SQL Editor** (linkes Menü)
2. Klicken Sie auf "New query"

### Schritt 2: Enums erstellen

Führen Sie folgende SQL-Befehle nacheinander aus:

```sql
-- Erstelle Enum für Getränke-Kategorien
CREATE TYPE public.drink_category AS ENUM (
  'beer',
  'wine',
  'cocktails',
  'spirits',
  'non_alcoholic',
  'hot_drinks'
);

-- Erstelle Enum für News-Kategorien
CREATE TYPE public.news_category AS ENUM (
  'general',
  'events',
  'promotions',
  'announcements'
);
```

### Schritt 3: Haupttabellen erstellen

```sql
-- Tabelle für Getränke
CREATE TABLE public.drinks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description_de TEXT NOT NULL,
  description_en TEXT NOT NULL,
  full_description_de TEXT,
  full_description_en TEXT,
  category drink_category NOT NULL,
  price NUMERIC NOT NULL,
  alcohol_content TEXT,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabelle für News/Blog-Artikel
CREATE TABLE public.news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_de TEXT NOT NULL,
  title_en TEXT NOT NULL,
  excerpt_de TEXT NOT NULL,
  excerpt_en TEXT NOT NULL,
  content_de TEXT NOT NULL,
  content_en TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  image_url TEXT,
  author_name TEXT DEFAULT 'Berliner Pub',
  category news_category DEFAULT 'general',
  read_time INTEGER DEFAULT 5,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabelle für Website-Einstellungen
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value_de TEXT,
  value_en TEXT,
  description TEXT,
  setting_type TEXT DEFAULT 'text',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### Schritt 4: Admin-Tabellen erstellen

```sql
-- Tabelle für Admin-Benutzer
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabelle für Admin-Sessions
CREATE TABLE public.admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### Schritt 5: API-Management Tabellen

```sql
-- Tabelle für API Keys
CREATE TABLE public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key TEXT UNIQUE NOT NULL,
  key_name TEXT NOT NULL,
  permissions TEXT[] DEFAULT ARRAY['news:create'],
  is_active BOOLEAN DEFAULT true,
  rate_limit INTEGER DEFAULT 100,
  created_by UUID,
  last_used TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabelle für API Logs
CREATE TABLE public.api_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID REFERENCES api_keys(id) ON DELETE SET NULL,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  request_data JSONB,
  response_data JSONB,
  response_status INTEGER,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### Schritt 6: Hilfsfunktionen erstellen

```sql
-- Funktion für einfaches Hashing (für Demo-Zwecke)
-- WICHTIG: In Produktion sollten Sie bcrypt verwenden!
CREATE OR REPLACE FUNCTION public.simple_hash(password TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN md5(password || 'berliner_pub_salt_2024');
END;
$$;

-- Funktion zum Generieren von Session Tokens
CREATE OR REPLACE FUNCTION public.generate_session_token()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN md5(random()::text || clock_timestamp()::text || random()::text);
END;
$$;

-- Funktion zum Generieren von API Keys
CREATE OR REPLACE FUNCTION public.generate_api_key()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN 'bp_' || 
         replace(gen_random_uuid()::text, '-', '') ||
         md5(random()::text || clock_timestamp()::text);
END;
$$;

-- Funktion für Admin-Authentifizierung
CREATE OR REPLACE FUNCTION public.authenticate_admin(
  admin_email TEXT,
  admin_password TEXT
)
RETURNS TABLE(user_id UUID, user_name TEXT, session_token TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_record public.admin_users%ROWTYPE;
  new_token TEXT;
BEGIN
  SELECT * INTO admin_record
  FROM public.admin_users
  WHERE email = admin_email 
    AND password_hash = public.simple_hash(admin_password)
    AND is_active = true;

  IF admin_record.id IS NOT NULL THEN
    new_token := public.generate_session_token();
    
    INSERT INTO public.admin_sessions (admin_user_id, session_token, expires_at)
    VALUES (admin_record.id, new_token, now() + interval '24 hours');
    
    UPDATE public.admin_users 
    SET last_login = now() 
    WHERE id = admin_record.id;
    
    RETURN QUERY SELECT admin_record.id, admin_record.name, new_token;
  END IF;
END;
$$;

-- Funktion zur Session-Verifizierung
CREATE OR REPLACE FUNCTION public.verify_admin_session(token TEXT)
RETURNS TABLE(user_id UUID, user_name TEXT, user_email TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT au.id, au.name, au.email
  FROM public.admin_sessions as_table
  JOIN public.admin_users au ON au.id = as_table.admin_user_id
  WHERE as_table.session_token = token 
    AND as_table.expires_at > now()
    AND au.is_active = true;
END;
$$;

-- Funktion für updated_at Trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Funktion für API Key Trigger
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
```

### Schritt 7: Triggers erstellen

```sql
-- Trigger für updated_at bei Getränken
CREATE TRIGGER update_drinks_updated_at
  BEFORE UPDATE ON public.drinks
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Trigger für updated_at bei News
CREATE TRIGGER update_news_updated_at
  BEFORE UPDATE ON public.news
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Trigger für API Key Generation
CREATE TRIGGER set_api_key_trigger
  BEFORE INSERT ON public.api_keys
  FOR EACH ROW
  EXECUTE FUNCTION public.set_api_key();
```

---

## Row Level Security (RLS) Policies

RLS schützt Ihre Daten vor unberechtigtem Zugriff. Aktivieren Sie RLS für alle Tabellen:

### Schritt 1: RLS aktivieren

```sql
-- RLS für alle Tabellen aktivieren
ALTER TABLE public.drinks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_logs ENABLE ROW LEVEL SECURITY;
```

### Schritt 2: Policies für Getränke (drinks)

```sql
-- Jeder kann verfügbare Getränke ansehen
CREATE POLICY "Anyone can view available drinks"
  ON public.drinks
  FOR SELECT
  USING (is_available = true);

-- Admins können alle Getränke verwalten
CREATE POLICY "Allow admin drinks management"
  ON public.drinks
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

### Schritt 3: Policies für News

```sql
-- Jeder kann veröffentlichte News ansehen
CREATE POLICY "Anyone can view published news"
  ON public.news
  FOR SELECT
  USING (is_published = true);

-- Authentifizierte Benutzer können News verwalten
CREATE POLICY "Authenticated users can manage news"
  ON public.news
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

### Schritt 4: Policies für Site Settings

```sql
-- Jeder kann Site Settings ansehen
CREATE POLICY "Anyone can view site settings"
  ON public.site_settings
  FOR SELECT
  USING (true);

-- Authentifizierte Benutzer können Settings verwalten
CREATE POLICY "Authenticated users can manage settings"
  ON public.site_settings
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

### Schritt 5: Policies für Admin-Tabellen

```sql
-- Admin Users Policies
CREATE POLICY "Only authenticated admins can access admin_users"
  ON public.admin_users
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Admin Sessions Policies
CREATE POLICY "Admins can manage their own sessions"
  ON public.admin_sessions
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

### Schritt 6: Policies für API Management

```sql
-- API Keys Policies
CREATE POLICY "Authenticated users can manage API keys"
  ON public.api_keys
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- API Logs Policies (nur Lesen und Einfügen)
CREATE POLICY "Authenticated users can view API logs"
  ON public.api_logs
  FOR SELECT
  USING (true);

CREATE POLICY "System can insert API logs"
  ON public.api_logs
  FOR INSERT
  WITH CHECK (true);
```

---

## Storage Buckets konfigurieren

### Schritt 1: Bucket für Getränke-Bilder erstellen

Gehen Sie zu Storage im Supabase Dashboard und führen Sie aus:

```sql
-- Erstelle öffentlichen Bucket für Getränke-Bilder
INSERT INTO storage.buckets (id, name, public)
VALUES ('drink-images', 'drink-images', true);
```

### Schritt 2: Storage Policies

```sql
-- Jeder kann Bilder ansehen
CREATE POLICY "Public can view drink images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'drink-images');

-- Authentifizierte Benutzer können hochladen
CREATE POLICY "Authenticated users can upload drink images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'drink-images');

-- Authentifizierte Benutzer können aktualisieren
CREATE POLICY "Authenticated users can update drink images"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'drink-images');

-- Authentifizierte Benutzer können löschen
CREATE POLICY "Authenticated users can delete drink images"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'drink-images');
```

---

## Projekt-Konfiguration

### Schritt 1: Repository klonen

```bash
git clone <IHR_REPOSITORY_URL>
cd berliner-pub
```

### Schritt 2: Abhängigkeiten installieren

```bash
npm install
```

### Schritt 3: Umgebungsvariablen konfigurieren

Erstellen oder bearbeiten Sie die `.env` Datei im Projekt-Root:

```env
VITE_SUPABASE_URL=https://IHR_PROJECT_ID.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=IHR_ANON_PUBLIC_KEY
VITE_SUPABASE_PROJECT_ID=IHR_PROJECT_ID
```

Ersetzen Sie:
- `IHR_PROJECT_ID` mit Ihrer Supabase Project ID
- `IHR_ANON_PUBLIC_KEY` mit Ihrem anon/public key

### Schritt 4: Supabase Client aktualisieren

Bearbeiten Sie `src/integrations/supabase/client.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://IHR_PROJECT_ID.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "IHR_ANON_PUBLIC_KEY";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
```

---

## Lokale Entwicklung

### Entwicklungsserver starten

```bash
npm run dev
```

Die Anwendung ist jetzt unter `http://localhost:5173` erreichbar.

### Build für Produktion erstellen

```bash
npm run build
```

Die Build-Dateien befinden sich im `dist` Ordner.

---

## Deployment auf Hosting/Domain

### Option 1: Netlify

1. Gehen Sie zu https://netlify.com und melden Sie sich an
2. Klicken Sie auf "Add new site" → "Import an existing project"
3. Verbinden Sie Ihr Git-Repository
4. Konfigurieren Sie die Build-Einstellungen:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Fügen Sie Umgebungsvariablen hinzu:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_PROJECT_ID`
6. Klicken Sie auf "Deploy site"

#### Custom Domain bei Netlify

1. Gehen Sie zu Site settings → Domain management
2. Klicken Sie auf "Add custom domain"
3. Folgen Sie den Anweisungen zur DNS-Konfiguration

### Option 2: Vercel

1. Gehen Sie zu https://vercel.com und melden Sie sich an
2. Klicken Sie auf "Add New" → "Project"
3. Importieren Sie Ihr Git-Repository
4. Konfigurieren Sie:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Fügen Sie Environment Variables hinzu
6. Klicken Sie auf "Deploy"

#### Custom Domain bei Vercel

1. Gehen Sie zu Project Settings → Domains
2. Fügen Sie Ihre Domain hinzu
3. Konfigurieren Sie DNS-Einträge gemäß Anleitung

### Option 3: Eigener Server (Apache/Nginx)

#### Build erstellen

```bash
npm run build
```

#### Nginx-Konfiguration

```nginx
server {
    listen 80;
    server_name ihre-domain.de;
    root /pfad/zu/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip Kompression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
```

#### Apache-Konfiguration (.htaccess)

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### Wichtig: Supabase URL-Konfiguration

Nach dem Deployment müssen Sie in Supabase die erlaubten URLs hinzufügen:

1. Gehen Sie zu Authentication → URL Configuration
2. Fügen Sie zu "Site URL" hinzu: `https://ihre-domain.de`
3. Fügen Sie zu "Redirect URLs" hinzu: `https://ihre-domain.de/**`

---

## Admin-Zugang einrichten

### Ersten Admin-Benutzer erstellen

Führen Sie im SQL Editor aus:

```sql
-- Erstelle ersten Admin-Benutzer
INSERT INTO public.admin_users (email, password_hash, name, role, is_active)
VALUES (
  'admin@berliner-pub.de',
  public.simple_hash('IhrSicheresPasswort123!'),
  'Administrator',
  'admin',
  true
);
```

**WICHTIG**: Ändern Sie das Passwort sofort nach dem ersten Login!

### Admin-Bereich zugreifen

1. Gehen Sie zu `https://ihre-domain.de/admin/login`
2. Melden Sie sich mit den erstellten Credentials an
3. Sie haben nun Zugriff auf:
   - Dashboard
   - Getränke-Verwaltung
   - News-Verwaltung
   - API Keys
   - Website-Einstellungen
   - Erscheinungsbild-Anpassungen
   - Analytics

---

## API-Keys und Secrets

### Edge Functions konfigurieren (Optional)

Falls Sie die Edge Functions nutzen möchten:

1. Gehen Sie zu Settings → Edge Functions
2. Fügen Sie folgende Secrets hinzu:
   - `SUPABASE_URL`: Ihre Supabase URL
   - `SUPABASE_ANON_KEY`: Ihr anon key
   - `SUPABASE_SERVICE_ROLE_KEY`: Ihr service_role key (Vorsicht!)

### Hugging Face API (für Bild-Generierung)

Falls die Bild-Generierungs-Funktion benötigt wird:

1. Erstellen Sie einen Account auf https://huggingface.co
2. Erstellen Sie ein Access Token
3. Fügen Sie in Supabase Edge Functions Secrets hinzu:
   - Key: `HUGGING_FACE_ACCESS_TOKEN`
   - Value: Ihr Token

---

## Wartung und Updates

### Datenbank-Backup

Führen Sie regelmäßig Backups durch:

1. Gehen Sie zu Database → Backups in Supabase
2. Klicken Sie auf "Create backup"
3. Aktivieren Sie automatische Backups (empfohlen)

### Logs überwachen

- **Database Logs**: Database → Logs
- **Edge Function Logs**: Edge Functions → [Funktion] → Logs
- **Auth Logs**: Authentication → Logs

### Sicherheit

1. **Regelmäßig Passwörter ändern**
2. **API Keys rotieren**
3. **RLS Policies überprüfen**
4. **Abgelaufene Sessions löschen**:

```sql
DELETE FROM public.admin_sessions WHERE expires_at < now();
```

---

## Fehlerbehebung

### Problem: "requested path is invalid" beim Login

**Lösung**: Site URL und Redirect URLs in Supabase konfigurieren (siehe Deployment-Abschnitt)

### Problem: Bilder werden nicht angezeigt

**Lösung**: Überprüfen Sie, ob der `drink-images` Bucket öffentlich ist

### Problem: Admin kann sich nicht anmelden

**Lösung**: 
1. Überprüfen Sie, ob der Benutzer in `admin_users` existiert
2. Prüfen Sie, ob `is_active = true`
3. Überprüfen Sie die Passwort-Hash-Funktion

### Problem: "Row Level Security" Fehler

**Lösung**: Überprüfen Sie die RLS Policies für die betreffende Tabelle

---

## Support und weitere Informationen

### Dokumentation

- Supabase Docs: https://supabase.com/docs
- React Docs: https://react.dev
- Vite Docs: https://vitejs.dev

### Bei Problemen

1. Überprüfen Sie die Browser-Konsole auf Fehler
2. Überprüfen Sie Supabase Logs
3. Überprüfen Sie die Netzwerk-Anfragen im Browser

---

## Lizenz

Dieses Projekt und alle zugehörigen Rechte gehören dem Käufer/Client. Die Datenbank-Credentials und API-Keys sind vertraulich und dürfen nicht weitergegeben werden.

---

**Viel Erfolg mit Ihrer Berliner Pub Website!** 🍺
