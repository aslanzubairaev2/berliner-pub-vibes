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
      'review.thomas': 'Toller Ort für einen Abend mit Freunden. Komme auf jeden Fall wieder!',

      // News translations
      'news.title': 'Berliner Pub News',
      'news.subtitle': 'Neueste Nachrichten, Veranstaltungen und Geschichten aus dem Leben unserer Kneipe',
      'news.minRead': 'Min Lesezeit',
      'news.readMore': 'Weiterlesen',
      'news.newsletter': 'Newsletter abonnieren',
      'news.newsletterDesc': 'Erhalten Sie Benachrichtigungen über neue Veranstaltungen, Sonderangebote und interessante Geschichten aus dem Leben unserer Kneipe',
      'news.subscribe': 'Abonnieren',
      'news.emailPlaceholder': 'Ihre E-Mail',
      'news.notFound': 'Artikel nicht gefunden',
      'news.notFoundDesc': 'Der gesuchte Artikel konnte nicht gefunden werden.',
      'news.backToNews': 'Zurück zu News',
      'news.visitUs': 'Besuchen Sie uns',
      'news.visitUsDesc': 'Kommen Sie vorbei und erleben Sie selbst, was unser Pub so besonders macht!',

      // Menu translations
      'menu.badge': 'Getränkekarte',
      'menu.title': 'Unsere Getränke',
      'menu.subtitle': 'Beste deutsche Getränke und Biere im Herzen Berlins',
      'menu.beer': 'Bier',
      'menu.alcoholic': 'Alkoholische Getränke',
      'menu.nonAlcoholic': 'Alkoholfreie Getränke',
      'menu.specialOffer': 'Besonderes Angebot',
      'menu.specialOfferText': 'Jeden Donnerstag findet bei uns eine Craft-Bier-Verkostung statt. Kommen Sie vorbei und entdecken Sie neue Geschmäcker!',
      'menu.alcohol': 'Alkohol',
      'menu.shortDescription': 'Kurzbeschreibung',
      'menu.detailedDescription': 'Detaillierte Beschreibung',
      'menu.close': 'Schließen',

      // About translations
      'about.badge': 'Über uns',
      'about.title': 'Geschichte des Berliner Pub',
      'about.subtitle': 'Seit über zwei Jahrzehnten schaffen wir die besondere Atmosphäre einer echten deutschen Kneipe im Herzen Berlins',
      'about.ourStory': 'Unsere Geschichte',
      'about.foundingYear': 'Gründungsjahr',
      'about.yearsOfTradition': 'Über 20 Jahre Tradition',
      'about.story1': 'Das Berliner Pub öffnete seine Türen im Jahr 2001 an der lebhaften Ansbacher Straße. Unsere Idee war einfach: einen Ort zu schaffen, wo traditionelle deutsche Kultur auf den modernen Berliner Geist trifft.',
      'about.story2': 'Über die Jahre sind wir nicht nur eine Kneipe geworden, sondern ein echter Treffpunkt für Einheimische und Touristen. Hier entstehen Freundschaften, werden wichtige Ereignisse gefeiert und unvergessliche Erinnerungen geschaffen.',
      'about.story3': 'Wir sind stolz darauf, die Authentizität deutscher Kneipenkultur zu bewahren und gleichzeitig modernen Service und Komfort zu bieten.',
      'about.forAll': 'Für alle da',
      'about.forAllSubtitle': 'Ein Ort der Offenheit und Vielfalt im Herzen Berlins',
      'about.youngAndOld': 'Für Jung und Alt',
      'about.youngAndOldDesc': 'Von Studenten bis Senioren - alle Altersgruppen sind bei uns herzlich willkommen',
      'about.lgbtqFriendly': 'LGBTQ+ Friendly',
      'about.lgbtqFriendlyDesc': 'Ein sicherer und offener Raum für die LGBTQ+ Gemeinschaft in Berlin',
      'about.diversity': 'Vielfalt leben',
      'about.diversityDesc': 'Wir feiern Diversität und schaffen einen Ort, wo sich alle wohlfühlen',
      'about.berlinsOpenest': 'Berlins offenste Kneipe',
      'about.berlinsopenestDesc': 'Im Berliner Pub sind alle willkommen - egal ob Jung oder Alt, egal welche sexuelle Orientierung oder Identität. Wir feiern Vielfalt und schaffen einen sicheren Raum, in dem sich jeder wohlfühlen und authentisch sein kann. Berlin steht für Offenheit und Toleranz - und das leben wir jeden Tag.',
      'about.openForAll': 'Offen für alle',
      'about.safeSpace': 'Safe Space',
      'about.ourValues': 'Unsere Werte',
      'about.ourValuesSubtitle': 'Prinzipien, die unsere Arbeit jeden Tag bestimmen',
      'about.traditions': 'Traditionen',
      'about.traditionsDesc': 'Wir bewahren und übertragen die besten Traditionen deutscher Kneipenkultur',
      'about.hospitality': 'Gastfreundschaft',
      'about.hospitalityDesc': 'Jeder Gast ist für uns besonders, wir schaffen eine Atmosphäre wie zu Hause',
      'about.quality': 'Qualität',
      'about.qualityDesc': 'Nur die besten Produkte und Getränke von geprüften Lieferanten',
      'about.experience': 'Erfahrung',
      'about.experienceDesc': 'Über 20 Jahre Erfahrung in der Gestaltung unvergesslicher Abende',
      'about.ourTeam': 'Unser Team',
      'about.ourTeamSubtitle': 'Menschen, die das Berliner Pub zu einem besonderen Ort machen',
      'about.owner': 'Eigentümer und Geschäftsführer',
      'about.ownerDesc': 'Aus Bayern stammend, brachte Stefan die besten Traditionen deutscher Kneipenkultur nach Berlin',
      'about.manager': 'Managerin und Sommelière',
      'about.managerDesc': 'Expertin für deutsche Weine und Biere, kreiert perfekte Getränkekombinationen',
      'about.bartender': 'Barkeeper',
      'about.bartenderDesc': 'Cocktail-Meister und Kenner der Biertraditionen, schafft unvergleichliche Baratmosphäre',
      'about.ourMission': 'Unsere Mission',
      'about.ourMissionDesc': 'Wir streben danach, einen Ort zu schaffen, wo sich jeder Besucher als Teil einer großen Familie fühlt. Das Berliner Pub ist nicht nur eine Kneipe, es ist ein Ort der Begegnungen, Traditionen und neuen Entdeckungen.',
      'about.authenticity': 'Authentizität',

      // Contact translations
      'contact.badge': 'Kontakt',
      'contact.title': 'Kontaktieren Sie uns',
      'contact.subtitle': 'Wir freuen uns über Ihre Fragen und Anregungen. Schreiben Sie uns einfach!',
      'contact.address': 'Adresse',
      'contact.phone': 'Telefon',
      'contact.email': 'Email',
      'contact.openingHours': 'Öffnungszeiten',
      'contact.showOnMap': 'Auf Karte anzeigen',
      'contact.contactForm': 'Kontakt',
      'contact.name': 'Name',
      'contact.subject': 'Betreff',
      'contact.message': 'Nachricht',
      'contact.sendMessage': 'Nachricht senden',
      'contact.findUs': 'Hier finden Sie uns',
      'contact.openInGoogleMaps': 'In Google Maps öffnen',
      'contact.monday': 'Montag',
      'contact.tuesday': 'Dienstag',
      'contact.wednesday': 'Mittwoch',
      'contact.thursday': 'Donnerstag',
      'contact.friday': 'Freitag',
      'contact.saturday': 'Samstag',
      'contact.sunday': 'Sonntag',

      // Reviews translations
      'reviews.badge': 'Bewertungen',
      'reviews.title': 'Bewertungen unserer Gäste',
      'reviews.subtitle': 'Lesen Sie, was unsere Besucher über uns sagen und teilen Sie Ihre Erfahrungen',
      'reviews.averageRating': 'Durchschnittsbewertung',
      'reviews.totalReviews': 'Gesamtbewertungen',
      'reviews.satisfiedGuests': 'Zufriedene Gäste',
      'reviews.guestReviews': 'Gästebewertungen',
      'reviews.verified': 'Verifiziert',
      'reviews.leaveReview': 'Bewertung hinterlassen',
      'reviews.yourName': 'Ihr Name',
      'reviews.rating': 'Bewertung',
      'reviews.reviewTitle': 'Titel der Bewertung',
      'reviews.yourReview': 'Ihre Bewertung',
      'reviews.sendReview': 'Bewertung senden',
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
      'review.thomas': 'Great place for an evening with friends. Will definitely come back!',

      // News translations
      'news.title': 'Berliner Pub News',
      'news.subtitle': 'Latest news, events and stories from the life of our pub',
      'news.minRead': 'min read',
      'news.readMore': 'Read More',
      'news.newsletter': 'Subscribe to Newsletter',
      'news.newsletterDesc': 'Receive notifications about new events, special offers and interesting stories from our pub\'s life',
      'news.subscribe': 'Subscribe',
      'news.emailPlaceholder': 'Your email',
      'news.notFound': 'Article not found',
      'news.notFoundDesc': 'The requested article could not be found.',
      'news.backToNews': 'Back to News',
      'news.visitUs': 'Visit Us', 
      'news.visitUsDesc': 'Come by and experience what makes our pub so special!',

      // Menu translations
      'menu.badge': 'Drink Menu',
      'menu.title': 'Our Beverages',
      'menu.subtitle': 'Best German drinks and beers in the heart of Berlin',
      'menu.beer': 'Beer',
      'menu.alcoholic': 'Alcoholic Beverages',
      'menu.nonAlcoholic': 'Non-Alcoholic Beverages',
      'menu.specialOffer': 'Special Offer',
      'menu.specialOfferText': 'Every Thursday we host a craft beer tasting. Come by and discover new flavors!',
      'menu.alcohol': 'Alcohol',
      'menu.shortDescription': 'Short Description',
      'menu.detailedDescription': 'Detailed Description',
      'menu.close': 'Close',

      // About translations
      'about.badge': 'About Us',
      'about.title': 'History of Berliner Pub',
      'about.subtitle': 'For over two decades, we have been creating the special atmosphere of an authentic German pub in the heart of Berlin',
      'about.ourStory': 'Our Story',
      'about.foundingYear': 'Founded',
      'about.yearsOfTradition': 'Over 20 years of tradition',
      'about.story1': 'Berliner Pub opened its doors in 2001 on the bustling Ansbacher Street. Our idea was simple: to create a place where traditional German culture meets the modern Berlin spirit.',
      'about.story2': 'Over the years, we have become not just a pub, but a real meeting place for locals and tourists. Here friendships are formed, important events are celebrated, and unforgettable memories are created.',
      'about.story3': 'We are proud to preserve the authenticity of German pub culture while providing modern service and comfort.',
      'about.forAll': 'For Everyone',
      'about.forAllSubtitle': 'A place of openness and diversity in the heart of Berlin',
      'about.youngAndOld': 'For Young and Old',
      'about.youngAndOldDesc': 'From students to seniors - all age groups are warmly welcome with us',
      'about.lgbtqFriendly': 'LGBTQ+ Friendly',
      'about.lgbtqFriendlyDesc': 'A safe and open space for the LGBTQ+ community in Berlin',
      'about.diversity': 'Living Diversity',
      'about.diversityDesc': 'We celebrate diversity and create a place where everyone feels comfortable',
      'about.berlinsOpenest': 'Berlin\'s Most Open Pub',
      'about.berlinsopenestDesc': 'At Berliner Pub, everyone is welcome - regardless of age, sexual orientation or identity. We celebrate diversity and create a safe space where everyone can feel comfortable and be authentic. Berlin stands for openness and tolerance - and we live that every day.',
      'about.openForAll': 'Open to All',
      'about.safeSpace': 'Safe Space',
      'about.ourValues': 'Our Values',
      'about.ourValuesSubtitle': 'Principles that guide our work every day',
      'about.traditions': 'Traditions',
      'about.traditionsDesc': 'We preserve and pass on the best traditions of German pub culture',
      'about.hospitality': 'Hospitality',
      'about.hospitalityDesc': 'Every guest is special to us, we create an atmosphere like home',
      'about.quality': 'Quality',
      'about.qualityDesc': 'Only the best products and drinks from trusted suppliers',
      'about.experience': 'Experience',
      'about.experienceDesc': 'Over 20 years of experience in creating unforgettable evenings',
      'about.ourTeam': 'Our Team',
      'about.ourTeamSubtitle': 'People who make Berliner Pub a special place',
      'about.owner': 'Owner and Managing Director',
      'about.ownerDesc': 'From Bavaria, Stefan brought the best traditions of German pub culture to Berlin',
      'about.manager': 'Manager and Sommelier',
      'about.managerDesc': 'Expert in German wines and beers, creates perfect drink combinations',
      'about.bartender': 'Bartender',
      'about.bartenderDesc': 'Cocktail master and connoisseur of beer traditions, creates incomparable bar atmosphere',
      'about.ourMission': 'Our Mission',
      'about.ourMissionDesc': 'We strive to create a place where every visitor feels like part of a big family. Berliner Pub is not just a pub, it is a place of encounters, traditions and new discoveries.',
      'about.authenticity': 'Authenticity',

      // Contact translations
      'contact.badge': 'Contact',
      'contact.title': 'Contact Us',
      'contact.subtitle': 'We welcome your questions and suggestions. Just write to us!',
      'contact.address': 'Address',
      'contact.phone': 'Phone',
      'contact.email': 'Email',
      'contact.openingHours': 'Opening Hours',
      'contact.showOnMap': 'Show on Map',
      'contact.contactForm': 'Contact',
      'contact.name': 'Name',
      'contact.subject': 'Subject',
      'contact.message': 'Message',
      'contact.sendMessage': 'Send Message',
      'contact.findUs': 'Find Us Here',
      'contact.openInGoogleMaps': 'Open in Google Maps',
      'contact.monday': 'Monday',
      'contact.tuesday': 'Tuesday',
      'contact.wednesday': 'Wednesday',
      'contact.thursday': 'Thursday',
      'contact.friday': 'Friday',
      'contact.saturday': 'Saturday',
      'contact.sunday': 'Sunday',

      // Reviews translations
      'reviews.badge': 'Reviews',
      'reviews.title': 'Guest Reviews',
      'reviews.subtitle': 'Read what our visitors say about us and share your experiences',
      'reviews.averageRating': 'Average Rating',
      'reviews.totalReviews': 'Total Reviews',
      'reviews.satisfiedGuests': 'Satisfied Guests',
      'reviews.guestReviews': 'Guest Reviews',
      'reviews.verified': 'Verified',
      'reviews.leaveReview': 'Leave a Review',
      'reviews.yourName': 'Your Name',
      'reviews.rating': 'Rating',
      'reviews.reviewTitle': 'Review Title',
      'reviews.yourReview': 'Your Review',
      'reviews.sendReview': 'Send Review',
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