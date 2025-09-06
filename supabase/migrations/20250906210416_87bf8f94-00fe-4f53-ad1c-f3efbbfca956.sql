-- Create enum for drink categories
CREATE TYPE public.drink_category AS ENUM ('beer', 'alcoholic', 'non_alcoholic');

-- Create enum for news categories  
CREATE TYPE public.news_category AS ENUM ('events', 'menu', 'general');

-- Create drinks table for menu management
CREATE TABLE public.drinks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category drink_category NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  alcohol_content TEXT,
  image_url TEXT,
  description_de TEXT NOT NULL,
  description_en TEXT NOT NULL,
  full_description_de TEXT,
  full_description_en TEXT,
  is_available BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create news table for news management
CREATE TABLE public.news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  category news_category DEFAULT 'general',
  title_de TEXT NOT NULL,
  title_en TEXT NOT NULL,
  excerpt_de TEXT NOT NULL,
  excerpt_en TEXT NOT NULL,
  content_de TEXT NOT NULL,
  content_en TEXT NOT NULL,
  image_url TEXT,
  read_time INTEGER DEFAULT 5,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  author_name TEXT DEFAULT 'Berliner Pub'
);

-- Create site settings table for site configuration
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value_de TEXT,
  value_en TEXT,
  description TEXT,
  setting_type TEXT DEFAULT 'text', -- text, number, boolean, json
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.drinks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access
CREATE POLICY "Anyone can view available drinks" 
ON public.drinks 
FOR SELECT 
USING (is_available = true);

CREATE POLICY "Anyone can view published news" 
ON public.news 
FOR SELECT 
USING (is_published = true);

CREATE POLICY "Anyone can view site settings" 
ON public.site_settings 
FOR SELECT 
USING (true);

-- Admin policies (for future admin functionality)
-- These will allow authenticated users with admin role to manage content
CREATE POLICY "Authenticated users can manage drinks" 
ON public.drinks 
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can manage news" 
ON public.news 
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can manage settings" 
ON public.site_settings 
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_drinks_category ON public.drinks(category);
CREATE INDEX idx_drinks_available ON public.drinks(is_available);
CREATE INDEX idx_drinks_sort_order ON public.drinks(sort_order);

CREATE INDEX idx_news_slug ON public.news(slug);
CREATE INDEX idx_news_category ON public.news(category);
CREATE INDEX idx_news_published ON public.news(is_published);
CREATE INDEX idx_news_published_at ON public.news(published_at);

CREATE INDEX idx_site_settings_key ON public.site_settings(key);

-- Create functions for updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER drinks_updated_at
  BEFORE UPDATE ON public.drinks
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER news_updated_at
  BEFORE UPDATE ON public.news
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Insert initial site settings
INSERT INTO public.site_settings (key, value_de, value_en, description) VALUES
('pub_name', 'Berliner Pub', 'Berliner Pub', 'Name of the pub'),
('address', 'Ansbacher Straße 29, 10789 Berlin', 'Ansbacher Straße 29, 10789 Berlin', 'Pub address'),
('phone', '+49 30 123 456 789', '+49 30 123 456 789', 'Contact phone number'),
('email', 'info@berlinerpub.de', 'info@berlinerpub.de', 'Contact email'),
('opening_hours', 'Mo-Fr: 12:00-02:00, Sa-So: 12:00-06:00', 'Mon-Fri: 12:00-02:00, Sat-Sun: 12:00-06:00', 'Opening hours'),
('about_text_de', 'Das Berliner Pub befindet sich im Herzen Berlins an der lebhaften Ansbacher Straße. Wir sind stolz darauf, eine authentische deutsche Kneipenatmosphäre zu schaffen, in der sich jeder Gast wie zu Hause fühlt.', null, 'About text in German'),
('about_text_en', null, 'Berliner Pub is located in the heart of Berlin on busy Ansbacher Street. We take pride in creating an authentic German pub atmosphere where every guest feels at home.', 'About text in English');

-- Insert sample drinks data
INSERT INTO public.drinks (name, category, price, alcohol_content, description_de, description_en, full_description_de, full_description_en, is_available, sort_order) VALUES

-- Beer category
('Berliner Weisse', 'beer', 4.50, '2.8-3.8%', 
 'Traditionelles Berliner Weizenbier mit Sirup', 
 'Traditional Berlin wheat beer with syrup',
 'Die Berliner Weisse ist ein traditionelles obergäriges Weizenbier mit niedrigem Alkoholgehalt, das seinen Ursprung in Berlin hat. Charakteristisch für dieses Bier ist sein säuerlicher Geschmack, der durch Milchsäuregärung entsteht. Traditionell wird es mit grünem Waldmeister- oder rotem Himbeersirup serviert, was dem Bier seine typische Farbe verleiht.',
 'Berliner Weisse is a traditional top-fermented wheat beer with low alcohol content that originated in Berlin. Characteristic of this beer is its sour taste, which is created by lactic acid fermentation. It is traditionally served with green woodruff or red raspberry syrup, which gives the beer its typical color.',
 true, 1),

('Augustiner Lagerbier Hell', 'beer', 5.00, '5.2%',
 'Klassisches Münchner Lager',
 'Classic Munich Lager', 
 'Augustiner Lagerbier Hell ist ein klassisches Münchner Vollbier aus der ältesten Brauerei Münchens, gegründet 1328. Das helle Lagerbier zeichnet sich durch seinen vollmundigen, ausgewogenen Geschmack aus.',
 'Augustiner Lagerbier Hell is a classic Munich full beer from Munich''s oldest brewery, founded in 1328. The light lager is characterized by its full-bodied, balanced taste.',
 true, 2),

('Erdinger Weissbier', 'beer', 5.50, '5.3%',
 'Bayerisches Weizenbier',
 'Bavarian wheat beer',
 'Erdinger Weissbier ist ein traditionelles bayerisches Weizenbier aus Erding bei München. Das Bier wird mit mindestens 50% Weizenmalz gebraut und besticht durch seinen fruchtig-frischen Geschmack.',
 'Erdinger Weissbier is a traditional Bavarian wheat beer from Erding near Munich. The beer is brewed with at least 50% wheat malt and captivates with its fruity-fresh taste.',
 true, 3),

-- Alcoholic category
('Schnapps Auswahl', 'alcoholic', 4.00, '38-42%',
 'Auswahl traditioneller deutscher Schnäpse',
 'Selection of traditional German schnapps',
 'Unsere Schnapps-Auswahl umfasst traditionelle deutsche Obstbrände und Kräuterschnäpse. Dazu gehören Zwetschgenwasser, Kirschwasser, Birnenbrand und Apfelkorn.',
 'Our schnapps selection includes traditional German fruit brandies and herbal schnapps. These include plum brandy, cherry brandy, pear brandy and apple liqueur.',
 true, 10),

('Jägermeister', 'alcoholic', 4.50, '35%',
 'Klassischer Kräuterlikör',
 'Classic herbal liqueur',
 'Jägermeister ist ein deutscher Kräuterlikör aus Wolfenbüttel, der seit 1935 nach einem geheimen Rezept mit 56 verschiedenen Kräutern, Früchten, Gewürzen und Wurzeln hergestellt wird.',
 'Jägermeister is a German herbal liqueur from Wolfenbüttel that has been made since 1935 according to a secret recipe with 56 different herbs, fruits, spices and roots.',
 true, 11),

-- Non-alcoholic category  
('Apfelschorle', 'non_alcoholic', 3.50, '0%',
 'Apfelsaft mit Mineralwasser',
 'Apple juice with mineral water',
 'Die Apfelschorle ist ein klassisches deutsches Erfrischungsgetränk, das aus naturtrübem Apfelsaft und kohlensäurehaltigem Mineralwasser hergestellt wird.',
 'Apple spritzer is a classic German refreshing drink made from naturally cloudy apple juice and carbonated mineral water.',
 true, 20),

('Kaffee', 'non_alcoholic', 2.50, '0%',
 'Frisch gebrühter Kaffee',
 'Freshly brewed coffee',
 'Unser Kaffee wird aus einer sorgfältig ausgewählten Mischung hochwertiger Arabica-Bohnen zubereitet, die von nachhaltigen Plantagen stammen.',
 'Our coffee is prepared from a carefully selected blend of high-quality Arabica beans from sustainable plantations.',
 true, 21);

-- Insert sample news data
INSERT INTO public.news (slug, category, title_de, title_en, excerpt_de, excerpt_en, content_de, content_en, read_time, is_published, published_at) VALUES

('oktoberfest-2024', 'events', 
 'Oktoberfest im Berliner Pub 2024', 
 'Oktoberfest at Berliner Pub 2024',
 'Feiern Sie mit uns das traditionelle Oktoberfest mit bayerischen Spezialitäten und Live-Musik.',
 'Celebrate traditional Oktoberfest with us featuring Bavarian specialties and live music.',
 '<h2>Oktoberfest im Berliner Pub</h2><p>Vom 15. bis 25. Oktober verwandeln wir unser Pub in eine echte bayerische Bierstube! Freuen Sie sich auf:</p><ul><li>Traditionelle bayerische Biere</li><li>Live-Musik jeden Abend</li><li>Authentische Oktoberfest-Atmosphäre</li></ul><p>Reservierungen werden empfohlen!</p>',
 '<h2>Oktoberfest at Berliner Pub</h2><p>From October 15-25, we''re transforming our pub into an authentic Bavarian beer hall! Look forward to:</p><ul><li>Traditional Bavarian beers</li><li>Live music every evening</li><li>Authentic Oktoberfest atmosphere</li></ul><p>Reservations recommended!</p>',
 3, true, now() - interval '2 days'),

('neue-craft-biere', 'menu',
 'Neue Craft-Biere im Sortiment',
 'New Craft Beers in Our Selection', 
 'Entdecken Sie unsere neuen handwerklich gebrauten Biere von lokalen Berliner Brauereien.',
 'Discover our new artisanally brewed beers from local Berlin breweries.',
 '<h2>Neue Craft-Beer-Auswahl</h2><p>Wir haben unser Sortiment um drei neue Craft-Biere erweitert:</p><h3>Berlin IPA</h3><p>Ein hopfenbetontes India Pale Ale von der Brauerei BRLO.</p><h3>Prenzlauer Weizen</h3><p>Ein erfrischendes Weizenbier mit Zitrusnoten.</p><h3>Kreuzberg Stout</h3><p>Ein kräftiges dunkles Bier mit Schokoladenaromen.</p>',
 '<h2>New Craft Beer Selection</h2><p>We have expanded our selection with three new craft beers:</p><h3>Berlin IPA</h3><p>A hop-forward India Pale Ale from BRLO brewery.</p><h3>Prenzlauer Weizen</h3><p>A refreshing wheat beer with citrus notes.</p><h3>Kreuzberg Stout</h3><p>A robust dark beer with chocolate flavors.</p>',
 4, true, now() - interval '1 week');