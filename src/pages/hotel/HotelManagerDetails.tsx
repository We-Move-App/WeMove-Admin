import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import Loader from "@/components/ui/loader";
import NotFoundImage from "@/assets/not-found-illustration.svg";

// Mock data for a hotel manager
const mockHotelManager: HotelManager = {
  id: "1",
  name: "Grand Plaza Hotel",
  mobile: "9876543210",
  email: "manager@grandplaza.com",
  status: "Approved",
  profilePhoto: "/placeholder.svg",
  hotelName: "Grand Plaza Hotel",
  businessLicense: "/placeholder.svg",
  hotelPhotos: ["/placeholder.svg", "/placeholder.svg"],
  address: "123 Main Street",
  city: "New York",
  locality: "Manhattan",
  landmark: "Central Park",
  pinCode: "10001",
  totalRooms: 120,
  standardRooms: {
    price: 100,
    numberOfRooms: 80,
    amenities: ["WiFi", "TV", "AC"],
    photos: ["/placeholder.svg"],
  },
  luxuryRooms: {
    price: 200,
    numberOfRooms: 40,
    amenities: ["WiFi", "TV", "AC", "Mini Bar", "Jacuzzi"],
    photos: ["/placeholder.svg"],
  },
  checkInTime: "14:00",
  checkOutTime: "12:00",
  amenities: ["Pool", "Gym", "Restaurant", "Spa"],
  policyDocuments: "/placeholder.svg",
  bankAccountNumber: "1234567890",
  bankAccountDetails: "/placeholder.svg",
  idCardFront: "/placeholder.svg",
  idCardBack: "/placeholder.svg",
};

const HotelManagerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewManager = id === "new";

  const [manager, setManager] = useState<Partial<HotelManager> | null>(null);

  const [loading, setLoading] = useState(true);

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
        const response = await axiosInstance.get(
          `/hotel-management/hotel-managers/${id}`
        );
        const userData = response.data?.data?.user;
        const bankData = response.data?.data?.bank;

        if (userData) {
          setManager({
            id: userData._id || "",
            profilePhoto: userData?.avatar?.url || "",
            name: userData.fullName || "",
            mobile: userData.phoneNumber || "",
            email: userData.email || "",
            status: userData.verificationStatus || "Pending",
            bankAccountNumber: bankData?.accountNumber || "",
            bankAccountDetails: bankData?.bankDocs.url || "",
          });
        } else {
          setManager(null);
        }
      } catch (error) {
        console.error("Failed to fetch bus operator:", error);
        setManager(null);
        toast({
          title: "Error",
          description: "Failed to fetch bus operator details.",
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

  const handleSubmit = () => {
    // Here you would send data to an API
    console.log("Saving hotel manager:", manager);
    toast({
      title: isNewManager ? "Hotel Manager Created" : "Hotel Manager Updated",
      description: `Successfully ${
        isNewManager ? "created" : "updated"
      } hotel manager: ${manager.name}`,
    });
    navigate("/hotel-management/managers");
  };

  if (loading) return <Loader />;
  // if (!manager) return <p>Hotel Manager not found.</p>;
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
              onValueChange={(value: any) => handleChange("status", value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>
          )}
          <Button onClick={handleSubmit}>Save Changes</Button>
        </div>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-4 mb-4">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="hotel">Hotel Details</TabsTrigger>
          <TabsTrigger value="rooms">Rooms</TabsTrigger>
          <TabsTrigger value="banking">Banking & ID</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <UploadField
                    label="Profile Photo"
                    value={manager.profilePhoto}
                    onChange={(value) => handleChange("profilePhoto", value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <Input
                    value={manager.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Mobile
                  </label>
                  <Input
                    value={manager.mobile}
                    onChange={(e) => handleChange("mobile", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={manager.email}
                    onChange={(e) => handleChange("email", e.target.value)}
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
                    value={manager.hotelName || ""}
                    onChange={(e) => handleChange("hotelName", e.target.value)}
                  />
                </div>
                <div>
                  <UploadField
                    label="Business License"
                    value={manager.businessLicense}
                    onChange={(value) => handleChange("businessLicense", value)}
                  />
                </div>
                <div>
                  <UploadField
                    label="Hotel Photos"
                    value={
                      manager.hotelPhotos ? manager.hotelPhotos[0] : undefined
                    }
                    onChange={(value) => handleChange("hotelPhotos", [value])}
                    multiple={true}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Address
                  </label>
                  <Textarea
                    value={manager.address || ""}
                    onChange={(e) => handleChange("address", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <Input
                    value={manager.city || ""}
                    onChange={(e) => handleChange("city", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Locality
                  </label>
                  <Input
                    value={manager.locality || ""}
                    onChange={(e) => handleChange("locality", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Landmark
                  </label>
                  <Input
                    value={manager.landmark || ""}
                    onChange={(e) => handleChange("landmark", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Pin Code
                  </label>
                  <Input
                    value={manager.pinCode || ""}
                    onChange={(e) => handleChange("pinCode", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Total Rooms
                  </label>
                  <Input
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
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Amenities (comma separated)
                  </label>
                  <Input
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
                </div>
                <div className="col-span-2">
                  <UploadField
                    label="Room Photos"
                    value={manager.standardRooms?.photos?.[0]}
                    onChange={(value) =>
                      handleChange("standardRooms", {
                        ...manager.standardRooms,
                        photos: [value],
                      })
                    }
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
                  <label className="block text-sm font-medium mb-1">
                    Amenities (comma separated)
                  </label>
                  <Input
                    value={manager.luxuryRooms?.amenities?.join(", ") || ""}
                    onChange={(e) =>
                      handleChange("luxuryRooms", {
                        ...manager.luxuryRooms,
                        amenities: e.target.value
                          .split(",")
                          .map((item) => item.trim())
                          .filter(Boolean),
                      })
                    }
                  />
                </div>
                <div className="col-span-2">
                  <UploadField
                    label="Room Photos"
                    value={manager.luxuryRooms?.photos?.[0]}
                    onChange={(value) =>
                      handleChange("luxuryRooms", {
                        ...manager.luxuryRooms,
                        photos: [value],
                      })
                    }
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
                    type="time"
                    value={manager.checkOutTime || ""}
                    onChange={(e) =>
                      handleChange("checkOutTime", e.target.value)
                    }
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Hotel Amenities (comma separated)
                  </label>
                  <Input
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
                </div>
                <div className="col-span-2">
                  <UploadField
                    label="Policy Documents"
                    value={manager.policyDocuments}
                    onChange={(value) => handleChange("policyDocuments", value)}
                  />
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
                    Bank Account Number
                  </label>
                  <Input
                    value={manager.bankAccountNumber || ""}
                    onChange={(e) =>
                      handleChange("bankAccountNumber", e.target.value)
                    }
                  />
                </div>
                <div>
                  <UploadField
                    label="Bank Account Details"
                    value={manager.bankAccountDetails}
                    onChange={(value) =>
                      handleChange("bankAccountDetails", value)
                    }
                  />
                </div>
                <div>
                  <UploadField
                    label="ID Card Front"
                    value={manager.idCardFront}
                    onChange={(value) => handleChange("idCardFront", value)}
                  />
                </div>
                <div>
                  <UploadField
                    label="ID Card Back"
                    value={manager.idCardBack}
                    onChange={(value) => handleChange("idCardBack", value)}
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

export default HotelManagerDetails;
