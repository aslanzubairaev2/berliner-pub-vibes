# Anleitung zur Bereitstellung der Berliner Pub Website auf STRATO Hosting

Diese Anleitung beschreibt den vollständigen Prozess der Bereitstellung der Berliner Pub Website auf deutschem STRATO Hosting, beginnend mit der Supabase-Datenbankkonfiguration bis zum Start der Production-Website.

---

## 📋 Inhaltsverzeichnis

1. [Voraussetzungen](#voraussetzungen)
2. [Teil 1: Supabase-Einrichtung (Datenbank)](#teil-1-supabase-einrichtung-datenbank)
3. [Teil 2: Projekt-Build](#teil-2-projekt-build)
4. [Teil 3: STRATO Hosting-Konfiguration](#teil-3-strato-hosting-konfiguration)
5. [Teil 4: Dateien auf STRATO hochladen](#teil-4-dateien-auf-strato-hochladen)
6. [Teil 5: Sicherheitskonfiguration](#teil-5-sicherheitskonfiguration)
7. [Teil 6: Datenbank befüllen](#teil-6-datenbank-befüllen)
8. [Teil 7: Überprüfung und Tests](#teil-7-überprüfung-und-tests)
9. [Teil 8: Wartung und Updates](#teil-8-wartung-und-updates)
10. [Fehlerbehebung](#fehlerbehebung)

---

## Voraussetzungen

### Erforderliche Software:

1. **Node.js** (Version 18 oder höher) - [Download](https://nodejs.org/)
2. **Git** - [Download](https://git-scm.com/)
3. **FTP/SFTP-Client** - z.B. [FileZilla](https://filezilla-project.org/) (kostenlos)
4. **Text-Editor** - VSCode, Sublime Text oder ein anderer

### Erforderliche Konten:

1. **Supabase-Konto** - [Kostenlos erstellen](https://supabase.com/)
2. **STRATO Hosting** - Ihr bestehendes Konto
3. **Domain** - Ihre bei STRATO registrierte Domain

### Benötigte Informationen:

- FTP/SFTP-Zugangsdaten für STRATO (Host, Login, Passwort)
- Ihr Domainname
- Administrator-E-Mail für Supabase

---

## Teil 1: Supabase-Einrichtung (Datenbank)

### Schritt 1.1: Supabase-Projekt erstellen

1. Gehen Sie zu [https://supabase.com](https://supabase.com)
2. Klicken Sie auf **"Sign In"** und melden Sie sich über GitHub oder E-Mail an
3. Klicken Sie auf **"New Project"**
4. Füllen Sie die Daten aus:
   - **Name**: `berliner-pub-production` (oder ein anderer Name)
   - **Database Password**: **SPEICHERN SIE DIESES PASSWORT!** Sie benötigen es später
   - **Region**: Wählen Sie `Frankfurt (eu-central-1)` (am nächsten zu Deutschland)
   - **Pricing Plan**: Sie können mit dem Free Tier beginnen
5. Klicken Sie auf **"Create new project"**
6. Warten Sie 1-2 Minuten, bis das Projekt erstellt ist

### Schritt 1.2: API-Zugangsdaten abrufen

Nach der Projekterstellung:

1. Klicken Sie im Seitenmenü auf das **"Settings"**-Symbol (Zahnrad)
2. Wählen Sie **"API"**
3. **SPEICHERN** Sie folgende Daten (Sie benötigen sie später):
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon/public key**: Langer JWT-Token, der mit `eyJ...` beginnt
   - **Project ID**: Kurze alphanumerische Kennung

### Schritt 1.3: SQL-Migrationen ausführen

Jetzt müssen Sie die Datenbankstruktur erstellen:

1. Klicken Sie im Supabase-Seitenmenü auf **"SQL Editor"**
2. Klicken Sie auf **"New query"**
3. Öffnen Sie den Projektordner und finden Sie die Migrationsdateien in `supabase/migrations/`
4. **WICHTIG**: Führen Sie die Migrationen **IN DER RICHTIGEN REIHENFOLGE** aus (nach Datum im Dateinamen)

**Ausführungsreihenfolge:**

```bash
# Liste aller Migrationsdateien (in dieser Reihenfolge ausführen):
1. 20251105215717_7f3cca0a-23c7-4760-967a-c23214217ad4.sql
2. 20251115154304_e622d2e4-4587-46bc-9999-78a69805fe8e.sql
```

Für jede Datei:
1. Öffnen Sie die Datei in einem Texteditor
2. Kopieren Sie den **GESAMTEN** Inhalt
3. Fügen Sie ihn in den SQL Editor in Supabase ein
4. Klicken Sie auf **"Run"** (oder F5)
5. Stellen Sie sicher, dass keine Fehler auftreten (sollte "Success" anzeigen)
6. Fahren Sie mit der nächsten Datei fort

### Schritt 1.4: Storage Bucket für Bilder erstellen

1. Klicken Sie im Supabase-Seitenmenü auf **"Storage"**
2. Klicken Sie auf **"Create a new bucket"**
3. Füllen Sie aus:
   - **Name**: `drink-images`
   - **Public bucket**: ✅ **JA** (Häkchen setzen)
4. Klicken Sie auf **"Create bucket"**

### Schritt 1.5: RLS-Richtlinien für Storage konfigurieren

Nach der Bucket-Erstellung:

1. Klicken Sie auf den Bucket `drink-images`
2. Gehen Sie zur Registerkarte **"Policies"**
3. Klicken Sie auf **"New Policy"**
4. Wählen Sie **"For full customization, create a policy"**
5. Erstellen Sie folgende Richtlinien:

**Richtlinie 1: Öffentlicher Lesezugriff**
```sql
-- Policy name: Public read access
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'drink-images');
```

**Richtlinie 2: Upload für authentifizierte Benutzer**
```sql
-- Policy name: Authenticated users can upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'drink-images');
```

**Richtlinie 3: Löschen für authentifizierte Benutzer**
```sql
-- Policy name: Authenticated users can delete
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'drink-images');
```

### Schritt 1.6: Secrets für Edge Functions konfigurieren

1. Gehen Sie in Supabase zu **Settings** → **Edge Functions**
2. Scrollen Sie zum Abschnitt **"Function Secrets"**
3. Fügen Sie folgende Secrets hinzu (wenn Sie die Bildgenerierung nutzen möchten):

```
HUGGING_FACE_ACCESS_TOKEN=ihr_token_von_huggingface
```

> **Hinweis**: Der Hugging Face Token wird nur für die Bierbilder-Generierungsfunktion benötigt. Wenn Sie diese nicht nutzen möchten, können Sie diesen Schritt überspringen.

### Schritt 1.7: Ersten Administrator erstellen

Nach Ausführung der Migrationen müssen Sie ein Administrator-Konto erstellen:

1. Führen Sie im **SQL Editor** folgende Abfrage aus:

```sql
-- ERSETZEN Sie E-Mail und Passwort mit Ihren Daten!
INSERT INTO public.admin_users (name, email, password_hash, is_active)
VALUES (
  'Hauptadministrator',
  'admin@ihre-domain.de',
  public.simple_hash('IHR_SICHERES_PASSWORT_HIER')
);
```

**WICHTIG**: 
- Verwenden Sie ein **starkes Passwort** (mindestens 12 Zeichen, Buchstaben, Zahlen, Sonderzeichen)
- **SPEICHERN** Sie E-Mail und Passwort - Sie benötigen sie für den Login im Admin-Panel
- Nach dem ersten Login **UNBEDINGT** das Passwort über das Admin-Panel ändern

---

## Teil 2: Projekt-Build

### Schritt 2.1: Projekt klonen oder erhalten

Wenn das Projekt in Git ist:
```bash
git clone https://github.com/ihr-repository/berliner-pub.git
cd berliner-pub
```

Wenn das Projekt als Archiv vorliegt:
```bash
# Entpacken Sie das Archiv in einen Ordner
cd pfad/zum/projekt
```

### Schritt 2.2: Abhängigkeiten installieren

```bash
npm install
```

Dies installiert alle erforderlichen Bibliotheken (~260 Pakete). Der Vorgang dauert 2-5 Minuten.

### Schritt 2.3: Umgebungsvariablen konfigurieren

1. Erstellen Sie im Projektstamm eine `.env`-Datei:

```bash
# Verwenden Sie NICHT das VITE_-Präfix - es wird nicht unterstützt!
# Stattdessen sind die Werte im Code eingebettet
```

2. Öffnen Sie die Datei `src/integrations/supabase/client.ts`
3. Ersetzen Sie die Werte mit Ihren Supabase-Daten:

```typescript
const SUPABASE_URL = "https://ihre-project-id.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "ihr-anon-key-hier";
```

### Schritt 2.4: Production-Build erstellen

```bash
npm run build
```

Dieser Befehl:
- Kompiliert TypeScript zu JavaScript
- Minifiziert den Code
- Optimiert Bilder
- Erstellt einen `dist/`-Ordner mit der fertigen Website

**Ergebnis**: Der `dist/`-Ordner enthält alle Dateien für den Server-Upload.

### Schritt 2.5: Lokal testen (optional)

Vor dem Server-Upload können Sie testen:

```bash
npm run preview
```

Öffnen Sie `http://localhost:4173` im Browser und prüfen Sie die Website-Funktionalität.

---

## Teil 3: STRATO Hosting-Konfiguration

### Schritt 3.1: Anmeldung im STRATO Customer Center

1. Gehen Sie zu [https://www.strato.de](https://www.strato.de)
2. Klicken Sie oben rechts auf **"Login"**
3. Wählen Sie **"Kunden-Login"**
4. Geben Sie Ihre Zugangsdaten ein
5. Gehen Sie zu **"Produkte"** → wählen Sie Ihr Hosting-Paket

### Schritt 3.2: FTP/SFTP-Zugang konfigurieren

1. Finden Sie im Kontrollpanel den Bereich **"FTP-Zugänge"** oder **"Zugang & Sicherheit"**
2. Notieren oder erstellen Sie FTP-Daten:
   - **Hostname**: normalerweise `ftp.strato.de` oder `ssh.strato.de`
   - **Username**: Ihr Benutzername
   - **Password**: Ihr FTP-Passwort
   - **Port**: 21 (FTP) oder 22 (SFTP)

**Empfehlung**: Verwenden Sie SFTP (Port 22) statt FTP für mehr Sicherheit.

### Schritt 3.3: Website-Stammordner bestimmen

Bei STRATO ist die Struktur normalerweise:
```
/
├── logs/          # Server-Logs
├── ssl/           # SSL-Zertifikate
└── www/           # WEBSITE-STAMMORDNER
    └── index.html # Hier Dateien hochladen
```

**WICHTIG**: Alle Dateien aus dem `dist/`-Ordner müssen in den `www/`-Ordner hochgeladen werden

---

## Teil 4: Dateien auf STRATO hochladen

### Schritt 4.1: Mit FileZilla verbinden

1. Öffnen Sie FileZilla
2. Füllen Sie im oberen Bereich aus:
   - **Host**: `sftp://ssh.strato.de` (oder Ihr SFTP-Host)
   - **Username**: Ihr Login
   - **Password**: Ihr Passwort
   - **Port**: `22`
3. Klicken Sie auf **"Quickconnect"** oder **"Verbinden"**

### Schritt 4.2: .htaccess-Datei erstellen

**KRITISCH WICHTIG** für die Funktion des React Routers!

1. Erstellen Sie eine `.htaccess`-Datei im Projektstamm (neben `dist/`)
2. Fügen Sie folgenden Code hinzu:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Wenn die angeforderte Datei existiert, liefere sie aus
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  
  # Ansonsten auf index.html umleiten
  RewriteRule ^ index.html [QSA,L]
</IfModule>

# Komprimierung aktivieren
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Caching für statische Dateien
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>

# Sicherheit
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
</IfModule>

# Zugriff auf .git und andere Systemdateien blockieren
<FilesMatch "^\.">
  Order allow,deny
  Deny from all
</FilesMatch>
```

### Schritt 4.3: Dateien hochladen

1. In FileZilla:
   - **Linkes Fenster**: Finden Sie den `dist/`-Ordner Ihres Projekts
   - **Rechtes Fenster**: Navigieren Sie zum `www/`-Ordner auf dem Server

2. Dateien hochladen:
   - Markieren Sie den **GESAMTEN** Inhalt des `dist/`-Ordners
   - Ziehen Sie ihn ins rechte Fenster (in `www/`)
   - Laden Sie auch die `.htaccess`-Datei hoch

3. Warten Sie, bis der Upload abgeschlossen ist (normalerweise 2-5 Minuten)

**Struktur auf dem Server sollte sein:**
```
www/
├── .htaccess
├── index.html
├── assets/
│   ├── index-abc123.js
│   ├── index-def456.css
│   └── ...
├── favicon.ico
└── robots.txt
```

### Schritt 4.4: Zugriffsrechte prüfen

1. Klicken Sie in FileZilla mit der rechten Maustaste auf den `www/`-Ordner
2. Wählen Sie **"Dateiattribute"** oder **"File permissions"**
3. Setzen Sie:
   - Ordner: `755` (rwxr-xr-x)
   - Dateien: `644` (rw-r--r--)
4. Aktivieren Sie **"In Unterverzeichnisse aufnehmen"**
5. Klicken Sie auf **"OK"**

---

## Teil 5: Sicherheitskonfiguration

### Schritt 5.1: Administrator-Passwort ändern

**OBLIGATORISCH** nach dem ersten Deployment!

1. Öffnen Sie Ihre Website: `https://ihre-domain.de`
2. Gehen Sie zu `/admin` oder `/admin/login`
3. Melden Sie sich mit den in Schritt 1.7 erstellten Daten an
4. Gehen Sie zu **Einstellungen** → **Sicherheit**
5. Klicken Sie auf **"Passwort ändern"**
6. Geben Sie ein:
   - Aktuelles Passwort
   - Neues Passwort (mindestens 12 Zeichen)
   - Passwortbestätigung
7. Speichern Sie die Änderungen

### Schritt 5.2: SSL-Zertifikat in STRATO konfigurieren

1. Finden Sie im STRATO Customer Center **"SSL-Zertifikate"**
2. Aktivieren Sie für Ihre Domain das **Let's Encrypt**-Zertifikat (normalerweise kostenlos)
3. Warten Sie 5-10 Minuten für die Aktivierung
4. Prüfen Sie, ob die Website über `https://` erreichbar ist

### Schritt 5.3: HTTPS-Weiterleitung einrichten

Fügen Sie am Anfang der `.htaccess`-Datei hinzu:

```apache
# HTTPS erzwingen
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

### Schritt 5.4: Backup der Supabase-Konfiguration

1. SQL-Schema exportieren:
   - Führen Sie im Supabase SQL Editor aus:
   ```sql
   -- Dieser Befehl zeigt die Struktur aller Tabellen
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

2. Speichern Sie die Migrationsergebnisse an einem sicheren Ort
3. Bewahren Sie separat auf:
   - Supabase Project URL
   - Supabase Anon Key
   - Database Password

---

## Teil 6: Datenbank befüllen

### WICHTIG: Datenbank ist leer!

Nach den Migrationen haben Sie nur die **Tabellenstruktur**, aber **keine Daten**. Sie müssen befüllen:

### Schritt 6.1: Getränke hinzufügen

**Variante A: Über Admin-Panel (empfohlen)**

1. Melden Sie sich im Admin-Panel an: `https://ihre-domain.de/admin`
2. Gehen Sie zum Bereich **"Drinks"** oder **"Getränke"**
3. Klicken Sie auf **"+ Getränk hinzufügen"**
4. Füllen Sie für jedes Getränk aus:
   - **Name**: Name (z.B. "Augustiner Helles")
   - **Category**: Kategorie (beer / alcoholic / non_alcoholic)
   - **Price**: Preis (z.B. 4.50)
   - **Alcohol Content**: Alkoholgehalt (z.B. "5.2%")
   - **Description DE**: Beschreibung auf Deutsch
   - **Description EN**: Beschreibung auf Englisch
   - **Full Description DE**: Vollständige Beschreibung auf Deutsch (optional)
   - **Full Description EN**: Vollständige Beschreibung auf Englisch (optional)
   - **Image**: Bild des Getränks hochladen
   - **Is Available**: ✅ Verfügbar
   - **Sort Order**: Sortierreihenfolge (1, 2, 3...)
5. Klicken Sie auf **"Speichern"**
6. Wiederholen Sie dies für alle Getränke

**Variante B: Über SQL (Massenladen)**

Wenn Sie eine Liste von Getränken haben, können Sie über SQL laden:

```sql
INSERT INTO public.drinks (
  name, category, price, alcohol_content, 
  description_de, description_en,
  full_description_de, full_description_en,
  image_url, is_available, sort_order
) VALUES
('Augustiner Helles', 'beer', 4.50, '5.2%',
 'Klassisches Münchner Helles',
 'Classic Munich Helles',
 'Ein traditionelles bayrisches Bier mit mildem Geschmack...',
 'A traditional Bavarian beer with a mild taste...',
 NULL, true, 1),

('Berliner Weisse', 'beer', 4.00, '2.8%',
 'Erfrischendes Berliner Weißbier',
 'Refreshing Berlin wheat beer',
 NULL, NULL, NULL, true, 2),

-- Fügen Sie weitere Getränke hinzu...
;
```

### Schritt 6.2: Getränkebilder hochladen

**Wichtig**: Bilder sind bereits im Projekt im Ordner `src/assets/` vorhanden

**Variante A: Über Admin-Panel**
1. Beim Hinzufügen eines Getränks verwenden Sie den Bild-Upload-Button
2. Wählen Sie eine Datei aus `src/assets/` (z.B. `augustiner-beer-transparent.png`)
3. Das System lädt automatisch in Supabase Storage hoch

**Variante B: Manuell in Supabase hochladen**
1. Gehen Sie in Supabase zu **Storage** → **drink-images**
2. Klicken Sie auf **"Upload files"**
3. Laden Sie Bilder aus dem Ordner `src/assets/` hoch
4. Kopieren Sie die Public URL jedes Bildes
5. Aktualisieren Sie in SQL:
```sql
UPDATE public.drinks 
SET image_url = 'https://xxxxx.supabase.co/storage/v1/object/public/drink-images/augustiner.png'
WHERE name = 'Augustiner Helles';
```

### Schritt 6.3: News hinzufügen

1. Melden Sie sich im Admin-Panel an
2. Gehen Sie zum Bereich **"News"** oder **"Nachrichten"**
3. Klicken Sie auf **"+ Nachricht hinzufügen"**
4. Füllen Sie aus:
   - **Title DE/EN**: Überschrift
   - **Excerpt DE/EN**: Kurzbeschreibung
   - **Content DE/EN**: Vollständiger Nachrichtentext (unterstützt Markdown)
   - **Category**: events / menu / general
   - **Slug**: URL-Adresse (z.B. `oktoberfest-2025`)
   - **Author Name**: Autorenname
   - **Read Time**: Lesezeit (Minuten)
   - **Image**: Nachrichtenbild
   - **Is Published**: ✅ Veröffentlichen
5. Speichern

### Schritt 6.4: Website-Einstellungen konfigurieren

1. Gehen Sie im Admin-Panel zu **"Settings"** oder **"Einstellungen"**
2. Konfigurieren Sie:
   - **Website-Name** (DE/EN)
   - **Website-Beschreibung** (DE/EN)
   - **Kontaktinformationen**
   - **Pub-Adresse**
   - **Telefon**
   - **E-Mail**
   - **Öffnungszeiten**
   - **Soziale Medien**

Oder über SQL:

```sql
INSERT INTO public.site_settings (key, value_de, value_en, description) VALUES
('pub_name', 'Berliner Pub', 'Berliner Pub', 'Name der Gaststätte'),
('pub_address', 'Hauptstraße 123, 10115 Berlin', 'Hauptstraße 123, 10115 Berlin', 'Adresse'),
('pub_phone', '+49 30 12345678', '+49 30 12345678', 'Telefon'),
('pub_email', 'info@berliner-pub.de', 'info@berliner-pub.de', 'E-Mail'),
('opening_hours', 'Mo-So: 16:00-01:00', 'Mon-Sun: 4PM-1AM', 'Öffnungszeiten');
```

---

## Teil 7: Überprüfung und Tests

### Schritt 7.1: Hauptfunktionen prüfen

Öffnen Sie die Website und prüfen Sie:

**Startseite** (`/`)
- ✅ Seite lädt
- ✅ Bilder werden angezeigt
- ✅ Navigation funktioniert
- ✅ Sprachumschaltung DE/EN funktioniert

**Menü** (`/menu`)
- ✅ Alle Getränke werden angezeigt
- ✅ Kategorien funktionieren (Beer, Alcoholic, Non-Alcoholic)
- ✅ Getränkebilder laden
- ✅ Preise werden korrekt angezeigt

**News** (`/news`)
- ✅ Nachrichtenliste wird angezeigt
- ✅ Einzelne Nachricht kann geöffnet werden
- ✅ Filter funktionieren

**Über uns** (`/about`)
- ✅ Informationen werden angezeigt

**Kontakt** (`/contact`)
- ✅ Kontaktinformationen sind korrekt
- ✅ Karte wird angezeigt (falls konfiguriert)

**Admin-Panel** (`/admin`)
- ✅ Login funktioniert
- ✅ Getränkeverwaltung funktioniert
- ✅ Nachrichtenverwaltung funktioniert
- ✅ Bild-Upload funktioniert

### Schritt 7.2: Performance prüfen

1. Öffnen Sie Chrome DevTools (F12)
2. Gehen Sie zur Registerkarte **"Network"**
3. Aktualisieren Sie die Seite (Strg+F5)
4. Prüfen Sie:
   - Ladezeit < 3 Sekunden
   - Seitengröße < 2 MB
   - Alle Ressourcen laden (Code 200)

### Schritt 7.3: Auf Mobilgeräten prüfen

1. Drücken Sie in Chrome DevTools die Geräte-Taste (Strg+Shift+M)
2. Wählen Sie verschiedene Geräte:
   - iPhone 12 Pro
   - iPad
   - Samsung Galaxy S21
3. Prüfen Sie, dass alles korrekt angezeigt wird

### Schritt 7.4: SEO prüfen

1. Öffnen Sie den Seitenquelltext (Strg+U)
2. Prüfen Sie das Vorhandensein von:
   - `<title>`-Tag
   - `<meta name="description">`-Tag
   - Open Graph Tags für soziale Medien
   - Korrekte Überschriften H1, H2, H3

---

## Teil 8: Wartung und Updates

### Schritt 8.1: Regelmäßige Aufgaben

**Wöchentlich:**
- ✅ Prüfen Sie, dass die Website funktioniert
- ✅ Überprüfen Sie Logs auf Fehler (falls in STRATO verfügbar)
- ✅ Erstellen Sie ein Datenbank-Backup

**Monatlich:**
- ✅ Aktualisieren Sie das Menü bei Preis- oder Getränkeänderungen
- ✅ Veröffentlichen Sie News und Events
- ✅ Prüfen Sie das SSL-Zertifikat

### Schritt 8.2: Backup erstellen

**Supabase-Datenbank:**
1. Gehen Sie in Supabase zu **Database** → **Backups**
2. Laden Sie das neueste Backup herunter
3. Speichern Sie es lokal oder in der Cloud

**Website-Dateien:**
1. Laden Sie in FileZilla den gesamten `www/`-Ordner herunter
2. Speichern Sie ihn an einem sicheren Ort
3. Datei mit Datum benennen: `berliner-pub-backup-2025-01-15.zip`

### Schritt 8.3: Website aktualisieren

Wenn Sie Code aktualisieren müssen:

1. Nehmen Sie Änderungen in der lokalen Projektversion vor
2. Aktualisieren Sie `src/integrations/supabase/client.ts` mit Production-Daten
3. Erstellen Sie das Projekt:
   ```bash
   npm run build
   ```
4. Laden Sie neue Dateien aus `dist/` über FileZilla auf den Server hoch
5. Prüfen Sie die Website (möglicherweise Cache leeren: Strg+Shift+R)

### Schritt 8.4: Abhängigkeiten aktualisieren

Alle 3-6 Monate:

```bash
# Veraltete Pakete prüfen
npm outdated

# Sichere Versionen aktualisieren
npm update

# Erstellen und testen
npm run build
npm run preview
```

---

## Fehlerbehebung

### Problem: "Leere Seite" nach Upload

**Ursache**: Falscher Pfad zu Dateien

**Lösung**:
1. Prüfen Sie, dass `.htaccess` hochgeladen wurde
2. Prüfen Sie Zugriffsrechte (755 für Ordner, 644 für Dateien)
3. Prüfen Sie, dass alle Dateien aus `dist/` in `www/` hochgeladen wurden

### Problem: "404 Not Found" beim Navigieren

**Ursache**: `.htaccess` funktioniert nicht

**Lösung**:
1. Stellen Sie sicher, dass die Datei genau `.htaccess` heißt (mit Punkt!)
2. Prüfen Sie, dass mod_rewrite in STRATO aktiviert ist (normalerweise aktiviert)
3. Versuchen Sie, den Browser-Cache zu leeren

### Problem: Bilder laden nicht

**Ursache**: Problem mit Supabase Storage

**Lösung**:
1. Prüfen Sie RLS-Richtlinien in Supabase Storage
2. Stellen Sie sicher, dass Bucket `drink-images` öffentlich ist
3. Prüfen Sie Bild-URLs in der Datenbank:
   ```sql
   SELECT id, name, image_url FROM drinks WHERE image_url IS NOT NULL;
   ```

### Problem: Admin-Panel-Login funktioniert nicht

**Ursache**: Falsche Daten oder Supabase-Problem

**Lösung**:
1. Prüfen Sie, dass E-Mail und Passwort korrekt sind
2. Prüfen Sie im Supabase SQL Editor:
   ```sql
   SELECT id, name, email, is_active FROM admin_users;
   ```
3. Passwort über SQL zurücksetzen:
   ```sql
   UPDATE admin_users 
   SET password_hash = public.simple_hash('neues_passwort')
   WHERE email = 'ihre@email.de';
   ```

### Problem: Langsame Website

**Lösung**:
1. Prüfen Sie Bildgrößen (optimieren > 500 KB)
2. Stellen Sie sicher, dass Caching in `.htaccess` aktiviert ist
3. Erwägen Sie die Nutzung eines CDN
4. Prüfen Sie Ihren STRATO-Tarif

### Problem: CORS-Fehler in der Konsole

**Ursache**: Supabase erkennt Ihre Domain nicht

**Lösung**:
1. Gehen Sie in Supabase zu **Settings** → **API**
2. Fügen Sie Ihre Domain zu **Site URL** hinzu: `https://ihre-domain.de`
3. Fügen Sie zu **Redirect URLs** hinzu:
   - `https://ihre-domain.de`
   - `https://ihre-domain.de/admin`

### Problem: SSL-Zertifikat funktioniert nicht

**Lösung**:
1. Prüfen Sie in STRATO den SSL-Zertifikatsstatus
2. Warten Sie 15-30 Minuten nach Aktivierung
3. Prüfen Sie HTTP→HTTPS-Weiterleitung in `.htaccess`
4. Kontaktieren Sie STRATO-Support, falls das nicht hilft

---

## 📞 Support

### Dokumentation:
- **Supabase**: https://supabase.com/docs
- **React**: https://react.dev
- **Vite**: https://vitejs.dev

### STRATO-Kontakte:
- **Telefon**: 030 300 146 000 (aus Deutschland)
- **E-Mail**: support@strato.de
- **FAQ**: https://www.strato.de/faq/

### Bei Problemen:

1. **Logs prüfen**:
   - Browser Console (F12)
   - Supabase → Database → Logs
   - Supabase → Edge Functions → Logs

2. **Status prüfen**:
   - Supabase Status: https://status.supabase.com
   - STRATO Status: https://www.strato.de/service/status/

3. **Informationen für Support sammeln**:
   - Genaue Problembeschreibung
   - Screenshots von Fehlern
   - Browser Console Logs
   - Welche Schritte führten zum Problem

---

## ✅ Checkliste für den finalen Launch

Bevor Sie die Website als "fertig" deklarieren, stellen Sie sicher:

### Datenbank:
- [ ] Alle Migrationen ausgeführt
- [ ] Administrator erstellt
- [ ] Alle Getränke hochgeladen
- [ ] Getränkebilder hochgeladen
- [ ] News hinzugefügt (mindestens 2-3)
- [ ] Website-Einstellungen konfiguriert
- [ ] RLS-Richtlinien aktiv
- [ ] Storage Bucket konfiguriert

### Server:
- [ ] Alle Dateien in `www/` hochgeladen
- [ ] `.htaccess`-Datei vorhanden
- [ ] Zugriffsrechte gesetzt (755/644)
- [ ] SSL-Zertifikat aktiv
- [ ] HTTPS-Weiterleitung funktioniert

### Funktionalität:
- [ ] Alle Seiten öffnen sich
- [ ] Navigation funktioniert
- [ ] Sprachumschaltung funktioniert
- [ ] Menü wird korrekt angezeigt
- [ ] Bilder laden
- [ ] Admin-Panel erreichbar
- [ ] Getränke können hinzugefügt/bearbeitet werden
- [ ] News können hinzugefügt/bearbeitet werden

### Sicherheit:
- [ ] Administrator-Passwort auf starkes geändert
- [ ] Supabase Credentials gespeichert
- [ ] Datenbank-Backup erstellt
- [ ] Dateien-Backup erstellt

### Performance:
- [ ] Ladezeit < 3 Sekunden
- [ ] Mobile Version funktioniert
- [ ] Keine Fehler in der Konsole
- [ ] SEO-Tags konfiguriert

### Zusätzlich:
- [ ] Domain korrekt konfiguriert
- [ ] robots.txt konfiguriert
- [ ] sitemap.xml erstellt (optional)
- [ ] Google Analytics hinzugefügt (optional)
- [ ] Kontaktinformationen aktuell

---

## 🎉 Fertig!

Nach Durchführung aller Schritte sollte Ihre Berliner Pub Website vollständig funktionsfähig und unter folgender Adresse erreichbar sein:

**https://ihre-domain.de**

Vergessen Sie nicht:
- Regelmäßig Menü aktualisieren
- News und Events veröffentlichen
- Backups erstellen
- Sicherheit überwachen

**Viel Erfolg! Prost! 🍺**

---

*Letzte Aktualisierung: Januar 2025*
*Anleitungsversion: 1.0*