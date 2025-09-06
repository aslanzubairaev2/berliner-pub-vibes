import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Upload, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface News {
  id: string;
  title_de: string;
  title_en: string;
  excerpt_de: string;
  excerpt_en: string;
  content_de: string;
  content_en: string;
  author_name?: string;
  category: 'menu' | 'events' | 'general';
  image_url?: string;
  is_published: boolean;
  published_at?: string;
  read_time?: number;
  slug: string;
}

const AdminNews = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<News>>({
    title_de: '',
    title_en: '',
    excerpt_de: '',
    excerpt_en: '',
    content_de: '',
    content_en: '',
    author_name: 'Berliner Pub',
    category: 'general',
    is_published: false,
    read_time: 5,
    slug: ''
  });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNews(data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
      toast.error('Ошибка загрузки новостей');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9ä-üß\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!formData.title_de || !formData.title_en || !formData.excerpt_de || !formData.excerpt_en || 
          !formData.content_de || !formData.content_en) {
        toast.error('Пожалуйста, заполните все обязательные поля');
        return;
      }

      const slug = formData.slug || generateSlug(formData.title_en || formData.title_de || '');
      const dataToSave = {
        title_de: formData.title_de,
        title_en: formData.title_en,
        excerpt_de: formData.excerpt_de,
        excerpt_en: formData.excerpt_en,
        content_de: formData.content_de,
        content_en: formData.content_en,
        author_name: formData.author_name || 'Berliner Pub',
        category: formData.category as 'menu' | 'events' | 'general',
        image_url: formData.image_url || null,
        is_published: formData.is_published ?? false,
        read_time: formData.read_time || 5,
        slug,
        published_at: formData.is_published && !editingNews?.is_published ? new Date().toISOString() : editingNews?.published_at
      };

      if (editingNews) {
        const { error } = await supabase
          .from('news')
          .update(dataToSave)
          .eq('id', editingNews.id);

        if (error) throw error;
        toast.success('Новость обновлена');
      } else {
        const { error } = await supabase
          .from('news')
          .insert([dataToSave]);

        if (error) throw error;
        toast.success('Новость добавлена');
      }

      setIsModalOpen(false);
      setEditingNews(null);
      fetchNews();
      resetForm();
    } catch (error) {
      console.error('Error saving news:', error);
      toast.error('Ошибка сохранения новости');
    }
  };

  const handleEdit = (newsItem: News) => {
    setEditingNews(newsItem);
    setFormData(newsItem);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту новость?')) return;

    try {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Новость удалена');
      fetchNews();
    } catch (error) {
      console.error('Error deleting news:', error);
      toast.error('Ошибка удаления новости');
    }
  };

  const togglePublished = async (id: string, isPublished: boolean) => {
    try {
      const updateData: any = { 
        is_published: !isPublished 
      };
      
      if (!isPublished) {
        updateData.published_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('news')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
      toast.success(isPublished ? 'Новость снята с публикации' : 'Новость опубликована');
      fetchNews();
    } catch (error) {
      console.error('Error updating news:', error);
      toast.error('Ошибка обновления новости');
    }
  };

  const resetForm = () => {
    setFormData({
      title_de: '',
      title_en: '',
      excerpt_de: '',
      excerpt_en: '',
      content_de: '',
      content_en: '',
      author_name: 'Berliner Pub',
      category: 'general',
      is_published: false,
      read_time: 5,
      slug: ''
    });
  };

  const handleAddNew = () => {
    setEditingNews(null);
    resetForm();
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить новость
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingNews ? 'Редактировать новость' : 'Добавить новую новость'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title_de">Заголовок (DE)</Label>
                  <Input
                    id="title_de"
                    value={formData.title_de || ''}
                    onChange={(e) => setFormData({ ...formData, title_de: e.target.value })}
                    placeholder="Заголовок на немецком"
                  />
                </div>
                <div>
                  <Label htmlFor="title_en">Заголовок (EN)</Label>
                  <Input
                    id="title_en"
                    value={formData.title_en || ''}
                    onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                    placeholder="Заголовок на английском"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="category">Категория</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value: 'menu' | 'events' | 'general') => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">Общие</SelectItem>
                      <SelectItem value="events">События</SelectItem>
                      <SelectItem value="menu">Меню</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="author_name">Автор</Label>
                  <Input
                    id="author_name"
                    value={formData.author_name || ''}
                    onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                    placeholder="Имя автора"
                  />
                </div>
                <div>
                  <Label htmlFor="read_time">Время чтения (мин)</Label>
                  <Input
                    id="read_time"
                    type="number"
                    value={formData.read_time || 5}
                    onChange={(e) => setFormData({ ...formData, read_time: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="slug">URL (slug)</Label>
                <Input
                  id="slug"
                  value={formData.slug || ''}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="url-friendly-name"
                />
              </div>

              <div>
                <Label htmlFor="image_url">URL изображения</Label>
                <div className="flex gap-2">
                  <Input
                    id="image_url"
                    value={formData.image_url || ''}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="excerpt_de">Краткое содержание (DE)</Label>
                  <Textarea
                    id="excerpt_de"
                    value={formData.excerpt_de || ''}
                    onChange={(e) => setFormData({ ...formData, excerpt_de: e.target.value })}
                    placeholder="Краткое описание на немецком"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="excerpt_en">Краткое содержание (EN)</Label>
                  <Textarea
                    id="excerpt_en"
                    value={formData.excerpt_en || ''}
                    onChange={(e) => setFormData({ ...formData, excerpt_en: e.target.value })}
                    placeholder="Краткое описание на английском"
                    rows={3}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="content_de">Полное содержание (DE)</Label>
                  <Textarea
                    id="content_de"
                    value={formData.content_de || ''}
                    onChange={(e) => setFormData({ ...formData, content_de: e.target.value })}
                    placeholder="Полное содержание на немецком"
                    rows={6}
                  />
                </div>
                <div>
                  <Label htmlFor="content_en">Полное содержание (EN)</Label>
                  <Textarea
                    id="content_en"
                    value={formData.content_en || ''}
                    onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
                    placeholder="Полное содержание на английском"
                    rows={6}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_published"
                  checked={formData.is_published}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                />
                <Label htmlFor="is_published">Опубликовать сразу</Label>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Отмена
                </Button>
                <Button onClick={handleSave}>
                  {editingNews ? 'Обновить' : 'Добавить'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* News List */}
      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader>
                <div className="h-5 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-4/5"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : news.map((newsItem) => (
          <Card key={newsItem.id} className="pub-card-shadow border-0">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{newsItem.title_de}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant={newsItem.is_published ? "default" : "secondary"}>
                    {newsItem.is_published ? 'Опубликована' : 'Черновик'}
                  </Badge>
                  <Badge variant="outline">{newsItem.category}</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Автор: {newsItem.author_name}</span>
                <span>Время чтения: {newsItem.read_time} мин</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-muted-foreground line-clamp-2">
                  {newsItem.excerpt_de}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(newsItem)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePublished(newsItem.id, newsItem.is_published)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {newsItem.is_published ? 'Снять' : 'Опубликовать'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(newsItem.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Удалить
                    </Button>
                  </div>
                  {newsItem.published_at && (
                    <span className="text-xs text-muted-foreground">
                      Опубликовано: {new Date(newsItem.published_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminNews;