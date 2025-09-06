export interface NewsArticle {
  id: number;
  slug: string;
  category: 'beer' | 'events' | 'music' | 'wine' | 'drinks';
  date: string;
  readTime: string;
  image?: string;
  titleDe: string;
  titleEn: string;
  excerptDe: string;
  excerptEn: string;
  contentDe: string;
  contentEn: string;
}

export const newsArticles: NewsArticle[] = [
  {
    id: 1,
    slug: 'neues-craft-bier-berliner-brauerei',
    category: 'beer',
    date: '2024-03-15',
    readTime: '3',
    titleDe: 'Neues Craft-Bier von der Berliner Brauerei Zur Letzten Instanz',
    titleEn: 'New Craft Beer from Berlin Brewery Zur Letzten Instanz',
    excerptDe: 'Wir freuen uns, ein exklusives Craft-Bier zu präsentieren, das speziell für das Berliner Pub in Zusammenarbeit mit der historischen Brauerei gebraut wurde...',
    excerptEn: 'We are excited to present an exclusive craft beer specially brewed for Berliner Pub in collaboration with the historic brewery...',
    contentDe: `
      <h2>Ein besonderes Bier für besondere Momente</h2>
      <p>Nach monatelanger Entwicklung können wir endlich unser exklusives Craft-Bier präsentieren, das in Zusammenarbeit mit der historischen Brauerei "Zur Letzten Instanz" entstanden ist.</p>
      
      <h3>Geschichte trifft Moderne</h3>
      <p>Die Brauerei "Zur Letzten Instanz", die seit 1621 in Berlin existiert, hat mit uns ein einzigartiges Bier entwickelt, das die Tradition der deutschen Braukunst mit modernen Craft-Beer-Techniken verbindet.</p>
      
      <h3>Geschmacksprofil</h3>
      <p>Unser "Berliner Pub Special" ist ein hopfenbetontes Pale Ale mit einer goldenen Farbe und einem komplexen Aromaprofil. Die Verwendung regionaler Hopfensorten verleiht dem Bier eine fruchtige Note mit einem angenehm bitteren Abgang.</p>
      
      <h3>Verfügbarkeit</h3>
      <p>Das Bier ist ab sofort exklusiv in unserem Pub erhältlich. Aufgrund der begrenzten Produktionsmenge empfehlen wir eine rechtzeitige Reservierung für größere Gruppen.</p>
      
      <p><strong>Probieren Sie unser neues Craft-Bier und erleben Sie ein Stück Berliner Braugeschichte!</strong></p>
    `,
    contentEn: `
      <h2>A Special Beer for Special Moments</h2>
      <p>After months of development, we can finally present our exclusive craft beer, created in collaboration with the historic brewery "Zur Letzten Instanz".</p>
      
      <h3>History Meets Modernity</h3>
      <p>The brewery "Zur Letzten Instanz", which has existed in Berlin since 1621, has developed a unique beer with us that combines the tradition of German brewing art with modern craft beer techniques.</p>
      
      <h3>Flavor Profile</h3>
      <p>Our "Berliner Pub Special" is a hop-forward Pale Ale with a golden color and complex aroma profile. The use of regional hop varieties gives the beer a fruity note with a pleasantly bitter finish.</p>
      
      <h3>Availability</h3>
      <p>The beer is now available exclusively in our pub. Due to limited production quantities, we recommend early reservation for larger groups.</p>
      
      <p><strong>Try our new craft beer and experience a piece of Berlin brewing history!</strong></p>
    `
  },
  {
    id: 2,
    slug: 'live-musik-jeden-freitag',
    category: 'music',
    date: '2024-03-05',
    readTime: '4',
    titleDe: 'Live-Musik jeden Freitag',
    titleEn: 'Live Music Every Friday',
    excerptDe: 'Ab sofort treten jeden Freitag lokale Musiker im Berliner Pub auf. Folk, Blues und traditionelle deutsche Musik...',
    excerptEn: 'Starting now, local musicians perform every Friday at Berliner Pub. Folk, blues, and traditional German music...',
    contentDe: `
      <h2>Musik belebt unsere Kneipe</h2>
      <p>Wir freuen uns, ab sofort jeden Freitag Live-Musik in unserem Pub anbieten zu können. Von 20:00 bis 22:30 Uhr verwandelt sich unser gemütlicher Raum in eine kleine Konzertbühne.</p>
      
      <h3>Vielfältiges Programm</h3>
      <p>Unsere Künstler kommen aus der lokalen Berliner Musikszene und bringen verschiedene Musikrichtungen mit:</p>
      <ul>
        <li><strong>Folk und Akustik:</strong> Intime Auftritte mit Gitarre und Gesang</li>
        <li><strong>Blues:</strong> Authentische Blues-Musik mit Mundharmonika und E-Gitarre</li>
        <li><strong>Deutsche Tradition:</strong> Klassische deutsche Lieder und Volksmusik</li>
        <li><strong>Singer-Songwriter:</strong> Eigene Kompositionen lokaler Talente</li>
      </ul>
      
      <h3>Reservierung empfohlen</h3>
      <p>Da unsere Musikabende sehr beliebt sind, empfehlen wir eine rechtzeitige Tischreservierung. Rufen Sie uns unter 030-123456 an oder kommen Sie persönlich vorbei.</p>
      
      <h3>Kommende Auftritte</h3>
      <p>Jeden Mittwoch veröffentlichen wir das Programm für den kommenden Freitag auf unserer Website und in den sozialen Medien.</p>
      
      <p><strong>Lassen Sie sich von der lebendigen Berliner Musikszene verzaubern!</strong></p>
    `,
    contentEn: `
      <h2>Music Brings Life to Our Pub</h2>
      <p>We are excited to offer live music every Friday in our pub. From 8:00 PM to 10:30 PM, our cozy space transforms into a small concert stage.</p>
      
      <h3>Diverse Program</h3>
      <p>Our artists come from the local Berlin music scene and bring various musical styles:</p>
      <ul>
        <li><strong>Folk and Acoustic:</strong> Intimate performances with guitar and vocals</li>
        <li><strong>Blues:</strong> Authentic blues music with harmonica and electric guitar</li>
        <li><strong>German Tradition:</strong> Classic German songs and folk music</li>
        <li><strong>Singer-Songwriter:</strong> Original compositions by local talents</li>
      </ul>
      
      <h3>Reservation Recommended</h3>
      <p>Since our music evenings are very popular, we recommend making table reservations in advance. Call us at 030-123456 or visit us in person.</p>
      
      <h3>Upcoming Performances</h3>
      <p>Every Wednesday we publish the program for the coming Friday on our website and social media.</p>
      
      <p><strong>Let yourself be enchanted by Berlin's vibrant music scene!</strong></p>
    `
  },
  {
    id: 3,
    slug: 'erweiterte-weinkarte',
    category: 'wine',
    date: '2024-02-28',
    readTime: '3',
    titleDe: 'Erweiterte Weinkarte',
    titleEn: 'Expanded Wine Menu',
    excerptDe: 'Wir haben unsere Weinkarte mit den besten deutschen Weinen aus dem Rhein- und Moseltal erweitert. Jeder Wein wurde sorgfältig ausgewählt...',
    excerptEn: 'We have expanded our wine menu with the finest German wines from Rhine and Moselle valleys. Each wine was carefully selected...',
    contentDe: `
      <h2>Deutsche Weinkultur im Berliner Pub</h2>
      <p>Wir sind stolz darauf, unsere Weinkarte um eine exquisite Auswahl deutscher Weine zu erweitern. Nach intensiver Verkostung und Auswahl können wir Ihnen nun 15 neue Weine präsentieren.</p>
      
      <h3>Regionen im Fokus</h3>
      <p>Unsere neuen Weine stammen aus den renommiertesten deutschen Weinregionen:</p>
      
      <h4>Moseltal</h4>
      <p>Elegante Riesling-Weine mit ihrer charakteristischen Mineralität und Frische. Perfekt als Begleitung zu unseren leichteren Gerichten oder als Aperitif.</p>
      
      <h4>Rheingau</h4>
      <p>Klassische Riesling-Weine von Weltklasse, die die Tradition und Exzellenz dieser historischen Weinregion widerspiegeln.</p>
      
      <h4>Pfalz</h4>
      <p>Kräftige Rotweine und fruchtige Weißweine aus einer der sonnigsten Regionen Deutschlands.</p>
      
      <h3>Weinverkostungen</h3>
      <p>Jeden ersten Donnerstag im Monat bieten wir eine Weinverkostung an, bei der Sie unsere neuen Weine probieren und mehr über ihre Herkunft erfahren können.</p>
      
      <p><strong>Entdecken Sie die Vielfalt deutscher Weine in unserem Pub!</strong></p>
    `,
    contentEn: `
      <h2>German Wine Culture at Berliner Pub</h2>
      <p>We are proud to expand our wine menu with an exquisite selection of German wines. After intensive tasting and selection, we can now present 15 new wines to you.</p>
      
      <h3>Regions in Focus</h3>
      <p>Our new wines come from Germany's most renowned wine regions:</p>
      
      <h4>Moselle Valley</h4>
      <p>Elegant Riesling wines with their characteristic minerality and freshness. Perfect as accompaniment to our lighter dishes or as an aperitif.</p>
      
      <h4>Rheingau</h4>
      <p>World-class classic Riesling wines that reflect the tradition and excellence of this historic wine region.</p>
      
      <h4>Palatinate</h4>
      <p>Robust red wines and fruity white wines from one of Germany's sunniest regions.</p>
      
      <h3>Wine Tastings</h3>
      <p>Every first Thursday of the month, we offer wine tastings where you can sample our new wines and learn more about their origins.</p>
      
      <p><strong>Discover the diversity of German wines in our pub!</strong></p>
    `
  },
  {
    id: 4,
    slug: 'jubilaeum-berliner-pub',
    category: 'events',
    date: '2024-02-20',
    readTime: '2',
    titleDe: '23-jähriges Jubiläum des Berliner Pub',
    titleEn: '23rd Anniversary of Berliner Pub',
    excerptDe: 'Dieses Jahr feiert unser Pub 23 Jahre! Schließen Sie sich uns am 15. April für eine besondere Feier mit Überraschungen an...',
    excerptEn: 'This year our pub celebrates 23 years! Join us on April 15th for a special celebration with surprises...',
    contentDe: `
      <h2>23 Jahre Berliner Pub - Eine Erfolgsgeschichte</h2>
      <p>Am 15. April 2024 feiern wir ein besonderes Jubiläum: 23 Jahre Berliner Pub! Was als kleine Kneipe in der Ansbacher Straße begann, ist heute ein beliebter Treffpunkt für Menschen aus aller Welt geworden.</p>
      
      <h3>Unsere Geschichte</h3>
      <p>2001 öffneten wir unsere Türen mit dem Ziel, eine authentische deutsche Kneipenatmosphäre zu schaffen. Über die Jahre hinweg haben wir uns kontinuierlich weiterentwickelt, ohne dabei unsere Wurzeln zu vergessen.</p>
      
      <h3>Jubiläumsfeier am 15. April</h3>
      <p>Feiern Sie mit uns dieses besondere Ereignis! Wir haben ein großartiges Programm vorbereitet:</p>
      <ul>
        <li><strong>17:00 - 19:00:</strong> Happy Hour mit 20% Rabatt auf alle Getränke</li>
        <li><strong>19:00 - 20:00:</strong> Kurze Ansprache und Rückblick auf 23 Jahre</li>
        <li><strong>20:00 - 22:00:</strong> Live-Musik mit der Band "Berlin Roots"</li>
        <li><strong>22:00 - 24:00:</strong> DJ und Tanz</li>
      </ul>
      
      <h3>Besondere Überraschungen</h3>
      <p>Für unsere Stammgäste haben wir einige Überraschungen vorbereitet, die wir an diesem Abend bekannt geben werden.</p>
      
      <p><strong>Seien Sie dabei und feiern Sie mit uns 23 Jahre Berliner Pub!</strong></p>
    `,
    contentEn: `
      <h2>23 Years of Berliner Pub - A Success Story</h2>
      <p>On April 15, 2024, we celebrate a special anniversary: 23 years of Berliner Pub! What started as a small pub on Ansbacher Street has become a popular meeting place for people from all over the world.</p>
      
      <h3>Our Story</h3>
      <p>We opened our doors in 2001 with the goal of creating an authentic German pub atmosphere. Over the years, we have continuously evolved without forgetting our roots.</p>
      
      <h3>Anniversary Celebration on April 15th</h3>
      <p>Celebrate this special event with us! We have prepared a great program:</p>
      <ul>
        <li><strong>5:00 PM - 7:00 PM:</strong> Happy Hour with 20% off all drinks</li>
        <li><strong>7:00 PM - 8:00 PM:</strong> Short speech and look back at 23 years</li>
        <li><strong>8:00 PM - 10:00 PM:</strong> Live music with the band "Berlin Roots"</li>
        <li><strong>10:00 PM - 12:00 AM:</strong> DJ and dancing</li>
      </ul>
      
      <h3>Special Surprises</h3>
      <p>We have prepared some surprises for our regular guests, which we will announce that evening.</p>
      
      <p><strong>Join us and celebrate 23 years of Berliner Pub!</strong></p>
    `
  },
  {
    id: 5,
    slug: 'deutsche-schnaepse-sammlung',
    category: 'drinks',
    date: '2024-02-15',
    readTime: '3',
    titleDe: 'Erweiterte Sammlung deutscher Schnäpse',
    titleEn: 'Expanded Collection of German Spirits',
    excerptDe: 'Wir haben unserer Sammlung seltene deutsche Schnäpse von privaten Destillerien hinzugefügt. Probieren Sie einzigartige Geschmäcker...',
    excerptEn: 'We have added rare German spirits from private distilleries to our collection. Try unique flavors...',
    contentDe: `
      <h2>Edle Schnäpse aus deutschen Landen</h2>
      <p>Unsere Spirituosen-Sammlung wurde um 12 exquisite deutsche Schnäpse erweitert. Diese stammen aus kleinen, familiengeführten Destillerien und repräsentieren die Vielfalt der deutschen Brennkunst.</p>
      
      <h3>Neue Highlights</h3>
      
      <h4>Obstbrände</h4>
      <p>Fruchtige Brände aus dem Schwarzwald und der Eifel:</p>
      <ul>
        <li>Williams-Christ-Birnenbrand (42% Vol.)</li>
        <li>Sauerkirschbrand aus der Eifel (40% Vol.)</li>
        <li>Mirabellenbrand aus Baden (43% Vol.)</li>
      </ul>
      
      <h4>Kräuterschnäpse</h4>
      <p>Traditionelle Kräuterspirituosen mit geheimen Rezepturen:</p>
      <ul>
        <li>Alpenbitter aus Bayern (35% Vol.)</li>
        <li>Schwarzwälder Kräuterschnaps (38% Vol.)</li>
        <li>Rheinischer Klosterschnaps (40% Vol.)</li>
      </ul>
      
      <h3>Verkostungssets</h3>
      <p>Für Neugierige bieten wir Verkostungssets mit je 3 cl von drei verschiedenen Schnäpsen an. So können Sie die Vielfalt deutscher Brennkunst entdecken, ohne sich auf eine Sorte festlegen zu müssen.</p>
      
      <h3>Fachkundige Beratung</h3>
      <p>Unser Personal wurde von den Destillerien geschult und kann Sie kompetent über Herstellung, Geschmack und ideale Trinktemperatur beraten.</p>
      
      <p><strong>Entdecken Sie die Welt der deutschen Schnäpse bei uns!</strong></p>
    `,
    contentEn: `
      <h2>Fine Spirits from German Lands</h2>
      <p>Our spirits collection has been expanded with 12 exquisite German schnapps. These come from small, family-run distilleries and represent the diversity of German distilling art.</p>
      
      <h3>New Highlights</h3>
      
      <h4>Fruit Brandies</h4>
      <p>Fruity brandies from the Black Forest and Eifel:</p>
      <ul>
        <li>Williams pear brandy (42% Vol.)</li>
        <li>Sour cherry brandy from Eifel (40% Vol.)</li>
        <li>Mirabelle brandy from Baden (43% Vol.)</li>
      </ul>
      
      <h4>Herbal Spirits</h4>
      <p>Traditional herbal spirits with secret recipes:</p>
      <ul>
        <li>Alpine bitter from Bavaria (35% Vol.)</li>
        <li>Black Forest herbal schnapps (38% Vol.)</li>
        <li>Rhenish monastery schnapps (40% Vol.)</li>
      </ul>
      
      <h3>Tasting Sets</h3>
      <p>For the curious, we offer tasting sets with 3 cl each of three different schnapps. This way you can discover the diversity of German distilling art without committing to one type.</p>
      
      <h3>Expert Advice</h3>
      <p>Our staff has been trained by the distilleries and can competently advise you on production, taste, and ideal drinking temperature.</p>
      
      <p><strong>Discover the world of German schnapps with us!</strong></p>
    `
  }
];

export const getCategoryColor = (category: string) => {
  const colors = {
    "beer": "bg-accent/20 text-accent-foreground",
    "events": "bg-pub-red/20 text-red-800", 
    "music": "bg-blue-100 text-blue-800",
    "wine": "bg-purple-100 text-purple-800",
    "drinks": "bg-green-100 text-green-800"
  };
  return colors[category as keyof typeof colors] || "bg-muted text-muted-foreground";
};

export const getCategoryName = (category: string, language: 'de' | 'en') => {
  const names = {
    de: {
      "beer": "Bier",
      "events": "Veranstaltungen",
      "music": "Musik", 
      "wine": "Wein",
      "drinks": "Getränke"
    },
    en: {
      "beer": "Beer",
      "events": "Events", 
      "music": "Music",
      "wine": "Wine", 
      "drinks": "Drinks"
    }
  };
  return names[language][category as keyof typeof names[typeof language]] || category;
};