import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Heart, Award, Clock, Rainbow, PartyPopper } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const About = () => {
  const { language, t } = useLanguage();
  
  const values = [
    {
      icon: <Heart className="h-8 w-8 text-accent" />,
      titleKey: "about.traditions",
      descriptionKey: "about.traditionsDesc"
    },
    {
      icon: <Users className="h-8 w-8 text-accent" />,
      titleKey: "about.hospitality",
      descriptionKey: "about.hospitalityDesc"
    },
    {
      icon: <Award className="h-8 w-8 text-accent" />,
      titleKey: "about.quality",
      descriptionKey: "about.qualityDesc"
    },
    {
      icon: <Clock className="h-8 w-8 text-accent" />,
      titleKey: "about.experience",
      descriptionKey: "about.experienceDesc"
    }
  ];

  const team = [
    {
      name: "Stefan Müller",
      positionKey: "about.owner",
      descriptionKey: "about.ownerDesc"
    },
    {
      name: "Anna Schmidt",
      positionKey: "about.manager",
      descriptionKey: "about.managerDesc"
    },
    {
      name: "Markus Wagner",
      positionKey: "about.bartender",
      descriptionKey: "about.bartenderDesc"
    }
  ];

  const inclusivity = [
    {
      icon: <PartyPopper className="h-8 w-8 text-accent" />,
      titleKey: "about.youngAndOld",
      descriptionKey: "about.youngAndOldDesc"
    },
    {
      icon: <Rainbow className="h-8 w-8 text-accent" />,
      titleKey: "about.lgbtqFriendly",
      descriptionKey: "about.lgbtqFriendlyDesc"
    },
    {
      icon: <Heart className="h-8 w-8 text-accent" />,
      titleKey: "about.diversity",
      descriptionKey: "about.diversityDesc"
    }
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">{t('about.badge')}</Badge>
          <h1 className="text-5xl font-bold mb-6">{t('about.title')}</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('about.subtitle')}
          </p>
        </div>

        {/* Story Section */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">{t('about.ourStory')}</h2>
              <div className="space-y-4 text-lg text-muted-foreground">
                <p>{t('about.story1')}</p>
                <p>{t('about.story2')}</p>
                <p>{t('about.story3')}</p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-accent/20 to-primary/20 rounded-2xl p-8 h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl font-bold text-accent mb-4">2001</div>
                  <p className="text-xl font-semibold">{t('about.foundingYear')}</p>
                  <p className="text-muted-foreground mt-2">{t('about.yearsOfTradition')}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Inclusivity Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('about.forAll')}</h2>
            <p className="text-xl text-muted-foreground">
              {t('about.forAllSubtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {inclusivity.map((item, index) => (
              <Card key={index} className="text-center pub-card-shadow border-0">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{t(item.titleKey)}</h3>
                  <p className="text-muted-foreground">{t(item.descriptionKey)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Card className="max-w-4xl mx-auto pub-gradient-warm border-0">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">{t('about.berlinsOpenest')}</h3>
                <p className="text-lg text-muted-foreground mb-6">
                  {t('about.berlinsopenestDesc')}
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Badge variant="outline" className="text-base px-4 py-2">{t('about.openForAll')}</Badge>
                  <Badge variant="outline" className="text-base px-4 py-2">{t('about.lgbtqFriendly')}</Badge>
                  <Badge variant="outline" className="text-base px-4 py-2">{t('about.safeSpace')}</Badge>
                  <Badge variant="outline" className="text-base px-4 py-2">{t('about.diversity')}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('about.ourValues')}</h2>
            <p className="text-xl text-muted-foreground">
              {t('about.ourValuesSubtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center pub-card-shadow border-0">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{t(value.titleKey)}</h3>
                  <p className="text-muted-foreground">{t(value.descriptionKey)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('about.ourTeam')}</h2>
            <p className="text-xl text-muted-foreground">
              {t('about.ourTeamSubtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center pub-card-shadow border-0">
                <CardContent className="p-8">
                  <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-10 w-10 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <Badge variant="secondary" className="mb-4">{t(member.positionKey)}</Badge>
                  <p className="text-muted-foreground">{t(member.descriptionKey)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Mission Section */}
        <section className="pub-gradient-warm rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-6">{t('about.ourMission')}</h2>
          <div className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            {t('about.ourMissionDesc')}
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="outline" className="text-lg px-4 py-2">{t('about.authenticity')}</Badge>
            <Badge variant="outline" className="text-lg px-4 py-2">{t('about.quality')}</Badge>
            <Badge variant="outline" className="text-lg px-4 py-2">{t('about.hospitality')}</Badge>
            <Badge variant="outline" className="text-lg px-4 py-2">{t('about.traditions')}</Badge>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;