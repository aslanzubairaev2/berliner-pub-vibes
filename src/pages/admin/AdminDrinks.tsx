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
import { Plus, Edit, Trash2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Drink {
  id: string;
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

const AdminDrinks = () => {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDrink, setEditingDrink] = useState<Drink | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  useEffect(() => {
    fetchDrinks();
  }, []);

  const fetchDrinks = async () => {
    try {
      const { data, error } = await supabase
        .from('drinks')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setDrinks(data || []);
    } catch (error) {
      console.error('Error fetching drinks:', error);
      toast.error('Ошибка загрузки напитков');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!formData.name || !formData.description_de || !formData.description_en || !formData.price || !formData.category) {
        toast.error('Пожалуйста, заполните все обязательные поля');
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

      if (editingDrink) {
        const { error } = await supabase
          .from('drinks')
          .update(dataToSave)
          .eq('id', editingDrink.id);

        if (error) throw error;
        toast.success('Напиток обновлен');
      } else {
        const { error } = await supabase
          .from('drinks')
          .insert([dataToSave]);

        if (error) throw error;
        toast.success('Напиток добавлен');
      }

      setIsModalOpen(false);
      setEditingDrink(null);
      fetchDrinks();
      resetForm();
    } catch (error) {
      console.error('Error saving drink:', error);
      toast.error('Ошибка сохранения напитка');
    }
  };

  const handleEdit = (drink: Drink) => {
    setEditingDrink(drink);
    setFormData(drink);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот напиток?')) return;

    try {
      const { error } = await supabase
        .from('drinks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Напиток удален');
      fetchDrinks();
    } catch (error) {
      console.error('Error deleting drink:', error);
      toast.error('Ошибка удаления напитка');
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

  const handleAddNew = () => {
    setEditingDrink(null);
    resetForm();
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Управление напитками</h1>
          <p className="text-muted-foreground mt-2">
            Добавляйте, редактируйте и удаляйте напитки из меню
          </p>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить напиток
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingDrink ? 'Редактировать напиток' : 'Добавить новый напиток'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Название</Label>
                  <Input
                    id="name"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Название напитка"
                  />
                </div>
                <div>
                  <Label htmlFor="price">Цена (€)</Label>
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
                  <Label htmlFor="category">Категория</Label>
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
                <Label htmlFor="description_de">Описание (DE)</Label>
                <Textarea
                  id="description_de"
                  value={formData.description_de || ''}
                  onChange={(e) => setFormData({ ...formData, description_de: e.target.value })}
                  placeholder="Краткое описание на немецком"
                />
              </div>

              <div>
                <Label htmlFor="description_en">Описание (EN)</Label>
                <Textarea
                  id="description_en"
                  value={formData.description_en || ''}
                  onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                  placeholder="Краткое описание на английском"
                />
              </div>

              <div>
                <Label htmlFor="full_description_de">Полное описание (DE)</Label>
                <Textarea
                  id="full_description_de"
                  value={formData.full_description_de || ''}
                  onChange={(e) => setFormData({ ...formData, full_description_de: e.target.value })}
                  placeholder="Подробное описание на немецком"
                />
              </div>

              <div>
                <Label htmlFor="full_description_en">Полное описание (EN)</Label>
                <Textarea
                  id="full_description_en"
                  value={formData.full_description_en || ''}
                  onChange={(e) => setFormData({ ...formData, full_description_en: e.target.value })}
                  placeholder="Подробное описание на английском"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                <div>
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
                <Label htmlFor="is_available">Доступен для заказа</Label>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Отмена
                </Button>
                <Button onClick={handleSave}>
                  {editingDrink ? 'Обновить' : 'Добавить'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Drinks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
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
        ) : drinks.map((drink) => (
          <Card key={drink.id} className="pub-card-shadow border-0">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{drink.name}</CardTitle>
                <Badge variant={drink.is_available ? "default" : "secondary"}>
                  {drink.is_available ? 'Доступен' : 'Недоступен'}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <Badge variant="outline">{drink.category}</Badge>
                <span className="text-lg font-bold">€{drink.price}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {drink.description_de}
                </p>
                {drink.alcohol_content && (
                  <p className="text-xs text-muted-foreground">
                    Алкоголь: {drink.alcohol_content}
                  </p>
                )}
                <div className="flex justify-between items-center pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(drink)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Редактировать
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(drink.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Удалить
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDrinks;