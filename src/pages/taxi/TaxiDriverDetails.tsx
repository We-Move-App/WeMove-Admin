import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { TaxiDriver } from '@/types/admin';
import UploadField from '@/components/ui/UploadField';
import axiosInstance from '@/api/axiosInstance';

const TaxiDriverDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // modes: post, view, edit
  const initialMode = id === 'new' ? 'post' : 'view';
  const [mode, setMode] = useState<'post' | 'view' | 'edit'>(initialMode);

  const [driver, setDriver] = useState<TaxiDriver>({
    id: '',
    name: '',
    mobile: '',
    email: '',
    status: 'Approved',
    vehicleType: 'Car',
  });

  // fetch existing driver when in view/edit
  useEffect(() => {
    if (id && id !== "new") {
      axiosInstance
        .get(`/driver-management/taxi-drivers/${id}?vehicleType=taxi`)
        .then((res) => {
          const apiData = res.data.data;

          // map API response into your TaxiDriver shape
          const mappedDriver: TaxiDriver = {
            id: apiData.TaxiDriverDetails?.driverId,
            driverId: apiData.TaxiDriverDetails?.driverId,
            name: apiData.TaxiDriverDetails?.name,
            email: apiData.TaxiDriverDetails?.email,
            mobile: apiData.TaxiDriverDetails?.mobile,
            status: apiData.TaxiDriverDetails?.status,
            age: apiData.TaxiDriverDetails?.age,
            address: apiData.TaxiDriverDetails?.address,
            experience: apiData.TaxiDriverDetails?.experience,
            vehicleNumber: apiData.taxiDetails?.registrationNo,
            vehicleType: apiData.taxiDetails?.vehicleType,
            vehicleRegistrationNumber: apiData.taxiDetails?.registrationNo,
            vehicleInsurance: apiData.documents?.insurance?.fileUrl,
            vehicleRegistrationCertificate:
              apiData.documents?.registrationCertificate?.fileUrl,
            vehiclePhotos: apiData.documents?.vehicleTaxiPhotos
              ? [apiData.documents.vehicleTaxiPhotos.fileUrl]
              : [],
            idProofs: apiData.documents?.idCard
              ? [apiData.documents.idCard.fileUrl]
              : [],
          };

          setDriver(mappedDriver);
        })
        .catch((err) => {
          console.error("Error fetching driver:", err);
        });
    }
  }, [id]);


  const handleChange = (field: keyof TaxiDriver, value: any) => {
    setDriver(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (mode === 'post') {
        await axiosInstance.post('/taxi-management/drivers', driver);
        toast({ title: 'Taxi Driver Created', description: driver.name });
      } else if (mode === 'edit') {
        await axiosInstance.put(`/taxi-management/drivers/${id}`, driver);
        toast({ title: 'Taxi Driver Updated', description: driver.name });
      }
      navigate('/taxi-management/drivers');
    } catch (error) {
      toast({ title: 'Error', description: 'Something went wrong!' });
    }
  };

  const isReadOnly = mode === 'view';

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
          {mode === 'post' ? 'Add New Taxi Driver' : `Taxi Driver: ${driver.name}`}
        </h1>
        <div className="flex gap-2">
          {/* status handling */}
          {mode !== "post" && (
            <Select
              value={driver.status}
              disabled={mode === "view"}
              onValueChange={(value: any) => handleChange("status", value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

          )}

          {/* action buttons */}
          {mode === "view" && (
            <Button onClick={() => setMode("edit")}>Edit</Button>
          )}
          {(mode === "post" || mode === "edit") && (
            <Button onClick={handleSubmit}>
              {mode === "post" ? "Create" : "Save Changes"}
            </Button>
          )}
        </div>

      </div >

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3 mb-4">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="experience">Experience & Documents</TabsTrigger>
          <TabsTrigger value="vehicle">Vehicle Details</TabsTrigger>
        </TabsList>

        {/* Personal Info */}
        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <Input
                    value={driver.name}
                    disabled={isReadOnly}
                    onChange={(e) => handleChange('name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Age</label>
                  <Input
                    type="number"
                    disabled={isReadOnly}
                    value={driver.age || ''}
                    onChange={(e) => handleChange('age', parseInt(e.target.value) || '')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Mobile</label>
                  <Input
                    value={driver.mobile}
                    disabled={isReadOnly}
                    onChange={(e) => handleChange('mobile', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input
                    type="email"
                    disabled={isReadOnly}
                    value={driver.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <Textarea
                    disabled={isReadOnly}
                    value={driver.address || ''}
                    onChange={(e) => handleChange('address', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Experience */}
        <TabsContent value="experience" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Years of Experience</label>
                  <Input
                    type="number"
                    disabled={isReadOnly}
                    value={driver.experience || 0}
                    onChange={(e) => handleChange('experience', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="col-span-2">
                  <UploadField
                    label="ID Proofs"
                    value={driver.idProofs || []}
                    disabled={isReadOnly}
                    onChange={(value) => handleChange('idProofs', value)}
                    multiple={true}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vehicle */}
        <TabsContent value="vehicle" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Registration Number</label>
                  <Input
                    value={driver.vehicleRegistrationNumber || ''}
                    disabled={isReadOnly}
                    onChange={(e) => handleChange('vehicleRegistrationNumber', e.target.value)}
                  />
                </div>
                <div>
                  <UploadField
                    label="Vehicle Insurance"
                    value={driver.vehicleInsurance}
                    disabled={isReadOnly}
                    onChange={(value) => handleChange('vehicleInsurance', value)}
                  />
                </div>
                <div>
                  <UploadField
                    label="Registration Certificate"
                    value={driver.vehicleRegistrationCertificate}
                    disabled={isReadOnly}
                    onChange={(value) => handleChange('vehicleRegistrationCertificate', value)}
                  />
                </div>
                <div className="col-span-2">
                  <UploadField
                    label="Vehicle Photos"
                    value={driver.vehiclePhotos || []}
                    disabled={isReadOnly}
                    onChange={(value) => handleChange('vehiclePhotos', value)}
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
