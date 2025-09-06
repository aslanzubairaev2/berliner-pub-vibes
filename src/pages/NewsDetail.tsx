import { useParams, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, ArrowLeft, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNews } from "@/hooks/useNews";

const NewsDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { articles, loading, error, getArticleBySlug } = useNews();
  
  const article = getArticleBySlug(slug || '');
  
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
          <p className="text-muted-foreground">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading article: {error}</p>
          <Button onClick={() => navigate('/news')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('news.backToNews')}
          </Button>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">{t('news.notFound')}</h1>
          <p className="text-muted-foreground mb-8">{t('news.notFoundDesc')}</p>
          <Button onClick={() => navigate('/news')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('news.backToNews')}
          </Button>
        </div>
      </div>
    );
  }

  const title = language === 'de' ? article.title_de : article.title_en;
  const content = language === 'de' ? article.content_de : article.content_en;

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate('/news')}
            className="mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('news.backToNews')}
          </Button>

          {/* Article Header */}
          <article className="prose prose-lg max-w-none">
            <div className="mb-8">
              <Badge className={getCategoryColor(article.category) + " mb-4"}>
                {getCategoryName(article.category, language)}
              </Badge>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                {title}
              </h1>
              
              <div className="flex items-center space-x-6 text-muted-foreground border-b border-border pb-6">
                <div className="flex items-center space-x-2">
                  <CalendarDays className="h-5 w-5" />
                  <span>{new Date(article.published_at || article.created_at).toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>{article.read_time} {t('news.minRead')}</span>
                </div>
              </div>
            </div>

            {/* Article Content */}
            <div 
              className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-li:text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </article>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <div className="bg-muted/30 rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4">{t('news.visitUs')}</h3>
              <p className="text-muted-foreground mb-6">
                {t('news.visitUsDesc')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={() => navigate('/contact')}>
                  {t('nav.contact')}
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/menu')}>
                  {t('nav.menu')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;