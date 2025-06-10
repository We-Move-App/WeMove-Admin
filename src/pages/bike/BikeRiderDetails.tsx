
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
import { BikeRider } from '@/types/admin';
import UploadField from '@/components/ui/UploadField';

// Mock data for a bike rider
const mockBikeRider: BikeRider = {
  id: "1",
  name: "Alex Johnson",
  email: "alex.j@example.com",
  mobile: "9876543210",
  status: "Approved",
  age: 28,
  address: "456 Park Avenue, Chennai",
  experience: 5,
  idProofs: ["/placeholder.svg", "/placeholder.svg"],
  vehicleType: "Scooter",
  vehicleRegistrationNumber: "TN-01-AB-5678",
  vehicleInsurance: "/placeholder.svg",
  vehicleRegistrationCertificate: "/placeholder.svg",
  vehiclePhotos: ["/placeholder.svg", "/placeholder.svg"]
};

const BikeRiderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewRider = id === 'new';

  // We would fetch real data here in a production app
  const [rider, setRider] = useState<BikeRider>(
    isNewRider
      ? { id: '', name: '', email: '', mobile: '', status: 'Approved', vehicleType: 'Scooter' }
      : mockBikeRider
  );

  const handleChange = (field: keyof BikeRider, value: any) => {
    setRider(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Here you would send data to an API
    console.log('Saving bike rider:', rider);
    toast({
      title: isNewRider ? "Bike Rider Created" : "Bike Rider Updated",
      description: `Successfully ${isNewRider ? 'created' : 'updated'} bike rider: ${rider.name}`,
    });
    navigate('/bike-management/riders');
  };

  return (
    <>
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate('/bike-management/riders')}
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Back to Bike Riders
      </Button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {isNewRider ? 'Add New Bike Rider' : `Bike Rider: ${rider.name}`}
        </h1>
        <div className="flex gap-2">
          {!isNewRider && (
            <Select
              value={rider.status}
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
                    value={rider.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Age</label>
                  <Input
                    type="number"
                    value={rider.age || ''}
                    onChange={(e) => handleChange('age', parseInt(e.target.value) || '')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Mobile</label>
                  <Input
                    value={rider.mobile}
                    onChange={(e) => handleChange('mobile', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input
                    type="email"
                    value={rider.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <Textarea
                    value={rider.address || ''}
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
                    value={rider.experience || 0}
                    onChange={(e) => handleChange('experience', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="col-span-2">
                  <UploadField
                    label="ID Proofs"
                    value={rider.idProofs ? rider.idProofs[0] : undefined}
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
                    value={rider.vehicleType || 'Scooter'}
                    onValueChange={(value: any) => handleChange('vehicleType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Scooter">Scooter</SelectItem>
                      <SelectItem value="MotorBike">MotorBike</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Registration Number</label>
                  <Input
                    value={rider.vehicleRegistrationNumber || ''}
                    onChange={(e) => handleChange('vehicleRegistrationNumber', e.target.value)}
                  />
                </div>
                <div>
                  <UploadField
                    label="Vehicle Insurance"
                    value={rider.vehicleInsurance}
                    onChange={(value) => handleChange('vehicleInsurance', value)}
                  />
                </div>
                <div>
                  <UploadField
                    label="Registration Certificate"
                    value={rider.vehicleRegistrationCertificate}
                    onChange={(value) => handleChange('vehicleRegistrationCertificate', value)}
                  />
                </div>
                <div className="col-span-2">
                  <UploadField
                    label="Vehicle Photos"
                    value={rider.vehiclePhotos ? rider.vehiclePhotos[0] : undefined}
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

export default BikeRiderDetails;
