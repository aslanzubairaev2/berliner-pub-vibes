import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { newsArticles, getCategoryColor, getCategoryName } from "@/data/newsData";

const News = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  const handleArticleClick = (slug: string) => {
    navigate(`/news/${slug}`);
  };

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
        <div className="mb-16">
          <Card 
            className="pub-card-shadow border-0 overflow-hidden cursor-pointer pub-hover-lift"
            onClick={() => handleArticleClick(newsArticles[0].slug)}
          >
            <div className="pub-gradient-warm p-8">
              <Badge className={getCategoryColor(newsArticles[0].category) + " mb-4"}>
                {getCategoryName(newsArticles[0].category, language)}
              </Badge>
              <h2 className="text-3xl font-bold mb-4">
                {language === 'de' ? newsArticles[0].titleDe : newsArticles[0].titleEn}
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                {language === 'de' ? newsArticles[0].excerptDe : newsArticles[0].excerptEn}
              </p>
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <CalendarDays className="h-4 w-4" />
                  <span>{new Date(newsArticles[0].date).toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>{newsArticles[0].readTime} {t('news.minRead')}</span>
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

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsArticles.slice(1).map((article) => (
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
                    {article.readTime} {t('news.minRead')}
                  </span>
                </div>
                <CardTitle className="text-xl leading-tight">
                  {language === 'de' ? article.titleDe : article.titleEn}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {language === 'de' ? article.excerptDe : article.excerptEn}
                </p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <CalendarDays className="h-4 w-4" />
                    <span>{new Date(article.date).toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US', { 
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