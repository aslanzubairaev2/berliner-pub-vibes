import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Heart, Award, Clock, Rainbow, PartyPopper } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: <Heart className="h-8 w-8 text-accent" />,
      title: "Traditionen",
      description: "Wir bewahren und übertragen die besten Traditionen deutscher Kneipenkultur"
    },
    {
      icon: <Users className="h-8 w-8 text-accent" />,
      title: "Gastfreundschaft",
      description: "Jeder Gast ist für uns besonders, wir schaffen eine Atmosphäre wie zu Hause"
    },
    {
      icon: <Award className="h-8 w-8 text-accent" />,
      title: "Qualität",
      description: "Nur die besten Produkte und Getränke von geprüften Lieferanten"
    },
    {
      icon: <Clock className="h-8 w-8 text-accent" />,
      title: "Erfahrung",
      description: "Über 20 Jahre Erfahrung in der Gestaltung unvergesslicher Abende"
    }
  ];

  const team = [
    {
      name: "Stefan Müller",
      position: "Eigentümer und Geschäftsführer",
      description: "Aus Bayern stammend, brachte Stefan die besten Traditionen deutscher Kneipenkultur nach Berlin"
    },
    {
      name: "Anna Schmidt",
      position: "Managerin und Sommelière",
      description: "Expertin für deutsche Weine und Biere, kreiert perfekte Getränkekombinationen"
    },
    {
      name: "Markus Wagner",
      position: "Barkeeper",
      description: "Cocktail-Meister und Kenner der Biertraditionen, schafft unvergleichliche Baratmosphäre"
    }
  ];

  const inclusivity = [
    {
      icon: <PartyPopper className="h-8 w-8 text-accent" />,
      title: "Für Jung und Alt",
      description: "Von Studenten bis Senioren - alle Altersgruppen sind bei uns herzlich willkommen"
    },
    {
      icon: <Rainbow className="h-8 w-8 text-accent" />,
      title: "LGBTQ+ Friendly",
      description: "Ein sicherer und offener Raum für die LGBTQ+ Gemeinschaft in Berlin"
    },
    {
      icon: <Heart className="h-8 w-8 text-accent" />,
      title: "Vielfalt leben",
      description: "Wir feiern Diversität und schaffen einen Ort, wo sich alle wohlfühlen"
    }
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">Über uns</Badge>
          <h1 className="text-5xl font-bold mb-6">Geschichte des Berliner Pub</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Seit über zwei Jahrzehnten schaffen wir die besondere Atmosphäre einer echten deutschen Kneipe 
            im Herzen Berlins
          </p>
        </div>

        {/* Story Section */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Unsere Geschichte</h2>
              <div className="space-y-4 text-lg text-muted-foreground">
                <p>
                  Das Berliner Pub öffnete seine Türen im Jahr 2001 an der lebhaften Ansbacher Straße. 
                  Unsere Idee war einfach: einen Ort zu schaffen, wo traditionelle deutsche Kultur 
                  auf den modernen Berliner Geist trifft.
                </p>
                <p>
                  Über die Jahre sind wir nicht nur eine Kneipe geworden, sondern ein echter Treffpunkt für 
                  Einheimische und Touristen. Hier entstehen Freundschaften, werden wichtige 
                  Ereignisse gefeiert und unvergessliche Erinnerungen geschaffen.
                </p>
                <p>
                  Wir sind stolz darauf, die Authentizität deutscher Kneipenkultur zu bewahren und 
                  gleichzeitig modernen Service und Komfort zu bieten.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-accent/20 to-primary/20 rounded-2xl p-8 h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl font-bold text-accent mb-4">2001</div>
                  <p className="text-xl font-semibold">Gründungsjahr</p>
                  <p className="text-muted-foreground mt-2">Über 20 Jahre Tradition</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Inclusivity Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Für alle da</h2>
            <p className="text-xl text-muted-foreground">
              Ein Ort der Offenheit und Vielfalt im Herzen Berlins
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {inclusivity.map((item, index) => (
              <Card key={index} className="text-center pub-card-shadow pub-hover-lift border-0">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Card className="max-w-4xl mx-auto pub-gradient-warm border-0">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">Berlins offenste Kneipe</h3>
                <p className="text-lg text-muted-foreground mb-6">
                  Im Berliner Pub sind alle willkommen - egal ob Jung oder Alt, egal welche sexuelle Orientierung 
                  oder Identität. Wir feiern Vielfalt und schaffen einen sicheren Raum, in dem sich jeder 
                  wohlfühlen und authentisch sein kann. Berlin steht für Offenheit und Toleranz - 
                  und das leben wir jeden Tag.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Badge variant="outline" className="text-base px-4 py-2">Offen für alle</Badge>
                  <Badge variant="outline" className="text-base px-4 py-2">LGBTQ+ Friendly</Badge>
                  <Badge variant="outline" className="text-base px-4 py-2">Safe Space</Badge>
                  <Badge variant="outline" className="text-base px-4 py-2">Vielfalt</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Unsere Werte</h2>
            <p className="text-xl text-muted-foreground">
              Prinzipien, die unsere Arbeit jeden Tag bestimmen
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
            <h2 className="text-3xl font-bold mb-4">Unser Team</h2>
            <p className="text-xl text-muted-foreground">
              Menschen, die das Berliner Pub zu einem besonderen Ort machen
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
          <h2 className="text-3xl font-bold mb-6">Unsere Mission</h2>
          <div className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Wir streben danach, einen Ort zu schaffen, wo sich jeder Besucher als Teil einer großen Familie fühlt. 
            Das Berliner Pub ist nicht nur eine Kneipe, es ist ein Ort der Begegnungen, Traditionen und neuen Entdeckungen.
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="outline" className="text-lg px-4 py-2">Authentizität</Badge>
            <Badge variant="outline" className="text-lg px-4 py-2">Qualität</Badge>
            <Badge variant="outline" className="text-lg px-4 py-2">Gastfreundschaft</Badge>
            <Badge variant="outline" className="text-lg px-4 py-2">Traditionen</Badge>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;