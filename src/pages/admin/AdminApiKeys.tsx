import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Eye, EyeOff, Plus, MoreHorizontal, Activity, Key, FileText } from 'lucide-react';
import { useApiKeys } from '@/hooks/useApiKeys';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ApiDocumentation } from '@/components/admin/ApiDocumentation';

export default function AdminApiKeys() {
  const { apiKeys, apiLogs, loading, createApiKey, updateApiKey, deleteApiKey, toggleApiKey, fetchApiLogs } = useApiKeys();
  const { toast } = useToast();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedApiKeyId, setSelectedApiKeyId] = useState<string | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    key_name: '',
    permissions: ['news:create'],
    rate_limit: 100,
    expires_at: ''
  });

  const handleCreateApiKey = async () => {
    if (!formData.key_name.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a key name',
        variant: 'destructive'
      });
      return;
    }

    const keyData = {
      ...formData,
      expires_at: formData.expires_at || null
    };

    const { error } = await createApiKey(keyData);
    
    if (!error) {
      toast({
        title: 'Success',
        description: 'API key created successfully'
      });
      setIsCreateModalOpen(false);
      setFormData({
        key_name: '',
        permissions: ['news:create'],
        rate_limit: 100,
        expires_at: ''
      });
    } else {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive'
      });
    }
  };

  const handleToggleKey = async (id: string, isActive: boolean) => {
    const { error } = await toggleApiKey(id, !isActive);
    if (!error) {
      toast({
        title: 'Success',
        description: `API key ${!isActive ? 'activated' : 'deactivated'} successfully`
      });
    } else {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive'
      });
    }
  };

  const handleDeleteKey = async (id: string) => {
    if (confirm('Are you sure you want to delete this API key?')) {
      const { error } = await deleteApiKey(id);
      if (!error) {
        toast({
          title: 'Success',
          description: 'API key deleted successfully'
        });
      } else {
        toast({
          title: 'Error',
          description: error,
          variant: 'destructive'
        });
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied',
      description: 'API key copied to clipboard'
    });
  };

  const toggleKeyVisibility = (id: string) => {
    const newVisibleKeys = new Set(visibleKeys);
    if (newVisibleKeys.has(id)) {
      newVisibleKeys.delete(id);
    } else {
      newVisibleKeys.add(id);
    }
    setVisibleKeys(newVisibleKeys);
  };

  const formatApiKey = (apiKey: string, isVisible: boolean) => {
    if (isVisible) return apiKey;
    return apiKey.substring(0, 8) + '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••';
  };

  const handleViewLogs = (apiKeyId: string) => {
    setSelectedApiKeyId(apiKeyId);
    fetchApiLogs(apiKeyId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">API Keys Management</h1>
          <p className="text-muted-foreground">Manage API keys for third-party applications</p>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create API Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New API Key</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="key_name">Key Name</Label>
                <Input
                  id="key_name"
                  value={formData.key_name}
                  onChange={(e) => setFormData({ ...formData, key_name: e.target.value })}
                  placeholder="Enter a descriptive name"
                />
              </div>
              
              <div>
                <Label htmlFor="rate_limit">Rate Limit (requests per hour)</Label>
                <Input
                  id="rate_limit"
                  type="number"
                  value={formData.rate_limit}
                  onChange={(e) => setFormData({ ...formData, rate_limit: parseInt(e.target.value) })}
                />
              </div>
              
              <div>
                <Label htmlFor="expires_at">Expiration Date (optional)</Label>
                <Input
                  id="expires_at"
                  type="datetime-local"
                  value={formData.expires_at}
                  onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateApiKey}>
                  Create Key
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="keys" className="space-y-4">
        <TabsList>
          <TabsTrigger value="keys">
            <Key className="mr-2 h-4 w-4" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="documentation">
            <FileText className="mr-2 h-4 w-4" />
            Documentation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="keys">
          <Card>
            <CardHeader>
              <CardTitle>Active API Keys</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div>Loading...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>API Key</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Rate Limit</TableHead>
                      <TableHead>Last Used</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apiKeys.map((key) => (
                      <TableRow key={key.id}>
                        <TableCell className="font-medium">{key.key_name}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <code className="text-sm bg-muted px-2 py-1 rounded">
                              {formatApiKey(key.api_key, visibleKeys.has(key.id))}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleKeyVisibility(key.id)}
                            >
                              {visibleKeys.has(key.id) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(key.api_key)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={key.is_active ? "default" : "secondary"}>
                            {key.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>{key.rate_limit}/hour</TableCell>
                        <TableCell>
                          {key.last_used ? new Date(key.last_used).toLocaleDateString() : 'Never'}
                        </TableCell>
                        <TableCell>{new Date(key.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewLogs(key.id)}>
                                View Logs
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleKey(key.id, key.is_active)}>
                                {key.is_active ? 'Deactivate' : 'Activate'}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleDeleteKey(key.id)}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>API Request Logs</CardTitle>
              {selectedApiKeyId && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedApiKeyId(null);
                    fetchApiLogs();
                  }}
                >
                  Show All Logs
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Endpoint</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{new Date(log.created_at).toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.method}</Badge>
                      </TableCell>
                      <TableCell>{log.endpoint}</TableCell>
                      <TableCell>
                        <Badge variant={log.response_status < 400 ? "default" : "destructive"}>
                          {log.response_status}
                        </Badge>
                      </TableCell>
                      <TableCell>{log.ip_address || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documentation">
          <ApiDocumentation />
        </TabsContent>
      </Tabs>
    </div>
  );
}