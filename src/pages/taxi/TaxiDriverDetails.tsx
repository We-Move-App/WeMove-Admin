
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
// import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { TaxiDriver } from '@/types/admin';
import UploadField from '@/components/ui/UploadField';

// Mock data for a taxi driver
const mockTaxiDriver: TaxiDriver = {
  id: "1",
  name: "John Smith",
  mobile: "9876543210",
  email: "john.smith@example.com",
  status: "Approved",
  age: 35,
  address: "123 Main Street, Chennai",
  experience: 8,
  idProofs: ["/placeholder.svg", "/placeholder.svg"],
  vehicleType: "Car",
  vehicleRegistrationNumber: "TN-01-AB-1234",
  vehicleInsurance: "/placeholder.svg",
  vehicleRegistrationCertificate: "/placeholder.svg",
  vehiclePhotos: ["/placeholder.svg", "/placeholder.svg"]
};

const TaxiDriverDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewDriver = id === 'new';

  // We would fetch real data here in a production app
  const [driver, setDriver] = useState<TaxiDriver>(
    isNewDriver
      ? { id: '', name: '', mobile: '', email: '', status: 'Approved', vehicleType: 'Car' }
      : mockTaxiDriver
  );

  const handleChange = (field: keyof TaxiDriver, value: any) => {
    setDriver(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Here you would send data to an API
    console.log('Saving taxi driver:', driver);
    toast({
      title: isNewDriver ? "Taxi Driver Created" : "Taxi Driver Updated",
      description: `Successfully ${isNewDriver ? 'created' : 'updated'} taxi driver: ${driver.name}`,
    });
    navigate('/taxi-management/drivers');
  };

  return (
    <>
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate('/taxi-management/drivers')}
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Back to Taxi Drivers
      </Button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {isNewDriver ? 'Add New Taxi Driver' : `Taxi Driver: ${driver.name}`}
        </h1>
        <div className="flex gap-2">
          {!isNewDriver && (
            <Select
              value={driver.status}
              onValueChange={(value: any) => handleChange('status', value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          )}
          <Button onClick={handleSubmit}>Save Changes</Button>
        </div>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3 mb-4">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="experience">Experience & Documents</TabsTrigger>
          <TabsTrigger value="vehicle">Vehicle Details</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <Input
                    value={driver.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Age</label>
                  <Input
                    type="number"
                    value={driver.age || ''}
                    onChange={(e) => handleChange('age', parseInt(e.target.value) || '')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Mobile</label>
                  <Input
                    value={driver.mobile}
                    onChange={(e) => handleChange('mobile', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input
                    type="email"
                    value={driver.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <Textarea
                    value={driver.address || ''}
                    onChange={(e) => handleChange('address', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experience" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Years of Experience</label>
                  <Input
                    type="number"
                    value={driver.experience || 0}
                    onChange={(e) => handleChange('experience', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="col-span-2">
                  <UploadField
                    label="ID Proofs"
                    value={driver.idProofs ? driver.idProofs[0] : undefined}
                    onChange={(value) => handleChange('idProofs', [value])}
                    multiple={true}
                  />
                  <p className="text-xs text-gray-500 mt-1">Upload all relevant ID proofs (Aadhar, PAN, etc.)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vehicle" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Vehicle Type</label>
                  <Select
                    value={driver.vehicleType || 'Car'}
                    onValueChange={(value: any) => handleChange('vehicleType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Car">Car</SelectItem>
                      <SelectItem value="Bike">Bike</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Registration Number</label>
                  <Input
                    value={driver.vehicleRegistrationNumber || ''}
                    onChange={(e) => handleChange('vehicleRegistrationNumber', e.target.value)}
                  />
                </div>
                <div>
                  <UploadField
                    label="Vehicle Insurance"
                    value={driver.vehicleInsurance}
                    onChange={(value) => handleChange('vehicleInsurance', value)}
                  />
                </div>
                <div>
                  <UploadField
                    label="Registration Certificate"
                    value={driver.vehicleRegistrationCertificate}
                    onChange={(value) => handleChange('vehicleRegistrationCertificate', value)}
                  />
                </div>
                <div className="col-span-2">
                  <UploadField
                    label="Vehicle Photos"
                    value={driver.vehiclePhotos ? driver.vehiclePhotos[0] : undefined}
                    onChange={(value) => handleChange('vehiclePhotos', [value])}
                    multiple={true}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default TaxiDriverDetails;
