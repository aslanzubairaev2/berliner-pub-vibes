import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { useLanguage } from "@/contexts/LanguageContext";

interface News {
  title_de: string;
  title_en: string;
  excerpt_de: string;
  excerpt_en: string;
  content_de: string;
  content_en: string;
  category: 'menu' | 'events' | 'general';
  image_url?: string;
  is_published: boolean;
  read_time?: number;
  slug: string;
}

interface AddNewsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const AddNewsDialog = ({ open, onOpenChange, onSuccess }: AddNewsDialogProps) => {
  const { t } = useLanguage();
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
        toast.error(t('admin.requiredFields'));
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
        published_at: formData.is_published ? new Date().toISOString() : null
      };

      const { error } = await supabase
        .from('news')
        .insert([dataToSave]);

      if (error) throw error;

      toast.success(t('admin.newsAdded'));
      onOpenChange(false);
      resetForm();
      onSuccess?.();
    } catch (error) {
      console.error('Error saving news:', error);
      toast.error(t('admin.errorSavingNews'));
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('admin.addNews')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title_de">{t('admin.titleDE')}</Label>
              <Input
                id="title_de"
                value={formData.title_de || ''}
                onChange={(e) => setFormData({ ...formData, title_de: e.target.value })}
                placeholder="German title"
              />
            </div>
            <div>
              <Label htmlFor="title_en">{t('admin.titleEN')}</Label>
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
              <Label htmlFor="category">{t('admin.category')}</Label>
              <Select
                value={formData.category}
                onValueChange={(value: 'menu' | 'events' | 'general') => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('admin.selectCategoryPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="events">Events</SelectItem>
                  <SelectItem value="menu">Menu</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="read_time">{t('admin.readingTime')}</Label>
              <Input
                id="read_time"
                type="number"
                value={formData.read_time || 5}
                onChange={(e) => setFormData({ ...formData, read_time: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="slug">{t('admin.slug')}</Label>
            <Input
              id="slug"
              value={formData.slug || ''}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder={t('admin.urlSlugPlaceholder')}
            />
          </div>

          <ImageUpload
            currentImageUrl={formData.image_url}
            onImageUploaded={(url) => setFormData({ ...formData, image_url: url })}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="excerpt_de">{t('admin.excerptDE')}</Label>
              <Textarea
                id="excerpt_de"
                value={formData.excerpt_de || ''}
                onChange={(e) => setFormData({ ...formData, excerpt_de: e.target.value })}
                placeholder="German excerpt"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="excerpt_en">{t('admin.excerptEN')}</Label>
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
              <Label htmlFor="content_de">{t('admin.contentDE')}</Label>
              <Textarea
                id="content_de"
                value={formData.content_de || ''}
                onChange={(e) => setFormData({ ...formData, content_de: e.target.value })}
                placeholder="German content"
                rows={6}
              />
            </div>
            <div>
              <Label htmlFor="content_en">{t('admin.contentEN')}</Label>
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
            <Label htmlFor="is_published">{t('admin.publishImmediately')}</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleSave}>
              {t('common.add')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};