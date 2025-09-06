import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type Language = 'de' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('pub-language');
    return (saved as Language) || 'de';
  });

  useEffect(() => {
    localStorage.setItem('pub-language', language);
  }, [language]);

  const translations = {
    de: {
      // Navigation
      'nav.home': 'Startseite',
      'nav.menu': 'Getränke',
      'nav.about': 'Über uns',
      'nav.news': 'News',
      'nav.reviews': 'Bewertungen',
      'nav.contact': 'Kontakt',

      // Home page
      'home.badge': 'Traditionelle deutsche Kneipe',
      'home.title': 'Berliner Pub',
      'home.subtitle': 'Willkommen in Berlins gemütlichstem Ort, wo Tradition auf Moderne trifft',
      'home.menuButton': 'Getränkekarte',
      
      // Features
      'home.whyChoose': 'Warum uns wählen',
      'home.whyChooseSubtitle': 'Seit über 20 Jahren schaffen wir unvergessliche Momente für unsere Gäste',
      'home.feature.beer': 'Bestes Bier',
      'home.feature.beerDesc': 'Große Auswahl deutscher und Craft-Biere',
      'home.feature.atmosphere': 'Gemütliche Atmosphäre', 
      'home.feature.atmosphereDesc': 'Perfekter Ort für Treffen mit Freunden',
      'home.feature.events': 'Veranstaltungen',
      'home.feature.eventsDesc': 'Regelmäßige Events und Live-Musik',
      'home.feature.hours': 'Praktische Zeiten',
      'home.feature.hoursDesc': 'Täglich ab 12:00 Uhr geöffnet',

      // About section
      'home.aboutBadge': 'Über uns',
      'home.aboutTitle': 'Geschichte unserer Kneipe',
      'home.aboutText1': 'Das Berliner Pub befindet sich im Herzen Berlins an der lebhaften Ansbacher Straße. Wir sind stolz darauf, eine authentische deutsche Kneipenatmosphäre zu schaffen, in der sich jeder Gast wie zu Hause fühlt.',
      'home.aboutText2': 'Wir spezialisieren uns auf die besten deutschen Getränke und schaffen eine unvergleichliche Atmosphäre einer traditionellen Kneipe im Zentrum Berlins.',
      'home.welcomeText': 'Für alle offen: Ein Ort für Jung und Alt, für die LGBTQ+ Gemeinschaft - alle sind herzlich willkommen!',
      'home.learnMore': 'Mehr erfahren',
      'home.openToday': 'Heute geöffnet',
      'home.hours': '12:00 - 02:00',

      // Testimonials
      'home.testimonialsTitle': 'Bewertungen unserer Gäste',
      'home.testimonialsSubtitle': 'Was unsere Besucher über uns sagen',
      'home.allReviews': 'Alle Bewertungen',

      // Location
      'home.locationTitle': 'Finden Sie uns in Berlin',
      'home.address': 'Ansbacher Straße 29, 10789 Berlin',
      'home.directions': 'Anfahrt',

      // Reviews data
      'review.michael': 'Beste Kneipe in Berlin! Tolles Bier und unglaubliche Atmosphäre.',
      'review.anna': 'Ich liebe diesen Ort! Hervorragende Getränkeauswahl und gemütliche Einrichtung.',
      'review.thomas': 'Toller Ort für einen Abend mit Freunden. Komme auf jeden Fall wieder!'
    },
    en: {
      // Navigation
      'nav.home': 'Home',
      'nav.menu': 'Drinks',
      'nav.about': 'About',
      'nav.news': 'News',
      'nav.reviews': 'Reviews',
      'nav.contact': 'Contact',

      // Home page
      'home.badge': 'Traditional German Pub',
      'home.title': 'Berliner Pub',
      'home.subtitle': 'Welcome to Berlin\'s coziest place, where tradition meets modernity',
      'home.menuButton': 'Drink Menu',
      
      // Features
      'home.whyChoose': 'Why Choose Us',
      'home.whyChooseSubtitle': 'For over 20 years, we have been creating unforgettable moments for our guests',
      'home.feature.beer': 'Best Beer',
      'home.feature.beerDesc': 'Large selection of German and craft beers',
      'home.feature.atmosphere': 'Cozy Atmosphere',
      'home.feature.atmosphereDesc': 'Perfect place to meet with friends',
      'home.feature.events': 'Events',
      'home.feature.eventsDesc': 'Regular events and live music',
      'home.feature.hours': 'Convenient Hours',
      'home.feature.hoursDesc': 'Open daily from 12:00 PM',

      // About section
      'home.aboutBadge': 'About Us',
      'home.aboutTitle': 'Our Pub\'s Story',
      'home.aboutText1': 'Berliner Pub is located in the heart of Berlin on bustling Ansbacher Street. We take pride in creating an authentic German pub atmosphere where every guest feels at home.',
      'home.aboutText2': 'We specialize in the finest German beverages and create an incomparable atmosphere of a traditional pub in the center of Berlin.',
      'home.welcomeText': 'Open to all: A place for young and old, for the LGBTQ+ community - everyone is warmly welcome!',
      'home.learnMore': 'Learn More',
      'home.openToday': 'Open Today',
      'home.hours': '12:00 PM - 02:00 AM',

      // Testimonials
      'home.testimonialsTitle': 'Guest Reviews',
      'home.testimonialsSubtitle': 'What our visitors say about us',
      'home.allReviews': 'All Reviews',

      // Location
      'home.locationTitle': 'Find Us in Berlin',
      'home.address': 'Ansbacher Straße 29, 10789 Berlin',
      'home.directions': 'Directions',

      // Reviews data
      'review.michael': 'Best pub in Berlin! Great beer and incredible atmosphere.',
      'review.anna': 'I love this place! Excellent drink selection and cozy interior.',
      'review.thomas': 'Great place for an evening with friends. Will definitely come back!'
    }
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};