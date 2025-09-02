import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, User, Clock } from "lucide-react";

const News = () => {
  const newsArticles = [
    {
      id: 1,
      title: "Neues Craft-Bier von der Berliner Brauerei Zur Letzten Instanz",
      excerpt: "Wir freuen uns, ein exklusives Craft-Bier zu präsentieren, das speziell für das Berliner Pub in Zusammenarbeit mit der historischen Brauerei gebraut wurde...",
      date: "2024-03-15",
      author: "Stefan Müller",
      category: "Bier",
      readTime: "3 Min"
    },
    {
      id: 2,
      title: "Live-Musik jeden Freitag",
      excerpt: "Ab sofort treten jeden Freitag lokale Musiker im Berliner Pub auf. Folk, Blues und traditionelle deutsche Musik...",
      date: "2024-03-05",
      author: "Markus Wagner",
      category: "Musik",
      readTime: "4 Min"
    },
    {
      id: 3,
      title: "Erweiterte Weinkarte",
      excerpt: "Wir haben unsere Weinkarte mit den besten deutschen Weinen aus dem Rhein- und Moseltal erweitert. Jeder Wein wurde sorgfältig ausgewählt...",
      date: "2024-02-28",
      author: "Anna Schmidt",
      category: "Wein",
      readTime: "3 Min"
    },
    {
      id: 4,
      title: "23-jähriges Jubiläum des Berliner Pub",
      excerpt: "Dieses Jahr feiert unser Pub 23 Jahre! Schließen Sie sich uns am 15. April für eine besondere Feier mit Überraschungen an...",
      date: "2024-02-20",
      author: "Stefan Müller",
      category: "Veranstaltungen",
      readTime: "2 Min"
    },
    {
      id: 5,
      title: "Erweiterte Sammlung deutscher Schnäpse",
      excerpt: "Wir haben unserer Sammlung seltene deutsche Schnäpse von privaten Destillerien hinzugefügt. Probieren Sie einzigartige Geschmäcker...",
      date: "2024-02-15",
      author: "Anna Schmidt",
      category: "Getränke",
      readTime: "3 Min"
    }
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      "Bier": "bg-accent/20 text-accent-foreground",
      "Veranstaltungen": "bg-pub-red/20 text-red-800",
      "Musik": "bg-blue-100 text-blue-800",
      "Wein": "bg-purple-100 text-purple-800",
      "Getränke": "bg-green-100 text-green-800"
    };
    return colors[category as keyof typeof colors] || "bg-muted text-muted-foreground";
  };

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">News</Badge>
          <h1 className="text-5xl font-bold mb-6">Berliner Pub Blog</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Neueste Nachrichten, Veranstaltungen und Geschichten aus dem Leben unserer Kneipe
          </p>
        </div>

        {/* Featured Article */}
        <div className="mb-16">
          <Card className="pub-card-shadow border-0 overflow-hidden">
            <div className="pub-gradient-warm p-8">
              <Badge className={getCategoryColor(newsArticles[0].category) + " mb-4"}>
                {newsArticles[0].category}
              </Badge>
              <h2 className="text-3xl font-bold mb-4">{newsArticles[0].title}</h2>
              <p className="text-lg text-muted-foreground mb-6">
                {newsArticles[0].excerpt}
              </p>
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <CalendarDays className="h-4 w-4" />
                  <span>{new Date(newsArticles[0].date).toLocaleDateString('de-DE', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>{newsArticles[0].author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>{newsArticles[0].readTime}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsArticles.slice(1).map((article) => (
            <Card key={article.id} className="pub-card-shadow pub-hover-lift border-0 cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge className={getCategoryColor(article.category)}>
                    {article.category}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {article.readTime}
                  </span>
                </div>
                <CardTitle className="text-xl leading-tight">
                  {article.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{article.author}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CalendarDays className="h-4 w-4" />
                    <span>{new Date(article.date).toLocaleDateString('de-DE', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-20">
          <Card className="max-w-2xl mx-auto text-center pub-gradient-warm border-0">
            <CardContent className="p-12">
              <h3 className="text-2xl font-bold mb-4">Newsletter abonnieren</h3>
              <p className="text-muted-foreground mb-6">
                Erhalten Sie Benachrichtigungen über neue Veranstaltungen, Sonderangebote 
                und interessante Geschichten aus dem Leben unserer Kneipe
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Ihre E-Mail" 
                  className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground"
                />
                <button className="px-6 py-2 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors">
                  Abonnieren
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default News;