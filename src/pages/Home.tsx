import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NavLink } from "react-router-dom";
import { 
  Beer, 
  Users, 
  MapPin, 
  Star,
  Clock,
  Calendar,
  Heart
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import pubHero from "@/assets/pub-hero.jpg";

const Home = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: <Beer className="h-8 w-8 text-accent" />,
      title: t('home.feature.beer'),
      description: t('home.feature.beerDesc')
    },
    {
      icon: <Users className="h-8 w-8 text-accent" />,
      title: t('home.feature.atmosphere'),
      description: t('home.feature.atmosphereDesc')
    },
    {
      icon: <Calendar className="h-8 w-8 text-accent" />,
      title: t('home.feature.events'),
      description: t('home.feature.eventsDesc')
    },
    {
      icon: <Clock className="h-8 w-8 text-accent" />,
      title: t('home.feature.hours'),
      description: t('home.feature.hoursDesc')
    }
  ];

  const testimonials = [
    {
      name: "Michael K.",
      text: t('review.michael'),
      rating: 5
    },
    {
      name: "Anna S.",
      text: t('review.anna'),
      rating: 5
    },
    {
      name: "Thomas M.",
      text: t('review.thomas'),
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${pubHero})` }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <Badge variant="secondary" className="mb-4 text-sm bg-accent/20 text-accent border-accent hover:bg-accent/20 hover:text-accent">
            {t('home.badge')}
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 pub-text-shadow">
            {t('home.title')}
          </h1>
          <p className="text-xl md:text-2xl mb-8 pub-text-shadow max-w-2xl mx-auto">
            {t('home.subtitle')}
          </p>
          <div className="flex justify-center">
            <Button size="lg" asChild className="pub-gradient-accent text-primary font-semibold">
              <NavLink to="/menu">{t('home.menuButton')}</NavLink>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{t('home.whyChoose')}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('home.whyChooseSubtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center pub-card-shadow border-0">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4">{t('home.aboutBadge')}</Badge>
              <h2 className="text-4xl font-bold mb-6">{t('home.aboutTitle')}</h2>
              <p className="text-lg text-muted-foreground mb-6">
                {t('home.aboutText1')}
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                {t('home.aboutText2')}
              </p>
              <div className="flex items-center space-x-2 mb-6">
                <Heart className="h-5 w-5 text-accent" />
                <p className="text-lg text-muted-foreground">
                  <strong>{t('home.welcomeText')}</strong>
                </p>
              </div>
              <Button size="lg" asChild>
                <NavLink to="/about">{t('home.learnMore')}</NavLink>
              </Button>
            </div>
            <div className="relative">
              <img 
                src={pubHero} 
                alt="Atmosphäre im Berliner Pub" 
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-accent text-accent-foreground p-6 rounded-xl shadow-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="h-5 w-5" />
                  <span className="font-semibold">{t('home.openToday')}</span>
                </div>
                <p className="text-sm">{t('home.hours')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 pub-gradient-warm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{t('home.testimonialsTitle')}</h2>
            <p className="text-xl text-muted-foreground">
              {t('home.testimonialsSubtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="pub-card-shadow border-0">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">
                    "{testimonial.text}"
                  </p>
                  <p className="font-semibold">— {testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" variant="outline" asChild>
              <NavLink to="/reviews">{t('home.allReviews')}</NavLink>
            </Button>
          </div>
        </div>
      </section>

      {/* Location CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <MapPin className="h-12 w-12 text-accent mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-4">{t('home.locationTitle')}</h2>
          <p className="text-xl mb-8 opacity-90">
            {t('home.address')}
          </p>
          <Button size="lg" variant="secondary" asChild>
            <NavLink to="/contact">{t('home.directions')}</NavLink>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;