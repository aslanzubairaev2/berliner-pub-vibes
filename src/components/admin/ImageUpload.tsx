import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Link, Image, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageUploaded: (url: string) => void;
  bucket?: string;
}

export const ImageUpload = ({ currentImageUrl, onImageUploaded, bucket = 'drink-images' }: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    try {
      setIsUploading(true);
      
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      onImageUploaded(data.publicUrl);
      setIsModalOpen(false);
      toast.success('Изображение загружено успешно!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Ошибка загрузки изображения');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Пожалуйста, выберите файл изображения');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Размер файла должен быть не более 5MB');
        return;
      }

      uploadFile(file);
    }
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) {
      toast.error('Введите URL изображения');
      return;
    }

    // Basic URL validation
    try {
      new URL(urlInput);
      onImageUploaded(urlInput);
      setUrlInput('');
      setIsModalOpen(false);
      toast.success('URL изображения добавлен');
    } catch {
      toast.error('Неверный формат URL');
    }
  };

  const handleGoogleDriveLink = () => {
    const driveUrl = urlInput.trim();
    if (!driveUrl.includes('drive.google.com')) {
      toast.error('Пожалуйста, введите корректную ссылку Google Drive');
      return;
    }

    // Convert Google Drive sharing link to direct image link
    let directUrl = driveUrl;
    const fileIdMatch = driveUrl.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
    if (fileIdMatch) {
      const fileId = fileIdMatch[1];
      directUrl = `https://drive.google.com/uc?id=${fileId}&export=view`;
    }

    onImageUploaded(directUrl);
    setUrlInput('');
    setIsModalOpen(false);
    toast.success('Google Drive image added');
  };

  return (
    <div className="space-y-2">
      {currentImageUrl !== undefined && (
        <>
          <Label>Image</Label>
          <div className="flex items-center gap-2">
            <Input
              value={currentImageUrl || ''}
              onChange={(e) => onImageUploaded(e.target.value)}
              placeholder="Image URL"
              className="flex-1"
            />
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={isUploading}>
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                </Button>
              </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Image</DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="local" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="local">From Disk</TabsTrigger>
                <TabsTrigger value="url">By URL</TabsTrigger>
                <TabsTrigger value="gdrive">Google Drive</TabsTrigger>
              </TabsList>
              
              <TabsContent value="local" className="space-y-4">
                <div>
                  <Label>Select image file</Label>
                  <div className="mt-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      className="w-full"
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Image className="h-4 w-4 mr-2" />
                          Choose File
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Supported: JPG, PNG, WebP (max 5MB)
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="url" className="space-y-4">
                <div>
                  <Label htmlFor="url-input">Image URL</Label>
                  <Input
                    id="url-input"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <Button onClick={handleUrlSubmit} className="w-full">
                  <Link className="h-4 w-4 mr-2" />
                  Add by URL
                </Button>
              </TabsContent>
              
              <TabsContent value="gdrive" className="space-y-4">
                <div>
                  <Label htmlFor="gdrive-input">Google Drive Link</Label>
                  <Input
                    id="gdrive-input"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://drive.google.com/file/d/..."
                  />
                </div>
                <Button onClick={handleGoogleDriveLink} className="w-full">
                  <Image className="h-4 w-4 mr-2" />
                  Add from Google Drive
                </Button>
                <div className="text-xs text-muted-foreground space-y-2">
                  <p><strong>Instructions:</strong></p>
                  <ol className="list-decimal list-inside space-y-1 text-xs">
                    <li>Open file in Google Drive</li>
                    <li>Click "Share" → "Change access"</li>
                    <li>Select "Anyone with the link"</li>
                    <li>Copy link and paste here</li>
                  </ol>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Image preview */}
      {currentImageUrl && (
        <div className="mt-2">
          <img
            src={currentImageUrl}
            alt="Preview"
            className="w-20 h-20 object-cover rounded border"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
        </>
      )}
      
      {currentImageUrl === undefined && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" disabled={isUploading} className="w-full">
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              {isUploading ? 'Загрузка...' : 'Загрузить изображение'}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Image</DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="local" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="local">From Disk</TabsTrigger>
                <TabsTrigger value="url">By URL</TabsTrigger>
                <TabsTrigger value="gdrive">Google Drive</TabsTrigger>
              </TabsList>
              
              <TabsContent value="local" className="space-y-4">
                <div>
                  <Label>Select image file</Label>
                  <div className="mt-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      className="w-full"
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Image className="h-4 w-4 mr-2" />
                          Choose File
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Supported: JPG, PNG, WebP (max 5MB)
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="url" className="space-y-4">
                <div>
                  <Label htmlFor="url-input">Image URL</Label>
                  <Input
                    id="url-input"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <Button onClick={handleUrlSubmit} className="w-full">
                  <Link className="h-4 w-4 mr-2" />
                  Add by URL
                </Button>
              </TabsContent>
              
              <TabsContent value="gdrive" className="space-y-4">
                <div>
                  <Label htmlFor="gdrive-input">Google Drive Link</Label>
                  <Input
                    id="gdrive-input"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://drive.google.com/file/d/..."
                  />
                </div>
                <Button onClick={handleGoogleDriveLink} className="w-full">
                  <Image className="h-4 w-4 mr-2" />
                  Add from Google Drive
                </Button>
                <div className="text-xs text-muted-foreground space-y-2">
                  <p><strong>Instructions:</strong></p>
                  <ol className="list-decimal list-inside space-y-1 text-xs">
                    <li>Open file in Google Drive</li>
                    <li>Click "Share" → "Change access"</li>
                    <li>Select "Anyone with the link"</li>
                    <li>Copy link and paste here</li>
                  </ol>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};