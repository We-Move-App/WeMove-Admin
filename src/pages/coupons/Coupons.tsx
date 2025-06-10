
import { useState } from 'react';
import { Plus, Tag, Percent, DollarSign } from 'lucide-react';
// import Layout from '@/components/layout/Layout';
import DataTable from '@/components/ui/DataTable';
import { Coupon } from '@/types/admin';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

// Modified mock data for coupons to include discount type
const mockCoupons: Coupon[] = [
  {
    id: "1",
    name: "WELCOME10",
    code: "WELCOME10",
    serviceType: "All",
    discountType: "percentage",
    discountPercentage: 10,
    discountAmount: null,
    startDate: "2023-06-01T00:00",
    expiryDate: "2023-12-31T23:59",
    isActive: true
  },
  {
    id: "2",
    name: "SUMMER20",
    code: "SUMMER20",
    serviceType: "Hotel",
    discountType: "percentage",
    discountPercentage: 20,
    discountAmount: null,
    startDate: "2023-05-01T00:00",
    expiryDate: "2023-09-30T23:59",
    isActive: true
  },
  {
    id: "3",
    name: "RIDE15",
    code: "RIDE15",
    serviceType: "Taxi",
    discountType: "percentage",
    discountPercentage: 15,
    discountAmount: null,
    startDate: "2023-07-01T00:00",
    expiryDate: "2023-10-15T23:59",
    isActive: true
  },
  {
    id: "4",
    name: "BUS100",
    code: "BUS100",
    serviceType: "Bus",
    discountType: "fixed",
    discountPercentage: null,
    discountAmount: 100,
    startDate: "2023-06-15T00:00",
    expiryDate: "2023-11-30T23:59",
    isActive: false
  }
];

const Coupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState<Coupon>({
    id: '',
    name: '',
    code: '',
    serviceType: 'All',
    discountType: 'percentage',
    discountPercentage: 0,
    discountAmount: null,
    startDate: new Date().toISOString().split('.')[0].slice(0, 16),
    expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('.')[0].slice(0, 16),
    isActive: true
  });

  const handleAddNew = () => {
    setIsEditing(false);
    setCurrentCoupon({
      id: Date.now().toString(),
      name: '',
      code: '',
      serviceType: 'All',
      discountType: 'percentage',
      discountPercentage: 0,
      discountAmount: null,
      startDate: new Date().toISOString().split('.')[0].slice(0, 16),
      expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('.')[0].slice(0, 16),
      isActive: true
    });
    setIsDialogOpen(true);
  };

  const handleEditCoupon = (coupon: Coupon) => {
    setIsEditing(true);
    setCurrentCoupon({ ...coupon });
    setIsDialogOpen(true);
  };

  const handleInputChange = (field: keyof Coupon, value: any) => {
    setCurrentCoupon(prev => ({ ...prev, [field]: value }));
  };

  const handleDiscountTypeChange = (type: 'percentage' | 'fixed') => {
    setCurrentCoupon(prev => ({
      ...prev,
      discountType: type,
      discountPercentage: type === 'percentage' ? (prev.discountPercentage || 0) : null,
      discountAmount: type === 'fixed' ? (prev.discountAmount || 0) : null
    }));
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

  const handleSaveCoupon = () => {
    // Validate form
    if (!currentCoupon.name || !currentCoupon.code) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Validate discount values
    if (currentCoupon.discountType === 'percentage' &&
      (currentCoupon.discountPercentage === null || currentCoupon.discountPercentage <= 0)) {
      toast({
        title: "Invalid Discount",
        description: "Please enter a valid percentage greater than 0",
        variant: "destructive"
      });
      return;
    }

    if (currentCoupon.discountType === 'fixed' &&
      (currentCoupon.discountAmount === null || currentCoupon.discountAmount <= 0)) {
      toast({
        title: "Invalid Discount",
        description: "Please enter a valid discount amount greater than 0",
        variant: "destructive"
      });
      return;
    }

    // Validate the dates
    const startDate = new Date(currentCoupon.startDate!);
    const endDate = new Date(currentCoupon.expiryDate);

    if (endDate <= startDate) {
      toast({
        title: "Invalid Date Range",
        description: "Expiry date must be after start date",
        variant: "destructive"
      });
      return;
    }

    if (isEditing) {
      setCoupons(prev => prev.map(item => item.id === currentCoupon.id ? currentCoupon : item));
      toast({
        title: "Coupon Updated",
        description: `Coupon ${currentCoupon.name} updated successfully`,
      });
    } else {
      setCoupons(prev => [...prev, currentCoupon]);
      toast({
        title: "Coupon Created",
        description: `New coupon ${currentCoupon.name} created successfully`,
      });
    }
    setIsDialogOpen(false);
  };

  const toggleCouponStatus = (id: string) => {
    setCoupons(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, isActive: !item.isActive }
          : item
      )
    );

    const coupon = coupons.find(c => c.id === id);
    if (coupon) {
      toast({
        title: coupon.isActive ? "Coupon Deactivated" : "Coupon Activated",
        description: `Coupon ${coupon.name} has been ${coupon.isActive ? 'deactivated' : 'activated'}.`,
      });
    }
  };

  const columns = [
    { key: 'name' as keyof Coupon, header: 'Coupon Name' },
    { key: 'code' as keyof Coupon, header: 'Coupon Code' },
    { key: 'serviceType' as keyof Coupon, header: 'Service Type' },
    {
      key: 'discount' as string,
      header: 'Discount',
      render: (coupon: Coupon) => (
        <div className="flex items-center">
          {coupon.discountType === 'percentage' ? (
            <span className="flex items-center">
              {coupon.discountPercentage}% <Percent size={14} className="ml-1 text-gray-500" />
            </span>
          ) : (
            <span className="flex items-center">
              ₹{coupon.discountAmount} <DollarSign size={14} className="ml-1 text-gray-500" />
            </span>
          )}
        </div>
      )
    },
    {
      key: 'startDate' as keyof Coupon,
      header: 'Start Date',
      render: (coupon: Coupon) => <span>{coupon.startDate ? formatDateTime(coupon.startDate) : 'N/A'}</span>
    },
    {
      key: 'expiryDate' as keyof Coupon,
      header: 'Expiry Date',
      render: (coupon: Coupon) => <span>{formatDateTime(coupon.expiryDate)}</span>
    },
    {
      key: 'isActive' as keyof Coupon,
      header: 'Status',
      render: (coupon: Coupon) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {coupon.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'actions' as string,
      header: 'Actions',
      render: (coupon: Coupon) => (
        <div className="flex items-center space-x-2">
          <button
            className="action-button"
            onClick={() => handleEditCoupon(coupon)}
          >
            Edit
          </button>
          <button
            className={`action-button ${coupon.isActive ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}
            onClick={() => toggleCouponStatus(coupon.id)}
          >
            {coupon.isActive ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      )
    }
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Coupons</h1>
        <Button
          onClick={handleAddNew}
          className="flex items-center gap-2"
        >
          <Plus size={16} /> Add New Coupon
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={coupons}
        keyExtractor={(item) => item.id}
        searchable={true}
        filterable={true}
        filterOptions={[
          {
            key: 'serviceType' as keyof Coupon,
            label: 'Service Type',
            options: [
              { label: 'All', value: 'All' },
              { label: 'Bus', value: 'Bus' },
              { label: 'Hotel', value: 'Hotel' },
              { label: 'Taxi', value: 'Taxi' },
              { label: 'Bike', value: 'Bike' }
            ]
          },
          {
            key: 'isActive' as keyof Coupon,
            label: 'Status',
            options: [
              { label: 'Active', value: 'true' },
              { label: 'Inactive', value: 'false' }
            ]
          }
        ]}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Edit Coupon' : 'Add New Coupon'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Coupon Name</label>
              <Input
                value={currentCoupon.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g. SUMMER20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Coupon Code</label>
              <Input
                value={currentCoupon.code}
                onChange={(e) => handleInputChange('code', e.target.value)}
                placeholder="e.g. SUMMER20"
              />
              <p className="text-xs text-gray-500">This is the code users will enter to apply the coupon</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Service Type</label>
              <Select
                value={currentCoupon.serviceType}
                onValueChange={(value: any) => handleInputChange('serviceType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Services</SelectItem>
                  <SelectItem value="Bus">Bus</SelectItem>
                  <SelectItem value="Hotel">Hotel</SelectItem>
                  <SelectItem value="Taxi">Taxi</SelectItem>
                  <SelectItem value="Bike">Bike</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Discount Type</label>
              <RadioGroup
                value={currentCoupon.discountType}
                onValueChange={(value) => handleDiscountTypeChange(value as 'percentage' | 'fixed')}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="percentage" id="percentage-discount" />
                  <Label htmlFor="percentage-discount" className="flex items-center">
                    <Percent size={16} className="mr-1" /> Percentage
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fixed" id="fixed-discount" />
                  <Label htmlFor="fixed-discount" className="flex items-center">
                    <DollarSign size={16} className="mr-1" /> Fixed Amount
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {currentCoupon.discountType === 'percentage' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Discount Percentage</label>
                <div className="relative">
                  <Input
                    type="number"
                    value={currentCoupon.discountPercentage !== null ? currentCoupon.discountPercentage : 0}
                    onChange={(e) => handleInputChange('discountPercentage', parseFloat(e.target.value) || 0)}
                    className="pr-8"
                    min={0}
                    max={100}
                  />
                  <Percent className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                </div>
              </div>
            )}

            {currentCoupon.discountType === 'fixed' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Discount Amount (₹)</label>
                <div className="relative">
                  <Input
                    type="number"
                    value={currentCoupon.discountAmount !== null ? currentCoupon.discountAmount : 0}
                    onChange={(e) => handleInputChange('discountAmount', parseFloat(e.target.value) || 0)}
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
                value={currentCoupon.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Expiry Date and Time</label>
              <Input
                type="datetime-local"
                value={currentCoupon.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={currentCoupon.isActive ? "active" : "inactive"}
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
            <Button onClick={handleSaveCoupon}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Coupons;
