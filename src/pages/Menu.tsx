import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Beer, Coffee, Utensils } from "lucide-react";

const Menu = () => {
  const foodMenu = [
    {
      category: "Основные блюда",
      items: [
        {
          name: "Wiener Schnitzel",
          description: "Классический венский шницель из телятины с картофельным салатом",
          price: "€18.50"
        },
        {
          name: "Sauerbraten",
          description: "Тушеная говядина в кисло-сладком соусе с красной капустой и кнёдлями",
          price: "€22.00"
        },
        {
          name: "Bratwurst mit Sauerkraut",
          description: "Традиционные немецкие колбаски с квашеной капустой и горчицей",
          price: "€14.50"
        },
        {
          name: "Berliner Currywurst",
          description: "Знаменитая берлинская колбаска с карри-соусом и картофелем фри",
          price: "€12.00"
        },
        {
          name: "Schweinshaxe",
          description: "Запеченная свиная рулька с тушеной капустой и картофельными кнёдлями",
          price: "€24.00"
        }
      ]
    },
    {
      category: "Закуски",
      items: [
        {
          name: "Brezel mit Obatzda",
          description: "Баварский крендель с традиционным сырным соусом",
          price: "€8.50"
        },
        {
          name: "Leberwurst Stulle",
          description: "Хлеб с печеночной колбасой и маринованными огурцами",
          price: "€6.50"
        },
        {
          name: "Kartoffelsalat",
          description: "Традиционный немецкий картофельный салат",
          price: "€5.50"
        },
        {
          name: "Flönz mit Himmel un Ääd",
          description: "Кровяная колбаса с картофельным пюре и яблочным соусом",
          price: "€11.00"
        }
      ]
    },
    {
      category: "Десерты",
      items: [
        {
          name: "Apfelstrudel",
          description: "Яблочный штрудель с ванильным соусом",
          price: "€7.50"
        },
        {
          name: "Schwarzwälder Kirschtorte",
          description: "Торт «Чёрный лес» с вишней и шнапсом",
          price: "€8.50"
        },
        {
          name: "Kaiserschmarrn",
          description: "Рваный блинчик с изюмом и сливовым повидлом",
          price: "€9.00"
        }
      ]
    }
  ];

  const drinkMenu = [
    {
      category: "Пиво",
      items: [
        {
          name: "Berliner Weisse",
          description: "Традиционное берлинское пшеничное пиво с сиропом",
          price: "€4.50"
        },
        {
          name: "Augustiner Lagerbier Hell",
          description: "Классический мюнхенский лагер",
          price: "€5.00"
        },
        {
          name: "Erdinger Weissbier",
          description: "Баварское пшеничное пиво",
          price: "€5.50"
        },
        {
          name: "Köstritzer Schwarzbier",
          description: "Темное пиво из Тюрингии",
          price: "€5.20"
        },
        {
          name: "Craft Beer Selection",
          description: "Ротация крафтового пива от местных пивоварен",
          price: "€6.50"
        }
      ]
    },
    {
      category: "Алкогольные напитки",
      items: [
        {
          name: "Schnapps Selection",
          description: "Выбор традиционных немецких шнапсов",
          price: "€4.00"
        },
        {
          name: "Jägermeister",
          description: "Классический травяной ликер",
          price: "€4.50"
        },
        {
          name: "Riesling",
          description: "Немецкое белое вино из долины Рейна",
          price: "€6.00"
        },
        {
          name: "Glühwein (зимой)",
          description: "Горячее глинтвейн с пряностями",
          price: "€5.50"
        }
      ]
    },
    {
      category: "Безалкогольные напитки",
      items: [
        {
          name: "Apfelschorle",
          description: "Яблочный сок с газированной водой",
          price: "€3.50"
        },
        {
          name: "Fassbrause",
          description: "Традиционный немецкий лимонад",
          price: "€3.80"
        },
        {
          name: "Kaffee",
          description: "Свежесваренный кофе",
          price: "€2.50"
        },
        {
          name: "Heisse Schokolade",
          description: "Горячий шоколад с взбитыми сливками",
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
          <Badge variant="outline" className="mb-4">Меню</Badge>
          <h1 className="text-5xl font-bold mb-6">Наше меню</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Традиционная немецкая кухня и лучшие напитки в сердце Берлина
          </p>
        </div>

        {/* Menu Tabs */}
        <Tabs defaultValue="food" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-12">
            <TabsTrigger value="food" className="flex items-center space-x-2">
              <Utensils className="h-4 w-4" />
              <span>Еда</span>
            </TabsTrigger>
            <TabsTrigger value="drinks" className="flex items-center space-x-2">
              <Beer className="h-4 w-4" />
              <span>Напитки</span>
            </TabsTrigger>
          </TabsList>

          {/* Food Menu */}
          <TabsContent value="food" className="space-y-12">
            {foodMenu.map((category, categoryIndex) => (
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
          </TabsContent>

          {/* Drinks Menu */}
          <TabsContent value="drinks" className="space-y-12">
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
          </TabsContent>
        </Tabs>

        {/* Special Note */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto bg-muted/30 border-0">
            <CardContent className="p-8">
              <Coffee className="h-8 w-8 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Особое предложение</h3>
              <p className="text-muted-foreground">
                Каждый четверг у нас проходит дегустация крафтового пива. 
                Приходите и откройте для себя новые вкусы!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Menu;