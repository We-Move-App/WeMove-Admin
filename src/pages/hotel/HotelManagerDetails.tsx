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
import PolicyDocuments from "@/components/hotel/PolicyDocuments";


const HotelManagerDetails = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const modeParam = searchParams.get("mode");
  const mode = modeParam === "post"
    ? "post"
    : modeParam === "edit"
      ? "edit"
      : "view";

  const isReadOnly = mode === "view";
  const navigate = useNavigate();
  const isNewManager = id === "new";

  const [manager, setManager] = useState<Partial<HotelManager> | null>(null);

  const [loading, setLoading] = useState(true);





  const toTitleCaseStatus = (status: string): HotelManager["status"] => {
    const map: Record<string, HotelManager["status"]> = {
      active: "active",
      inactive: "inactive",
      pending: "Pending",
      approved: "Approved",
      rejected: "Rejected",
      submitted: "Submitted",
      blocked: "Blocked",
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
          mobile: "",
          email: "",
          status: "Pending",
          bankAccountNumber: "",
          bankAccountDetails: "",
        });
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get(`/hotel-management/hotel-managers/hotel/${id}`);
        console.log("API Response:", response.data);
        const managerData = response.data?.data?.hotelManager;
        // console.log("Manager Data:", managerData);
        const hotelData = response.data?.data?.hotel;
        // console.log("Hotel Data:", hotelData);
        const hotelAddress = response.data?.data?.hotelAddress?.address || {};
        // console.log("Hotel Address:", hotelAddress);
        const roomType = response.data?.data?.roomTypes || {};
        // console.log("Room Types:", roomType);
        const bankData = response.data?.data?.hotelManagerBank;
        // console.log("Bank Data:", bankData);
        const apiStatus = managerData?.verificationStatus || "pending";
        const standardRoom = roomType.find(r => r.roomType === "standard");
        const luxuryRoom = roomType.find(r => r.roomType === "luxury");
        const hotelPolicy = response.data?.data?.hotelPolicies || {};
        // console.log("Hotel Policy:", hotelPolicy);



        if (managerData) {
          setManager({
            id: managerData._id || "",
            profilePhoto: managerData?.avatar?.url || "",
            name: managerData.fullName || "",
            mobile: managerData.phoneNumber || "",
            email: managerData.email || "",
            companyName: managerData.companyName || "",
            companyAddress: managerData.companyAddress || "",
            status: toTitleCaseStatus(apiStatus),
            // Hotel Details
            hotelName: hotelData?.hotelName || "",
            businessLicense: hotelData?.businessLicense || "",
            hotelPhotos: hotelData?.images?.map(img => img.url) || [],
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
                amenities: standardRoom.amenities?.map(a => a.name) || [],
                photos: standardRoom.images?.map(img => img.url) || []
              }
              : { numberOfRooms: 0, price: 0, amenities: [], photos: [] },
            luxuryRooms: luxuryRoom
              ? {
                numberOfRooms: parseInt(luxuryRoom.numberOfRoom, 10) || 0,
                price: luxuryRoom.roomPrice,
                amenities: luxuryRoom.amenities?.map(a => a.name) || [],
                photos: luxuryRoom.images?.map(img => img.url) || []
              }
              : { numberOfRooms: 0, price: 0, amenities: [], photos: [] },

            // Policy Info
            checkInTime: hotelPolicy?.checkInTime,
            checkOutTime: hotelPolicy?.checkOutTime,
            amenities: hotelPolicy?.amenities?.map(a => a.name) || [],
            policyDocuments:
              hotelPolicy?.uploadDocuments?.[0]?.fileUrl || null,


            // Bank Details
            bankName: bankData?.bankName || "",
            accountHolderName: bankData?.accountHolderName || "",
            bankAccountNumber: bankData?.accountNumber || "",
            bankAccountDetails: bankData?.bankDocs?.url || "",
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

  useEffect(() => {
    console.log("Policy docs after state update:", manager?.policyDocuments);
  }, [manager]);



  const handleChange = (field: keyof HotelManager, value: any) => {
    setManager((prev) => ({ ...prev, [field]: value }));
  };




  // const uploadImage = async (file: File): Promise<string> => {
  //   const formData = new FormData();
  //   formData.append("image", file);

  //   const res = await fileUploadInstance.post("/file/upload", formData, {
  //     headers: { "Content-Type": "multipart/form-data" },
  //   });

  //   console.log("Uploaded file URL:", res.data?.data?.url);
  //   return res.data?.data?.url;
  // };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file); // backend expects field name "image"?

    const res = await fileUploadInstance.post("/file/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log("Uploaded file URL:", res.data?.data?.url);
    return res.data?.data?.url;
  };



  const handleFileUpload = async (file: File) => {
    const uploadedUrl = await uploadImage(file);
    return uploadedUrl;
  };

  const handleMultipleFileUpload = async (files: File[]) => {
    const uploadedUrls = await Promise.all(files.map(file => uploadImage(file)));
    return uploadedUrls;
  };





  const handleSubmit = async () => {
    try {
      const payload = {
        profileInfo: {
          fullName: manager.name,
          email: manager.email,
          phoneNumber: manager.mobile,
          companyName: manager.companyName,
          companyAddress: manager.companyAddress,
          avatar: manager.profilePhoto ? { url: manager.profilePhoto } : null,
        },
        bankInfo: {
          accountNumber: manager.bankAccountNumber,
          bankDocs: manager.bankAccountDetails && manager.bankAccountDetails.length > 0
            ? { url: manager.bankAccountDetails[0] }
            : null,
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
          standardAmenities: (manager.standardRooms?.amenities || []).map(a => ({
            name: a,
            status: true,
          })),
          standardImages: manager.standardRooms?.photos || [],
          luxuryRoomCount: manager.luxuryRooms?.numberOfRooms || 0,
          luxuryRoomPrice: manager.luxuryRooms?.price || 0,
          luxuryAmenities: (manager.luxuryRooms?.amenities || []).map(a => ({
            name: a,
            status: true,
          })),
          luxuryImages: manager.luxuryRooms?.photos || [],
        },
        policyInfo: {
          checkInTime: manager.checkInTime,
          checkOutTime: manager.checkOutTime,
          amenities: (manager.amenities || []).map(a => ({ name: a, status: true })),
          uploadDocuments: manager.policyDocuments
            ? Array.isArray(manager.policyDocuments)
              ? manager.policyDocuments.map((url: string, i: number) => ({ name: `Policy Doc ${i + 1}`, fileUrl: url }))
              : [{ name: "Policy Doc", fileUrl: manager.policyDocuments }]
            : [],
        },
      };

      console.log("Payload being sent:", JSON.stringify(payload, null, 2));

      if (mode === "post") {
        await axiosInstance.post("/hotel-management/hotel-managers/register", payload);
      } else if (mode === "edit") {
        await axiosInstance.put(`/hotel-management/hotel-manager/update/${id}`, payload);
      }

      toast({
        title: mode === "post" ? "Created" : "Updated",
        description: `${manager.name}`,
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



  const handleStatusChange = async (value: HotelManager["status"]) => {
    try {
      setManager((prev) => ({ ...prev!, status: value }));

      await axiosInstance.put(
        `/hotel-management/hotel-managers/verify/${id}`,
        {
          status: value.toLowerCase(),
        }
      );

      toast({
        title: "Status Updated",
        description: `Hotel manager status changed to ${value}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

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

  return (
    <>
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate("/hotel-management/managers")}
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Back to Hotel Managers
      </Button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {isNewManager
            ? "Add New Hotel Manager"
            : `Hotel Manager: ${manager.name}`}
        </h1>
        <div className="flex gap-2">
          {!isNewManager && (

            <Select
              value={manager.status}
              onValueChange={(value: HotelManager["status"]) => handleStatusChange(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="Submitted">Submitted</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                <SelectItem value="Blocked">Blocked</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>

          )}
          {/* <Button onClick={handleSubmit}>Save Changes</Button> */}
          <div className="flex gap-2">
            {mode === "view" && id !== "new" && (
              <Button onClick={() => navigate(`/hotel-management/managers/${id}?mode=edit`)}>
                Edit
              </Button>
            )}

            {(mode === "edit" || mode === "post") && (
              <Button onClick={handleSubmit}>
                {mode === "post" ? "Create Manager" : "Save Changes"}
              </Button>
            )}
          </div>
        </div>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-5 mb-4">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="hotel">Hotel Details</TabsTrigger>
          <TabsTrigger value="rooms">Rooms</TabsTrigger>
          <TabsTrigger value="banking">Banking</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="text-lg font-semibold mb-4">Personal Iinfo</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <UploadField
                    disabled={isReadOnly}
                    label="Profile Photo"
                    value={isNewManager || !manager.profilePhoto ? null : manager.profilePhoto}
                    onChange={async (file) => {
                      if (file instanceof File) {
                        const uploadedUrl = await uploadImage(file);
                        handleChange("profilePhoto", uploadedUrl);
                      }
                    }}
                    multiple={false}
                  />

                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <Input
                    disabled={isReadOnly}
                    value={manager.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Mobile
                  </label>
                  <Input
                    disabled={isReadOnly}
                    value={manager.mobile}
                    onChange={(e) => handleChange("mobile", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <Input
                    disabled={isReadOnly}
                    type="email"
                    value={manager.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="text-lg font-semibold mb-4">Company Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Company Name</label>
                  <Input
                    disabled={isReadOnly}
                    value={manager.companyName}
                    onChange={(e) => handleChange("companyName", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Company Address
                  </label>
                  <Textarea
                    disabled={isReadOnly}
                    value={manager.companyAddress || ""}
                    onChange={(e) => handleChange("companyAddress", e.target.value)}
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
                    Hotel Name
                  </label>
                  <Input
                    disabled={isReadOnly}
                    value={manager.hotelName || ""}
                    onChange={(e) => handleChange("hotelName", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Business License
                  </label>
                  <Input
                    disabled={isReadOnly}
                    value={manager.businessLicense || ""}
                    onChange={(e) => handleChange("businessLicense", e.target.value)}
                  />
                </div>


                <div className="md:col-span-2">
                  <UploadField
                    disabled={isReadOnly}
                    label="Hotel Photos"
                    value={
                      isNewManager || !manager.hotelPhotos
                        ? null
                        : manager.hotelPhotos
                    }
                    onChange={async (files) => {
                      if (Array.isArray(files) && files.every(f => f instanceof File)) {
                        const uploadedUrls = await handleMultipleFileUpload(files);
                        handleChange("hotelPhotos", uploadedUrls);
                      }
                    }}
                    multiple={true}
                  />
                </div>


                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <Input
                    disabled={isReadOnly}
                    value={manager.city || ""}
                    onChange={(e) => handleChange("city", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Locality
                  </label>
                  <Input
                    disabled={isReadOnly}
                    value={manager.locality || ""}
                    onChange={(e) => handleChange("locality", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Landmark
                  </label>
                  <Input
                    disabled={isReadOnly}
                    value={manager.landmark || ""}
                    onChange={(e) => handleChange("landmark", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Pin Code
                  </label>
                  <Input
                    disabled={isReadOnly}
                    value={manager.pinCode || ""}
                    onChange={(e) => handleChange("pinCode", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Total Rooms
                  </label>
                  <Input
                    disabled={isReadOnly}
                    type="number"
                    value={manager.totalRooms || 0}
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
              <h3 className="text-lg font-semibold mb-4">Standard Rooms</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Price (per night)
                  </label>
                  <Input
                    disabled={isReadOnly}
                    type="number"
                    value={manager.standardRooms?.price || 0}
                    onChange={(e) =>
                      handleChange("standardRooms", {
                        ...manager.standardRooms,
                        price: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Number of Rooms
                  </label>
                  <Input
                    disabled={isReadOnly}
                    type="number"
                    value={manager.standardRooms?.numberOfRooms || 0}
                    onChange={(e) =>
                      handleChange("standardRooms", {
                        ...manager.standardRooms,
                        numberOfRooms: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                {/* <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Amenities (comma separated)
                  </label>
                  <Input
                    disabled={isReadOnly}
                    value={manager.standardRooms?.amenities?.join(", ") || ""}
                    onChange={(e) =>
                      handleChange("standardRooms", {
                        ...manager.standardRooms,
                        amenities: e.target.value
                          .split(",")
                          .map((item) => item.trim())
                          .filter(Boolean),
                      })
                    }
                  />
                </div> */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Amenities</label>
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
                    label="Room Photos"
                    value={isNewManager || !manager.standardRooms?.photos ? null : manager.standardRooms?.photos}
                    onChange={async (files) => {
                      if (Array.isArray(files) && files.every(f => f instanceof File)) {
                        const uploadedUrls = await handleMultipleFileUpload(files);
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

              <h3 className="text-lg font-semibold mb-4 mt-8">Luxury Rooms</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Price (per night)
                  </label>
                  <Input
                    disabled={isReadOnly}
                    type="number"
                    value={manager.luxuryRooms?.price || 0}
                    onChange={(e) =>
                      handleChange("luxuryRooms", {
                        ...manager.luxuryRooms,
                        price: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Number of Rooms
                  </label>
                  <Input
                    disabled={isReadOnly}
                    type="number"
                    value={manager.luxuryRooms?.numberOfRooms || 0}
                    onChange={(e) =>
                      handleChange("luxuryRooms", {
                        ...manager.luxuryRooms,
                        numberOfRooms: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Amenities</label>
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
                    value={isNewManager || !manager.luxuryRooms?.photos ? null : manager.luxuryRooms?.photos}
                    onChange={async (files) => {
                      if (Array.isArray(files) && files.every(f => f instanceof File)) {
                        const uploadedUrls = await handleMultipleFileUpload(files);
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
                    Check-in Time
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
                    Check-out Time
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
                {/* <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Hotel Amenities (comma separated)
                  </label>
                  <Input
                    disabled={isReadOnly}
                    value={manager.amenities?.join(", ") || ""}
                    onChange={(e) =>
                      handleChange(
                        "amenities",
                        e.target.value
                          .split(",")
                          .map((item) => item.trim())
                          .filter(Boolean)
                      )
                    }
                  />
                </div> */}
                {/* <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Hotel Amenities</label>
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
                </div> */}
                <div className="col-span-2">
                  <UploadField
                    disabled={isReadOnly}
                    label="Policy Documents"
                    value={
                      isNewManager || !manager.policyDocuments
                        ? null
                        : manager.policyDocuments
                    }
                    onChange={async (file) => {
                      if (file instanceof File) {
                        const uploadedUrl = await handleFileUpload(file);
                        handleChange("policyDocuments", [
                          { name: file.name, fileUrl: uploadedUrl }
                        ]);
                      }
                    }}
                    multiple
                  />
                  {/* <PolicyDocuments
                    documents={
                      manager.policyDocuments
                        ? Array.isArray(manager.policyDocuments)
                          ? manager.policyDocuments.map(url => ({ fileUrl: url }))
                          : [{ fileUrl: manager.policyDocuments }]
                        : []
                    }
                  /> */}
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
                    Bank Name
                  </label>
                  <Input
                    disabled={isReadOnly}
                    value={manager.bankName || ""}
                    onChange={(e) =>
                      handleChange("bankName", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Bank Account Number
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
                    Account Holder Name
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
                  {/* <UploadField
                    disabled={isReadOnly}
                    label="Bank Account Details"
                    value={
                      isNewManager || !manager.bankAccountDetails
                        ? null
                        : manager.bankAccountDetails
                    }
                    onChange={async (files) => {
                      if (!files) return;

                      const filesArray = Array.isArray(files) ? files : [files];

                      const uploadedFiles = await Promise.all(
                        filesArray.map(async (file) => {
                          const uploadedUrl = await handleFileUpload(file);
                          return { name: file.name, fileUrl: uploadedUrl };
                        })
                      );

                      handleChange("bankAccountDetails", uploadedFiles);
                    }}

                    multiple
                  /> */}
                  <UploadField
                    disabled={isReadOnly}
                    label="Bank Account Details"
                    value={manager.bankAccountDetails || null}
                    onChange={async (file) => {
                      if (!file) return;
                      const filesArray = Array.isArray(file) ? file : [file];

                      const uploadedFiles = await Promise.all(
                        filesArray.map(async (f) => {
                          const uploadedUrl = await handleFileUpload(f);
                          return uploadedUrl; // store only the URL
                        })
                      );

                      handleChange("bankAccountDetails", uploadedFiles); // now it's string[]
                    }}
                    multiple
                  />


                  {/* <PolicyDocuments
                    documents={
                      manager.hotelManagerBank?.bankDocs
                        ? [
                          {
                            name: "Bank Document",
                            fileUrl: manager.hotelManagerBank.bankDocs.url,
                          },
                        ]
                        : []
                    }
                  /> */}
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
