import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ImagePlus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { ImageUpload } from "@/components/admin/ImageUpload";

const AdminAppearance = () => {
  const { settings, loading, fetchSettings, getSetting } = useSiteSettings();
  const [saving, setSaving] = useState(false);
  const [galleryEnabled, setGalleryEnabled] = useState<boolean>(false);
  const [heroImageUrl, setHeroImageUrl] = useState<string>('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  // Update state when settings are loaded
  useEffect(() => {
    if (!loading && settings) {
      const galleryValue = getSetting('gallery_enabled');
      setGalleryEnabled(galleryValue === 'true');
      
      const heroValue = getSetting('hero_image_url');
      setHeroImageUrl(heroValue || '');
      
      try {
        const imagesValue = getSetting('gallery_images');
        setGalleryImages(imagesValue ? JSON.parse(imagesValue) : []);
      } catch {
        setGalleryImages([]);
      }
    }
  }, [loading, settings, getSetting]);

  const updateSetting = async (key: string, valueDe: string, valueEn: string) => {
    const { error } = await supabase
      .from('site_settings')
      .update({
        value_de: valueDe,
        value_en: valueEn,
        updated_at: new Date().toISOString()
      })
      .eq('key', key);

    if (error) throw error;
  };

  const handleSaveHeroImage = async () => {
    try {
      setSaving(true);
      await updateSetting('hero_image_url', heroImageUrl, heroImageUrl);
      toast.success('Hero image saved');
      await fetchSettings();
    } catch (error) {
      console.error('Error saving hero image:', error);
      toast.error('Error saving hero image');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveGallery = async () => {
    try {
      setSaving(true);
      const galleryJson = JSON.stringify(galleryImages);
      await updateSetting('gallery_images', galleryJson, galleryJson);
      const enabledValue = galleryEnabled.toString();
      await updateSetting('gallery_enabled', enabledValue, enabledValue);
      toast.success('Gallery settings saved');
      await fetchSettings();
    } catch (error) {
      console.error('Error saving gallery:', error);
      toast.error('Error saving gallery');
    } finally {
      setSaving(false);
    }
  };

  const handleAddGalleryImage = (url: string) => {
    setGalleryImages(prev => [...prev, url]);
    toast.success('Изображение добавлено в галерею');
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Appearance Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage hero image and gallery on the home page
        </p>
      </div>

      {/* Hero Image */}
      <Card className="pub-card-shadow border-0">
        <CardHeader>
          <CardTitle>Hero Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Current Hero Image</Label>
            {heroImageUrl && (
              <div className="mt-2 mb-4">
                <img 
                  src={heroImageUrl} 
                  alt="Hero" 
                  className="w-full max-w-2xl h-64 object-cover rounded-lg"
                />
              </div>
            )}
            <ImageUpload
              currentImageUrl={heroImageUrl}
              onImageUploaded={setHeroImageUrl}
              bucket="drink-images"
            />
          </div>
          <Button onClick={handleSaveHeroImage} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Save Hero Image
          </Button>
        </CardContent>
      </Card>

      {/* Gallery */}
      <Card className="pub-card-shadow border-0">
        <CardHeader>
          <CardTitle>Gallery Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Gallery</Label>
              <p className="text-sm text-muted-foreground">
                Show gallery section on home page
              </p>
            </div>
            <Switch
              checked={galleryEnabled}
              onCheckedChange={setGalleryEnabled}
            />
          </div>

          <div>
            <Label>Gallery Images</Label>
            <p className="text-sm text-muted-foreground mb-4">
              Add images to display in the gallery carousel
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {galleryImages.map((url, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={url} 
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemoveGalleryImage(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <div className="w-full h-40 border-2 border-dashed rounded-lg flex items-center justify-center">
                <ImageUpload
                  onImageUploaded={handleAddGalleryImage}
                  bucket="drink-images"
                />
              </div>
            </div>
          </div>

          <Button onClick={handleSaveGallery} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Save Gallery Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAppearance;
