import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
// import Layout from '@/components/layout/Layout';
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
import { HotelManager } from "@/types/admin";
import UploadField from "@/components/ui/UploadField";
import axiosInstance from "@/api/axiosInstance";
import fileUploadInstance from "@/api/fileUploadInstance";
import Loader from "@/components/ui/loader";
import NotFoundImage from "@/assets/not-found-illustration.svg";
import AmenitiesMultiSelect from "@/components/ui/amenitiesMultiSelect";
import { FileText } from "lucide-react";
import BranchSelect from "@/components/branch-select/BranchSelect";
import { useTranslation } from "react-i18next";

const HotelManagerDetails = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const modeParam = searchParams.get("mode");
  const mode =
    modeParam === "post" ? "post" : modeParam === "edit" ? "edit" : "view";

  const isReadOnly = mode === "view";
  const navigate = useNavigate();
  const isNewManager = id === "new";

  const [manager, setManager] = useState<Partial<HotelManager> | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<string | undefined>(
    undefined
  );

  const [loading, setLoading] = useState(true);
  const { i18n, t } = useTranslation();

  const toTitleCaseStatus = (status: string): HotelManager["status"] => {
    const map: Record<string, HotelManager["status"]> = {
      active: "active",
      inactive: "inactive",
      pending: "Pending",
      approved: "approved",
      rejected: "rejected",
      submitted: "Submitted",
      blocked: "blocked",
    };
    return map[status.toLowerCase()] ?? "Pending";
  };

  useEffect(() => {
    const fetchOperator = async () => {
      if (isNewManager) {
        setManager({
          id: "new",
          profilePhoto: "",
          name: "",
          branch: "",
          mobile: "",
          email: "",
          status: "Pending",
          remark: "",
          bankAccountNumber: "",
          bankAccountDetails: "",
          batchVerified: false,
        });
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get(
          `/hotel-management/hotel-managers/hotel/${id}`
        );
        console.log("API Response:", response.data);

        const hotelData = response.data?.data?.hotel || null;
        const managerData = response.data?.data?.manager || null;
        const hotelAddress = response.data?.data?.hotel?.address || {};
        // const roomType = response.data?.data?.roomTypes || {};
        // const roomTypeRaw = response.data?.data?.roomTypes;
        // const roomType = Array.isArray(roomTypeRaw) ? roomTypeRaw : roomTypeRaw ? [roomTypeRaw] : [];
        const bankData = response.data?.data?.bankAccount || null;

        const apiStatus = managerData?.verificationStatus || "pending";
        const standardRoom = response.data?.data?.standardRoom || null;
        const luxuryRoom = response.data?.data?.luxuryRoom || null;
        const hotelPolicy = response.data?.data?.policy || null;

        if (managerData) {
          setManager({
            id: managerData._id || "",
            profilePhoto: managerData?.avatar?.url || "",
            name: managerData.fullName || "",
            mobile: managerData.phoneNumber || "",
            email: managerData.email || "",
            branch: managerData?.branch?.name || "",
            companyName: managerData.companyName || "",
            companyAddress: managerData.companyAddress || "",
            status: toTitleCaseStatus(apiStatus),
            remark: managerData.remarks || "",
            batchVerified: managerData?.batchVerified ?? false,
            // Hotel Details
            hotelName: hotelData?.hotelName || "",
            businessLicense: hotelData?.businessLicense || "",
            hotelPhotos: hotelData?.images?.map((img) => img.url) || [],
            // Hotel Address
            city: hotelAddress?.townCity || "",
            locality: hotelAddress?.locality || "",
            landmark: hotelAddress?.landmark || "",
            pinCode: hotelAddress?.pincode || "",
            // Room
            totalRooms: hotelData?.totalRoom || [],
            // Room Type
            standardRooms: standardRoom
              ? {
                  numberOfRooms: parseInt(standardRoom.numberOfRoom, 10) || 0,
                  price: standardRoom.roomPrice,
                  amenities: standardRoom.amenities?.map((a) => a.name) || [],
                  photos: standardRoom.images?.map((img) => img.url) || [],
                }
              : { numberOfRooms: 0, price: 0, amenities: [], photos: [] },

            luxuryRooms: luxuryRoom
              ? {
                  numberOfRooms: parseInt(luxuryRoom.numberOfRoom, 10) || 0,
                  price: luxuryRoom.roomPrice,
                  amenities: luxuryRoom.amenities?.map((a) => a.name) || [],
                  photos: luxuryRoom.images?.map((img) => img.url) || [],
                }
              : { numberOfRooms: 0, price: 0, amenities: [], photos: [] },

            // Policy Info
            checkInTime: hotelPolicy?.checkInTime,
            checkOutTime: hotelPolicy?.checkOutTime,
            amenities: hotelPolicy?.amenities?.map((a) => a.name) || [],
            policyDocuments: hotelPolicy?.uploadDocuments || [],

            // Bank Details
            bankName: bankData?.bankName || "",
            accountHolderName: bankData?.accountHolderName || "",
            bankAccountNumber: bankData?.accountNumber || "",
            bankAccountDetails: bankData?.bankDocs || [],
          });
        } else {
          setManager(null);
        }
      } catch (error) {
        console.error("Failed to fetch hotel manager:", error);
        setManager(null);
        toast({
          title: "Error",
          description: "Failed to fetch hotel manager details.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOperator();
  }, [id, isNewManager]);

  const handleChange = (field: keyof HotelManager, value: any) => {
    setManager((prev) => ({ ...prev, [field]: value }));
  };

  const uploadImage = async (
    file: File
  ): Promise<{
    public_id: string;
    url: string;
    fileName: string;
    fileType: string;
  }> => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fileUploadInstance.post("/file/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const uploadedData = res.data?.data;

    console.log("Uploaded file response:", uploadedData);

    return {
      public_id: uploadedData.public_id,
      url: uploadedData.url,
      fileName: uploadedData.fileName,
      fileType: uploadedData.fileType,
    };
  };

  const handleFileUpload = async (file: File) => {
    return await uploadImage(file);
  };

  const handleMultipleFileUpload = async (files: File[]) => {
    return await Promise.all(files.map((file) => uploadImage(file)));
  };

  const handlePolicyFileChange = async (file: File) => {
    const uploadedData = await handleFileUpload(file); // full object from upload API
    // Instead of wrapping in { name, Url }, just store the object directly
    const updatedDocs = [...(manager.policyDocuments || []), uploadedData];
    handleChange("policyDocuments", updatedDocs);
  };

  const updateStatusApi = async (status: HotelManager["status"]) => {
    const payload = {
      status: status.toLowerCase(),
      remarks: manager?.remark,
      batchVerified: manager?.batchVerified,
    };

    // call the verify endpoint (adjust URL if different)
    return axiosInstance.put(
      `/hotel-management/hotel-managers/verify/${id}`,
      payload
    );
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        profileInfo: {
          fullName: manager.name,
          email: manager.email,
          phoneNumber: manager.mobile,
          branch: selectedBranch,
          companyName: manager.companyName,
          companyAddress: manager.companyAddress,
          avatar: manager.profilePhoto ? { url: manager.profilePhoto } : null,
        },
        bankInfo: {
          accountNumber: manager.bankAccountNumber,
          bankDocs: manager.bankAccountDetails,
          bankName: manager.bankName,
          accountHolderName: manager.accountHolderName,
        },
        hotelInfo: {
          hotelName: manager.hotelName,
          businessLicense: manager.businessLicense,
          totalRoom: manager.totalRooms,
          hotelImages: manager.hotelPhotos || [],
        },
        addressInfo: {
          address: manager.address,
          townCity: manager.city,
          landmark: manager.landmark,
          locality: manager.locality,
          pincode: manager.pinCode,
          state: manager.state,
        },
        roomInfo: {
          standardRoomCount: manager.standardRooms?.numberOfRooms || 0,
          standardRoomPrice: manager.standardRooms?.price || 0,
          standardAmenities: (manager.standardRooms?.amenities || []).map(
            (a) => ({
              name: a,
              status: true,
            })
          ),
          standardImages: manager.standardRooms?.photos || [],
          luxuryRoomCount: manager.luxuryRooms?.numberOfRooms || 0,
          luxuryRoomPrice: manager.luxuryRooms?.price || 0,
          luxuryAmenities: (manager.luxuryRooms?.amenities || []).map((a) => ({
            name: a,
            status: true,
          })),
          luxuryImages: manager.luxuryRooms?.photos || [],
        },
        policyInfo: {
          checkInTime: manager.checkInTime,
          checkOutTime: manager.checkOutTime,
          amenities: (manager.amenities || []).map((a) => ({
            name: a,
            status: true,
          })),
          uploadDocuments: manager.policyDocuments || [],
        },
      };

      console.log("Payload being sent:", JSON.stringify(payload, null, 2));

      if (mode === "post") {
        await axiosInstance.post(
          "/hotel-management/hotel-managers/register",
          payload
        );
      } else if (mode === "edit") {
        await axiosInstance.put(
          `/hotel-management/hotel-manager/update/${id}`,
          payload
        );
      }

      if (manager.status) {
        try {
          await updateStatusApi(manager.status);
          toast({
            title: "Status Updated",
            description: `Hotel manager status changed to ${manager.status}`,
          });
        } catch (statusErr) {
          // status update failed — notify user but do not throw away the main save
          console.error("Status update failed", statusErr);
          toast({
            title: "Status update failed",
            description:
              "Manager saved, but failed to update status. Try again.",
            variant: "destructive",
          });
        }
      }

      toast({
        title: mode === "post" ? "Manager Created" : "Manager Updated",
        description:
          mode === "post"
            ? `The manager ${manager.name} has been successfully added.`
            : `The details for ${manager.name} have been successfully updated.`,
      });

      navigate("/hotel-management/managers");
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Save failed",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = (value: HotelManager["status"]) => {
    setManager((prev) => ({ ...prev!, status: value }));
  };

  const statusOptions = [
    "approved",
    "processing",
    "submitted",
    "rejected",
    "blocked",
  ];

  const verificationOptions = ["Not Verified", "Verified"];

  if (loading) return <Loader />;
  if (!manager) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 flex flex-col items-center space-y-4">
            <img src={NotFoundImage} alt="Not Found" className="w-32 h-32" />
            <h2 className="text-xl font-semibold">Hotel Manager Not Found</h2>
            <p className="text-muted-foreground">
              We couldn’t find the hotel manager you’re looking for. It might
              have been deleted or the link is incorrect.
            </p>
            <Button onClick={() => navigate("/hotel-management/managers")}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to List
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  console.log("Policy Document:", manager.policyDocuments);
  console.log("manager state:", manager);
  console.log("Mode:", mode);
  console.log("Bank Account Details:", manager.bankAccountDetails);
  return (
    <>
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate("/hotel-management/managers")}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />{" "}
        {t("hotelManagerDetails.backButton")}
      </Button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {isNewManager
            ? t("hotelManagerDetails.addNewTitle")
            : t("hotelManagerDetails.viewTitle", { name: manager.name })}
        </h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="default"
            className="bg-gray-300 text-gray-800 border-gray-300 hover:bg-gray-300 hover:text-gray-900"
            onClick={() => navigate("/hotel-management/managers")}
          >
            {t("hotelManagerDetails.cancel")}
          </Button>

          {mode === "view" && id !== "new" && (
            <Button
              onClick={() =>
                navigate(`/hotel-management/managers/${id}?mode=edit`)
              }
            >
              {t("hotelManagerDetails.edit")}
            </Button>
          )}

          {(mode === "edit" || mode === "post") && (
            <Button onClick={handleSubmit}>
              {mode === "post"
                ? t("hotelManagerDetails.create")
                : t("hotelManagerDetails.saveChanges")}
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="inline-flex gap-2 mb-4 px-2 py-1 rounded-md bg-gray-100">
          <TabsTrigger value="personal">
            {t("hotelManagerDetails.tabs.personal")}
          </TabsTrigger>
          <TabsTrigger value="hotel">
            {t("hotelManagerDetails.tabs.hotel")}
          </TabsTrigger>
          <TabsTrigger value="rooms">
            {t("hotelManagerDetails.tabs.rooms")}
          </TabsTrigger>
          <TabsTrigger value="banking">
            {t("hotelManagerDetails.tabs.banking")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="text-lg font-semibold mb-4">
                {t("hotelManagerDetails.personalInfo.sectionTitle")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <UploadField
                    disabled={isReadOnly}
                    label={t("hotelManagerDetails.personalInfo.profilePhoto")}
                    value={manager?.profilePhoto}
                    onChange={async (file) => {
                      if (file instanceof File) {
                        const uploadedData = await uploadImage(file);
                        handleChange("profilePhoto", uploadedData.url);
                      }
                    }}
                    multiple={false}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("hotelManagerDetails.personalInfo.name")}
                  </label>
                  <Input
                    disabled={isReadOnly}
                    value={manager.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("hotelManagerDetails.personalInfo.mobile")}
                  </label>
                  <Input
                    disabled={isReadOnly}
                    value={manager.mobile}
                    onChange={(e) => handleChange("mobile", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("hotelManagerDetails.personalInfo.email")}
                  </label>
                  <Input
                    disabled={isReadOnly}
                    type="email"
                    value={manager.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("hotelManagerDetails.personalInfo.status")}
                  </label>
                  {mode === "view" ? (
                    <p className="filter-input w-full bg-gray-100">
                      {manager.status}
                    </p>
                  ) : (
                    <select
                      name="status"
                      value={manager.status}
                      onChange={(e) =>
                        handleStatusChange(
                          e.target.value as HotelManager["status"]
                        )
                      }
                      className="filter-select w-full"
                    >
                      {statusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {(manager.status === "rejected" ||
                  manager.status === "blocked") && (
                  <div className="col-span-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("hotelManagerDetails.personalInfo.remark")}
                    </label>
                    <textarea
                      name="remark"
                      value={manager.remark || ""}
                      onChange={(e) =>
                        setManager({ ...manager, remark: e.target.value })
                      }
                      className="filter-input w-full h-24"
                      placeholder={t(
                        "hotelManagerDetails.personalInfo.remarkPlaceholder"
                      )}
                      required
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("hotelManagerDetails.personalInfo.chooseBranch")}
                  </label>
                  {mode === "view" ? (
                    <p className="filter-input w-full bg-gray-100">
                      {manager.branch}
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
                    {t("hotelManagerDetails.personalInfo.verificationStatus")}
                  </label>

                  {mode === "view" ? (
                    <p className="filter-input w-full bg-gray-100">
                      {manager.batchVerified
                        ? t("hotelManagerDetails.personalInfo.verified")
                        : t("hotelManagerDetails.personalInfo.notVerified")}
                    </p>
                  ) : (
                    <select
                      name="batchVerified"
                      value={
                        manager.batchVerified ? "Verified" : "Not Verified"
                      }
                      onChange={(e) =>
                        handleChange(
                          "batchVerified",
                          e.target.value === "Verified"
                        )
                      }
                      className="filter-select w-full"
                    >
                      <option value="Verified">
                        {t("hotelManagerDetails.personalInfo.verified")}
                      </option>
                      <option value="Not Verified">
                        {t("hotelManagerDetails.personalInfo.notVerified")}
                      </option>
                    </select>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="text-lg font-semibold mb-4">
                {t("hotelManagerDetails.companyInfo.sectionTitle")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("hotelManagerDetails.companyInfo.companyName")}
                  </label>
                  <Input
                    disabled={isReadOnly}
                    value={manager.companyName}
                    onChange={(e) =>
                      handleChange("companyName", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("hotelManagerDetails.companyInfo.companyAddress")}
                  </label>
                  <Textarea
                    disabled={isReadOnly}
                    value={manager.companyAddress || ""}
                    onChange={(e) =>
                      handleChange("companyAddress", e.target.value)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hotel" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("hotelManagerDetails.hotelDetails.hotelName")}
                  </label>
                  <Input
                    disabled={isReadOnly}
                    value={manager.hotelName || ""}
                    onChange={(e) => handleChange("hotelName", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("hotelManagerDetails.hotelDetails.businessLicense")}
                  </label>
                  <Input
                    disabled={isReadOnly}
                    value={manager.businessLicense || ""}
                    onChange={(e) =>
                      handleChange("businessLicense", e.target.value)
                    }
                  />
                </div>

                <div className="md:col-span-2">
                  <UploadField
                    disabled={isReadOnly}
                    label={t("hotelManagerDetails.hotelDetails.hotelPhotos")}
                    value={
                      isNewManager || !manager.hotelPhotos
                        ? null
                        : manager.hotelPhotos
                    }
                    onChange={async (files) => {
                      if (
                        Array.isArray(files) &&
                        files.every((f) => f instanceof File)
                      ) {
                        const uploadedUrls = await handleMultipleFileUpload(
                          files
                        );
                        handleChange("hotelPhotos", uploadedUrls);
                      }
                    }}
                    multiple={true}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("hotelManagerDetails.hotelDetails.city")}
                  </label>
                  <Input
                    disabled={isReadOnly}
                    value={manager.city || ""}
                    onChange={(e) => handleChange("city", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("hotelManagerDetails.hotelDetails.locality")}
                  </label>
                  <Input
                    disabled={isReadOnly}
                    value={manager.locality || ""}
                    onChange={(e) => handleChange("locality", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("hotelManagerDetails.hotelDetails.landmark")}
                  </label>
                  <Input
                    disabled={isReadOnly}
                    value={manager.landmark || ""}
                    onChange={(e) => handleChange("landmark", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("hotelManagerDetails.hotelDetails.pinCode")}
                  </label>
                  <Input
                    disabled={isReadOnly}
                    value={manager.pinCode || ""}
                    onChange={(e) => handleChange("pinCode", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("hotelManagerDetails.hotelDetails.totalRooms")}
                  </label>
                  <Input
                    disabled={isReadOnly}
                    type="number"
                    value={manager.totalRooms || ""}
                    onChange={(e) =>
                      handleChange("totalRooms", parseInt(e.target.value) || 0)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rooms" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">
                {t("hotelManagerDetails.rooms.standardRooms")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("hotelManagerDetails.rooms.pricePerNight")}
                  </label>
                  <Input
                    disabled={isReadOnly}
                    type="number"
                    value={manager.standardRooms?.price || ""}
                    onChange={(e) =>
                      handleChange("standardRooms", {
                        ...manager.standardRooms,
                        price: parseInt(e.target.value) || "",
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("hotelManagerDetails.rooms.numberOfRooms")}
                  </label>
                  <Input
                    disabled={isReadOnly}
                    type="number"
                    value={manager.standardRooms?.numberOfRooms || ""}
                    onChange={(e) =>
                      handleChange("standardRooms", {
                        ...manager.standardRooms,
                        numberOfRooms: parseInt(e.target.value) || "",
                      })
                    }
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    {t("hotelManagerDetails.rooms.amenities")}
                  </label>
                  <AmenitiesMultiSelect
                    value={manager.standardRooms?.amenities || []}
                    onChange={(selected) =>
                      handleChange("standardRooms", {
                        ...manager.standardRooms,
                        amenities: selected,
                      })
                    }
                    isReadOnly={isReadOnly}
                  />
                </div>

                <div className="col-span-2">
                  <UploadField
                    disabled={isReadOnly}
                    label={t("hotelManagerDetails.rooms.roomPhotos")}
                    value={
                      isNewManager || !manager.standardRooms?.photos
                        ? null
                        : manager.standardRooms?.photos
                    }
                    onChange={async (files) => {
                      if (
                        Array.isArray(files) &&
                        files.every((f) => f instanceof File)
                      ) {
                        const uploadedUrls = await handleMultipleFileUpload(
                          files
                        );
                        handleChange("standardRooms", {
                          ...manager.standardRooms,
                          photos: uploadedUrls,
                        });
                      }
                    }}
                    multiple={true}
                  />
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-4 mt-8">
                {t("hotelManagerDetails.rooms.luxuryRooms")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("hotelManagerDetails.rooms.pricePerNight")}
                  </label>
                  <Input
                    disabled={isReadOnly}
                    type="number"
                    value={manager.luxuryRooms?.price || ""}
                    onChange={(e) =>
                      handleChange("luxuryRooms", {
                        ...manager.luxuryRooms,
                        price: parseInt(e.target.value) || "",
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("hotelManagerDetails.rooms.numberOfRooms")}
                  </label>
                  <Input
                    disabled={isReadOnly}
                    type="number"
                    value={manager.luxuryRooms?.numberOfRooms || ""}
                    onChange={(e) =>
                      handleChange("luxuryRooms", {
                        ...manager.luxuryRooms,
                        numberOfRooms: parseInt(e.target.value) || "",
                      })
                    }
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    {t("hotelManagerDetails.rooms.amenities")}
                  </label>
                  <AmenitiesMultiSelect
                    value={manager.luxuryRooms?.amenities || []}
                    onChange={(selected) =>
                      handleChange("luxuryRooms", {
                        ...manager.luxuryRooms,
                        amenities: selected,
                      })
                    }
                    isReadOnly={isReadOnly}
                  />
                </div>
                <div className="col-span-2">
                  <UploadField
                    disabled={isReadOnly}
                    label="Room Photos"
                    value={
                      isNewManager || !manager.luxuryRooms?.photos
                        ? null
                        : manager.luxuryRooms?.photos
                    }
                    onChange={async (files) => {
                      if (
                        Array.isArray(files) &&
                        files.every((f) => f instanceof File)
                      ) {
                        const uploadedUrls = await handleMultipleFileUpload(
                          files
                        );
                        handleChange("luxuryRooms", {
                          ...manager.luxuryRooms,
                          photos: uploadedUrls,
                        });
                      }
                    }}
                    multiple={true}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("hotelManagerDetails.rooms.checkInTime")}
                  </label>
                  <Input
                    disabled={isReadOnly}
                    type="time"
                    value={manager.checkInTime || ""}
                    onChange={(e) =>
                      handleChange("checkInTime", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("hotelManagerDetails.rooms.checkOutTime")}
                  </label>
                  <Input
                    disabled={isReadOnly}
                    type="time"
                    value={manager.checkOutTime || ""}
                    onChange={(e) =>
                      handleChange("checkOutTime", e.target.value)
                    }
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    {t("hotelManagerDetails.rooms.hotelAmenities")}
                  </label>
                  {/* <AmenitiesMultiSelect
                    value={manager.amenities || []}
                    onChange={(selected) =>
                      handleChange("amenities", {
                        ...manager.amenities,
                        amenities: selected,
                      })
                    }
                    isReadOnly={isReadOnly}
                  /> */}
                  <AmenitiesMultiSelect
                    value={manager.amenities || []}
                    onChange={(selected) => handleChange("amenities", selected)}
                    isReadOnly={isReadOnly}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  {mode === "view" &&
                    manager.policyDocuments &&
                    manager.policyDocuments.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          {t("hotelManagerDetails.rooms.policyDocument")}
                        </label>
                        <div className="flex flex-col gap-2">
                          {manager.policyDocuments.map((doc) => (
                            <a
                              key={doc._id}
                              href={doc.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-blue-600 hover:underline"
                            >
                              <FileText className="w-5 h-5" />
                              <span>{doc.fileName}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                  {mode !== "view" && (
                    <UploadField
                      disabled={isReadOnly}
                      label={t("hotelManagerDetails.rooms.policyDocuments")}
                      value={
                        isNewManager || !manager.policyDocuments
                          ? null
                          : manager.policyDocuments
                      }
                      onChange={async (file) => {
                        if (!file) return;

                        const filesArray = Array.isArray(file) ? file : [file];

                        const uploadedFiles = await Promise.all(
                          filesArray.map(async (f) => {
                            const uploadedData = await uploadImage(f);
                            return uploadedData;
                          })
                        );

                        handleChange("policyDocuments", uploadedFiles);
                      }}
                      multiple
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="banking" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("hotelManagerDetails.banking.bankName")}
                  </label>
                  <Input
                    disabled={isReadOnly}
                    value={manager.bankName || ""}
                    onChange={(e) => handleChange("bankName", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("hotelManagerDetails.banking.bankAccountNumber")}
                  </label>
                  <Input
                    disabled={isReadOnly}
                    value={manager.bankAccountNumber || ""}
                    onChange={(e) =>
                      handleChange("bankAccountNumber", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("hotelManagerDetails.banking.accountHolderName")}
                  </label>
                  <Input
                    disabled={isReadOnly}
                    value={manager.accountHolderName || ""}
                    onChange={(e) =>
                      handleChange("accountHolderName", e.target.value)
                    }
                  />
                </div>

                <div>
                  {/* View Mode */}
                  {mode === "view" && manager.bankAccountDetails && (
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t("hotelManagerDetails.banking.bankAccountDocument")}
                      </label>
                      <a
                        href={
                          typeof manager.bankAccountDetails === "string"
                            ? manager.bankAccountDetails
                            : manager.bankAccountDetails.url ||
                              manager.bankAccountDetails.fileUrl
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:underline"
                      >
                        <FileText className="w-5 h-5" />
                        <span>
                          {typeof manager.bankAccountDetails === "string"
                            ? "Bank Document"
                            : manager.bankAccountDetails.fileName ||
                              "Bank Document"}
                        </span>
                      </a>
                    </div>
                  )}

                  {/* Edit Mode */}
                  {mode !== "view" && (
                    <UploadField
                      disabled={isReadOnly}
                      label={t(
                        "hotelManagerDetails.banking.bankAccountDetails"
                      )}
                      value={manager.bankAccountDetails || null}
                      multiple={false}
                      onChange={async (file) => {
                        if (!file) return;

                        const filesArray = Array.isArray(file) ? file : [file];

                        const uploadedFiles = await Promise.all(
                          filesArray.map(async (f) => {
                            const uploadedData = await handleFileUpload(f);
                            return uploadedData;
                          })
                        );
                        handleChange("bankAccountDetails", uploadedFiles[0]);
                      }}
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default HotelManagerDetails;
