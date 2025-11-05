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

interface Drink {
  name: string;
  description_de: string;
  description_en: string;
  full_description_de?: string;
  full_description_en?: string;
  price: number;
  category: 'beer' | 'alcoholic' | 'non_alcoholic';
  alcohol_content?: string;
  image_url?: string;
  is_available: boolean;
  sort_order?: number;
}

interface AddDrinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const AddDrinkDialog = ({ open, onOpenChange, onSuccess }: AddDrinkDialogProps) => {
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
        toast.error('Please fill in all required fields');
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
        image_url: formData.image_url || null,
        is_available: formData.is_available ?? true,
        sort_order: formData.sort_order || 0
      };

      const { error } = await supabase
        .from('drinks')
        .insert([dataToSave]);

      if (error) throw error;
      
      toast.success('Drink added successfully');
      onOpenChange(false);
      resetForm();
      onSuccess?.();
    } catch (error) {
      console.error('Error saving drink:', error);
      toast.error('Error saving drink');
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
          <DialogTitle>Add New Drink</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Drink name"
              />
            </div>
            <div>
              <Label htmlFor="price">Price (€)</Label>
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
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category} 
                onValueChange={(value: 'beer' | 'alcoholic' | 'non_alcoholic') => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beer">Пиво</SelectItem>
                  <SelectItem value="alcoholic">Алкогольные</SelectItem>
                  <SelectItem value="non_alcoholic">Безалкогольные</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="alcohol_content">Содержание алкоголя</Label>
              <Input
                id="alcohol_content"
                value={formData.alcohol_content || ''}
                onChange={(e) => setFormData({ ...formData, alcohol_content: e.target.value })}
                placeholder="например: 5.2%"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description_de">Description (DE)</Label>
            <Textarea
              id="description_de"
              value={formData.description_de || ''}
              onChange={(e) => setFormData({ ...formData, description_de: e.target.value })}
              placeholder="Short description in German"
            />
          </div>

          <div>
            <Label htmlFor="description_en">Description (EN)</Label>
            <Textarea
              id="description_en"
              value={formData.description_en || ''}
              onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
              placeholder="Short description in English"
            />
          </div>

          <div>
            <Label htmlFor="full_description_de">Full Description (DE)</Label>
            <Textarea
              id="full_description_de"
              value={formData.full_description_de || ''}
              onChange={(e) => setFormData({ ...formData, full_description_de: e.target.value })}
              placeholder="Detailed description in German"
            />
          </div>

          <div>
            <Label htmlFor="full_description_en">Full Description (EN)</Label>
            <Textarea
              id="full_description_en"
              value={formData.full_description_en || ''}
              onChange={(e) => setFormData({ ...formData, full_description_en: e.target.value })}
              placeholder="Detailed description in English"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 items-start">
            <div>
              <ImageUpload
                currentImageUrl={formData.image_url}
                onImageUploaded={(url) => setFormData({ ...formData, image_url: url })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sort_order">Порядок сортировки</Label>
              <Input
                id="sort_order"
                type="number"
                value={formData.sort_order || 0}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_available"
              checked={formData.is_available}
              onCheckedChange={(checked) => setFormData({ ...formData, is_available: checked })}
            />
            <Label htmlFor="is_available">Available for order</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Add Drink
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};