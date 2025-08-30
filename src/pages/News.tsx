import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, User, Clock } from "lucide-react";

const News = () => {
  const newsArticles = [
    {
      id: 1,
      title: "Новое крафтовое пиво от берлинской пивоварни Zur Letzten Instanz",
      excerpt: "Мы рады представить эксклюзивное крафтовое пиво, сваренное специально для Berliner Pub совместно с исторической пивоварней...",
      date: "2024-03-15",
      author: "Штефан Мюллер",
      category: "Пиво",
      readTime: "3 мин"
    },
    {
      id: 2,
      title: "Живая музыка каждую пятницу",
      excerpt: "Теперь каждую пятницу в Berliner Pub выступают местные музыканты. Фолк, блюз и традиционная немецкая музыка...",
      date: "2024-03-05",
      author: "Маркус Вагнер",
      category: "Музыка",
      readTime: "4 мин"
    },
    {
      id: 3,
      title: "Обновленное винное меню",
      excerpt: "Мы расширили нашу винную карту лучшими немецкими винами из долины Рейна и Мозеля. Каждое вино тщательно отобрано...",
      date: "2024-02-28",
      author: "Анна Шмидт",
      category: "Вино",
      readTime: "3 мин"
    },
    {
      id: 4,
      title: "Празднование 23-летия Berliner Pub",
      excerpt: "В этом году наш паб отмечает 23 года! Присоединяйтесь к нам 15 апреля для особого празднования с сюрпризами...",
      date: "2024-02-20",
      author: "Штефан Мюллер",
      category: "События",
      readTime: "2 мин"
    },
    {
      id: 5,
      title: "Расширение коллекции немецких шнапсов",
      excerpt: "Добавили в нашу коллекцию редкие сорта немецких шнапсов от частных винокурен. Попробуйте уникальные вкусы...",
      date: "2024-02-15",
      author: "Анна Шмидт",
      category: "Напитки",
      readTime: "3 мин"
    }
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      "Пиво": "bg-accent/20 text-accent-foreground",
      "События": "bg-pub-red/20 text-red-800",
      "Музыка": "bg-blue-100 text-blue-800",
      "Вино": "bg-purple-100 text-purple-800",
      "Напитки": "bg-green-100 text-green-800"
    };
    return colors[category as keyof typeof colors] || "bg-muted text-muted-foreground";
  };

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">Новости</Badge>
          <h1 className="text-5xl font-bold mb-6">Блог Berliner Pub</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Последие новости, события и истории из жизни нашего паба
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
                  <span>{new Date(newsArticles[0].date).toLocaleDateString('ru-RU', { 
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
                    <span>{new Date(article.date).toLocaleDateString('ru-RU', { 
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
              <h3 className="text-2xl font-bold mb-4">Подпишитесь на новости</h3>
              <p className="text-muted-foreground mb-6">
                Получайте уведомления о новых событиях, специальных предложениях 
                и интересных историях из жизни нашего паба
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Ваш email" 
                  className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground"
                />
                <button className="px-6 py-2 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors">
                  Подписаться
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