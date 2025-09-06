import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, TrendingUp, TrendingDown, Users, Eye, Calendar, Clock, Coffee } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AnalyticsData {
  totalDrinks: number;
  totalNews: number;
  publishedNews: number;
  draftNews: number;
  recentActivity: {
    drinks_created: number;
    news_created: number;
    settings_updated: number;
  };
  categoryBreakdown: {
    beer: number;
    alcoholic: number;
    non_alcoholic: number;
  };
  newsCategories: {
    general: number;
    events: number;
    menu: number;
  };
}

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalDrinks: 0,
    totalNews: 0,
    publishedNews: 0,
    draftNews: 0,
    recentActivity: {
      drinks_created: 0,
      news_created: 0,
      settings_updated: 0,
    },
    categoryBreakdown: {
      beer: 0,
      alcoholic: 0,
      non_alcoholic: 0,
    },
    newsCategories: {
      general: 0,
      events: 0,
      menu: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7d");

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Fetch drinks data
      const { data: drinks, error: drinksError } = await supabase
        .from('drinks')
        .select('category, created_at');
      
      if (drinksError) throw drinksError;

      // Fetch news data
      const { data: news, error: newsError } = await supabase
        .from('news')
        .select('category, is_published, created_at');
      
      if (newsError) throw newsError;

      // Fetch settings data
      const { data: settings, error: settingsError } = await supabase
        .from('site_settings')
        .select('updated_at');
      
      if (settingsError) throw settingsError;

      // Calculate date range
      const now = new Date();
      const daysAgo = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
      const rangeStart = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));

      // Process data
      const categoryBreakdown = {
        beer: drinks?.filter(d => d.category === 'beer').length || 0,
        alcoholic: drinks?.filter(d => d.category === 'alcoholic').length || 0,
        non_alcoholic: drinks?.filter(d => d.category === 'non_alcoholic').length || 0,
      };

      const newsCategories = {
        general: news?.filter(n => n.category === 'general').length || 0,
        events: news?.filter(n => n.category === 'events').length || 0,
        menu: news?.filter(n => n.category === 'menu').length || 0,
      };

      const publishedNews = news?.filter(n => n.is_published).length || 0;
      const draftNews = (news?.length || 0) - publishedNews;

      // Recent activity (within selected time range)
      const recentDrinks = drinks?.filter(d => new Date(d.created_at) >= rangeStart).length || 0;
      const recentNews = news?.filter(n => new Date(n.created_at) >= rangeStart).length || 0;
      const recentSettings = settings?.filter(s => new Date(s.updated_at) >= rangeStart).length || 0;

      setAnalytics({
        totalDrinks: drinks?.length || 0,
        totalNews: news?.length || 0,
        publishedNews,
        draftNews,
        recentActivity: {
          drinks_created: recentDrinks,
          news_created: recentNews,
          settings_updated: recentSettings,
        },
        categoryBreakdown,
        newsCategories,
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Error loading analytics data');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, trend, description }: {
    title: string;
    value: number | string;
    icon: any;
    trend?: 'up' | 'down' | 'neutral';
    description?: string;
  }) => (
    <Card className="pub-card-shadow border-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{loading ? "..." : value}</div>
        {description && (
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            {trend === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
            {trend === 'down' && <TrendingDown className="h-3 w-3 text-red-500" />}
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Track your pub's content performance and growth metrics.
          </p>
        </div>
        
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Drinks"
          value={analytics.totalDrinks}
          icon={Coffee}
          trend="neutral"
          description="Active menu items"
        />
        <StatCard
          title="Published News"
          value={analytics.publishedNews}
          icon={Eye}
          trend="up"
          description="Live articles"
        />
        <StatCard
          title="Draft Articles"
          value={analytics.draftNews}
          icon={Clock}
          trend="neutral"
          description="Unpublished content"
        />
        <StatCard
          title="Total Content"
          value={analytics.totalDrinks + analytics.totalNews}
          icon={BarChart3}
          trend="up"
          description="All items"
        />
      </div>

      {/* Recent Activity */}
      <Card className="pub-card-shadow border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Activity ({timeRange === "7d" ? "Last 7 days" : timeRange === "30d" ? "Last 30 days" : "Last 90 days"})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Drinks Created</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {loading ? "..." : analytics.recentActivity.drinks_created}
                  </p>
                </div>
                <Coffee className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">News Published</p>
                  <p className="text-2xl font-bold text-green-600">
                    {loading ? "..." : analytics.recentActivity.news_created}
                  </p>
                </div>
                <Eye className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Settings Updated</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {loading ? "..." : analytics.recentActivity.settings_updated}
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="pub-card-shadow border-0">
          <CardHeader>
            <CardTitle>Drinks by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <span className="text-sm">Beer</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{analytics.categoryBreakdown.beer}</span>
                  <Badge variant="secondary">
                    {analytics.totalDrinks > 0 ? Math.round((analytics.categoryBreakdown.beer / analytics.totalDrinks) * 100) : 0}%
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Alcoholic</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{analytics.categoryBreakdown.alcoholic}</span>
                  <Badge variant="secondary">
                    {analytics.totalDrinks > 0 ? Math.round((analytics.categoryBreakdown.alcoholic / analytics.totalDrinks) * 100) : 0}%
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Non-Alcoholic</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{analytics.categoryBreakdown.non_alcoholic}</span>
                  <Badge variant="secondary">
                    {analytics.totalDrinks > 0 ? Math.round((analytics.categoryBreakdown.non_alcoholic / analytics.totalDrinks) * 100) : 0}%
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="pub-card-shadow border-0">
          <CardHeader>
            <CardTitle>News by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">General</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{analytics.newsCategories.general}</span>
                  <Badge variant="secondary">
                    {analytics.totalNews > 0 ? Math.round((analytics.newsCategories.general / analytics.totalNews) * 100) : 0}%
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">Events</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{analytics.newsCategories.events}</span>
                  <Badge variant="secondary">
                    {analytics.totalNews > 0 ? Math.round((analytics.newsCategories.events / analytics.totalNews) * 100) : 0}%
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm">Menu</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{analytics.newsCategories.menu}</span>
                  <Badge variant="secondary">
                    {analytics.totalNews > 0 ? Math.round((analytics.newsCategories.menu / analytics.totalNews) * 100) : 0}%
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Summary */}
      <Card className="pub-card-shadow border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Performance Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {analytics.publishedNews > 0 ? Math.round((analytics.publishedNews / analytics.totalNews) * 100) : 0}%
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                News Publication Rate
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {analytics.totalDrinks}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Total Menu Items
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {analytics.recentActivity.drinks_created + analytics.recentActivity.news_created}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Recent Content Added
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;