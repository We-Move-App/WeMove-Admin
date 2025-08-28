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
    vehicleType: '',
  });

  useEffect(() => {
    if (id && id !== "new") {
      axiosInstance
        .get(`/driver-management/taxi-drivers/${id}?vehicleType=taxi`)
        .then((res) => {
          const apiData = res.data.data;

          // map API response into your TaxiDriver shape
          const mappedDriver: TaxiDriver = {
            id: apiData.TaxiDriverDetails?.driverId || '',
            driverId: apiData.TaxiDriverDetails?.driverId || '',
            name: apiData.TaxiDriverDetails?.name || '',
            email: apiData.TaxiDriverDetails?.email || '',
            mobile: apiData.TaxiDriverDetails?.mobile || '',
            status: apiData.TaxiDriverDetails?.status || '',
            age: apiData.TaxiDriverDetails?.age || null,
            profilePhoto: apiData.documents?.avatarPhotos || null,
            address: apiData.TaxiDriverDetails?.address || '',
            experience: apiData.TaxiDriverDetails?.experience || 0,
            vehicleNumber: apiData.taxiDetails?.registrationNo || '',
            vehicleType: apiData.taxiDetails?.vehicleType || '',
            vehicleRegistrationNumber: apiData.taxiDetails?.registrationNo || '',
            vehicleModel: apiData.taxiDetails?.model || '',
            vehicleInsurance: apiData.documents?.insurance || null,
            vehicleRegistrationCertificate: apiData.documents?.registrationCertificate || null,
            vehiclePhotos: apiData.documents?.vehicleTaxiPhotos ? [apiData.documents.vehicleTaxiPhotos] : [],
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

    return res.data.data;
  };

  // const handleSingleUpload = async (
  //   file: File | File[] | null,
  //   key: keyof TaxiDriver
  // ) => {
  //   console.log(`handleSingleUpload called for key: ${key}`, file);

  //   if (!file) return;

  //   const fileToUpload = Array.isArray(file) ? file[0] : file;
  //   console.log("File to upload:", fileToUpload);

  //   // Upload the file
  //   const uploaded = await uploadFiles(fileToUpload);
  //   console.log("Uploaded response:", uploaded);

  //   // Store as FileObject
  //   handleChange(key, {
  //     fileUrl: uploaded.url,
  //     fileName: uploaded.fileName,
  //   });

  //   console.log(`Updated driver field ${key}:`, {
  //     fileUrl: uploaded.url,
  //     fileName: uploaded.fileName,
  //   });
  // };

  const handleSingleUpload = async (
    file: File | File[] | null,
    key: keyof TaxiDriver
  ) => {
    if (!file) return;

    const fileToUpload = Array.isArray(file) ? file[0] : file;

    const uploaded = await uploadFiles(fileToUpload);

    // ✅ Always store as single object
    handleChange(key, {
      fileUrl: uploaded.url,
      fileName: uploaded.fileName,
    });
  };


  const buildDriverPayload = async (driver: TaxiDriver) => {
    const isFile = (file: any): file is File =>
      file && typeof file === "object" && "name" in file;

    // const uploadOrReturn = async (
    //   file: any,
    //   documentType: string
    // ): Promise<any | null> => {
    //   if (!file) return null;

    //   if (isFile(file)) {
    //     const uploaded = await uploadFiles(file);
    //     return uploaded
    //       ? {
    //         documentType,
    //         fileUrl: uploaded.url,
    //         fileName: uploaded.fileName
    //       }
    //       : null;
    //   }


    //   if (typeof file === "string") {
    //     return { documentType, fileUrl: file, fileName: file.split("/").pop() };
    //   }

    //   if (typeof file === "object" && "fileUrl" in file) {
    //     return { ...file, documentType };
    //   }

    //   return null;
    // };

    const uploadOrReturn = async (
      file: any,
      documentType: string
    ): Promise<any | null> => {
      if (!file) return null;

      // Case 1: Fresh File upload
      if (file instanceof File) {
        const uploaded = await uploadFiles(file);
        return uploaded
          ? {
            documentType,
            fileUrl: uploaded.fileUrl, // ✅ backend expects "fileUrl"
            fileName: uploaded.fileName || file.name,
          }
          : null;
      }

      // Case 2: Already uploaded string URL
      if (typeof file === "string") {
        return {
          documentType,
          fileUrl: file,
          fileName: file.split("/").pop() || "unknown",
        };
      }

      // Case 3: Object from backend (edit mode re-use)
      if (typeof file === "object" && ("fileUrl" in file || "url" in file)) {
        return {
          documentType,
          fileUrl: file.fileUrl || file.url,
          fileName:
            file.fileName ||
            file.fileUrl?.split("/").pop() ||
            file.url?.split("/").pop() ||
            "unknown",
        };
      }

      return null;
    };



    // Uploads
    const profilePhoto = await uploadOrReturn(driver.profilePhoto, "avatar");

    const idProofDoc = driver.idProofs
      ? await uploadOrReturn(driver.idProofs, "id_card")
      : null;

    const driverLicenseDoc = driver.driverLicense
      ? await uploadOrReturn(driver.driverLicense, "license")
      : null;

    // const vehiclePhotos = driver.vehiclePhotos
    //   ? await uploadOrReturn(driver.vehiclePhotos, "vehicle_photo")
    //   : null;
    const vehiclePhotos = driver.vehiclePhotos
      ? await uploadOrReturn(driver.vehiclePhotos, "vehicle_photo")
      : null;

    const vehicleInsurance = driver.vehicleInsurance
      ? await uploadOrReturn(driver.vehicleInsurance, "insurance")
      : null;

    const vehicleRegistrationCertificate = driver.vehicleRegistrationCertificate
      ? await uploadOrReturn(
        driver.vehicleRegistrationCertificate,
        "registration"
      )
      : null;

    const bankAccountDetails = driver.bankAccountDetails
      ? await uploadOrReturn(driver.bankAccountDetails, "passbook")
      : null;

    // Build payload
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
        document: bankAccountDetails,
      },
      vehicleDetails: {
        model: driver.vehicleModel || "",
        registrationNo: driver.vehicleRegistrationNumber || "",
        vehicleType: "taxi",
        insurance: vehicleInsurance,
        registrationCertificate: vehicleRegistrationCertificate,
        // vehiclePhotos: vehiclePhotos.length ? vehiclePhotos[0] : null,
        vehiclePhotos: vehiclePhotos,
        avatarPhotos: profilePhoto,
      },
      documents: [
        ...(idProofDoc ? [idProofDoc] : []),
        ...(driverLicenseDoc ? [driverLicenseDoc] : []),
      ],
    };

    console.log("Driver Payload:", payload);
    return payload;
  };


  const buildPutDriverPayload = async (driver: TaxiDriver) => {
    const isFile = (file: any): file is File =>
      file && typeof file === "object" && "name" in file;

    const uploadOrReturn = async (file: any, documentType: string) => {
      if (!file) return null;

      // Case 0: FileList or Array<File>
      if (file instanceof FileList || Array.isArray(file)) {
        const files = Array.from(file); // normalize to array
        const uploaded = await uploadFiles(files[0]); // assuming single file for now
        return uploaded
          ? {
            fileUrl: uploaded.fileUrl,
            fileName: uploaded.fileName || files[0].name,
            documentType,
          }
          : null;
      }

      // Case 1: Single File
      if (isFile(file)) {
        const uploaded = await uploadFiles(file);
        return uploaded
          ? {
            fileUrl: uploaded.fileUrl,
            fileName: uploaded.fileName || file.name,
            documentType,
          }
          : null;
      }

      // Case 2: Already uploaded string URL
      if (typeof file === "string") {
        return {
          fileUrl: file,
          fileName: file.split("/").pop() || "unknown",
          documentType,
        };
      }

      // Case 3: Object from backend (fileUrl or url)
      if (typeof file === "object") {
        return {
          fileUrl: file.fileUrl || file.url,
          fileName:
            file.fileName ||
            file.fileUrl?.split("/").pop() ||
            file.url?.split("/").pop() ||
            "unknown",
          documentType,
        };
      }

      return null;
    };

    const profilePhoto = await uploadOrReturn(driver.profilePhoto, "avatar");

    const idProofDoc = driver.idProofs
      ? await uploadOrReturn(driver.idProofs, "id_card")
      : null;

    const driverLicenseDoc = driver.driverLicense
      ? await uploadOrReturn(driver.driverLicense, "license")
      : null;

    const vehiclePhotos = driver.vehiclePhotos
      ? await uploadOrReturn(driver.vehiclePhotos, "vehicle_photo")
      : null;

    const vehicleInsurance = driver.vehicleInsurance
      ? await uploadOrReturn(driver.vehicleInsurance, "insurance")
      : null;

    const vehicleRegistrationCertificate = driver.vehicleRegistrationCertificate
      ? await uploadOrReturn(
        driver.vehicleRegistrationCertificate,
        "registration"
      )
      : null;

    const bankAccountDetails = driver.bankAccountDetails
      ? await uploadOrReturn(driver.bankAccountDetails, "passbook")
      : null;

    return {
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
        document: bankAccountDetails,
      },
      vehicleDetails: {
        model: driver.vehicleModel || "",
        registrationNo: driver.vehicleRegistrationNumber || "",
        vehicleType: "taxi",
        insurance: vehicleInsurance,
        registrationCertificate: vehicleRegistrationCertificate,
        vehiclePhotos: vehiclePhotos,
        avatarPhotos: profilePhoto || null,
      },
      documents: [
        ...(idProofDoc ? [idProofDoc] : []),
        ...(driverLicenseDoc ? [driverLicenseDoc] : []),
      ],
    };
  };

  const handleSubmit = async () => {
    try {
      if (mode === "post") {
        const payload = await buildDriverPayload(driver);
        await axiosInstance.post("/driver-management/taxi-drivers/register", payload);
      }
      else if (mode === "edit") {
        try {
          // 1. Build payload for driver update
          const payload = await buildPutDriverPayload(driver);
          console.log("PUT payload:", JSON.stringify(payload, null, 2));

          // 2. First API call -> Update driver details
          await axiosInstance.put(
            `/driver-management/taxi-drivers/${id}?vehicleType=taxi`,
            payload
          );

          // 3. Second API call -> Verify driver status
          await axiosInstance.put(
            `/driver-management/drivers/verify/${driver.driverId}`,
            { status: driver.status }
          );

          // ✅ Success message / toast
          console.log("Driver updated & verified successfully");
        } catch (error) {
          console.error("Error updating driver:", error);
        }
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

                      const fileToUpload = Array.isArray(file) ? file[0] : file;

                      const uploaded = await uploadFiles(fileToUpload);
                      console.log("Uploaded file:", uploaded);
                      handleChange("profilePhoto", {
                        fileUrl: uploaded.url,
                        fileName: uploaded.fileName,
                      });
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
                      label="ID Proofs"
                      value={driver.idProofs || null}
                      disabled={isReadOnly}
                      multiple={false}
                      onChange={(file) => handleSingleUpload(file, "idProofs")}
                    />


                    <div>
                      <UploadField
                        label="Driver License"
                        value={driver.driverLicense || null}
                        disabled={isReadOnly}
                        multiple={false}
                        onChange={(file) => handleSingleUpload(file, "driverLicense")}
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
                    value={driver.vehicleInsurance || null}
                    disabled={isReadOnly}
                    multiple={false}
                    onChange={(file) => handleSingleUpload(file, "vehicleInsurance")}
                  />
                </div>
                <div>


                  <UploadField
                    label="Registration Certificate"
                    value={driver.vehicleRegistrationCertificate || null}
                    disabled={isReadOnly}
                    multiple={false}
                    onChange={(file) => handleSingleUpload(file, "vehicleRegistrationCertificate")}
                  />
                </div>
                <div className="col-span-2">
                  <UploadField
                    label="Vehicle Photos"
                    value={driver.vehiclePhotos || null}
                    disabled={isReadOnly}
                    multiple={false}
                    onChange={(file) => handleSingleUpload(file, "vehiclePhotos")}
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
                    value={driver.bankAccountDetails || null}
                    disabled={isReadOnly}
                    multiple={false}
                    onChange={(file) => handleSingleUpload(file, "bankAccountDetails")}
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
