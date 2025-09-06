import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SiteSetting {
  id: string;
  key: string;
  value_de?: string;
  value_en?: string;
  setting_type: string;
  description?: string;
  updated_at: string;
}

const AdminSettings = () => {
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSetting, setEditingSetting] = useState<SiteSetting | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<SiteSetting>>({
    key: '',
    value_de: '',
    value_en: '',
    setting_type: 'text',
    description: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('key', { ascending: true });

      if (error) throw error;
      setSettings(data || []);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Error loading settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!formData.key) {
        toast.error('Please fill in the key field');
        return;
      }

      const dataToSave = {
        key: formData.key,
        value_de: formData.value_de || '',
        value_en: formData.value_en || '',
        setting_type: formData.setting_type || 'text',
        description: formData.description || ''
      };

      if (editingSetting) {
        const { error } = await supabase
          .from('site_settings')
          .update(dataToSave)
          .eq('id', editingSetting.id);

        if (error) throw error;
        toast.success('Setting updated');
      } else {
        const { error } = await supabase
          .from('site_settings')
          .insert([dataToSave]);

        if (error) throw error;
        toast.success('Setting added');
      }

      setIsModalOpen(false);
      setEditingSetting(null);
      fetchSettings();
      resetForm();
    } catch (error) {
      console.error('Error saving setting:', error);
      toast.error('Error saving setting');
    }
  };

  const handleEdit = (setting: SiteSetting) => {
    setEditingSetting(setting);
    setFormData(setting);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this setting?')) return;

    try {
      const { error } = await supabase
        .from('site_settings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Setting deleted');
      fetchSettings();
    } catch (error) {
      console.error('Error deleting setting:', error);
      toast.error('Error deleting setting');
    }
  };

  const resetForm = () => {
    setFormData({
      key: '',
      value_de: '',
      value_en: '',
      setting_type: 'text',
      description: ''
    });
  };

  const handleAddNew = () => {
    setEditingSetting(null);
    resetForm();
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Site Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your pub's site configuration and content settings.
          </p>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew}>
              <Plus className="h-4 w-4 mr-2" />
              Add Setting
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingSetting ? 'Edit Setting' : 'Add New Setting'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="key">Key</Label>
                  <Input
                    id="key"
                    value={formData.key || ''}
                    onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                    placeholder="setting_key"
                  />
                </div>
                <div>
                  <Label htmlFor="setting_type">Type</Label>
                  <Select 
                    value={formData.setting_type} 
                    onValueChange={(value) => setFormData({ ...formData, setting_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="textarea">Textarea</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="boolean">Boolean</SelectItem>
                      <SelectItem value="url">URL</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description of this setting"
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="value_de">Value (DE)</Label>
                  {formData.setting_type === 'text' || formData.setting_type === 'textarea' ? (
                    <Textarea
                      id="value_de"
                      value={formData.value_de || ''}
                      onChange={(e) => setFormData({ ...formData, value_de: e.target.value })}
                      placeholder="German value"
                      rows={formData.setting_type === 'textarea' ? 6 : 4}
                      className="min-h-[100px]"
                    />
                  ) : (
                    <Input
                      id="value_de"
                      type={formData.setting_type === 'number' ? 'number' : 
                            formData.setting_type === 'email' ? 'email' :
                            formData.setting_type === 'url' ? 'url' : 'text'}
                      value={formData.value_de || ''}
                      onChange={(e) => setFormData({ ...formData, value_de: e.target.value })}
                      placeholder="German value"
                    />
                  )}
                </div>
                <div>
                  <Label htmlFor="value_en">Value (EN)</Label>
                  {formData.setting_type === 'text' || formData.setting_type === 'textarea' ? (
                    <Textarea
                      id="value_en"
                      value={formData.value_en || ''}
                      onChange={(e) => setFormData({ ...formData, value_en: e.target.value })}
                      placeholder="English value"
                      rows={formData.setting_type === 'textarea' ? 6 : 4}
                      className="min-h-[100px]"
                    />
                  ) : (
                    <Input
                      id="value_en"
                      type={formData.setting_type === 'number' ? 'number' : 
                            formData.setting_type === 'email' ? 'email' :
                            formData.setting_type === 'url' ? 'url' : 'text'}
                      value={formData.value_en || ''}
                      onChange={(e) => setFormData({ ...formData, value_en: e.target.value })}
                      placeholder="English value"
                    />
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  {editingSetting ? 'Update' : 'Add'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Settings List */}
      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader>
                <div className="h-5 bg-muted rounded w-1/4"></div>
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
        ) : settings.length === 0 ? (
          <Card className="pub-card-shadow border-0">
            <CardContent className="text-center py-12">
              <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Settings Found</h3>
              <p className="text-muted-foreground mb-4">
                Start by adding your first site setting.
              </p>
              <Button onClick={handleAddNew}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Setting
              </Button>
            </CardContent>
          </Card>
        ) : (
          settings.map((setting) => (
            <Card key={setting.id} className="pub-card-shadow border-0">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{setting.key}</CardTitle>
                    {setting.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {setting.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-muted px-2 py-1 rounded">
                      {setting.setting_type}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">German Value</Label>
                      <p className="text-sm mt-1 p-2 bg-muted rounded min-h-[2rem]">
                        {setting.value_de || '-'}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">English Value</Label>
                      <p className="text-sm mt-1 p-2 bg-muted rounded min-h-[2rem]">
                        {setting.value_en || '-'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xs text-muted-foreground">
                      Updated: {new Date(setting.updated_at).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(setting)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(setting.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminSettings;