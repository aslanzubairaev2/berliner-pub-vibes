import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Beer, Coffee, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Import all drink images
import berlinerWeisseImg from "@/assets/berliner-weisse.jpg";
import augustinerBeerImg from "@/assets/augustiner-beer.jpg";
import erdingerWeissbierImg from "@/assets/erdinger-weissbier.jpg";
import kostritzerSchwarzbieerImg from "@/assets/kostritzer-schwarzbier.jpg";
import craftBeerImg from "@/assets/craft-beer.jpg";
import germanSchnappsImg from "@/assets/german-schnapps.jpg";
import jagermeisterImg from "@/assets/jagermeister.jpg";
import rieslingWineImg from "@/assets/riesling-wine.jpg";
import gluhweinImg from "@/assets/gluhwein.jpg";
import apfelschorleImg from "@/assets/apfelschorle.jpg";
import fassbrauseImg from "@/assets/fassbrause.jpg";
import coffeeImg from "@/assets/coffee.jpg";
import hotChocolateImg from "@/assets/hot-chocolate.jpg";
import teaSelectionImg from "@/assets/tea-selection.jpg";

const Menu = () => {
  const { toast } = useToast();
  const [selectedDrink, setSelectedDrink] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const drinkMenu = [
    {
      category: "Bier",
      items: [
        {
          name: "Berliner Weisse",
          description: "Traditionelles Berliner Weizenbier mit Sirup",
          price: "€4.50",
          image: berlinerWeisseImg,
          alcohol: "2.8-3.8%",
          fullDescription: "Die Berliner Weisse ist ein traditionelles obergäriges Weizenbier mit niedrigem Alkoholgehalt, das seinen Ursprung in Berlin hat. Charakteristisch für dieses Bier ist sein säuerlicher Geschmack, der durch Milchsäuregärung entsteht. Traditionell wird es mit grünem Waldmeister- oder rotem Himbeersirup serviert, was dem Bier seine typische Farbe verleiht. Das Bier wurde erstmals im 17. Jahrhundert gebraut und galt als 'Champagner des Nordens'."
        },
        {
          name: "Augustiner Lagerbier Hell",
          description: "Klassisches Münchner Lager",
          price: "€5.00",
          image: augustinerBeerImg,
          alcohol: "5.2%",
          fullDescription: "Augustiner Lagerbier Hell ist ein klassisches Münchner Vollbier aus der ältesten Brauerei Münchens, gegründet 1328. Das helle Lagerbier zeichnet sich durch seinen vollmundigen, ausgewogenen Geschmack aus. Gebraut wird es nach traditionellem bayerischem Reinheitsgebot ausschließlich aus Hopfen, Malz, Hefe und Wasser. Der Hopfen verleiht dem Bier eine feine, elegante Bittere, während das Malz für den runden, harmonischen Körper sorgt."
        },
        {
          name: "Erdinger Weissbier",
          description: "Bayerisches Weizenbier",
          price: "€5.50",
          image: erdingerWeissbierImg,
          alcohol: "5.3%",
          fullDescription: "Erdinger Weissbier ist ein traditionelles bayerisches Weizenbier aus Erding bei München. Die Brauerei wurde 1886 gegründet und ist heute eine der führenden Weizenbierbrauereien der Welt. Das Bier wird mit mindestens 50% Weizenmalz gebraut und besticht durch seinen fruchtig-frischen Geschmack mit Noten von Banane und Gewürznelke. Die typische Hefe verleiht dem Bier seinen charakteristischen Geschmack und die natürliche Trübung."
        },
        {
          name: "Köstritzer Schwarzbier",
          description: "Dunkles Bier aus Thüringen",
          price: "€5.20",
          image: kostritzerSchwarzbieerImg,
          alcohol: "4.8%",
          fullDescription: "Das Köstritzer Schwarzbier ist ein traditionelles Schwarzbier aus Bad Köstritz in Thüringen. Die Brauerei blickt auf über 500 Jahre Brauereigeschichte zurück. Das Schwarzbier zeichnet sich durch seine dunkle Farbe und den malzig-süßlichen Geschmack aus, der durch die Verwendung von dunklem Röstmalz entsteht. Trotz seiner dunklen Farbe ist es überraschend mild und erfrischend, mit Noten von Schokolade und Kaffee."
        },
        {
          name: "Craft Beer Auswahl",
          description: "Wechselnde Craft-Biere von lokalen Brauereien",
          price: "€6.50",
          image: craftBeerImg,
          alcohol: "4.5-7.2%",
          fullDescription: "Unsere wechselnde Auswahl an Craft-Bieren stammt von ausgewählten Berliner und deutschen Mikrobrauereien. Diese handwerklich gebrauten Biere zeichnen sich durch innovative Rezepturen, hochwertige Zutaten und außergewöhnliche Geschmacksprofile aus. Von hopfenbetonten IPAs über fruchtige Sauerbiere bis hin zu kräftigen Stouts - entdecken Sie jeden Monat neue Geschmackswelten von leidenschaftlichen Braumeistern."
        }
      ]
    },
    {
      category: "Alkoholische Getränke",
      items: [
        {
          name: "Schnapps Auswahl",
          description: "Auswahl traditioneller deutscher Schnäpse",
          price: "€4.00",
          image: germanSchnappsImg,
          alcohol: "38-42%",
          fullDescription: "Unsere Schnapps-Auswahl umfasst traditionelle deutsche Obstbrände und Kräuterschnäpse. Dazu gehören Zwetschgenwasser, Kirschwasser, Birnenbrand und Apfelkorn. Jeder Schnaps wird nach traditionellen Rezepturen destilliert und zeichnet sich durch seinen reinen, intensiven Frucht- oder Kräutergeschmack aus. Perfekt als Digestif nach dem Essen oder als traditioneller Begleiter zu herzhaften Speisen."
        },
        {
          name: "Jägermeister",
          description: "Klassischer Kräuterlikör",
          price: "€4.50",
          image: jagermeisterImg,
          alcohol: "35%",
          fullDescription: "Jägermeister ist ein deutscher Kräuterlikör aus Wolfenbüttel, der seit 1935 nach einem geheimen Rezept mit 56 verschiedenen Kräutern, Früchten, Gewürzen und Wurzeln hergestellt wird. Die Mischung wird ein ganzes Jahr lang in Eichenfässern gelagert, bevor sie gefiltert und abgefüllt wird. Der komplexe Geschmack vereint süße und bittere Noten mit einem charakteristischen Kräuteraroma."
        },
        {
          name: "Riesling",
          description: "Deutscher Weißwein aus dem Rheintal",
          price: "€6.00",
          image: rieslingWineImg,
          alcohol: "11.5%",
          fullDescription: "Unser Riesling stammt aus den renommierten Weinlagen des Rheintals und repräsentiert die hohe Kunst deutschen Weinbaus. Diese edle Rebsorte zeichnet sich durch ihre lebendige Säure und ihr komplexes Aromaprofil aus, das von grünem Apfel und Zitrus bis hin zu mineralischen Noten reicht. Der Wein wird in traditionellen deutschen Kellereien vinifiziert und verkörpert die typische Eleganz und Frische deutscher Rieslingweine."
        },
        {
          name: "Glühwein (Winter)",
          description: "Heißer Glühwein mit Gewürzen",
          price: "€5.50",
          image: gluhweinImg,
          alcohol: "7-14%",
          fullDescription: "Unser hausgemachter Glühwein wird aus ausgewählten deutschen Rotweinen zubereitet und mit einer traditionellen Gewürzmischung aus Zimt, Nelken, Sternanis und Orangenschale verfeinert. Das jahrhundertealte Rezept stammt aus der deutschen Weihnachtstradition und wird bei uns von November bis März serviert. Der Glühwein wird schonend erhitzt, um die Aromen zu bewahren und ein warmes, wohltuendes Getränk zu schaffen."
        }
      ]
    },
    {
      category: "Alkoholfreie Getränke",
      items: [
        {
          name: "Apfelschorle",
          description: "Apfelsaft mit Mineralwasser",
          price: "€3.50",
          image: apfelschorleImg,
          alcohol: "0%",
          fullDescription: "Die Apfelschorle ist ein klassisches deutsches Erfrischungsgetränk, das aus naturtrübem Apfelsaft und kohlensäurehaltigem Mineralwasser hergestellt wird. Wir verwenden ausschließlich Direktsaft von deutschen Äpfeln aus kontrolliert biologischem Anbau. Das Mischungsverhältnis von 60% Apfelsaft zu 40% Mineralwasser sorgt für den perfekten Geschmack - fruchtig, erfrischend und nicht zu süß."
        },
        {
          name: "Fassbrause",
          description: "Traditionelle deutsche Limonade",
          price: "€3.80",
          image: fassbrauseImg,
          alcohol: "0%",
          fullDescription: "Fassbrause ist eine traditionelle deutsche Limonade, die ursprünglich als alkoholfreie Alternative zu Bier entwickelt wurde. Die erste Fassbrause wurde 1908 vom Chemiker Carl Rehm erfunden. Unser Getränk basiert auf natürlichen Fruchtextrakten und Malzauszug, was ihm einen charakteristisch malzig-fruchtigen Geschmack verleiht. Die leichte Süße wird durch eine erfrischende Säure ausbalanciert."
        },
        {
          name: "Kaffee",
          description: "Frisch gebrühter Kaffee",
          price: "€2.50",
          image: coffeeImg,
          alcohol: "0%",
          fullDescription: "Unser Kaffee wird aus einer sorgfältig ausgewählten Mischung hochwertiger Arabica-Bohnen zubereitet, die von nachhaltigen Plantagen in Mittel- und Südamerika stammen. Die Bohnen werden täglich frisch geröstet und in unserer italienischen Espressomaschine zubereitet. Jede Tasse wird individuell aufgebrüht, um das volle Aroma und die perfekte Crema zu gewährleisten."
        },
        {
          name: "Heisse Schokolade",
          description: "Heiße Schokolade mit Sahne",
          price: "€4.20",
          image: hotChocolateImg,
          alcohol: "0%",
          fullDescription: "Unsere hausgemachte heiße Schokolade wird aus echter belgischer Schokolade mit 70% Kakaoanteil zubereitet. Die Schokolade wird langsam in warmer Vollmilch aufgelöst und mit einem Hauch Vanille verfeinert. Serviert wird sie mit frisch geschlagener Sahne und optional mit Marshmallows oder Zimt. Ein wahres Verwöhnerlebnis für Schokoladenliebhaber in der kalten Jahreszeit."
        },
        {
          name: "Tee Auswahl",
          description: "Verschiedene hochwertige Tees",
          price: "€3.20",
          image: teaSelectionImg,
          alcohol: "0%",
          fullDescription: "Unsere sorgfältig kuratierte Teeauswahl umfasst klassischen schwarzen Tee, grünen Tee, Kamillentee, Pfefferminztee und Früchtetee. Jeder Tee wird aus hochwertigen, lose Blättern zubereitet und für die optimale Ziehzeit aufgebrüht. Die Tees stammen aus nachhaltigen Anbaugebieten und werden ohne künstliche Zusätze serviert. Auf Wunsch mit Honig, Zitrone oder Milch verfügbar."
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
          <Badge variant="outline" className="mb-4">Getränkekarte</Badge>
          <h1 className="text-5xl font-bold mb-6">Unsere Getränke</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Beste deutsche Getränke und Biere im Herzen Berlins
          </p>
        </div>

        {/* Drinks Menu */}
        <div className="space-y-12">
          {drinkMenu.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h2 className="text-3xl font-bold mb-8 text-center">{category.category}</h2>
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
                      <p className="text-muted-foreground">{item.description}</p>
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
              <h3 className="text-xl font-semibold mb-3">Besonderes Angebot</h3>
              <p className="text-muted-foreground">
                Jeden Donnerstag findet bei uns eine Craft-Bier-Verkostung statt. 
                Kommen Sie vorbei und entdecken Sie neue Geschmäcker!
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
                  <div className="aspect-[3/4] rounded-lg overflow-hidden">
                    <img 
                      src={selectedDrink.image} 
                      alt={selectedDrink.name}
                      className="w-full h-full object-contain"
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
                      Alkohol: {selectedDrink.alcohol}
                    </Badge>
                  </div>

                  {/* Short Description */}
                  <div>
                    <h4 className="font-semibold mb-2">Kurzbeschreibung</h4>
                    <p className="text-muted-foreground">{selectedDrink.description}</p>
                  </div>

                  {/* Full Description */}
                  <div>
                    <h4 className="font-semibold mb-2">Detaillierte Beschreibung</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {selectedDrink.fullDescription}
                    </p>
                  </div>

                  {/* Close Button */}
                  <div className="flex justify-center pt-4">
                    <Button onClick={closeModal} className="w-full md:w-auto">
                      Schließen
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