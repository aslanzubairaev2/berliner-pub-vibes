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
import { useLanguage } from "@/contexts/LanguageContext";

interface Drink {
  name: string;
  description_de: string;
  description_en: string;
  full_description_de?: string;
  full_description_en?: string;
  price: number;
  category: 'beer' | 'alcoholic' | 'non_alcoholic';
  alcohol_content?: string;
  is_available: boolean;
  sort_order?: number;
}

interface AddDrinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const AddDrinkDialog = ({ open, onOpenChange, onSuccess }: AddDrinkDialogProps) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<Partial<Drink>>({
    name: '',
    description_de: '',
    description_en: '',
    full_description_de: '',
    full_description_en: '',
    price: 0,
    category: 'beer',
    alcohol_content: '',
    is_available: true,
    sort_order: 0
  });

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!formData.name || !formData.description_de || !formData.description_en || !formData.price || !formData.category) {
        toast.error(t('admin.requiredFields'));
        return;
      }

      const dataToSave = {
        name: formData.name,
        description_de: formData.description_de,
        description_en: formData.description_en,
        full_description_de: formData.full_description_de || '',
        full_description_en: formData.full_description_en || '',
        price: formData.price,
        category: formData.category as 'beer' | 'alcoholic' | 'non_alcoholic',
        alcohol_content: formData.alcohol_content || null,
        is_available: formData.is_available ?? true,
        sort_order: formData.sort_order || 0
      };

      const { error } = await supabase
        .from('drinks')
        .insert([dataToSave]);

      if (error) throw error;

      toast.success(t('admin.drinkAdded'));
      onOpenChange(false);
      resetForm();
      onSuccess?.();
    } catch (error) {
      console.error('Error saving drink:', error);
      toast.error(t('admin.errorSavingDrink'));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description_de: '',
      description_en: '',
      full_description_de: '',
      full_description_en: '',
      price: 0,
      category: 'beer',
      alcohol_content: '',
      is_available: true,
      sort_order: 0
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('admin.addDrink')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">{t('admin.name')}</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t('admin.drinkNamePlaceholder')}
              />
            </div>
            <div>
              <Label htmlFor="price">{t('admin.price')}</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price || 0}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">{t('admin.category')}</Label>
              <Select
                value={formData.category}
                onValueChange={(value: 'beer' | 'alcoholic' | 'non_alcoholic') => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('admin.selectCategoryPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beer">{t('admin.beer')}</SelectItem>
                  <SelectItem value="alcoholic">{t('admin.alcoholic')}</SelectItem>
                  <SelectItem value="non_alcoholic">{t('admin.nonAlcoholic')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="alcohol_content">{t('admin.alcoholContent')}</Label>
              <Input
                id="alcohol_content"
                value={formData.alcohol_content || ''}
                onChange={(e) => setFormData({ ...formData, alcohol_content: e.target.value })}
                placeholder={t('admin.alcoholPlaceholder')}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description_de">{t('admin.descriptionDE')}</Label>
            <Textarea
              id="description_de"
              value={formData.description_de || ''}
              onChange={(e) => setFormData({ ...formData, description_de: e.target.value })}
              placeholder="Short description in German"
            />
          </div>

          <div>
            <Label htmlFor="description_en">{t('admin.descriptionEN')}</Label>
            <Textarea
              id="description_en"
              value={formData.description_en || ''}
              onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
              placeholder="Short description in English"
            />
          </div>

          <div>
            <Label htmlFor="full_description_de">{t('admin.fullDescriptionDE')}</Label>
            <Textarea
              id="full_description_de"
              value={formData.full_description_de || ''}
              onChange={(e) => setFormData({ ...formData, full_description_de: e.target.value })}
              placeholder="Detailed description in German"
            />
          </div>

          <div>
            <Label htmlFor="full_description_en">{t('admin.fullDescriptionEN')}</Label>
            <Textarea
              id="full_description_en"
              value={formData.full_description_en || ''}
              onChange={(e) => setFormData({ ...formData, full_description_en: e.target.value })}
              placeholder="Detailed description in English"
            />
          </div>

          <div>
            <Label htmlFor="sort_order">{t('admin.sortOrder')}</Label>
            <Input
              id="sort_order"
              type="number"
              value={formData.sort_order || 0}
              onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_available"
              checked={formData.is_available}
              onCheckedChange={(checked) => setFormData({ ...formData, is_available: checked })}
            />
            <Label htmlFor="is_available">{t('admin.availableForOrder')}</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleSave}>
              {t('admin.addDrink')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};