
import { useState } from 'react';
import { Mail, PlusCircle, Save, Send, Calendar, Clock } from 'lucide-react';
// import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import DataTable from '@/components/ui/DataTable';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data for email templates
type EmailTemplate = {
  id: string;
  name: string;
  subject: string;
  body: string;
  lastEdited: string;
};

type ScheduledEmail = {
  id: string;
  template: string;
  scheduledFor: string;
  status: 'pending' | 'sent' | 'failed';
  recipientCount: number;
  subject: string;
};

const mockTemplates: EmailTemplate[] = [
  {
    id: '1',
    name: 'Welcome Email',
    subject: 'Welcome to Our Travel Platform',
    body: '<p>Dear {{customer_name}},</p><p>Welcome to our travel platform. We are excited to have you on board!</p><p>Here are some quick links to get you started:</p><ul><li>Browse our <a href="#">bus services</a></li><li>Check out <a href="#">premium hotels</a></li><li>Explore <a href="#">taxi services</a></li></ul><p>Best regards,<br>The Travel Team</p>',
    lastEdited: '2023-08-15'
  },
  {
    id: '2',
    name: 'Special Offer',
    subject: '20% Off on Your Next Booking',
    body: '<p>Dear {{customer_name}},</p><p>We\'re excited to offer you a special 20% discount on your next booking!</p><p>Use coupon code: <strong>SPECIAL20</strong></p><p>Valid until {{expiry_date}}.</p><p>Best regards,<br>The Travel Team</p>',
    lastEdited: '2023-09-01'
  },
  {
    id: '3',
    name: 'Booking Confirmation',
    subject: 'Your Booking is Confirmed',
    body: '<p>Dear {{customer_name}},</p><p>Your booking has been confirmed. Here are the details:</p><p><strong>Booking ID:</strong> {{booking_id}}<br><strong>Service:</strong> {{service_type}}<br><strong>Date:</strong> {{booking_date}}<br><strong>Amount:</strong> ₹{{amount}}</p><p>Thank you for choosing us!</p><p>Best regards,<br>The Travel Team</p>',
    lastEdited: '2023-07-22'
  }
];

const mockScheduledEmails: ScheduledEmail[] = [
  {
    id: '1',
    template: 'Special Offer',
    subject: '20% Off on Your Next Booking',
    scheduledFor: '2023-12-25T10:00',
    status: 'pending',
    recipientCount: 1250
  },
  {
    id: '2',
    template: 'New Year Offer',
    subject: 'New Year Special Discounts',
    scheduledFor: '2023-12-31T09:00',
    status: 'pending',
    recipientCount: 3400
  },
  {
    id: '3',
    template: 'Summer Campaign',
    subject: 'Beat the Heat with Our Summer Offers',
    scheduledFor: '2023-05-01T08:00',
    status: 'sent',
    recipientCount: 2800
  }
];

const NotificationsManagement = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>(mockTemplates);
  const [scheduledEmails, setScheduledEmails] = useState<ScheduledEmail[]>(mockScheduledEmails);
  const [currentTemplate, setCurrentTemplate] = useState<EmailTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // New scheduled email state
  const [newScheduledEmail, setNewScheduledEmail] = useState<{
    templateId: string;
    scheduledFor: string;
    filterOptions: {
      allCustomers: boolean;
      activeCustomers: boolean;
      inactiveCustomers: boolean;
    }
  }>({
    templateId: '',
    scheduledFor: new Date().toISOString().split('.')[0].slice(0, 16),
    filterOptions: {
      allCustomers: true,
      activeCustomers: false,
      inactiveCustomers: false
    }
  });

  const handleEditTemplate = (template: EmailTemplate) => {
    setCurrentTemplate({ ...template });
    setIsEditing(true);
    setPreviewMode(false);
  };

  const handleCreateTemplate = () => {
    const newTemplate: EmailTemplate = {
      id: Date.now().toString(),
      name: '',
      subject: '',
      body: '<p>Write your email content here...</p>',
      lastEdited: new Date().toISOString().split('T')[0]
    };
    setCurrentTemplate(newTemplate);
    setIsEditing(true);
    setPreviewMode(false);
  };

  const handleSaveTemplate = () => {
    if (!currentTemplate?.name || !currentTemplate?.subject || !currentTemplate?.body) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const now = new Date().toISOString().split('T')[0];

    if (templates.some(t => t.id === currentTemplate.id)) {
      // Update existing template
      setTemplates(prev =>
        prev.map(t => t.id === currentTemplate.id ? { ...currentTemplate, lastEdited: now } : t)
      );
      toast({
        title: "Template Updated",
        description: `Template "${currentTemplate.name}" has been updated`,
      });
    } else {
      // Create new template
      setTemplates(prev => [...prev, { ...currentTemplate, lastEdited: now }]);
      toast({
        title: "Template Created",
        description: `New template "${currentTemplate.name}" has been created`,
      });
    }

    setIsEditing(false);
    setCurrentTemplate(null);
  };

  const handleScheduleEmail = (template: EmailTemplate) => {
    setNewScheduledEmail({
      ...newScheduledEmail,
      templateId: template.id
    });
    setIsScheduling(true);
  };

  const handleSaveScheduledEmail = () => {
    const template = templates.find(t => t.id === newScheduledEmail.templateId);

    if (!template) {
      toast({
        title: "Error",
        description: "Please select a template",
        variant: "destructive"
      });
      return;
    }

    const scheduledDate = new Date(newScheduledEmail.scheduledFor);
    const now = new Date();

    if (scheduledDate <= now) {
      toast({
        title: "Invalid Date",
        description: "Scheduled date must be in the future",
        variant: "destructive"
      });
      return;
    }

    const newEmail: ScheduledEmail = {
      id: Date.now().toString(),
      template: template.name,
      subject: template.subject,
      scheduledFor: newScheduledEmail.scheduledFor,
      status: 'pending',
      recipientCount: Math.floor(Math.random() * 3000) + 500 // Mock recipient count
    };

    setScheduledEmails(prev => [...prev, newEmail]);

    toast({
      title: "Email Scheduled",
      description: `Email has been scheduled for ${new Date(newScheduledEmail.scheduledFor).toLocaleString()}`,
    });

    setIsScheduling(false);
    setNewScheduledEmail({
      templateId: '',
      scheduledFor: new Date().toISOString().split('.')[0].slice(0, 16),
      filterOptions: {
        allCustomers: true,
        activeCustomers: false,
        inactiveCustomers: false
      }
    });
  };

  const handleCancelScheduledEmail = (id: string) => {
    setScheduledEmails(prev => prev.filter(email => email.id !== id));

    toast({
      title: "Email Cancelled",
      description: "Scheduled email has been cancelled",
    });
  };

  const handleTestSend = () => {
    if (!currentTemplate) return;

    toast({
      title: "Test Email Sent",
      description: "A test email has been sent to your address",
    });
  };

  // Template columns
  const templateColumns = [
    {
      key: 'name' as keyof EmailTemplate,
      header: 'Template Name'
    },
    {
      key: 'subject' as keyof EmailTemplate,
      header: 'Subject'
    },
    {
      key: 'lastEdited' as keyof EmailTemplate,
      header: 'Last Edited'
    },
    {
      key: 'actions' as string,
      header: 'Actions',
      render: (template: EmailTemplate) => (
        <div className="flex items-center space-x-2">
          <button
            className="action-button"
            onClick={() => handleEditTemplate(template)}
          >
            Edit
          </button>
          <button
            className="action-button bg-blue-50 text-blue-600"
            onClick={() => handleScheduleEmail(template)}
          >
            Schedule
          </button>
        </div>
      )
    }
  ];

  // Scheduled email columns
  const scheduledEmailColumns = [
    {
      key: 'template' as keyof ScheduledEmail,
      header: 'Template'
    },
    {
      key: 'subject' as keyof ScheduledEmail,
      header: 'Subject'
    },
    {
      key: 'recipientCount' as keyof ScheduledEmail,
      header: 'Recipients',
      render: (email: ScheduledEmail) => (
        <span>{email.recipientCount.toLocaleString()}</span>
      )
    },
    {
      key: 'scheduledFor' as keyof ScheduledEmail,
      header: 'Scheduled For',
      render: (email: ScheduledEmail) => (
        <span>{new Date(email.scheduledFor).toLocaleString()}</span>
      )
    },
    {
      key: 'status' as keyof ScheduledEmail,
      header: 'Status',
      render: (email: ScheduledEmail) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${email.status === 'sent' ? 'bg-green-100 text-green-800' :
            email.status === 'failed' ? 'bg-red-100 text-red-800' :
              'bg-blue-100 text-blue-800'
          }`}>
          {email.status === 'sent' ? 'Sent' :
            email.status === 'failed' ? 'Failed' :
              'Pending'}
        </span>
      )
    },
    {
      key: 'actions' as string,
      header: 'Actions',
      render: (email: ScheduledEmail) => (
        <div className="flex items-center space-x-2">
          {email.status === 'pending' && (
            <button
              className="action-button bg-red-50 text-red-600"
              onClick={() => handleCancelScheduledEmail(email.id)}
            >
              Cancel
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Notifications & Alerts</h1>
        </div>

        <Tabs defaultValue="templates" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="templates">Email Templates</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled Emails</TabsTrigger>
          </TabsList>

          <TabsContent value="templates">
            <div className="flex justify-end mb-4">
              <Button onClick={handleCreateTemplate} className="flex items-center gap-2">
                <PlusCircle size={16} /> Create Template
              </Button>
            </div>

            <DataTable
              columns={templateColumns}
              data={templates}
              keyExtractor={(item) => item.id}
              searchable={true}
            />
          </TabsContent>

          <TabsContent value="scheduled">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Schedule Overview</CardTitle>
                <CardDescription>Track your upcoming marketing campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-blue-600">Pending</p>
                    <p className="text-2xl font-bold text-blue-700">
                      {scheduledEmails.filter(e => e.status === 'pending').length}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-green-600">Sent</p>
                    <p className="text-2xl font-bold text-green-700">
                      {scheduledEmails.filter(e => e.status === 'sent').length}
                    </p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4">
                    <p className="text-sm text-red-600">Failed</p>
                    <p className="text-2xl font-bold text-red-700">
                      {scheduledEmails.filter(e => e.status === 'failed').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <DataTable
              columns={scheduledEmailColumns}
              data={scheduledEmails}
              keyExtractor={(item) => item.id}
              searchable={true}
            />
          </TabsContent>
        </Tabs>

        {/* Template Editor Dialog */}
        <Dialog open={isEditing} onOpenChange={(open) => {
          if (!open) {
            setIsEditing(false);
            setCurrentTemplate(null);
            setPreviewMode(false);
          }
        }}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {currentTemplate?.id && templates.some(t => t.id === currentTemplate.id)
                  ? 'Edit Email Template'
                  : 'Create Email Template'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {!previewMode ? (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Template Name</label>
                    <Input
                      value={currentTemplate?.name || ''}
                      onChange={(e) => setCurrentTemplate(prev => prev ? { ...prev, name: e.target.value } : null)}
                      placeholder="e.g. Welcome Email"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Subject Line</label>
                    <Input
                      value={currentTemplate?.subject || ''}
                      onChange={(e) => setCurrentTemplate(prev => prev ? { ...prev, subject: e.target.value } : null)}
                      placeholder="e.g. Welcome to Our Platform"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email Body</label>
                    <p className="text-xs text-gray-500 mb-2">
                      You can use HTML tags for formatting and these variables:
                      <code className="bg-gray-100 px-1 mx-1">{"{{customer_name}}"}</code>,
                      <code className="bg-gray-100 px-1 mx-1">{"{{booking_id}}"}</code>,
                      <code className="bg-gray-100 px-1 mx-1">{"{{amount}}"}</code>,
                      <code className="bg-gray-100 px-1 mx-1">{"{{expiry_date}}"}</code>
                    </p>
                    <Textarea
                      value={currentTemplate?.body || ''}
                      onChange={(e) => setCurrentTemplate(prev => prev ? { ...prev, body: e.target.value } : null)}
                      className="min-h-[300px] font-mono text-sm"
                    />
                  </div>
                </>
              ) : (
                <div className="border rounded-md p-4">
                  <div className="bg-gray-50 p-4 mb-4 rounded">
                    <p className="font-medium">Subject: {currentTemplate?.subject}</p>
                  </div>
                  <div className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: currentTemplate?.body || '' }}>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="flex justify-between items-center">
              <div>
                <Button
                  variant="outline"
                  onClick={() => setPreviewMode(!previewMode)}
                  className="mr-2"
                >
                  {previewMode ? 'Edit' : 'Preview'}
                </Button>
                {!previewMode && (
                  <Button
                    variant="outline"
                    onClick={handleTestSend}
                    className="flex items-center"
                  >
                    <Send size={16} className="mr-1" /> Test
                  </Button>
                )}
              </div>
              <div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setCurrentTemplate(null);
                    setPreviewMode(false);
                  }}
                  className="mr-2"
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveTemplate} className="flex items-center">
                  <Save size={16} className="mr-1" /> Save Template
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Schedule Email Dialog */}
        <Dialog open={isScheduling} onOpenChange={(open) => !open && setIsScheduling(false)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule Email Campaign</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Template</label>
                <Select
                  value={newScheduledEmail.templateId}
                  onValueChange={(value) =>
                    setNewScheduledEmail({ ...newScheduledEmail, templateId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Schedule Date and Time</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                    <Input
                      type="datetime-local"
                      value={newScheduledEmail.scheduledFor}
                      onChange={(e) =>
                        setNewScheduledEmail({ ...newScheduledEmail, scheduledFor: e.target.value })
                      }
                      className="pl-8"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2 border rounded-md p-4">
                <label className="text-sm font-medium block mb-2">Recipient Filters</label>

                <div className="flex items-center space-x-2 mb-2">
                  <Switch
                    id="all-customers"
                    checked={newScheduledEmail.filterOptions.allCustomers}
                    onCheckedChange={(checked) => {
                      setNewScheduledEmail({
                        ...newScheduledEmail,
                        filterOptions: {
                          allCustomers: checked,
                          activeCustomers: false,
                          inactiveCustomers: false
                        }
                      });
                    }}
                  />
                  <Label htmlFor="all-customers">All Customers</Label>
                </div>

                <div className="flex items-center space-x-2 mb-2">
                  <Switch
                    id="active-customers"
                    checked={newScheduledEmail.filterOptions.activeCustomers}
                    onCheckedChange={(checked) => {
                      setNewScheduledEmail({
                        ...newScheduledEmail,
                        filterOptions: {
                          allCustomers: false,
                          activeCustomers: checked,
                          inactiveCustomers: newScheduledEmail.filterOptions.inactiveCustomers
                        }
                      });
                    }}
                    disabled={newScheduledEmail.filterOptions.allCustomers}
                  />
                  <Label htmlFor="active-customers">Active Customers Only</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="inactive-customers"
                    checked={newScheduledEmail.filterOptions.inactiveCustomers}
                    onCheckedChange={(checked) => {
                      setNewScheduledEmail({
                        ...newScheduledEmail,
                        filterOptions: {
                          allCustomers: false,
                          activeCustomers: newScheduledEmail.filterOptions.activeCustomers,
                          inactiveCustomers: checked
                        }
                      });
                    }}
                    disabled={newScheduledEmail.filterOptions.allCustomers}
                  />
                  <Label htmlFor="inactive-customers">Inactive Customers</Label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsScheduling(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveScheduledEmail} className="flex items-center">
                <Clock size={16} className="mr-1" /> Schedule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default NotificationsManagement;
