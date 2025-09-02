import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Beer, Coffee } from "lucide-react";

const Menu = () => {
  const drinkMenu = [
    {
      category: "Bier",
      items: [
        {
          name: "Berliner Weisse",
          description: "Traditionelles Berliner Weizenbier mit Sirup",
          price: "€4.50"
        },
        {
          name: "Augustiner Lagerbier Hell",
          description: "Klassisches Münchner Lager",
          price: "€5.00"
        },
        {
          name: "Erdinger Weissbier",
          description: "Bayerisches Weizenbier",
          price: "€5.50"
        },
        {
          name: "Köstritzer Schwarzbier",
          description: "Dunkles Bier aus Thüringen",
          price: "€5.20"
        },
        {
          name: "Craft Beer Auswahl",
          description: "Wechselnde Craft-Biere von lokalen Brauereien",
          price: "€6.50"
        }
      ]
    },
    {
      category: "Alkoholische Getränke",
      items: [
        {
          name: "Schnapps Auswahl",
          description: "Auswahl traditioneller deutscher Schnäpse",
          price: "€4.00"
        },
        {
          name: "Jägermeister",
          description: "Klassischer Kräuterlikör",
          price: "€4.50"
        },
        {
          name: "Riesling",
          description: "Deutscher Weißwein aus dem Rheintal",
          price: "€6.00"
        },
        {
          name: "Glühwein (Winter)",
          description: "Heißer Glühwein mit Gewürzen",
          price: "€5.50"
        }
      ]
    },
    {
      category: "Alkoholfreie Getränke",
      items: [
        {
          name: "Apfelschorle",
          description: "Apfelsaft mit Mineralwasser",
          price: "€3.50"
        },
        {
          name: "Fassbrause",
          description: "Traditionelle deutsche Limonade",
          price: "€3.80"
        },
        {
          name: "Kaffee",
          description: "Frisch gebrühter Kaffee",
          price: "€2.50"
        },
        {
          name: "Heisse Schokolade",
          description: "Heiße Schokolade mit Sahne",
          price: "€4.20"
        }
      ]
    }
  ];

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
                  <Card key={itemIndex} className="pub-hover-lift pub-card-shadow border-0">
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
      </div>
    </div>
  );
};

export default Menu;