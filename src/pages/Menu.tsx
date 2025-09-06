import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Beer, Coffee, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMenu, type Drink } from "@/hooks/useMenu";

// Import all drink images for fallbacks
import berlinerWeisseImg from "@/assets/berliner-weisse-new.jpg";
import augustinerBeerImg from "@/assets/augustiner-beer-new.jpg";
import erdingerWeissbierImg from "@/assets/erdinger-weissbier-new.jpg";
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
  const { drinks, loading, error, getDrinksByCategory } = useMenu();
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Image mapping for fallbacks
  const getImageForDrink = (drinkName: string) => {
    const imageMap: Record<string, string> = {
      'Berliner Weisse': berlinerWeisseImg,
      'Augustiner Lagerbier Hell': augustinerBeerImg,
      'Erdinger Weissbier': erdingerWeissbierImg,
      'Köstritzer Schwarzbier': kostritzerSchwarzbieerImg,
      'Craft Beer Auswahl': craftBeerImg,
      'Schnapps Auswahl': germanSchnappsImg,
      'Jägermeister': jagermeisterImg,
      'Riesling': rieslingWineImg,
      'Glühwein (Winter)': gluhweinImg,
      'Apfelschorle': apfelschorleImg,
      'Fassbrause': fassbrauseImg,
      'Kaffee': coffeeImg,
      'Heisse Schokolade': hotChocolateImg,
      'Tee Auswahl': teaSelectionImg,
    };
    return imageMap[drinkName] || coffeeImg;
  };

  const getCategoryName = (category: string) => {
    const categoryMap: Record<string, { de: string; en: string }> = {
      'beer': { de: 'Bier', en: 'Beer' },
      'alcoholic': { de: 'Alkoholische Getränke', en: 'Alcoholic Beverages' },
      'non_alcoholic': { de: 'Alkoholfreie Getränke', en: 'Non-Alcoholic Beverages' }
    };
    return language === 'de' ? categoryMap[category]?.de : categoryMap[category]?.en;
  };

  const drinkCategories = ['beer', 'alcoholic', 'non_alcoholic'];

  const handleDrinkClick = (drink: Drink) => {
    setSelectedDrink(drink);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDrink(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading menu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading menu: {error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

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
          {drinkCategories.map((category) => {
            const categoryDrinks = getDrinksByCategory(category);
            if (categoryDrinks.length === 0) return null;
            
            return (
              <div key={category}>
                <h2 className="text-3xl font-bold mb-8 text-center">
                  {getCategoryName(category)}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {categoryDrinks.map((drink) => (
                    <Card 
                      key={drink.id} 
                      className="pub-hover-lift pub-card-shadow border-0 cursor-pointer"
                      onClick={() => handleDrinkClick(drink)}
                    >
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <div className="w-20 h-20 flex-shrink-0">
                            <img 
                              src={drink.image_url || getImageForDrink(drink.name)} 
                              alt={drink.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-3">
                              <h3 className="text-xl font-semibold">{drink.name}</h3>
                              <Badge variant="secondary" className="ml-2 bg-accent text-accent-foreground">
                                €{drink.price.toFixed(2)}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground">
                              {language === 'de' ? drink.description_de : drink.description_en}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
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
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted/10">
                    <img 
                      src={selectedDrink.image_url || getImageForDrink(selectedDrink.name)} 
                      alt={selectedDrink.name}
                      className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                      loading="eager"
                    />
                  </div>
                </div>

                {/* Product Info - Right Side */}
                <div className="space-y-6">
                  {/* Price and Alcohol Info */}
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary" className="text-lg px-4 py-2 bg-accent text-accent-foreground">
                      €{selectedDrink.price.toFixed(2)}
                    </Badge>
                    {selectedDrink.alcohol_content && (
                      <Badge variant="outline" className="text-sm">
                        {t('menu.alcohol')}: {selectedDrink.alcohol_content}
                      </Badge>
                    )}
                  </div>

                  {/* Short Description */}
                  <div>
                    <h4 className="font-semibold mb-2">{t('menu.shortDescription')}</h4>
                    <p className="text-muted-foreground">
                      {language === 'de' ? selectedDrink.description_de : selectedDrink.description_en}
                    </p>
                  </div>

                  {/* Full Description */}
                  {(selectedDrink.full_description_de || selectedDrink.full_description_en) && (
                    <div>
                      <h4 className="font-semibold mb-2">{t('menu.detailedDescription')}</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        {language === 'de' 
                          ? selectedDrink.full_description_de || selectedDrink.full_description_en
                          : selectedDrink.full_description_en || selectedDrink.full_description_de}
                      </p>
                    </div>
                  )}

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