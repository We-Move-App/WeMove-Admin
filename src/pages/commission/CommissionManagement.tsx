
import { useState } from 'react';
import { Plus, Percent, DollarSign } from 'lucide-react';
// import Layout from '@/components/layout/Layout';
import DataTable from '@/components/ui/DataTable';
import { Commission } from '@/types/admin';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

// Modified mock data to include commission type
const mockCommissions: Commission[] = [
  {
    id: "1",
    serviceType: "Bus",
    percentage: 10,
    fixedRate: null,
    commissionType: "percentage",
    effectiveFrom: "2023-01-01T00:00",
    effectiveTo: "2023-12-31T23:59",
    isActive: true
  },
  {
    id: "2",
    serviceType: "Hotel",
    percentage: 12,
    fixedRate: null,
    commissionType: "percentage",
    effectiveFrom: "2023-01-01T00:00",
    effectiveTo: "2023-12-31T23:59",
    isActive: true
  },
  {
    id: "3",
    serviceType: "Taxi",
    percentage: null,
    fixedRate: 50,
    commissionType: "fixed",
    effectiveFrom: "2023-01-01T00:00",
    effectiveTo: "2023-12-31T23:59",
    isActive: true
  },
  {
    id: "4",
    serviceType: "Bike",
    percentage: 8,
    fixedRate: null,
    commissionType: "percentage",
    effectiveFrom: "2023-01-01T00:00",
    effectiveTo: "2023-12-31T23:59",
    isActive: true
  }
];

const CommissionManagement = () => {
  const [commissions, setCommissions] = useState<Commission[]>(mockCommissions);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCommission, setCurrentCommission] = useState<Commission>({
    id: '',
    serviceType: 'Bus',
    percentage: 0,
    fixedRate: null,
    commissionType: 'percentage',
    effectiveFrom: new Date().toISOString().split('.')[0].slice(0, 16),
    effectiveTo: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('.')[0].slice(0, 16),
    isActive: true
  });

  const handleAddNew = () => {
    setIsEditing(false);
    setCurrentCommission({
      id: Date.now().toString(),
      serviceType: 'Bus',
      percentage: 0,
      fixedRate: null,
      commissionType: 'percentage',
      effectiveFrom: new Date().toISOString().split('.')[0].slice(0, 16),
      effectiveTo: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('.')[0].slice(0, 16),
      isActive: true
    });
    setIsDialogOpen(true);
  };

  const handleEditCommission = (commission: Commission) => {
    setIsEditing(true);
    setCurrentCommission({ ...commission });
    setIsDialogOpen(true);
  };

  const handleInputChange = (field: keyof Commission, value: any) => {
    setCurrentCommission(prev => ({ ...prev, [field]: value }));
  };

  const handleCommissionTypeChange = (type: 'percentage' | 'fixed') => {
    setCurrentCommission(prev => ({
      ...prev,
      commissionType: type,
      percentage: type === 'percentage' ? (prev.percentage || 0) : null,
      fixedRate: type === 'fixed' ? (prev.fixedRate || 0) : null
    }));
  };

  const handleSaveCommission = () => {
    // Validate the dates
    const startDate = new Date(currentCommission.effectiveFrom);
    const endDate = new Date(currentCommission.effectiveTo!);

    if (endDate <= startDate) {
      toast({
        title: "Invalid Date Range",
        description: "End date must be after start date",
        variant: "destructive"
      });
      return;
    }

    // Validate that either percentage or fixed rate is set based on commission type
    if (currentCommission.commissionType === 'percentage' &&
      (currentCommission.percentage === null || currentCommission.percentage <= 0)) {
      toast({
        title: "Invalid Commission",
        description: "Please enter a valid percentage greater than 0",
        variant: "destructive"
      });
      return;
    }

    if (currentCommission.commissionType === 'fixed' &&
      (currentCommission.fixedRate === null || currentCommission.fixedRate <= 0)) {
      toast({
        title: "Invalid Commission",
        description: "Please enter a valid fixed rate greater than 0",
        variant: "destructive"
      });
      return;
    }

    if (isEditing) {
      setCommissions(prev => prev.map(item => item.id === currentCommission.id ? currentCommission : item));
      toast({
        title: "Commission Updated",
        description: `${currentCommission.serviceType} commission updated successfully`,
      });
    } else {
      setCommissions(prev => [...prev, currentCommission]);
      toast({
        title: "Commission Added",
        description: `New ${currentCommission.serviceType} commission added successfully`,
      });
    }
    setIsDialogOpen(false);
  };

  const toggleCommissionStatus = (id: string) => {
    setCommissions(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, isActive: !item.isActive }
          : item
      )
    );

    const commission = commissions.find(c => c.id === id);
    if (commission) {
      toast({
        title: commission.isActive ? "Commission Deactivated" : "Commission Activated",
        description: `${commission.serviceType} commission has been ${commission.isActive ? 'deactivated' : 'activated'}.`,
      });
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const columns = [
    { key: 'serviceType' as keyof Commission, header: 'Service Type' },
    {
      key: 'commissionValue' as string,
      header: 'Commission',
      render: (commission: Commission) => (
        <div className="flex items-center">
          {commission.commissionType === 'percentage' ? (
            <span className="flex items-center">
              {commission.percentage}% <Percent size={14} className="ml-1 text-gray-500" />
            </span>
          ) : (
            <span className="flex items-center">
              ₹{commission.fixedRate} <DollarSign size={14} className="ml-1 text-gray-500" />
            </span>
          )}
        </div>
      )
    },
    {
      key: 'effectiveFrom' as keyof Commission,
      header: 'Effective From',
      render: (commission: Commission) => <span>{formatDateTime(commission.effectiveFrom)}</span>
    },
    {
      key: 'effectiveTo' as keyof Commission,
      header: 'Effective To',
      render: (commission: Commission) => <span>{commission.effectiveTo ? formatDateTime(commission.effectiveTo) : 'No End Date'}</span>
    },
    {
      key: 'isActive' as keyof Commission,
      header: 'Status',
      render: (commission: Commission) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${commission.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {commission.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'actions' as string,
      header: 'Actions',
      render: (commission: Commission) => (
        <div className="flex items-center space-x-2">
          <button
            className="action-button"
            onClick={() => handleEditCommission(commission)}
          >
            Edit
          </button>
          <button
            className={`action-button ${commission.isActive ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}
            onClick={() => toggleCommissionStatus(commission.id)}
          >
            {commission.isActive ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      )
    }
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Commission Management</h1>
        <Button
          onClick={handleAddNew}
          className="flex items-center gap-2"
        >
          <Plus size={16} /> Add New Commission
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={commissions}
        keyExtractor={(item) => item.id}
        searchable={false}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Edit Commission' : 'Add New Commission'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Service Type</label>
              <Select
                value={currentCommission.serviceType}
                onValueChange={(value: any) => handleInputChange('serviceType', value)}
                disabled={isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bus">Bus</SelectItem>
                  <SelectItem value="Hotel">Hotel</SelectItem>
                  <SelectItem value="Taxi">Taxi</SelectItem>
                  <SelectItem value="Bike">Bike</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Commission Type</label>
              <RadioGroup
                value={currentCommission.commissionType}
                onValueChange={(value) => handleCommissionTypeChange(value as 'percentage' | 'fixed')}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="percentage" id="percentage" />
                  <Label htmlFor="percentage" className="flex items-center">
                    <Percent size={16} className="mr-1" /> Percentage
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fixed" id="fixed" />
                  <Label htmlFor="fixed" className="flex items-center">
                    <DollarSign size={16} className="mr-1" /> Fixed Rate
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {currentCommission.commissionType === 'percentage' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Commission Percentage</label>
                <div className="relative">
                  <Input
                    type="number"
                    value={currentCommission.percentage !== null ? currentCommission.percentage : 0}
                    onChange={(e) => handleInputChange('percentage', parseFloat(e.target.value) || 0)}
                    className="pr-8"
                    min={0}
                    max={100}
                  />
                  <Percent className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                </div>
              </div>
            )}

            {currentCommission.commissionType === 'fixed' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Fixed Rate (₹)</label>
                <div className="relative">
                  <Input
                    type="number"
                    value={currentCommission.fixedRate !== null ? currentCommission.fixedRate : 0}
                    onChange={(e) => handleInputChange('fixedRate', parseFloat(e.target.value) || 0)}
                    className="pl-8"
                    min={0}
                  />
                  <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date and Time</label>
              <Input
                type="datetime-local"
                value={currentCommission.effectiveFrom}
                onChange={(e) => handleInputChange('effectiveFrom', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">End Date and Time</label>
              <Input
                type="datetime-local"
                value={currentCommission.effectiveTo}
                onChange={(e) => handleInputChange('effectiveTo', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={currentCommission.isActive ? "active" : "inactive"}
                onValueChange={(value) => handleInputChange('isActive', value === "active")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveCommission}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CommissionManagement;
