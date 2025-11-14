import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { TaxiDriver } from "@/types/admin";
import UploadField from "@/components/ui/UploadField";
import axiosInstance from "@/api/axiosInstance";
import fileUploadInstance from "@/api/fileUploadInstance";
import BranchSelect from "@/components/branch-select/BranchSelect";
import { useTranslation } from "react-i18next";

const BikeRiderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const initialMode = id === "new" ? "post" : "view";
  const [mode, setMode] = useState<"post" | "view" | "edit">(initialMode);

  const [driver, setDriver] = useState<TaxiDriver>({
    id: "",
    name: "",
    mobile: "",
    email: "",
    status: "approved",
    vehicleType: "",
    batchVerified: false,
  });

  const [selectedBranch, setSelectedBranch] = useState<string | undefined>(
    undefined
  );

  const { t, i18n } = useTranslation();

  // GET API
  useEffect(() => {
    if (id && id !== "new") {
      axiosInstance
        .get(`/driver-management/bike-drivers/${id}?vehicleType=bike`)
        .then((res) => {
          const apiData = res.data.data;

          // map API response into your BikeDriver shape
          const mappedDriver: TaxiDriver = {
            id: apiData.BikeDriverDetails?.driverId || "",
            driverId: apiData.BikeDriverDetails?.driverId || "",
            name: apiData.BikeDriverDetails?.name || "",
            email: apiData.BikeDriverDetails?.email || "",
            mobile: apiData.BikeDriverDetails?.mobile || "",
            branchId:
              apiData.BikeDriverDetails?.branch?._id ||
              apiData.BikeDriverDetails?.branch?.id ||
              "",
            branch: apiData.BikeDriverDetails?.branch?.name || "",
            status: apiData.BikeDriverDetails?.status || "",
            remark: apiData.BikeDriverDetails?.remarks || "",
            batchVerified: apiData.BikeDriverDetails?.batchVerified || "",
            age: apiData.BikeDriverDetails?.age || null,
            profilePhoto: apiData.documents?.avatarPhotos || null,
            address: apiData.BikeDriverDetails?.address || "",
            experience: apiData.BikeDriverDetails?.experience || 0,
            vehicleNumber: apiData.bikeDetails?.registrationNo || "",
            vehicleType: apiData.bikeDetails?.vehicleType || "",
            vehicleRegistrationNumber:
              apiData.bikeDetails?.registrationNo || "",
            vehicleModel: apiData.bikeDetails?.model || "",
            vehicleInsurance: apiData.documents?.insurance || null,
            vehicleRegistrationCertificate:
              apiData.documents?.registrationCertificate || null,
            vehiclePhotos: apiData.documents?.vehicleBikePhotos
              ? [apiData.documents.vehicleBikePhotos]
              : [],
            idProofs:
              apiData.documents?.idCard?.fileUrl ||
              apiData.documents?.idCard?.fileName ||
              "No ID Proof uploaded",
            // driverLicense: apiData.documents?.driverLicense?.fileUrl || apiData.documents?.driverLicense?.fileName || "No Driver License uploaded",
            driverLicense:
              apiData.documents?.license?.fileUrl ||
              "No Driver License uploaded",
            accountNumber: apiData.bankDetails?.accountNumber || "",
            accountHolderName: apiData.bankDetails?.holderName || "",
            bankAccountDetails:
              apiData?.bankDetails?.document?.fileUrl ||
              "No Bank Account Details uploaded",
          };
          setDriver(mappedDriver);
          console.log("Branch name:", apiData.BikeDriverDetails?.branch?.name);
        })
        .catch((err) => {
          console.error("Error fetching driver:", err);
        });
    }
  }, [id]);

  const handleChange = (field: keyof TaxiDriver, value: any) => {
    setDriver((prev) => ({ ...prev, [field]: value }));
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

    return res.data.data;
  };

  const handleSingleUpload = async (
    file: File | File[] | null,
    key: keyof TaxiDriver
  ) => {
    console.log(`handleSingleUpload called for key: ${key}`, file);

    if (!file) return;

    const fileToUpload = Array.isArray(file) ? file[0] : file;
    console.log("File to upload:", fileToUpload);

    // Upload the file
    const uploaded = await uploadFiles(fileToUpload);
    console.log("Uploaded response:", uploaded);

    // Store as FileObject
    handleChange(key, {
      fileUrl: uploaded.url,
      fileName: uploaded.fileName,
    });

    console.log(`Updated driver field ${key}:`, {
      fileUrl: uploaded.url,
      fileName: uploaded.fileName,
    });
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
              fileName: uploaded.fileName,
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

    // Uploads
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

    // Build payload
    const payload = {
      basicDriverDetails: {
        fullName: driver.name || "",
        phoneNo: driver.mobile || "",
        email: driver.email || "",
        age: driver.age || null,
        remarks: driver?.remark,
        batchVerified: driver?.batchVerified,
        experience: driver.experience || 0,
        address: driver.address || "",
        branch: selectedBranch || "",
      },
      bankDetails: {
        accountNumber: driver.accountNumber || "",
        holderName: driver.accountHolderName || "",
        document: bankAccountDetails,
      },
      vehicleDetails: {
        model: driver.vehicleModel || "",
        registrationNo: driver.vehicleRegistrationNumber || "",
        vehicleType: "bike",
        insurance: vehicleInsurance,
        registrationCertificate: vehicleRegistrationCertificate,
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

  // PUT API Payload Builder
  const buildPutDriverPayload = async (
    driver: TaxiDriver,
    selectedBranch?: string,
    selectedBranchId?: string
  ) => {
    const isFile = (file: any): file is File =>
      file && typeof file === "object" && "name" in file;

    const uploadOrReturn = async (file: any, documentType: string) => {
      if (!file) return null;

      // Case 1: New file (File object)
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
          fileUrl: file.fileUrl || file.url, // ✅ supports both keys
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
        branch: selectedBranchId || driver.branchId || "",
        // branch: selectedBranch || driver.branch || "",
      },
      bankDetails: {
        accountNumber: driver.accountNumber || "",
        holderName: driver.accountHolderName || "",
        document: bankAccountDetails,
      },
      vehicleDetails: {
        model: driver.vehicleModel || "",
        registrationNo: driver.vehicleRegistrationNumber || "",
        vehicleType: "bike",
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
        await axiosInstance.post(
          "/driver-management/bike-drivers/register",
          payload
        );
      } else if (mode === "edit") {
        let payload;
        // 1. Try updating driver details
        try {
          payload = await buildPutDriverPayload(driver, selectedBranch);
          console.log("PUT payload:", JSON.stringify(payload, null, 2));

          await axiosInstance.put(
            `/driver-management/bike-drivers/${id}?vehicleType=bike`,
            payload
          );

          console.log("✅ Driver details updated");
        } catch (error) {
          console.error("❌ Error updating driver:", error);
        }

        // 2. Independently try updating driver status
        try {
          if (driver.driverId) {
            await axiosInstance.put(
              `/driver-management/drivers/verify/${driver.driverId}`,
              {
                status: driver.status,
                remarks: driver?.remark,
                batchVerified: driver?.batchVerified,
              }
            );
            console.log("✅ Driver status updated");
          } else {
            console.warn("⚠️ Skipping verify API: missing driverId");
          }
        } catch (error) {
          console.error("❌ Error verifying driver status:", error);
        }

        console.log("Editing driver", {
          id,
          driverId: driver.driverId,
          status: driver.status,
          payload,
        });
      }
      toast({
        title: mode === "post" ? "Driver Created" : "Driver Updated",
        description: driver.name,
      });
      navigate("/bike-management/riders");
    } catch (error) {
      console.error("Error saving driver:", error);
    }
  };

  const isReadOnly = mode === "view";

  const statusOptions = [
    "approved",
    "processing",
    "submitted",
    "rejected",
    "blocked",
  ];

  return (
    <>
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate("/bike-management/riders")}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />{" "}
        {t("bikeDriversDetails.backButton")}
      </Button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {mode === "post"
            ? t("bikeDriversDetails.titleAdd")
            : t("bikeDriversDetails.titleDriver", { name: driver.name })}
        </h1>
        <div className="flex gap-2">
          {/* status handling */}
          {/* {mode !== "post" && (
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
              </SelectContent>
            </Select>
          )} */}

          {/* action buttons */}
          {mode === "view" && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="default"
                className="bg-gray-300 text-gray-800 border-gray-300 hover:bg-gray-300 hover:text-gray-900"
                onClick={() => navigate("/bike-management/riders")}
              >
                {t("bikeDriversDetails.buttons.cancel")}
              </Button>
              <Button onClick={() => setMode("edit")}>
                {t("bikeDriversDetails.buttons.edit")}
              </Button>
            </div>
          )}
          {(mode === "post" || mode === "edit") && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="default"
                className="bg-gray-300 text-gray-800 border-gray-300 hover:bg-gray-300 hover:text-gray-900"
                onClick={() => navigate("/taxi-management/drivers")}
              >
                {t("bikeDriversDetails.buttons.cancel")}
              </Button>
              <Button onClick={handleSubmit}>
                {mode === "post"
                  ? t("bikeDriversDetails.buttons.create")
                  : t("bikeDriversDetails.buttons.saveChanges")}
              </Button>
            </div>
          )}
        </div>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="inline-flex gap-2 mb-4 px-2 py-1 rounded-md bg-gray-100">
          <TabsTrigger value="personal">
            {t("bikeDriversDetails.tabs.personal")}
          </TabsTrigger>
          <TabsTrigger value="experience">
            {t("bikeDriversDetails.tabs.experience")}
          </TabsTrigger>
          <TabsTrigger value="vehicle">
            {t("bikeDriversDetails.tabs.vehicle")}
          </TabsTrigger>
          <TabsTrigger value="bank">
            {t("bikeDriversDetails.tabs.bank")}
          </TabsTrigger>
        </TabsList>

        {/* Personal Info */}
        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Profile Photo */}
                <div className="col-span-2">
                  <UploadField
                    label={t("bikeDriversDetails.fields.profilePhoto")}
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
                  <label className="block text-sm font-medium mb-1">
                    {t("bikeDriversDetails.fields.name")}
                  </label>
                  <Input
                    value={driver.name}
                    disabled={isReadOnly}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("bikeDriversDetails.fields.age")}
                  </label>
                  <Input
                    type="number"
                    disabled={isReadOnly}
                    value={driver.age || ""}
                    onChange={(e) =>
                      handleChange("age", parseInt(e.target.value) || "")
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("bikeDriversDetails.fields.mobile")}
                  </label>
                  <Input
                    value={driver.mobile}
                    disabled={isReadOnly}
                    onChange={(e) => handleChange("mobile", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("bikeDriversDetails.fields.email")}
                  </label>
                  <Input
                    value={driver.email}
                    disabled={isReadOnly}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("bikeDriversDetails.fields.address")}
                  </label>
                  <Textarea
                    disabled={isReadOnly}
                    value={driver.address || ""}
                    onChange={(e) => handleChange("address", e.target.value)}
                  />
                </div>
                <div className="space-y-4">
                  {/* Status Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("bikeDriversDetails.fields.status")}
                    </label>

                    {mode === "view" ? (
                      <p className="filter-input w-full bg-gray-100">
                        {t(`bikeDriversDetails.status.${driver.status}`)}
                      </p>
                    ) : (
                      <Select
                        value={driver.status}
                        onValueChange={(value: string) =>
                          handleChange("status", value)
                        }
                        // disabled={mode === "view"}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option.charAt(0).toUpperCase() + option.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
                {/* Remark Field (conditionally rendered) */}
                {(driver.status === "rejected" ||
                  driver.status === "blocked") && (
                  <div className="col-span-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("bikeDriversDetails.fields.remark")}
                    </label>
                    <textarea
                      name="remark"
                      value={driver.remark || ""}
                      onChange={(e) =>
                        setDriver({ ...driver, remark: e.target.value })
                      }
                      className="filter-input w-full h-24"
                      placeholder={t(
                        "bikeDriversDetails.placeholders.remarkPlaceholder"
                      )}
                      required
                      disabled={mode === "view"}
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("bikeDriversDetails.fields.chooseBranch")}
                  </label>
                  {mode === "view" ? (
                    <p className="filter-input w-full bg-gray-100">
                      {driver.branch}
                    </p>
                  ) : (
                    <BranchSelect
                      value={selectedBranch}
                      onChange={setSelectedBranch}
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("bikeDriversDetails.fields.verificationStatus")}
                  </label>

                  {mode === "view" ? (
                    <p className="filter-input w-full bg-gray-100">
                      {driver.batchVerified
                        ? t("bikeDriversDetails.fields.verified")
                        : t("bikeDriversDetails.fields.notVerified")}
                    </p>
                  ) : (
                    <select
                      name="batchVerified"
                      value={driver.batchVerified ? "Verified" : "Not Verified"}
                      onChange={(e) =>
                        handleChange(
                          "batchVerified",
                          e.target.value === "Verified"
                        )
                      }
                      className="filter-select w-full"
                    >
                      <option value="verified">
                        {t("bikeDriversDetails.fields.verified")}
                      </option>
                      <option value="notVerified">
                        {t("bikeDriversDetails.fields.notVerified")}
                      </option>
                    </select>
                  )}
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
                  <label className="block text-sm font-medium mb-1">
                    {t("bikeDriversDetails.fields.yearsOfExperience")}
                  </label>
                  <Input
                    type="number"
                    disabled={isReadOnly}
                    value={driver.experience || 0}
                    onChange={(e) =>
                      handleChange("experience", parseInt(e.target.value) || 0)
                    }
                  />
                </div>
                <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <UploadField
                      label={t("bikeDriversDetails.fields.idProofs")}
                      value={driver.idProofs || null}
                      disabled={isReadOnly}
                      multiple={false}
                      onChange={(file) => handleSingleUpload(file, "idProofs")}
                    />
                    <div>
                      <UploadField
                        label={t("bikeDriversDetails.fields.driverLicense")}
                        value={driver.driverLicense || null}
                        disabled={isReadOnly}
                        multiple={false}
                        onChange={(file) =>
                          handleSingleUpload(file, "driverLicense")
                        }
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
                  <label className="block text-sm font-medium mb-1">
                    {t("bikeDriversDetails.fields.vehicleModel")}
                  </label>
                  <Input
                    value={driver.vehicleModel || ""}
                    disabled={isReadOnly}
                    onChange={(e) =>
                      handleChange("vehicleModel", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("bikeDriversDetails.fields.vehicleRegistrationNumber")}
                  </label>
                  <Input
                    value={driver.vehicleRegistrationNumber || ""}
                    disabled={isReadOnly}
                    onChange={(e) =>
                      handleChange("vehicleRegistrationNumber", e.target.value)
                    }
                  />
                </div>
                <div>
                  <UploadField
                    label={t("bikeDriversDetails.fields.vehicleInsurance")}
                    value={driver.vehicleInsurance || null}
                    disabled={isReadOnly}
                    multiple={false}
                    onChange={(file) =>
                      handleSingleUpload(file, "vehicleInsurance")
                    }
                  />
                </div>
                <div>
                  <UploadField
                    label={t(
                      "bikeDriversDetails.fields.vehicleRegistrationCertificate"
                    )}
                    value={driver.vehicleRegistrationCertificate || null}
                    disabled={isReadOnly}
                    multiple={false}
                    onChange={(file) =>
                      handleSingleUpload(file, "vehicleRegistrationCertificate")
                    }
                  />
                </div>
                <div className="col-span-2">
                  <UploadField
                    label={t("bikeDriversDetails.fields.vehiclePhotos")}
                    value={driver.vehiclePhotos || null}
                    disabled={isReadOnly}
                    multiple={false}
                    onChange={(file) =>
                      handleSingleUpload(file, "vehiclePhotos")
                    }
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
                  <label className="block text-sm font-medium mb-1">
                    {t("bikeDriversDetails.fields.accountNumber")}
                  </label>
                  <Input
                    value={driver.accountNumber || ""}
                    disabled={isReadOnly}
                    onChange={(e) =>
                      handleChange("accountNumber", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("bikeDriversDetails.fields.accountHolderName")}
                  </label>
                  <Input
                    value={driver.accountHolderName || ""}
                    disabled={isReadOnly}
                    onChange={(e) =>
                      handleChange("accountHolderName", e.target.value)
                    }
                  />
                </div>
                <div className="col-span-2">
                  <UploadField
                    label={t("bikeDriversDetails.fields.bankAccountDetails")}
                    value={driver.bankAccountDetails || null}
                    disabled={isReadOnly}
                    multiple={false}
                    onChange={(file) =>
                      handleSingleUpload(file, "bankAccountDetails")
                    }
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
