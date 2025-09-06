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
import { ImageUpload } from "@/components/admin/ImageUpload";

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
      toast.error('Error loading news');
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
        toast.error('Please fill in all required fields');
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
        toast.success('News updated');
      } else {
        const { error } = await supabase
          .from('news')
          .insert([dataToSave]);

        if (error) throw error;
        toast.success('News added');
      }

      setIsModalOpen(false);
      setEditingNews(null);
      fetchNews();
      resetForm();
    } catch (error) {
      console.error('Error saving news:', error);
      toast.error('Error saving news');
    }
  };

  const handleEdit = (newsItem: News) => {
    setEditingNews(newsItem);
    setFormData(newsItem);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this news?')) return;

    try {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('News deleted');
      fetchNews();
    } catch (error) {
      console.error('Error deleting news:', error);
      toast.error('Error deleting news');
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
      toast.success(isPublished ? 'News unpublished' : 'News published');
      fetchNews();
    } catch (error) {
      console.error('Error updating news:', error);
      toast.error('Error updating news');
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
      <div className="flex justify-center items-center">
        <div>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew}>
              <Plus className="h-4 w-4 mr-2" />
              Add News
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingNews ? 'Edit News' : 'Add News'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title_de">Title (DE)</Label>
                  <Input
                    id="title_de"
                    value={formData.title_de || ''}
                    onChange={(e) => setFormData({ ...formData, title_de: e.target.value })}
                    placeholder="German title"
                  />
                </div>
                <div>
                  <Label htmlFor="title_en">Title (EN)</Label>
                  <Input
                    id="title_en"
                    value={formData.title_en || ''}
                    onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                    placeholder="English title"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value: 'menu' | 'events' | 'general') => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="events">Events</SelectItem>
                      <SelectItem value="menu">Menu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="read_time">Reading time (min)</Label>
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

              <ImageUpload
                currentImageUrl={formData.image_url}
                onImageUploaded={(url) => setFormData({ ...formData, image_url: url })}
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="excerpt_de">Excerpt (DE)</Label>
                  <Textarea
                    id="excerpt_de"
                    value={formData.excerpt_de || ''}
                    onChange={(e) => setFormData({ ...formData, excerpt_de: e.target.value })}
                    placeholder="German excerpt"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="excerpt_en">Excerpt (EN)</Label>
                  <Textarea
                    id="excerpt_en"
                    value={formData.excerpt_en || ''}
                    onChange={(e) => setFormData({ ...formData, excerpt_en: e.target.value })}
                    placeholder="English excerpt"
                    rows={3}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="content_de">Content (DE)</Label>
                  <Textarea
                    id="content_de"
                    value={formData.content_de || ''}
                    onChange={(e) => setFormData({ ...formData, content_de: e.target.value })}
                    placeholder="German content"
                    rows={6}
                  />
                </div>
                <div>
                  <Label htmlFor="content_en">Content (EN)</Label>
                  <Textarea
                    id="content_en"
                    value={formData.content_en || ''}
                    onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
                    placeholder="English content"
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
                <Label htmlFor="is_published">Publish immediately</Label>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  {editingNews ? 'Update' : 'Add'}
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
                <div className="flex flex-col items-end gap-2">
                  <Badge variant={newsItem.is_published ? "default" : "secondary"}>
                    {newsItem.is_published ? 'Published' : 'Draft'}
                  </Badge>
                  <Badge variant="outline">{newsItem.category}</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span>Read time: {newsItem.read_time} min</span>
                  {newsItem.published_at && (
                    <span className="text-xs">
                      • {new Date(newsItem.published_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-muted-foreground line-clamp-2">
                  {newsItem.excerpt_de}
                </p>
                <div className="flex justify-between items-center w-full">
                <div className="flex justify-between items-center w-full">
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
                      {newsItem.is_published ? 'Unpublish' : 'Publish'}
                    </Button>
                  </div>
                  <Trash2 
                    className="h-5 w-5 text-red-500 hover:text-red-700 cursor-pointer transition-colors" 
                    onClick={() => handleDelete(newsItem.id)}
                  />
                </div>
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