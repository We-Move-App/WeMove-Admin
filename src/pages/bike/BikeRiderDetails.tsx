
import { useEffect, useState } from 'react';
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
import axiosInstance from '@/api/axiosInstance';
import fileUploadInstance from '@/api/fileUploadInstance';


// Mock data for a bike rider
// const mockBikeRider: BikeRider = {
//   id: "1",
//   name: "Alex Johnson",
//   email: "alex.j@example.com",
//   mobile: "9876543210",
//   status: "Approved",
//   age: 28,
//   address: "456 Park Avenue, Chennai",
//   experience: 5,
//   idProofs: ["/placeholder.svg", "/placeholder.svg"],
//   vehicleType: "Scooter",
//   vehicleRegistrationNumber: "TN-01-AB-5678",
//   vehicleInsurance: "/placeholder.svg",
//   vehicleRegistrationCertificate: "/placeholder.svg",
//   vehiclePhotos: ["/placeholder.svg", "/placeholder.svg"]
// };

const BikeRiderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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

  // GET API
  useEffect(() => {
    if (id && id !== "new") {
      axiosInstance
        .get(`/driver-management/bike-drivers/${id}?vehicleType=bike`)
        .then((res) => {
          const apiData = res.data.data;

          // map API response into your BikeDriver shape
          const mappedDriver: TaxiDriver = {
            id: apiData.BikeDriverDetails?.driverId || '',
            driverId: apiData.BikeDriverDetails?.driverId || '',
            name: apiData.BikeDriverDetails?.name || '',
            email: apiData.BikeDriverDetails?.email || '',
            mobile: apiData.BikeDriverDetails?.mobile || '',
            status: apiData.BikeDriverDetails?.status || '',
            age: apiData.BikeDriverDetails?.age || null,
            profilePhoto: apiData.documents?.avatarPhotos || null,
            address: apiData.BikeDriverDetails?.address || '',
            experience: apiData.BikeDriverDetails?.experience || 0,
            vehicleNumber: apiData.bikeDetails?.registrationNo || '',
            vehicleType: apiData.bikeDetails?.vehicleType || '',
            vehicleRegistrationNumber: apiData.bikeDetails?.registrationNo || '',
            vehicleModel: apiData.bikeDetails?.model || '',
            vehicleInsurance: apiData.documents?.insurance || null,
            vehicleRegistrationCertificate: apiData.documents?.registrationCertificate || null,
            vehiclePhotos: apiData.documents?.vehicleBikePhotos ? [apiData.documents.vehicleBikePhotos] : [],
            idProofs: apiData.documents?.idCard?.fileUrl || apiData.documents?.idCard?.fileName || "No ID Proof uploaded",
            // driverLicense: apiData.documents?.driverLicense?.fileUrl || apiData.documents?.driverLicense?.fileName || "No Driver License uploaded",
            driverLicense: apiData.documents?.license?.fileUrl || "No Driver License uploaded",
            accountNumber: apiData.bankDetails?.accountNumber || '',
            accountHolderName: apiData.bankDetails?.holderName || '',
            bankAccountDetails: apiData?.bankDetails?.document?.fileUrl || "No Bank Account Details uploaded",
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

  // Upload Files to Server
  const uploadFiles = async (files: File | File[]) => {
    const formData = new FormData();

    if (Array.isArray(files)) {
      files.forEach((file) => formData.append("image", file));
    } else {
      formData.append("image", files);
    }

    const res = await fileUploadInstance.post("/file/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log("Upload response:", res.data);

    return res.data.data || res.data;

    // return res.data.data;
  };

  // POST API Payload Builder
  const buildDriverPayload = async (driver: TaxiDriver) => {
    const isFile = (file: any): file is File =>
      file && typeof file === "object" && "name" in file;

    const uploadOrReturn = async (
      file: any,
      documentType: string
    ): Promise<any | null> => {
      if (!file) return null;

      if (isFile(file)) {
        const uploaded = await uploadFiles(file);
        return uploaded
          ? {
            documentType,
            fileUrl: uploaded.url,
            fileName: uploaded.fileName
          }
          : null;
      }


      if (typeof file === "string") {
        return { documentType, fileUrl: file, fileName: file.split("/").pop() };
      }

      if (typeof file === "object" && "fileUrl" in file) {
        return { ...file, documentType };
      }

      return null;
    };

    // Upload docs (✅ single objects, not arrays)
    const profilePhoto = await uploadOrReturn(driver.profilePhoto, "avatar");
    const idCard = await uploadOrReturn(driver.idProofs?.[0], "id_card");
    const license = await uploadOrReturn(driver.driverLicense?.[0], "license");
    const vehiclePhotos = await uploadOrReturn(driver.vehiclePhotos?.[0], "vehicle_photo");
    const vehicleInsurance = await uploadOrReturn(driver.vehicleInsurance, "insurance");
    const vehicleRegistrationCertificate = await uploadOrReturn(
      driver.vehicleRegistrationCertificate,
      "registration"
    );
    const bankPassbook = await uploadOrReturn(driver.bankAccountDetails, "passbook");

    const payload = {
      basicDriverDetails: {
        fullName: driver.name || "",
        phoneNo: driver.mobile || "",
        email: driver.email || "",
        // gender: driver.gender || "",
        // dob: driver.dob || "",
        age: driver.age || null,
        experience: driver.experience || 0,
        address: driver.address || "",
        termsAccepted: true,
        ratings: 1,
      },

      bankDetails: {
        accountNumber: driver.accountNumber || "",
        holderName: driver.accountHolderName || "",
        document: bankPassbook,
      },

      vehicleDetails: {
        model: driver.vehicleModel || "",
        registrationNo: driver.vehicleRegistrationNumber || "",
        vehicleType: driver.vehicleType || "bike",
        insurance: vehicleInsurance,
        registrationCertificate: vehicleRegistrationCertificate,
        vehiclePhotos: vehiclePhotos,
        avatarPhotos: profilePhoto,
      },

      documents: [
        ...(idCard ? [idCard] : []),
        ...(license ? [license] : []),
      ],
    };

    console.log("Driver Payload:", JSON.stringify(payload, null, 2));
    return payload;
  };

  const handleSubmit = async () => {
    try {
      if (mode === "post") {
        const payload = await buildDriverPayload(driver);
        await axiosInstance.post("/driver-management/bike-drivers/register", payload);
      }
      // } else if (mode === "edit") {
      //   try {
      //     // 1. Build payload for driver update
      //     const payload = await buildPutDriverPayload(driver);
      //     console.log("PUT payload:", JSON.stringify(payload, null, 2));

      //     // 2. First API call -> Update driver details
      //     await axiosInstance.put(
      //       `/driver-management/bike-drivers/${id}?vehicleType=bike`,
      //       payload
      //     );

      //     // 3. Second API call -> Verify driver status
      //     await axiosInstance.put(
      //       `/driver-management/drivers/verify/${driver.driverId}`,
      //       { status: driver.status }
      //     );

      //     // ✅ Success message / toast
      //     console.log("Driver updated & verified successfully");
      //   } catch (error) {
      //     console.error("Error updating driver:", error);
      //   }
      // }
      toast({
        title: mode === "post" ? "Driver Created" : "Driver Updated",
        description: driver.name,
      });
      navigate("/bike-management/riders");
    } catch (error) {
      console.error("Error saving driver:", error);
    }
  };

  const isReadOnly = mode === 'view';

  return (
    <>
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate('/bike-management/riders')}
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Back to Bike Drivers
      </Button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {mode === 'post' ? 'Add New Bike Driver' : `Bike Driver: ${driver.name}`}
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
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-4 mb-4">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="experience">Experience & Documents</TabsTrigger>
          <TabsTrigger value="vehicle">Vehicle Details</TabsTrigger>
          <TabsTrigger value="bank">Bank Details</TabsTrigger>
        </TabsList>

        {/* Personal Info */}
        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Profile Photo */}
                <div className="col-span-2">
                  <UploadField
                    label="Profile Photo"
                    value={driver.profilePhoto || null}
                    disabled={isReadOnly}
                    multiple={false}
                    onChange={async (file) => {
                      if (!file) return;

                      // Ensure we have an array to handle multiple files (even if multiple=false)
                      const filesArray = Array.isArray(file) ? file : [file];

                      // Upload all selected files
                      const uploadedFiles = await Promise.all(
                        filesArray.map(async (f) => await uploadFiles(f))
                      );

                      // Since this is single file, pick the first uploaded file
                      handleChange("profilePhoto", uploadedFiles[0]);
                    }}
                  />

                </div>
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
                    value={driver.email}
                    disabled={isReadOnly}
                    onChange={(e) => handleChange('email', e.target.value)}
                  />
                </div>
                <div>
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
                <div className='col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <UploadField
                      disabled={isReadOnly}
                      label="ID Proofs"
                      multiple={true}
                      value={driver.idProofs || []}
                      onChange={async (files) => {
                        if (!files) return;

                        // Normalize to an array
                        const filesArray = Array.isArray(files) ? files : [files];

                        // Upload all files and get uploaded data
                        const uploadedFiles = await Promise.all(
                          filesArray.map(async (file) => {
                            const uploadedData = await uploadFiles(file);
                            return uploadedData;
                          })
                        );

                        // Update driver state with uploaded file data
                        setDriver({
                          ...driver,
                          idProofs: uploadedFiles,
                        });
                      }}
                    />


                    <div>
                      <UploadField
                        label="Driver License"
                        value={driver.driverLicense || []}
                        disabled={isReadOnly}
                        multiple={true}
                        onChange={async (files) => {
                          if (!files) return;
                          const filesArray = Array.isArray(files) ? files : [files];
                          const uploadedFiles = await Promise.all(
                            filesArray.map(async (f) => await uploadFiles(f))
                          );
                          handleChange('driverLicense', uploadedFiles);
                        }}
                      />


                    </div>
                  </div>
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
                  <label className="block text-sm font-medium mb-1">Vehicle Model</label>
                  <Input
                    value={driver.vehicleModel || ''}
                    disabled={isReadOnly}
                    onChange={(e) => handleChange('vehicleModel', e.target.value)}
                  />
                </div>
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
                    multiple={false}
                    onChange={async (file) => {
                      if (!file) return;
                      const filesArray = Array.isArray(file) ? file : [file];
                      const uploadedFiles = await Promise.all(filesArray.map(f => uploadFiles(f)));
                      handleChange('vehicleInsurance', uploadedFiles[0]);
                    }}
                  />
                </div>
                <div>
                  <UploadField
                    label="Registration Certificate"
                    value={driver.vehicleRegistrationCertificate}
                    disabled={isReadOnly}
                    multiple={false}
                    onChange={async (file) => {
                      if (!file) return;
                      const filesArray = Array.isArray(file) ? file : [file];
                      const uploadedFiles = await Promise.all(filesArray.map(f => uploadFiles(f)));
                      handleChange('vehicleRegistrationCertificate', uploadedFiles[0]);
                    }}
                  />
                </div>
                <div className="col-span-2">
                  <UploadField
                    label="Vehicle Photos"
                    value={driver.vehiclePhotos || []}
                    disabled={isReadOnly}
                    multiple={true}
                    onChange={async (files) => {
                      if (!files) return;
                      const filesArray = Array.isArray(files) ? files : [files];
                      const uploadedFiles = await Promise.all(filesArray.map(f => uploadFiles(f)));
                      handleChange('vehiclePhotos', uploadedFiles);
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bank Details */}
        <TabsContent value="bank" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Account Number</label>
                  <Input
                    value={driver.accountNumber || ''}
                    disabled={isReadOnly}
                    onChange={(e) => handleChange('accountNumber', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Account Holder Name</label>
                  <Input
                    value={driver.accountHolderName || ''}
                    disabled={isReadOnly}
                    onChange={(e) => handleChange('accountHolderName', e.target.value)}
                  />
                </div>
                <div className='col-span-2'>
                  <UploadField
                    label="Bank Account Details"
                    value={driver.bankAccountDetails}
                    disabled={isReadOnly}
                    multiple={false}
                    onChange={async (file) => {
                      if (!file) return;
                      const filesArray = Array.isArray(file) ? file : [file];
                      const uploadedFiles = await Promise.all(filesArray.map(f => uploadFiles(f)));
                      handleChange('bankAccountDetails', uploadedFiles[0]);
                    }}
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
