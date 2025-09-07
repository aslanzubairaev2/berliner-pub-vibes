import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

export const ApiDocumentation = () => {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied',
      description: 'Code copied to clipboard'
    });
  };

  const curlExample = `curl -X POST https://hizfxcxcegckhswmsaui.supabase.co/functions/v1/news-api \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -d '{
    "title_de": "Neue Speisekarte verfügbar",
    "title_en": "New Menu Available",
    "excerpt_de": "Wir haben unsere Speisekarte aktualisiert...",
    "excerpt_en": "We have updated our menu...",
    "content_de": "Vollständiger Artikel auf Deutsch...",
    "content_en": "Full article in English...",
    "category": "menu",
    "image_url": "https://example.com/image.jpg",
    "read_time": 3,
    "author_name": "Restaurant Team",
    "is_published": true
  }'`;

  const jsExample = `// Using fetch API
const response = await fetch('https://hizfxcxcegckhswmsaui.supabase.co/functions/v1/news-api', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'YOUR_API_KEY'
  },
  body: JSON.stringify({
    title_de: "Neue Speisekarte verfügbar",
    title_en: "New Menu Available",
    excerpt_de: "Wir haben unsere Speisekarte aktualisiert...",
    excerpt_en: "We have updated our menu...",
    content_de: "Vollständiger Artikel auf Deutsch...",
    content_en: "Full article in English...",
    category: "menu",
    image_url: "https://example.com/image.jpg",
    read_time: 3,
    author_name: "Restaurant Team",
    is_published: true
  })
});

const data = await response.json();
console.log(data);`;

  const pythonExample = `import requests

url = "https://hizfxcxcegckhswmsaui.supabase.co/functions/v1/news-api"
headers = {
    "Content-Type": "application/json",
    "x-api-key": "YOUR_API_KEY"
}

payload = {
    "title_de": "Neue Speisekarte verfügbar",
    "title_en": "New Menu Available",
    "excerpt_de": "Wir haben unsere Speisekarte aktualisiert...",
    "excerpt_en": "We have updated our menu...",
    "content_de": "Vollständiger Artikel auf Deutsch...",
    "content_en": "Full article in English...",
    "category": "menu",
    "image_url": "https://example.com/image.jpg",
    "read_time": 3,
    "author_name": "Restaurant Team",
    "is_published": True
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Code className="mr-2 h-5 w-5" />
            API Documentation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Endpoint</h3>
              <div className="bg-muted p-3 rounded-lg font-mono text-sm flex items-center justify-between">
                <span>POST https://hizfxcxcegckhswmsaui.supabase.co/functions/v1/news-api</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard('https://hizfxcxcegckhswmsaui.supabase.co/functions/v1/news-api')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Authentication</h3>
              <p className="text-muted-foreground mb-2">
                Include your API key in the request headers:
              </p>
              <div className="bg-muted p-3 rounded-lg font-mono text-sm">
                x-api-key: YOUR_API_KEY
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Request Body</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Required Fields:</h4>
                    <ul className="space-y-1 text-sm">
                      <li><Badge variant="outline">title_de</Badge> - German title</li>
                      <li><Badge variant="outline">title_en</Badge> - English title</li>
                      <li><Badge variant="outline">excerpt_de</Badge> - German excerpt</li>
                      <li><Badge variant="outline">excerpt_en</Badge> - English excerpt</li>
                      <li><Badge variant="outline">content_de</Badge> - German content</li>
                      <li><Badge variant="outline">content_en</Badge> - English content</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Optional Fields:</h4>
                    <ul className="space-y-1 text-sm">
                      <li><Badge variant="secondary">category</Badge> - events, menu, general</li>
                      <li><Badge variant="secondary">image_url</Badge> - Article image URL</li>
                      <li><Badge variant="secondary">read_time</Badge> - Reading time in minutes</li>
                      <li><Badge variant="secondary">author_name</Badge> - Author name</li>
                      <li><Badge variant="secondary">is_published</Badge> - Publish immediately</li>
                      <li><Badge variant="secondary">slug</Badge> - Custom URL slug</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Response Codes</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Badge variant="default">201</Badge>
                  <span className="text-sm">News article created successfully</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="destructive">400</Badge>
                  <span className="text-sm">Bad request - missing required fields</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="destructive">401</Badge>
                  <span className="text-sm">Unauthorized - invalid API key</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="destructive">403</Badge>
                  <span className="text-sm">Forbidden - insufficient permissions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="destructive">429</Badge>
                  <span className="text-sm">Rate limit exceeded</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Code Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="curl" className="space-y-4">
            <TabsList>
              <TabsTrigger value="curl">cURL</TabsTrigger>
              <TabsTrigger value="javascript">JavaScript</TabsTrigger>
              <TabsTrigger value="python">Python</TabsTrigger>
            </TabsList>

            <TabsContent value="curl">
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{curlExample}</code>
                </pre>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(curlExample)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="javascript">
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{jsExample}</code>
                </pre>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(jsExample)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="python">
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{pythonExample}</code>
                </pre>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(pythonExample)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};