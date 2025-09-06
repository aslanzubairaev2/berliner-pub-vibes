import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Beer, Coffee, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

// Import all drink images
import berlinerWeisseImg from "@/assets/berliner-weisse-transparent.png";
import augustinerBeerImg from "@/assets/augustiner-beer-transparent.png";
import erdingerWeissbierImg from "@/assets/erdinger-weissbier-transparent.png";
import kostritzerSchwarzbieerImg from "@/assets/kostritzer-schwarzbier-transparent.png";
import craftBeerImg from "@/assets/craft-beer-transparent.png";
import germanSchnappsImg from "@/assets/german-schnapps-transparent.png";
import jagermeisterImg from "@/assets/jagermeister-transparent.png";
import rieslingWineImg from "@/assets/riesling-wine-transparent.png";
import gluhweinImg from "@/assets/gluhwein-transparent.png";
import apfelschorleImg from "@/assets/apfelschorle-transparent.png";
import fassbrauseImg from "@/assets/fassbrause-transparent.png";
import coffeeImg from "@/assets/coffee-transparent.png";
import hotChocolateImg from "@/assets/hot-chocolate-transparent.png";
import teaSelectionImg from "@/assets/tea-selection-transparent.png";

const Menu = () => {
  const { toast } = useToast();
  const { language, t } = useLanguage();
  const [selectedDrink, setSelectedDrink] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const drinkMenu = [
    {
      categoryDe: "Bier",
      categoryEn: "Beer",
      items: [
        {
          name: "Berliner Weisse",
          descriptionDe: "Traditionelles Berliner Weizenbier mit Sirup",
          descriptionEn: "Traditional Berlin wheat beer with syrup",
          price: "€4.50",
          image: berlinerWeisseImg,
          alcohol: "2.8-3.8%",
          fullDescriptionDe: "Die Berliner Weisse ist ein traditionelles obergäriges Weizenbier mit niedrigem Alkoholgehalt, das seinen Ursprung in Berlin hat. Charakteristisch für dieses Bier ist sein säuerlicher Geschmack, der durch Milchsäuregärung entsteht. Traditionell wird es mit grünem Waldmeister- oder rotem Himbeersirup serviert, was dem Bier seine typische Farbe verleiht. Das Bier wurde erstmals im 17. Jahrhundert gebraut und galt als 'Champagner des Nordens'.",
          fullDescriptionEn: "Berliner Weisse is a traditional top-fermented wheat beer with low alcohol content that originated in Berlin. Characteristic of this beer is its sour taste, which is created by lactic acid fermentation. It is traditionally served with green woodruff or red raspberry syrup, which gives the beer its typical color. The beer was first brewed in the 17th century and was known as the 'Champagne of the North'."
        },
        {
          name: "Augustiner Lagerbier Hell",
          descriptionDe: "Klassisches Münchner Lager",
          descriptionEn: "Classic Munich Lager",
          price: "€5.00",
          image: augustinerBeerImg,
          alcohol: "5.2%",
          fullDescriptionDe: "Augustiner Lagerbier Hell ist ein klassisches Münchner Vollbier aus der ältesten Brauerei Münchens, gegründet 1328. Das helle Lagerbier zeichnet sich durch seinen vollmundigen, ausgewogenen Geschmack aus. Gebraut wird es nach traditionellem bayerischem Reinheitsgebot ausschließlich aus Hopfen, Malz, Hefe und Wasser. Der Hopfen verleiht dem Bier eine feine, elegante Bittere, während das Malz für den runden, harmonischen Körper sorgt.",
          fullDescriptionEn: "Augustiner Lagerbier Hell is a classic Munich full beer from Munich's oldest brewery, founded in 1328. The light lager is characterized by its full-bodied, balanced taste. It is brewed according to the traditional Bavarian purity law exclusively from hops, malt, yeast and water. The hops give the beer a fine, elegant bitterness, while the malt provides the round, harmonious body."
        },
        {
          name: "Erdinger Weissbier",
          descriptionDe: "Bayerisches Weizenbier",
          descriptionEn: "Bavarian wheat beer",
          price: "€5.50",
          image: erdingerWeissbierImg,
          alcohol: "5.3%",
          fullDescriptionDe: "Erdinger Weissbier ist ein traditionelles bayerisches Weizenbier aus Erding bei München. Die Brauerei wurde 1886 gegründet und ist heute eine der führenden Weizenbierbrauereien der Welt. Das Bier wird mit mindestens 50% Weizenmalz gebraut und besticht durch seinen fruchtig-frischen Geschmack mit Noten von Banane und Gewürznelke. Die typische Hefe verleiht dem Bier seinen charakteristischen Geschmack und die natürliche Trübung.",
          fullDescriptionEn: "Erdinger Weissbier is a traditional Bavarian wheat beer from Erding near Munich. The brewery was founded in 1886 and is today one of the world's leading wheat beer breweries. The beer is brewed with at least 50% wheat malt and captivates with its fruity-fresh taste with notes of banana and clove. The typical yeast gives the beer its characteristic taste and natural cloudiness."
        },
        {
          name: "Köstritzer Schwarzbier",
          descriptionDe: "Dunkles Bier aus Thüringen",
          descriptionEn: "Dark beer from Thuringia",
          price: "€5.20",
          image: kostritzerSchwarzbieerImg,
          alcohol: "4.8%",
          fullDescriptionDe: "Das Köstritzer Schwarzbier ist ein traditionelles Schwarzbier aus Bad Köstritz in Thüringen. Die Brauerei blickt auf über 500 Jahre Brauereigeschichte zurück. Das Schwarzbier zeichnet sich durch seine dunkle Farbe und den malzig-süßlichen Geschmack aus, der durch die Verwendung von dunklem Röstmalz entsteht. Trotz seiner dunklen Farbe ist es überraschend mild und erfrischend, mit Noten von Schokolade und Kaffee.",
          fullDescriptionEn: "Köstritzer Schwarzbier is a traditional black beer from Bad Köstritz in Thuringia. The brewery looks back on over 500 years of brewing history. The black beer is characterized by its dark color and malty-sweet taste, which comes from the use of dark roasted malt. Despite its dark color, it is surprisingly mild and refreshing, with notes of chocolate and coffee."
        },
        {
          name: "Craft Beer Auswahl",
          descriptionDe: "Wechselnde Craft-Biere von lokalen Brauereien",
          descriptionEn: "Rotating craft beers from local breweries",
          price: "€6.50",
          image: craftBeerImg,
          alcohol: "4.5-7.2%",
          fullDescriptionDe: "Unsere wechselnde Auswahl an Craft-Bieren stammt von ausgewählten Berliner und deutschen Mikrobrauereien. Diese handwerklich gebrauten Biere zeichnen sich durch innovative Rezepturen, hochwertige Zutaten und außergewöhnliche Geschmacksprofile aus. Von hopfenbetonten IPAs über fruchtige Sauerbiere bis hin zu kräftigen Stouts - entdecken Sie jeden Monat neue Geschmackswelten von leidenschaftlichen Braumeistern.",
          fullDescriptionEn: "Our rotating selection of craft beers comes from selected Berlin and German microbreweries. These artisanally brewed beers are characterized by innovative recipes, high-quality ingredients and exceptional flavor profiles. From hop-heavy IPAs to fruity sour beers to strong stouts - discover new flavor worlds from passionate brewmasters every month."
        }
      ]
    },
    {
      categoryDe: "Alkoholische Getränke",
      categoryEn: "Alcoholic Beverages",
      items: [
        {
          name: "Schnapps Auswahl",
          descriptionDe: "Auswahl traditioneller deutscher Schnäpse",
          descriptionEn: "Selection of traditional German schnapps",
          price: "€4.00",
          image: germanSchnappsImg,
          alcohol: "38-42%",
          fullDescriptionDe: "Unsere Schnapps-Auswahl umfasst traditionelle deutsche Obstbrände und Kräuterschnäpse. Dazu gehören Zwetschgenwasser, Kirschwasser, Birnenbrand und Apfelkorn. Jeder Schnaps wird nach traditionellen Rezepturen destilliert und zeichnet sich durch seinen reinen, intensiven Frucht- oder Kräutergeschmack aus. Perfekt als Digestif nach dem Essen oder als traditioneller Begleiter zu herzhaften Speisen.",
          fullDescriptionEn: "Our schnapps selection includes traditional German fruit brandies and herbal schnapps. These include plum brandy, cherry brandy, pear brandy and apple liqueur. Each schnapps is distilled according to traditional recipes and is characterized by its pure, intense fruit or herbal flavor. Perfect as a digestif after dinner or as a traditional accompaniment to hearty dishes."
        },
        {
          name: "Jägermeister",
          descriptionDe: "Klassischer Kräuterlikör",
          descriptionEn: "Classic herbal liqueur",
          price: "€4.50",
          image: jagermeisterImg,
          alcohol: "35%",
          fullDescriptionDe: "Jägermeister ist ein deutscher Kräuterlikör aus Wolfenbüttel, der seit 1935 nach einem geheimen Rezept mit 56 verschiedenen Kräutern, Früchten, Gewürzen und Wurzeln hergestellt wird. Die Mischung wird ein ganzes Jahr lang in Eichenfässern gelagert, bevor sie gefiltert und abgefüllt wird. Der komplexe Geschmack vereint süße und bittere Noten mit einem charakteristischen Kräuteraroma.",
          fullDescriptionEn: "Jägermeister is a German herbal liqueur from Wolfenbüttel that has been made since 1935 according to a secret recipe with 56 different herbs, fruits, spices and roots. The mixture is aged in oak barrels for a whole year before being filtered and bottled. The complex flavor combines sweet and bitter notes with a characteristic herbal aroma."
        },
        {
          name: "Riesling",
          descriptionDe: "Deutscher Weißwein aus dem Rheintal",
          descriptionEn: "German white wine from the Rhine Valley",
          price: "€6.00",
          image: rieslingWineImg,
          alcohol: "11.5%",
          fullDescriptionDe: "Unser Riesling stammt aus den renommierten Weinlagen des Rheintals und repräsentiert die hohe Kunst deutschen Weinbaus. Diese edle Rebsorte zeichnet sich durch ihre lebendige Säure und ihr komplexes Aromaprofil aus, das von grünem Apfel und Zitrus bis hin zu mineralischen Noten reicht. Der Wein wird in traditionellen deutschen Kellereien vinifiziert und verkörpert die typische Eleganz und Frische deutscher Rieslingweine.",
          fullDescriptionEn: "Our Riesling comes from the renowned vineyards of the Rhine Valley and represents the high art of German winemaking. This noble grape variety is characterized by its lively acidity and complex aroma profile, ranging from green apple and citrus to mineral notes. The wine is vinified in traditional German cellars and embodies the typical elegance and freshness of German Riesling wines."
        },
        {
          name: "Glühwein (Winter)",
          descriptionDe: "Heißer Glühwein mit Gewürzen",
          descriptionEn: "Hot mulled wine with spices",
          price: "€5.50",
          image: gluhweinImg,
          alcohol: "7-14%",
          fullDescriptionDe: "Unser hausgemachter Glühwein wird aus ausgewählten deutschen Rotweinen zubereitet und mit einer traditionellen Gewürzmischung aus Zimt, Nelken, Sternanis und Orangenschale verfeinert. Das jahrhundertealte Rezept stammt aus der deutschen Weihnachtstradition und wird bei uns von November bis März serviert. Der Glühwein wird schonend erhitzt, um die Aromen zu bewahren und ein warmes, wohltuendes Getränk zu schaffen.",
          fullDescriptionEn: "Our homemade mulled wine is prepared from selected German red wines and refined with a traditional spice mixture of cinnamon, cloves, star anise and orange peel. The centuries-old recipe comes from German Christmas tradition and is served here from November to March. The mulled wine is gently heated to preserve the aromas and create a warm, soothing drink."
        }
      ]
    },
    {
      categoryDe: "Alkoholfreie Getränke",
      categoryEn: "Non-Alcoholic Beverages",
      items: [
        {
          name: "Apfelschorle",
          descriptionDe: "Apfelsaft mit Mineralwasser",
          descriptionEn: "Apple juice with mineral water",
          price: "€3.50",
          image: apfelschorleImg,
          alcohol: "0%",
          fullDescriptionDe: "Die Apfelschorle ist ein klassisches deutsches Erfrischungsgetränk, das aus naturtrübem Apfelsaft und kohlensäurehaltigem Mineralwasser hergestellt wird. Wir verwenden ausschließlich Direktsaft von deutschen Äpfeln aus kontrolliert biologischem Anbau. Das Mischungsverhältnis von 60% Apfelsaft zu 40% Mineralwasser sorgt für den perfekten Geschmack - fruchtig, erfrischend und nicht zu süß.",
          fullDescriptionEn: "Apple spritzer is a classic German refreshing drink made from naturally cloudy apple juice and carbonated mineral water. We use exclusively direct juice from German apples from certified organic cultivation. The mixing ratio of 60% apple juice to 40% mineral water ensures the perfect taste - fruity, refreshing and not too sweet."
        },
        {
          name: "Fassbrause",
          descriptionDe: "Traditionelle deutsche Limonade",
          descriptionEn: "Traditional German lemonade",
          price: "€3.80",
          image: fassbrauseImg,
          alcohol: "0%",
          fullDescriptionDe: "Fassbrause ist eine traditionelle deutsche Limonade, die ursprünglich als alkoholfreie Alternative zu Bier entwickelt wurde. Die erste Fassbrause wurde 1908 vom Chemiker Carl Rehm erfunden. Unser Getränk basiert auf natürlichen Fruchtextrakten und Malzauszug, was ihm einen charakteristisch malzig-fruchtigen Geschmack verleiht. Die leichte Süße wird durch eine erfrischende Säure ausbalanciert.",
          fullDescriptionEn: "Fassbrause is a traditional German lemonade that was originally developed as a non-alcoholic alternative to beer. The first Fassbrause was invented in 1908 by chemist Carl Rehm. Our drink is based on natural fruit extracts and malt extract, which gives it a characteristically malty-fruity taste. The light sweetness is balanced by a refreshing acidity."
        },
        {
          name: "Kaffee",
          descriptionDe: "Frisch gebrühter Kaffee",
          descriptionEn: "Freshly brewed coffee",
          price: "€2.50",
          image: coffeeImg,
          alcohol: "0%",
          fullDescriptionDe: "Unser Kaffee wird aus einer sorgfältig ausgewählten Mischung hochwertiger Arabica-Bohnen zubereitet, die von nachhaltigen Plantagen in Mittel- und Südamerika stammen. Die Bohnen werden täglich frisch geröstet und in unserer italienischen Espressomaschine zubereitet. Jede Tasse wird individuell aufgebrüht, um das volle Aroma und die perfekte Crema zu gewährleisten.",
          fullDescriptionEn: "Our coffee is prepared from a carefully selected blend of high-quality Arabica beans from sustainable plantations in Central and South America. The beans are freshly roasted daily and prepared in our Italian espresso machine. Each cup is individually brewed to ensure full aroma and perfect crema."
        },
        {
          name: "Heisse Schokolade",
          descriptionDe: "Heiße Schokolade mit Sahne",
          descriptionEn: "Hot chocolate with cream",
          price: "€4.20",
          image: hotChocolateImg,
          alcohol: "0%",
          fullDescriptionDe: "Unsere hausgemachte heiße Schokolade wird aus echter belgischer Schokolade mit 70% Kakaoanteil zubereitet. Die Schokolade wird langsam in warmer Vollmilch aufgelöst und mit einem Hauch Vanille verfeinert. Serviert wird sie mit frisch geschlagener Sahne und optional mit Marshmallows oder Zimt. Ein wahres Verwöhnerlebnis für Schokoladenliebhaber in der kalten Jahreszeit.",
          fullDescriptionEn: "Our homemade hot chocolate is made from real Belgian chocolate with 70% cocoa content. The chocolate is slowly dissolved in warm whole milk and refined with a touch of vanilla. It is served with freshly whipped cream and optionally with marshmallows or cinnamon. A true indulgent experience for chocolate lovers in the cold season."
        },
        {
          name: "Tee Auswahl",
          descriptionDe: "Verschiedene hochwertige Tees",
          descriptionEn: "Various high-quality teas",
          price: "€3.20",
          image: teaSelectionImg,
          alcohol: "0%",
          fullDescriptionDe: "Unsere sorgfältig kuratierte Teeauswahl umfasst klassischen schwarzen Tee, grünen Tee, Kamillentee, Pfefferminztee und Früchtetee. Jeder Tee wird aus hochwertigen, lose Blättern zubereitet und für die optimale Ziehzeit aufgebrüht. Die Tees stammen aus nachhaltigen Anbaugebieten und werden ohne künstliche Zusätze serviert. Auf Wunsch mit Honig, Zitrone oder Milch verfügbar.",
          fullDescriptionEn: "Our carefully curated tea selection includes classic black tea, green tea, chamomile tea, peppermint tea and fruit tea. Each tea is prepared from high-quality loose leaves and brewed for the optimal steeping time. The teas come from sustainable growing areas and are served without artificial additives. Available with honey, lemon or milk on request."
        }
      ]
    }
  ];

  const handleDrinkClick = (drink) => {
    setSelectedDrink(drink);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDrink(null);
  };

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">{t('menu.badge')}</Badge>
          <h1 className="text-5xl font-bold mb-6">{t('menu.title')}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('menu.subtitle')}
          </p>
        </div>

        {/* Drinks Menu */}
        <div className="space-y-12">
          {drinkMenu.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h2 className="text-3xl font-bold mb-8 text-center">
                {language === 'de' ? category.categoryDe : category.categoryEn}
              </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {category.items.map((item, itemIndex) => (
                    <Card 
                      key={itemIndex} 
                      className="pub-hover-lift pub-card-shadow border-0 cursor-pointer"
                      onClick={() => handleDrinkClick(item)}
                    >
                      <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-semibold">{item.name}</h3>
                        <Badge variant="secondary" className="ml-2 bg-accent text-accent-foreground">
                          {item.price}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">
                        {language === 'de' ? item.descriptionDe : item.descriptionEn}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Special Note */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto bg-muted/30 border-0">
            <CardContent className="p-8">
              <Coffee className="h-8 w-8 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">{t('menu.specialOffer')}</h3>
              <p className="text-muted-foreground">
                {t('menu.specialOfferText')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Product Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                {selectedDrink?.name}
              </DialogTitle>
            </DialogHeader>
            
            {selectedDrink && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Image - Left Side */}
                <div className="w-full">
                  <div className="aspect-[3/4] rounded-lg overflow-hidden flex justify-start md:justify-start">
                    <img 
                      src={selectedDrink.image} 
                      alt={selectedDrink.name}
                      className="w-full md:h-full md:w-auto object-contain rounded-lg"
                    />
                  </div>
                </div>

                {/* Product Info - Right Side */}
                <div className="space-y-6">
                  {/* Price and Alcohol Info */}
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary" className="text-lg px-4 py-2 bg-accent text-accent-foreground">
                      {selectedDrink.price}
                    </Badge>
                    <Badge variant="outline" className="text-sm">
                      {t('menu.alcohol')}: {selectedDrink.alcohol}
                    </Badge>
                  </div>

                  {/* Short Description */}
                  <div>
                    <h4 className="font-semibold mb-2">{t('menu.shortDescription')}</h4>
                    <p className="text-muted-foreground">
                      {language === 'de' ? selectedDrink.descriptionDe : selectedDrink.descriptionEn}
                    </p>
                  </div>

                  {/* Full Description */}
                  <div>
                    <h4 className="font-semibold mb-2">{t('menu.detailedDescription')}</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {language === 'de' ? selectedDrink.fullDescriptionDe : selectedDrink.fullDescriptionEn}
                    </p>
                  </div>

                  {/* Close Button */}
                  <div className="flex justify-center pt-4">
                    <Button onClick={closeModal} className="w-full md:w-auto">
                      {t('menu.close')}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Menu;