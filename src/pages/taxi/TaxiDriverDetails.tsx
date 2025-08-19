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
import fileUploadInstance from '@/api/fileUploadInstance';

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

  // helper to upload single or multiple files
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

    return res.data.data;
  };

  // const isFile = (file: any): file is File => file && typeof file === "object" && "name" in file;

  // const buildDriverPayload = async (driver: TaxiDriver) => {
  //   // Upload files first
  //   const profilePhoto = isFile(driver.profilePhoto)
  //     ? await uploadFiles(driver.profilePhoto)
  //     : driver.profilePhoto;

  //   const idProofs = Array.isArray(driver.idProofs)
  //     ? await Promise.all(driver.idProofs.map(async (f) => isFile(f) ? await uploadFiles(f) : f))
  //     : [];

  //   const driverLicense = Array.isArray(driver.driverLicense)
  //     ? await Promise.all(driver.driverLicense.map(async (f) => isFile(f) ? await uploadFiles(f) : f))
  //     : [];

  //   const vehiclePhotos = Array.isArray(driver.vehiclePhotos)
  //     ? await Promise.all(driver.vehiclePhotos.map(async (f) => isFile(f) ? await uploadFiles(f) : f))
  //     : [];

  //   const vehicleInsurance = isFile(driver.vehicleInsurance)
  //     ? await uploadFiles(driver.vehicleInsurance)
  //     : driver.vehicleInsurance;

  //   const vehicleRegistrationCertificate = isFile(driver.vehicleRegistrationCertificate)
  //     ? await uploadFiles(driver.vehicleRegistrationCertificate)
  //     : driver.vehicleRegistrationCertificate;

  //   const bankAccountDetails = isFile(driver.bankAccountDetails)
  //     ? await uploadFiles(driver.bankAccountDetails)
  //     : driver.bankAccountDetails;

  //   // Final payload
  //   return {
  //     name: driver.name || "",
  //     age: driver.age || null,
  //     mobile: driver.mobile || "",
  //     address: driver.address || "",
  //     profilePhoto,

  //     experience: driver.experience || 0,
  //     idProofs,
  //     driverLicense,

  //     vehicleModel: driver.vehicleModel || "",
  //     vehicleRegistrationNumber: driver.vehicleRegistrationNumber || "",
  //     vehicleInsurance,
  //     vehicleRegistrationCertificate,
  //     vehiclePhotos,

  //     accountNumber: driver.accountNumber || "",
  //     accountHolderName: driver.accountHolderName || "",
  //     bankAccountDetails,

  //     status: "pending",
  //   };
  // };


  const buildDriverPayload = async (driver: TaxiDriver) => {
    const isFile = (file: any): file is File => file && typeof file === "object" && "name" in file;

    // Upload files first
    const profilePhoto = isFile(driver.profilePhoto) ? await uploadFiles(driver.profilePhoto) : driver.profilePhoto;

    const documents = Array.isArray(driver.idProofs)
      ? await Promise.all(driver.idProofs.map(async (f) => isFile(f) ? await uploadFiles(f) : f))
      : [];

    const driverLicenseDocs = Array.isArray(driver.driverLicense)
      ? await Promise.all(driver.driverLicense.map(async (f) => isFile(f) ? await uploadFiles(f) : f))
      : [];

    const vehiclePhotos = Array.isArray(driver.vehiclePhotos)
      ? await Promise.all(driver.vehiclePhotos.map(async (f) => isFile(f) ? await uploadFiles(f) : f))
      : [];

    const vehicleInsurance = isFile(driver.vehicleInsurance) ? await uploadFiles(driver.vehicleInsurance) : driver.vehicleInsurance;

    const vehicleRegistrationCertificate = isFile(driver.vehicleRegistrationCertificate)
      ? await uploadFiles(driver.vehicleRegistrationCertificate)
      : driver.vehicleRegistrationCertificate;

    const bankAccountDetails = isFile(driver.bankAccountDetails)
      ? await uploadFiles(driver.bankAccountDetails)
      : driver.bankAccountDetails;

    // Build payload according to backend expectation
    const payload = {
      basicDriverDetails: {
        fullName: driver.name || "",
        phoneNo: driver.mobile || "",
        email: driver.email || "",
        age: driver.age || null,
        experience: driver.experience || 0,
        address: driver.address || "",
      },
      bankDetails: {
        accountNumber: driver.accountNumber || "",
        holderName: driver.accountHolderName || "",
        document: bankAccountDetails || null,
      },
      vehicleDetails: {
        model: driver.vehicleModel || "",
        registrationNo: driver.vehicleRegistrationNumber || "",
        vehicleType: "taxi",
        insurance: vehicleInsurance || null,
        registrationCertificate: vehicleRegistrationCertificate || null,
        vehiclePhotos: vehiclePhotos.length ? vehiclePhotos[0] : null,
        avatarPhotos: profilePhoto || null,
      },
      documents: [...documents, ...driverLicenseDocs],
    };

    console.log("Driver Payload:", payload);
    return payload;
  };



  const handleSubmit = async () => {
    try {
      const payload = await buildDriverPayload(driver);
      if (mode === "post") {
        await axiosInstance.post("/driver-management/taxi-drivers/register", payload);
      } else if (mode === "edit") {
        await axiosInstance.put(`/driver-management/taxi-drivers/${id}?vehicleType=taxi`, payload);
      }
      toast({
        title: mode === "post" ? "Driver Created" : "Driver Updated",
        description: driver.name,
      });
      navigate("/taxi-management/drivers");
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

export default TaxiDriverDetails;
