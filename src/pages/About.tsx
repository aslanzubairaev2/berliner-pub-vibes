import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Heart, Award, Clock } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: <Heart className="h-8 w-8 text-accent" />,
      title: "Традиции",
      description: "Мы храним и передаем лучшие традиции немецкой пивной культуры"
    },
    {
      icon: <Users className="h-8 w-8 text-accent" />,
      title: "Гостеприимство",
      description: "Каждый гость для нас особенный, и мы создаем атмосферу дома"
    },
    {
      icon: <Award className="h-8 w-8 text-accent" />,
      title: "Качество",
      description: "Только лучшие продукты и напитки от проверенных поставщиков"
    },
    {
      icon: <Clock className="h-8 w-8 text-accent" />,
      title: "Опыт",
      description: "Более 20 лет опыта в создании незабываемых вечеров"
    }
  ];

  const team = [
    {
      name: "Штефан Мюллер",
      position: "Владелец и шеф-повар",
      description: "Родом из Баварии, Штефан привез в Берлин лучшие рецепты традиционной немецкой кухни"
    },
    {
      name: "Анна Шмидт",
      position: "Менеджер и сомелье",
      description: "Эксперт по немецким винам и пиву, создает идеальные сочетания для каждого блюда"
    },
    {
      name: "Маркус Вагнер",
      position: "Бармен",
      description: "Мастер коктейлей и знаток пивных традиций, создает неповторимую атмосферу бара"
    }
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">О нас</Badge>
          <h1 className="text-5xl font-bold mb-6">История Berliner Pub</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Уже более двух десятилетий мы создаем особую атмосферу настоящего немецкого паба 
            в самом сердце Берлина
          </p>
        </div>

        {/* Story Section */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Наша история</h2>
              <div className="space-y-4 text-lg text-muted-foreground">
                <p>
                  Berliner Pub открыл свои двери в 2001 году на оживленной Ansbacher Straße. 
                  Наша идея была проста: создать место, где традиционная немецкая культура 
                  встречается с современным берлинским духом.
                </p>
                <p>
                  За годы работы мы стали не просто пабом, а настоящим центром общения для 
                  местных жителей и туристов. Здесь рождаются дружбы, отмечаются важные 
                  события и создаются незабываемые воспоминания.
                </p>
                <p>
                  Мы гордимся тем, что сохраняем аутентичность немецкой пивной культуры, 
                  предлагая при этом современный уровень сервиса и комфорта.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-accent/20 to-primary/20 rounded-2xl p-8 h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl font-bold text-accent mb-4">2001</div>
                  <p className="text-xl font-semibold">Год основания</p>
                  <p className="text-muted-foreground mt-2">Более 20 лет традиций</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Наши ценности</h2>
            <p className="text-xl text-muted-foreground">
              Принципы, которые определяют нашу работу каждый день
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center pub-card-shadow pub-hover-lift border-0">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Наша команда</h2>
            <p className="text-xl text-muted-foreground">
              Люди, которые делают Berliner Pub особенным местом
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center pub-card-shadow pub-hover-lift border-0">
                <CardContent className="p-8">
                  <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-10 w-10 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <Badge variant="secondary" className="mb-4">{member.position}</Badge>
                  <p className="text-muted-foreground">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Mission Section */}
        <section className="pub-gradient-warm rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-6">Наша миссия</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Мы стремимся создать место, где каждый посетитель почувствует себя частью большой семьи. 
            Berliner Pub — это не просто ресторан, это место встреч, традиций и новых открытий.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="outline" className="text-lg px-4 py-2">Аутентичность</Badge>
            <Badge variant="outline" className="text-lg px-4 py-2">Качество</Badge>
            <Badge variant="outline" className="text-lg px-4 py-2">Гостеприимство</Badge>
            <Badge variant="outline" className="text-lg px-4 py-2">Традиции</Badge>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;