
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Save, Building, Bell, Shield, Settings as SettingsIcon, Smartphone, Key, Globe, CreditCard, LineChart } from 'lucide-react';

const Settings = () => {
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "Travel Admin Platform",
    siteURL: "https://travel-admin.example.com",
    contactEmail: "support@travel-admin.example.com",
    contactPhone: "+91 9876543210",
    timezone: "Asia/Kolkata",
    dateFormat: "DD/MM/YYYY"
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    emailDigest: true,
    emailDigestFrequency: "daily",
    bookingConfirmations: true,
    marketingEmails: true
  });
  
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    passwordExpiryDays: 90,
    sessionTimeout: 30,
    loginAttempts: 5,
    strongPasswordPolicy: true,
    ipRestriction: false
  });
  
  const [paymentSettings, setPaymentSettings] = useState({
    currency: "INR",
    decimalPlaces: 2,
    displaySymbol: "₹",
    defaultPaymentMethod: "upi",
    autoInvoiceGeneration: true,
    taxPercentage: 18
  });

  const handleGeneralSettingChange = (field: keyof typeof generalSettings, value: string) => {
    setGeneralSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationSettingChange = (field: keyof typeof notificationSettings, value: any) => {
    setNotificationSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSecuritySettingChange = (field: keyof typeof securitySettings, value: any) => {
    setSecuritySettings(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentSettingChange = (field: keyof typeof paymentSettings, value: any) => {
    setPaymentSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveSettings = (settingType: string) => {
    toast({
      title: "Settings Saved",
      description: `${settingType} settings have been updated successfully.`,
    });
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-6 flex flex-wrap">
            <TabsTrigger value="general" className="flex items-center">
              <Building size={16} className="mr-2" /> General
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center">
              <Bell size={16} className="mr-2" /> Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center">
              <Shield size={16} className="mr-2" /> Security
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex items-center">
              <CreditCard size={16} className="mr-2" /> Payment
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center">
              <Key size={16} className="mr-2" /> API Keys
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center">
              <SettingsIcon size={16} className="mr-2" /> System
            </TabsTrigger>
          </TabsList>
          
          {/* General Settings */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Configure your site's general information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      value={generalSettings.siteName}
                      onChange={(e) => handleGeneralSettingChange('siteName', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="siteURL">Site URL</Label>
                    <Input
                      id="siteURL"
                      value={generalSettings.siteURL}
                      onChange={(e) => handleGeneralSettingChange('siteURL', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={generalSettings.contactEmail}
                      onChange={(e) => handleGeneralSettingChange('contactEmail', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input
                      id="contactPhone"
                      value={generalSettings.contactPhone}
                      onChange={(e) => handleGeneralSettingChange('contactPhone', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={generalSettings.timezone}
                      onValueChange={(value) => handleGeneralSettingChange('timezone', value)}
                    >
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Kolkata">Asia/Kolkata (GMT+5:30)</SelectItem>
                        <SelectItem value="America/New_York">America/New_York (GMT-4)</SelectItem>
                        <SelectItem value="Europe/London">Europe/London (GMT+1)</SelectItem>
                        <SelectItem value="Australia/Sydney">Australia/Sydney (GMT+10)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <Select
                      value={generalSettings.dateFormat}
                      onValueChange={(value) => handleGeneralSettingChange('dateFormat', value)}
                    >
                      <SelectTrigger id="dateFormat">
                        <SelectValue placeholder="Select date format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button
                    onClick={() => handleSaveSettings('General')}
                    className="flex items-center"
                  >
                    <Save size={16} className="mr-1" /> Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Notifications Settings */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure how and when notifications are sent.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Notification Channels</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="emailNotifications" className="flex-1">Email Notifications</Label>
                      <Switch
                        id="emailNotifications"
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={(checked) => 
                          handleNotificationSettingChange('emailNotifications', checked)
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="smsNotifications" className="flex-1">SMS Notifications</Label>
                      <Switch
                        id="smsNotifications"
                        checked={notificationSettings.smsNotifications}
                        onCheckedChange={(checked) => 
                          handleNotificationSettingChange('smsNotifications', checked)
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="pushNotifications" className="flex-1">Push Notifications</Label>
                      <Switch
                        id="pushNotifications"
                        checked={notificationSettings.pushNotifications}
                        onCheckedChange={(checked) => 
                          handleNotificationSettingChange('pushNotifications', checked)
                        }
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Email Settings</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="emailDigest" className="flex-1">Email Digest</Label>
                      <Switch
                        id="emailDigest"
                        checked={notificationSettings.emailDigest}
                        onCheckedChange={(checked) => 
                          handleNotificationSettingChange('emailDigest', checked)
                        }
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="emailDigestFrequency" className="w-40">Digest Frequency</Label>
                      <Select
                        value={notificationSettings.emailDigestFrequency}
                        onValueChange={(value) => 
                          handleNotificationSettingChange('emailDigestFrequency', value)
                        }
                        disabled={!notificationSettings.emailDigest}
                      >
                        <SelectTrigger id="emailDigestFrequency">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Notification Types</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="bookingConfirmations" className="flex-1">Booking Confirmations</Label>
                      <Switch
                        id="bookingConfirmations"
                        checked={notificationSettings.bookingConfirmations}
                        onCheckedChange={(checked) => 
                          handleNotificationSettingChange('bookingConfirmations', checked)
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="marketingEmails" className="flex-1">Marketing Emails</Label>
                      <Switch
                        id="marketingEmails"
                        checked={notificationSettings.marketingEmails}
                        onCheckedChange={(checked) => 
                          handleNotificationSettingChange('marketingEmails', checked)
                        }
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button
                    onClick={() => handleSaveSettings('Notification')}
                    className="flex items-center"
                  >
                    <Save size={16} className="mr-1" /> Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Security Settings */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Configure security options for your platform.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="twoFactorAuth" className="flex-1">Two Factor Authentication</Label>
                    <Switch
                      id="twoFactorAuth"
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={(checked) => 
                        handleSecuritySettingChange('twoFactorAuth', checked)
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="strongPasswordPolicy" className="flex-1">Strong Password Policy</Label>
                    <Switch
                      id="strongPasswordPolicy"
                      checked={securitySettings.strongPasswordPolicy}
                      onCheckedChange={(checked) => 
                        handleSecuritySettingChange('strongPasswordPolicy', checked)
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="ipRestriction" className="flex-1">IP Restriction</Label>
                    <Switch
                      id="ipRestriction"
                      checked={securitySettings.ipRestriction}
                      onCheckedChange={(checked) => 
                        handleSecuritySettingChange('ipRestriction', checked)
                      }
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                    <div className="space-y-2">
                      <Label htmlFor="passwordExpiryDays">Password Expiry (Days)</Label>
                      <Input
                        id="passwordExpiryDays"
                        type="number"
                        value={securitySettings.passwordExpiryDays}
                        onChange={(e) => handleSecuritySettingChange('passwordExpiryDays', parseInt(e.target.value))}
                        min={0}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout">Session Timeout (Minutes)</Label>
                      <Input
                        id="sessionTimeout"
                        type="number"
                        value={securitySettings.sessionTimeout}
                        onChange={(e) => handleSecuritySettingChange('sessionTimeout', parseInt(e.target.value))}
                        min={5}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="loginAttempts">Max Login Attempts</Label>
                      <Input
                        id="loginAttempts"
                        type="number"
                        value={securitySettings.loginAttempts}
                        onChange={(e) => handleSecuritySettingChange('loginAttempts', parseInt(e.target.value))}
                        min={1}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button
                    onClick={() => handleSaveSettings('Security')}
                    className="flex items-center"
                  >
                    <Save size={16} className="mr-1" /> Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Payment Settings */}
          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle>Payment Settings</CardTitle>
                <CardDescription>Configure payment options and display preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={paymentSettings.currency}
                      onValueChange={(value) => handlePaymentSettingChange('currency', value)}
                    >
                      <SelectTrigger id="currency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INR">Indian Rupee (INR)</SelectItem>
                        <SelectItem value="USD">US Dollar (USD)</SelectItem>
                        <SelectItem value="EUR">Euro (EUR)</SelectItem>
                        <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="displaySymbol">Currency Symbol</Label>
                    <Input
                      id="displaySymbol"
                      value={paymentSettings.displaySymbol}
                      onChange={(e) => handlePaymentSettingChange('displaySymbol', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="decimalPlaces">Decimal Places</Label>
                    <Input
                      id="decimalPlaces"
                      type="number"
                      value={paymentSettings.decimalPlaces}
                      onChange={(e) => handlePaymentSettingChange('decimalPlaces', parseInt(e.target.value))}
                      min={0}
                      max={4}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="taxPercentage">Tax Percentage</Label>
                    <Input
                      id="taxPercentage"
                      type="number"
                      value={paymentSettings.taxPercentage}
                      onChange={(e) => handlePaymentSettingChange('taxPercentage', parseInt(e.target.value))}
                      min={0}
                      max={100}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="defaultPaymentMethod">Default Payment Method</Label>
                    <Select
                      value={paymentSettings.defaultPaymentMethod}
                      onValueChange={(value) => handlePaymentSettingChange('defaultPaymentMethod', value)}
                    >
                      <SelectTrigger id="defaultPaymentMethod">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="credit_card">Credit Card</SelectItem>
                        <SelectItem value="debit_card">Debit Card</SelectItem>
                        <SelectItem value="upi">UPI</SelectItem>
                        <SelectItem value="net_banking">Net Banking</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4">
                  <Label htmlFor="autoInvoiceGeneration" className="flex-1">Auto-generate Invoices</Label>
                  <Switch
                    id="autoInvoiceGeneration"
                    checked={paymentSettings.autoInvoiceGeneration}
                    onCheckedChange={(checked) => 
                      handlePaymentSettingChange('autoInvoiceGeneration', checked)
                    }
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button
                    onClick={() => handleSaveSettings('Payment')}
                    className="flex items-center"
                  >
                    <Save size={16} className="mr-1" /> Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* API Keys */}
          <TabsContent value="api">
            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>Manage API keys for external integrations.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="p-4 border rounded-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Production API Key</h3>
                        <p className="text-sm text-gray-500">For live integrations</p>
                      </div>
                      <Button variant="outline" size="sm">Regenerate</Button>
                    </div>
                    <div className="mt-2 bg-gray-50 p-2 rounded-md flex justify-between items-center">
                      <code className="text-sm truncate max-w-[300px] sm:max-w-[500px]">
                        sk_live_*****************************abcd
                      </code>
                      <Button variant="ghost" size="sm">Show</Button>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Test API Key</h3>
                        <p className="text-sm text-gray-500">For testing and development</p>
                      </div>
                      <Button variant="outline" size="sm">Regenerate</Button>
                    </div>
                    <div className="mt-2 bg-gray-50 p-2 rounded-md flex justify-between items-center">
                      <code className="text-sm truncate max-w-[300px] sm:max-w-[500px]">
                        sk_test_*****************************wxyz
                      </code>
                      <Button variant="ghost" size="sm">Show</Button>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Webhook Secret</h3>
                        <p className="text-sm text-gray-500">For verifying webhook signatures</p>
                      </div>
                      <Button variant="outline" size="sm">Regenerate</Button>
                    </div>
                    <div className="mt-2 bg-gray-50 p-2 rounded-md flex justify-between items-center">
                      <code className="text-sm truncate max-w-[300px] sm:max-w-[500px]">
                        whsec_*****************************1234
                      </code>
                      <Button variant="ghost" size="sm">Show</Button>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button
                    onClick={() => handleSaveSettings('API')}
                    className="flex items-center"
                  >
                    <Save size={16} className="mr-1" /> Save API Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* System Settings */}
          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure system performance and maintenance options.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Performance</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cacheLifetime">Cache Lifetime (hours)</Label>
                      <Input id="cacheLifetime" type="number" defaultValue={24} min={1} />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="requestTimeout">Request Timeout (seconds)</Label>
                      <Input id="requestTimeout" type="number" defaultValue={30} min={5} />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Database</h3>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="automaticBackup" className="flex-1">Automatic Database Backup</Label>
                    <Switch id="automaticBackup" defaultChecked={true} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="backupFrequency">Backup Frequency</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger id="backupFrequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Maintenance</h3>
                  <div className="flex justify-between gap-4">
                    <Button variant="outline" className="flex-1">Clear Cache</Button>
                    <Button variant="outline" className="flex-1">Optimize Database</Button>
                    <Button variant="outline" className="flex-1">Run Diagnostics</Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Error Logging</h3>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableErrorLogging" className="flex-1">Enable Detailed Error Logging</Label>
                    <Switch id="enableErrorLogging" defaultChecked={true} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="logRetention">Log Retention (days)</Label>
                    <Input id="logRetention" type="number" defaultValue={30} min={1} />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button
                    onClick={() => handleSaveSettings('System')}
                    className="flex items-center"
                  >
                    <Save size={16} className="mr-1" /> Save System Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
