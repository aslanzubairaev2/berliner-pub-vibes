import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNews } from "@/hooks/useNews";

const News = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { articles, loading, error } = useNews();

  const handleArticleClick = (slug: string) => {
    navigate(`/news/${slug}`);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'events': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'menu': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'general': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    };
    return colors[category] || colors['general'];
  };

  const getCategoryName = (category: string, lang: string) => {
    const names: Record<string, { de: string; en: string }> = {
      'events': { de: 'Veranstaltungen', en: 'Events' },
      'menu': { de: 'Menü', en: 'Menu' },
      'general': { de: 'Allgemein', en: 'General' }
    };
    return lang === 'de' ? names[category]?.de : names[category]?.en;
  };

  if (loading) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading news...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading news: {error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">No published articles found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">News</Badge>
          <h1 className="text-5xl font-bold mb-6">{t('news.title')}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('news.subtitle')}
          </p>
        </div>

        {/* Featured Article */}
        {articles.length > 0 && (
          <div className="mb-16">
            <Card 
              className="pub-card-shadow border-0 overflow-hidden cursor-pointer pub-hover-lift"
              onClick={() => handleArticleClick(articles[0].slug)}
            >
              <div className="pub-gradient-warm p-8">
                <Badge className={getCategoryColor(articles[0].category) + " mb-4"}>
                  {getCategoryName(articles[0].category, language)}
                </Badge>
                <h2 className="text-3xl font-bold mb-4">
                  {language === 'de' ? articles[0].title_de : articles[0].title_en}
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  {language === 'de' ? articles[0].excerpt_de : articles[0].excerpt_en}
                </p>
                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <CalendarDays className="h-4 w-4" />
                    <span>{new Date(articles[0].published_at || articles[0].created_at).toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{articles[0].read_time} {t('news.minRead')}</span>
                  </div>
                </div>
                <div className="mt-6">
                  <Button variant="secondary">
                    {t('news.readMore')}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.slice(1).map((article) => (
            <Card 
              key={article.id} 
              className="pub-card-shadow pub-hover-lift border-0 cursor-pointer"
              onClick={() => handleArticleClick(article.slug)}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge className={getCategoryColor(article.category)}>
                    {getCategoryName(article.category, language)}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {article.read_time} {t('news.minRead')}
                  </span>
                </div>
                <CardTitle className="text-xl leading-tight">
                  {language === 'de' ? article.title_de : article.title_en}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {language === 'de' ? article.excerpt_de : article.excerpt_en}
                </p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <CalendarDays className="h-4 w-4" />
                    <span>{new Date(article.published_at || article.created_at).toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    {t('news.readMore')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-20">
          <Card className="max-w-2xl mx-auto text-center pub-gradient-warm border-0">
            <CardContent className="p-12">
              <h3 className="text-2xl font-bold mb-4">{t('news.newsletter')}</h3>
              <p className="text-muted-foreground mb-6">
                {t('news.newsletterDesc')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder={t('news.emailPlaceholder')}
                  className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground"
                />
                <button className="px-6 py-2 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors">
                  {t('news.subscribe')}
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