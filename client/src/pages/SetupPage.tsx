import { useState, useMemo } from 'react';
import { Car, CheckCircle, XCircle, Eye, EyeOff, AlertCircle, Info } from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

interface FormData {
  appUrl: string;
  serverPort: number;
  clientPort: number;
  dbMode: 'local' | 'external';
  dbHost: string;
  dbPort: number;
  dbName: string;
  dbUser: string;
  dbPassword: string;
  dbSslMode: string;
  adminEmail: string;
  adminPassword: string;
  adminPasswordConfirm: string;
  adminName: string;
}

type PasswordStrength = 'weak' | 'medium' | 'strong';

const calculatePasswordStrength = (password: string): PasswordStrength => {
  if (password.length < 8) return 'weak';
  
  let strength = 0;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;
  
  if (strength <= 2) return 'weak';
  if (strength <= 4) return 'medium';
  return 'strong';
};

export default function SetupPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    appUrl: 'http://localhost:5173',
    serverPort: 4000,
    clientPort: 5173,
    dbMode: 'local',
    dbHost: '',
    dbPort: 5432,
    dbName: '',
    dbUser: '',
    dbPassword: '',
    dbSslMode: 'prefer',
    adminEmail: '',
    adminPassword: '',
    adminPasswordConfirm: '',
    adminName: 'Administrator'
  });

  const passwordStrength = useMemo(
    () => calculatePasswordStrength(formData.adminPassword),
    [formData.adminPassword]
  );

  const passwordsMatch = formData.adminPassword === formData.adminPasswordConfirm;
  const isPasswordValid = formData.adminPassword.length >= 8 && passwordsMatch;

  const handleTestConnection = async () => {
    if (formData.dbMode === 'local') {
      toast({
        title: 'Local Database',
        description: 'Using local database configuration. No test needed.',
      });
      return;
    }

    // Validate required fields
    if (!formData.dbHost || !formData.dbName || !formData.dbUser) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all database connection fields',
        variant: 'destructive',
      });
      return;
    }

    setTestingConnection(true);
    setConnectionStatus('idle');

    try {
      await api.setup.testDb({
        dbHost: formData.dbHost.trim(),
        dbPort: formData.dbPort,
        dbName: formData.dbName.trim(),
        dbUser: formData.dbUser.trim(),
        dbPassword: formData.dbPassword,
        dbSslMode: formData.dbSslMode,
      });
      setConnectionStatus('success');
      toast({
        title: 'Connection Successful',
        description: 'Successfully connected to the database',
      });
    } catch (error) {
      setConnectionStatus('error');
      toast({
        title: 'Connection Failed',
        description: error instanceof Error ? error.message : 'Failed to connect to database',
        variant: 'destructive',
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords match
    if (!passwordsMatch) {
      toast({
        title: 'Password Mismatch',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    // Validate password strength
    if (passwordStrength === 'weak') {
      toast({
        title: 'Weak Password',
        description: 'Please use a stronger password (at least 8 characters with mixed case, numbers, and symbols)',
        variant: 'destructive',
      });
      return;
    }

    // Validate external DB connection if needed
    if (formData.dbMode === 'external' && connectionStatus !== 'success') {
      toast({
        title: 'Database Not Tested',
        description: 'Please test the database connection before proceeding',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Clean data before sending
      const cleanData = {
        ...formData,
        appUrl: formData.appUrl.trim(),
        adminEmail: formData.adminEmail.trim().toLowerCase(),
        adminName: formData.adminName.trim(),
        dbHost: formData.dbHost.trim(),
        dbName: formData.dbName.trim(),
        dbUser: formData.dbUser.trim(),
      };

      await api.setup.save(cleanData);
      
      toast({
        title: 'Setup Complete',
        description: 'Redirecting to home page...',
      });

      // Clear sensitive data from memory
      setFormData({
        ...formData,
        adminPassword: '',
        adminPasswordConfirm: '',
        dbPassword: '',
      });

      // Reload the page to clear setup state and show main app
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } catch (error) {
      toast({
        title: 'Setup Failed',
        description: error instanceof Error ? error.message : 'Failed to complete setup',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Car className="h-12 w-12" />
          </div>
          <CardTitle className="text-3xl">Welcome to Car Rental</CardTitle>
          <CardDescription>
            Complete the setup to get started with your car rental application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Application Settings</h3>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Info className="h-3 w-3" />
                  <span>Configure URLs and ports</span>
                </div>
              </div>
              
              <div>
                <Label htmlFor="appUrl">Application URL</Label>
                <Input
                  id="appUrl"
                  type="url"
                  value={formData.appUrl}
                  onChange={(e) => setFormData({ ...formData, appUrl: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="serverPort">Server Port</Label>
                  <Input
                    id="serverPort"
                    type="number"
                    value={formData.serverPort}
                    onChange={(e) => setFormData({ ...formData, serverPort: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="clientPort">Client Port</Label>
                  <Input
                    id="clientPort"
                    type="number"
                    value={formData.clientPort}
                    onChange={(e) => setFormData({ ...formData, clientPort: parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Database Configuration</h3>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Info className="h-3 w-3" />
                  <span>Choose your database setup</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Database Mode</Label>
                <div className="grid gap-3">
                  <label className="flex items-start space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors">
                    <input
                      type="radio"
                      name="dbMode"
                      value="local"
                      checked={formData.dbMode === 'local'}
                      onChange={(e) => {
                        setFormData({ ...formData, dbMode: e.target.value as 'local' | 'external' });
                        setConnectionStatus('idle');
                      }}
                      className="w-4 h-4 mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="font-medium">Local Database</div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Use the built-in PostgreSQL container (recommended for development)
                      </p>
                    </div>
                  </label>
                  <label className="flex items-start space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors">
                    <input
                      type="radio"
                      name="dbMode"
                      value="external"
                      checked={formData.dbMode === 'external'}
                      onChange={(e) => {
                        setFormData({ ...formData, dbMode: e.target.value as 'local' | 'external' });
                        setConnectionStatus('idle');
                      }}
                      className="w-4 h-4 mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="font-medium">External Database</div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Connect to an existing PostgreSQL database (recommended for production)
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {formData.dbMode === 'external' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dbHost">Database Host</Label>
                      <Input
                        id="dbHost"
                        type="text"
                        value={formData.dbHost}
                        onChange={(e) => setFormData({ ...formData, dbHost: e.target.value })}
                        placeholder="localhost"
                        required={formData.dbMode === 'external'}
                      />
                    </div>
                    <div>
                      <Label htmlFor="dbPort">Database Port</Label>
                      <Input
                        id="dbPort"
                        type="number"
                        value={formData.dbPort}
                        onChange={(e) => setFormData({ ...formData, dbPort: parseInt(e.target.value) })}
                        required={formData.dbMode === 'external'}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="dbName">Database Name</Label>
                    <Input
                      id="dbName"
                      type="text"
                      value={formData.dbName}
                      onChange={(e) => setFormData({ ...formData, dbName: e.target.value })}
                      placeholder="pern_demo"
                      required={formData.dbMode === 'external'}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dbUser">Database User</Label>
                      <Input
                        id="dbUser"
                        type="text"
                        value={formData.dbUser}
                        onChange={(e) => setFormData({ ...formData, dbUser: e.target.value })}
                        placeholder="postgres"
                        required={formData.dbMode === 'external'}
                      />
                    </div>
                    <div>
                      <Label htmlFor="dbPassword">Database Password</Label>
                      <Input
                        id="dbPassword"
                        type="password"
                        value={formData.dbPassword}
                        onChange={(e) => setFormData({ ...formData, dbPassword: e.target.value })}
                        required={formData.dbMode === 'external'}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="dbSslMode">SSL Mode</Label>
                    <select
                      id="dbSslMode"
                      value={formData.dbSslMode}
                      onChange={(e) => setFormData({ ...formData, dbSslMode: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="disable">Disable</option>
                      <option value="prefer">Prefer</option>
                      <option value="require">Require</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleTestConnection}
                      disabled={testingConnection}
                    >
                      {testingConnection ? 'Testing...' : 'Test Connection'}
                    </Button>
                    {connectionStatus === 'success' && (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">Connected</span>
                      </div>
                    )}
                    {connectionStatus === 'error' && (
                      <div className="flex items-center gap-1 text-red-600">
                        <XCircle className="h-4 w-4" />
                        <span className="text-sm">Failed</span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="border-t pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Administrator Account</h3>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Info className="h-3 w-3" />
                  <span>Required for system access</span>
                </div>
              </div>
              
              <div>
                <Label htmlFor="adminName">Full Name</Label>
                <Input
                  id="adminName"
                  type="text"
                  value={formData.adminName}
                  onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <Label htmlFor="adminEmail">Email Address</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  value={formData.adminEmail}
                  onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                  placeholder="admin@example.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="adminPassword">Password</Label>
                <div className="relative">
                  <Input
                    id="adminPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.adminPassword}
                    onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                    minLength={8}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {formData.adminPassword && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 text-xs">
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            passwordStrength === 'weak' ? 'bg-red-500 w-1/3' :
                            passwordStrength === 'medium' ? 'bg-yellow-500 w-2/3' :
                            'bg-green-500 w-full'
                          }`}
                        />
                      </div>
                      <span className={`font-medium ${
                        passwordStrength === 'weak' ? 'text-red-600' :
                        passwordStrength === 'medium' ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {passwordStrength === 'weak' && 'Weak'}
                        {passwordStrength === 'medium' && 'Medium'}
                        {passwordStrength === 'strong' && 'Strong'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Use 12+ characters with mixed case, numbers, and symbols for best security
                    </p>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="adminPasswordConfirm">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="adminPasswordConfirm"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.adminPasswordConfirm}
                    onChange={(e) => setFormData({ ...formData, adminPasswordConfirm: e.target.value })}
                    minLength={8}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {formData.adminPasswordConfirm && (
                  <div className="mt-1 flex items-center gap-1 text-xs">
                    {passwordsMatch ? (
                      <>
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span className="text-green-600">Passwords match</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-3 w-3 text-red-600" />
                        <span className="text-red-600">Passwords do not match</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="border-t pt-6">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading || !isPasswordValid || (formData.dbMode === 'external' && connectionStatus !== 'success')}
              >
                {loading ? 'Setting up...' : 'Complete Setup'}
              </Button>
              {!isPasswordValid && formData.adminPassword && (
                <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Please ensure passwords match and meet security requirements
                </p>
              )}
              {formData.dbMode === 'external' && connectionStatus !== 'success' && (
                <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Please test your database connection before proceeding
                </p>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
