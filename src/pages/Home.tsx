import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NavLink } from "react-router-dom";
import { 
  Beer, 
  Utensils, 
  Users, 
  MapPin, 
  Star,
  Clock,
  ChefHat,
  Calendar
} from "lucide-react";
import pubHero from "@/assets/pub-hero.jpg";
import pubFood from "@/assets/pub-food.jpg";

const Home = () => {
  const features = [
    {
      icon: <Beer className="h-8 w-8 text-accent" />,
      title: "Лучшее пиво",
      description: "Широкий выбор немецкого и крафтового пива"
    },
    {
      icon: <ChefHat className="h-8 w-8 text-accent" />,
      title: "Аутентичная кухня",
      description: "Традиционные немецкие блюда от шеф-повара"
    },
    {
      icon: <Users className="h-8 w-8 text-accent" />,
      title: "Уютная атмосфера",
      description: "Идеальное место для встреч с друзьями"
    },
    {
      icon: <Calendar className="h-8 w-8 text-accent" />,
      title: "События",
      description: "Регулярные мероприятия и живая музыка"
    }
  ];

  const testimonials = [
    {
      name: "Михаил К.",
      text: "Лучший паб в Берлине! Отличное пиво и невероятная атмосфера.",
      rating: 5
    },
    {
      name: "Anna S.",
      text: "Обожаю это место! Шницель просто восхитительный.",
      rating: 5
    },
    {
      name: "Thomas M.",
      text: "Отличное место для вечера с друзьями. Обязательно вернусь!",
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
          <Badge variant="secondary" className="mb-4 text-sm bg-accent/20 text-accent border-accent">
            Традиционный немецкий паб
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 pub-text-shadow">
            Berliner Pub
          </h1>
          <p className="text-xl md:text-2xl mb-8 pub-text-shadow max-w-2xl mx-auto">
            Добро пожаловать в уютный уголок Берлина, где традиции встречаются с современностью
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="pub-gradient-accent text-primary font-semibold">
              <NavLink to="/menu">Посмотреть меню</NavLink>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white hover:text-primary">
              <NavLink to="/contact">Забронировать столик</NavLink>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Почему выбирают нас</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Более 20 лет мы создаем незабываемые моменты для наших гостей
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center pub-card-shadow pub-hover-lift border-0">
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
              <Badge variant="outline" className="mb-4">О нас</Badge>
              <h2 className="text-4xl font-bold mb-6">История нашего паба</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Berliner Pub расположен в самом сердце Берлина на оживленной Ansbacher Straße. 
                Мы гордимся тем, что создаем аутентичную атмосферу немецкого паба, где каждый 
                гость чувствует себя как дома.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                Наша кухня предлагает лучшие традиционные немецкие блюда, приготовленные 
                по старинным рецептам, а наш бар может похвастаться широким выбором 
                местного и крафтового пива.
              </p>
              <Button size="lg" asChild>
                <NavLink to="/about">Узнать больше</NavLink>
              </Button>
            </div>
            <div className="relative">
              <img 
                src={pubFood} 
                alt="Немецкая кухня в Berliner Pub" 
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-accent text-accent-foreground p-6 rounded-xl shadow-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="h-5 w-5" />
                  <span className="font-semibold">Открыто сегодня</span>
                </div>
                <p className="text-sm">16:00 - 01:00</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 pub-gradient-warm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Отзывы наших гостей</h2>
            <p className="text-xl text-muted-foreground">
              Что говорят о нас наши посетители
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
              <NavLink to="/reviews">Все отзывы</NavLink>
            </Button>
          </div>
        </div>
      </section>

      {/* Location CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <MapPin className="h-12 w-12 text-accent mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-4">Найдите нас в Берлине</h2>
          <p className="text-xl mb-8 opacity-90">
            Ansbacher Straße 29, 10789 Berlin
          </p>
          <Button size="lg" variant="secondary" asChild>
            <NavLink to="/contact">Как добраться</NavLink>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;