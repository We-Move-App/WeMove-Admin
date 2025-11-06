import { useEffect, useState } from "react";
import { Plus, Percent, DollarSign } from "lucide-react";
// import Layout from '@/components/layout/Layout';
import DataTable from "@/components/ui/DataTable";
import { Commission } from "@/types/admin";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import axiosInstance from "@/api/axiosInstance";
import { useTranslation } from "react-i18next";

// Modified mock data to include commission type
const mockCommissions: Commission[] = [
  {
    id: "1",
    serviceType: "Bus",
    percentage: 10,
    fixedRate: null,
    commissionType: "percentage",
    // effectiveFrom: "2023-01-01T00:00",
    // effectiveTo: "2023-12-31T23:59",
    isActive: true,
  },
  {
    id: "2",
    serviceType: "Hotel",
    percentage: 12,
    fixedRate: null,
    commissionType: "percentage",
    // effectiveFrom: "2023-01-01T00:00",
    // effectiveTo: "2023-12-31T23:59",
    isActive: true,
  },
  {
    id: "3",
    serviceType: "Taxi",
    percentage: null,
    fixedRate: 50,
    commissionType: "fixed",
    // effectiveFrom: "2023-01-01T00:00",
    // effectiveTo: "2023-12-31T23:59",
    isActive: true,
  },
  {
    id: "4",
    serviceType: "Bike",
    percentage: 8,
    fixedRate: null,
    commissionType: "percentage",
    // effectiveFrom: "2023-01-01T00:00",
    // effectiveTo: "2023-12-31T23:59",
    isActive: true,
  },
];

const CommissionManagement = () => {
  // const [commissions, setCommissions] = useState<Commission[]>(mockCommissions);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCommission, setCurrentCommission] = useState<Commission>({
    id: "",
    serviceType: "Bus",
    percentage: 0,
    fixedRate: null,
    commissionType: "percentage",
    // effectiveFrom: new Date().toISOString().split(".")[0].slice(0, 16),
    // effectiveTo: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
    //   .toISOString()
    //   .split(".")[0]
    //   .slice(0, 16),
    isActive: true,
  });

  const [commissions, setCommissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { t, i18n } = useTranslation();

  // useEffect(() => {
  //   const fetchCommissions = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await axiosInstance.get(
  //         "/commission-management/get-all"
  //       );

  //       const capitalizeFirstLetter = (str: string) =>
  //         str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

  //       const formatStatus = (status: string) => {
  //         switch (status) {
  //           case "in_active":
  //             return "Inactive";
  //           case "active":
  //             return "Active";
  //           default:
  //             return capitalizeFirstLetter(status);
  //         }
  //       };

  //       const mapped = response.data.data.map((item: any) => ({
  //         id: item._id,
  //         serviceType: capitalizeFirstLetter(item.serviceType),
  //         commissionType: item.commissionType,
  //         percentage:
  //           item.commissionType === "percentage"
  //             ? item.commissionPercentage
  //             : null,
  //         fixedRate:
  //           item.commissionType === "fixed" ? item.commissionRate : null,
  //         // effectiveFrom: item.startDate,
  //         // effectiveTo: item.endDate,
  //         status: formatStatus(item.status),
  //         isActive: item.status === "active",
  //       }));

  //       setCommissions(mapped);
  //     } catch (error) {
  //       console.error("Error fetching commissions:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchCommissions();
  // }, []);

  const fetchCommissions = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        "/commission-management/get-all"
      );

      const capitalizeFirstLetter = (str: string) =>
        str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

      const formatStatus = (status: string) => {
        switch (status) {
          case "in_active":
            return "Inactive";
          case "active":
            return "Active";
          default:
            return capitalizeFirstLetter(status);
        }
      };

      const mapped = response.data.data.map((item: any) => ({
        id: item._id,
        serviceType: capitalizeFirstLetter(item.serviceType),
        commissionType: item.commissionType,
        percentage:
          item.commissionType === "percentage"
            ? item.commissionPercentage
            : null,
        fixedRate: item.commissionType === "fixed" ? item.commissionRate : null,
        status: formatStatus(item.status),
        isActive: item.status === "active",
      }));

      setCommissions(mapped);
    } catch (error) {
      console.error("Error fetching commissions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommissions();
  }, []);

  const handleAddNew = () => {
    setIsEditing(false);
    setCurrentCommission({
      id: undefined,
      serviceType: "Bus",
      percentage: 0,
      fixedRate: null,
      commissionType: "percentage",
      // effectiveFrom: new Date().toISOString().split(".")[0].slice(0, 16),
      // effectiveTo: new Date(
      //   new Date().setFullYear(new Date().getFullYear() + 1)
      // )
      //   .toISOString()
      //   .split(".")[0]
      //   .slice(0, 16),
      isActive: true,
    });
    setIsDialogOpen(true);
  };

  const handleEditCommission = async (commission: Commission) => {
    setIsEditing(true);

    try {
      const res = await axiosInstance.get(
        `/commission-management/get/${commission.id}`
      );

      if (res.status === 200) {
        const data = res.data.data;

        const mappedCommission: Commission = {
          id: data._id,
          serviceType:
            data.serviceType.charAt(0).toUpperCase() +
            data.serviceType.slice(1), // e.g. "bus" -> "Bus"
          commissionType: data.commissionType,
          percentage:
            data.commissionType === "percentage"
              ? data.commissionPercentage
              : null,
          fixedRate:
            data.commissionType === "fixed" ? data.commissionRate : null,
          // effectiveFrom: new Date(data.startDate).toISOString().slice(0, 16),
          // effectiveTo: new Date(data.endDate).toISOString().slice(0, 16),
          isActive: data.status === "active",
        };

        setCurrentCommission(mappedCommission);
        setIsDialogOpen(true);
      }
    } catch (error) {
      console.error("Error fetching commission:", error);
    }
  };

  const handleInputChange = (field: keyof Commission, value: any) => {
    setCurrentCommission((prev) => ({ ...prev, [field]: value }));
  };

  const handleCommissionTypeChange = (type: "percentage" | "fixed") => {
    setCurrentCommission((prev) => ({
      ...prev,
      commissionType: type,
      percentage: type === "percentage" ? prev.percentage || 0 : null,
      fixedRate: type === "fixed" ? prev.fixedRate || 0 : null,
    }));
  };

  const handleSaveCommission = async () => {
    try {
      let payload: any = {
        commissionType: currentCommission.commissionType,
        // startDate: new Date(currentCommission.effectiveFrom).toISOString(),
        // endDate: new Date(currentCommission.effectiveTo).toISOString(),
        status: currentCommission.isActive ? "active" : "in_active",
      };

      if (currentCommission.commissionType === "fixed") {
        payload.commissionRate = currentCommission.fixedRate;
      } else if (currentCommission.commissionType === "percentage") {
        payload.commissionPercentage = currentCommission.percentage;
      }

      let res;
      if (currentCommission.id) {
        // 🔹 UPDATE
        res = await axiosInstance.put(
          `/commission-management/update/${currentCommission.id}`,
          payload
        );
      } else {
        // 🔹 CREATE
        payload.serviceType = currentCommission.serviceType?.toLowerCase();
        res = await axiosInstance.post(
          "/commission-management/create",
          payload
        );
      }

      // if (res.status === 200 || res.status === 201) {
      //   toast({
      //     title: "Success",
      //     description: "Commission saved successfully",
      //   });
      //   setIsDialogOpen(false);
      // }
      if (res.status === 200 || res.status === 201) {
        toast({
          title: "Success",
          description: "Commission saved successfully",
        });
        setIsDialogOpen(false);

        // 🔹 Refresh the table
        fetchCommissions();
      }
    } catch (error: any) {
      console.error("Error saving commission:", error);

      // extract backend message if available
      const message =
        error.response?.data?.message || "Failed to save commission";

      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
    }
  };

  const toggleCommissionStatus = async (id: string) => {
    try {
      // find the commission
      const commission = commissions.find((c) => c.id === id);
      if (!commission) return;

      // prepare payload with only status
      const newStatus = commission.isActive ? "in_active" : "active";
      const payload = { status: newStatus };

      // call API
      await axiosInstance.put(`/commission-management/update/${id}`, payload);

      // update local state
      setCommissions((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, isActive: newStatus === "active" } : item
        )
      );

      // toast message
      toast({
        title:
          newStatus === "active"
            ? "Commission Activated"
            : "Commission Deactivated",
        description: `${commission.serviceType} commission has been ${
          newStatus === "active" ? "activated" : "deactivated"
        }.`,
      });
    } catch (error: any) {
      console.error("Error toggling commission status:", error);
      toast({
        title: "Error",
        description: "Failed to update commission status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const columns = [
    {
      key: "serviceType" as keyof Commission,
      header: t("commissionManagement.tableHeaders.serviceType"),
    },
    {
      key: "commissionValue" as string,
      header: t("commissionManagement.tableHeaders.commission"),
      render: (commission: Commission) => (
        <div className="flex items-center">
          {commission.commissionType === "percentage" ? (
            <span className="flex items-center">
              {commission.percentage}
              <Percent size={14} className="ml-1 text-gray-500" />
            </span>
          ) : (
            <span className="flex items-center">
              {commission.fixedRate}
              <DollarSign size={14} className="ml-1 text-gray-500" />
            </span>
          )}
        </div>
      ),
    },
    {
      key: "isActive" as keyof Commission,
      header: t("commissionManagement.tableHeaders.status"),
      render: (commission: Commission) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            commission.isActive
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {commission.isActive
            ? t("commissionManagement.statusLabels.active")
            : t("commissionManagement.statusLabels.inactive")}
        </span>
      ),
    },
    {
      key: "actions" as string,
      header: t("commissionManagement.tableHeaders.actions"),
      render: (commission: Commission) => (
        <div className="flex items-center space-x-2">
          <button
            className="action-button"
            onClick={() => handleEditCommission(commission)}
          >
            {t("commissionManagement.editAction")}
          </button>
          <button
            className={`action-button ${
              commission.isActive
                ? "bg-red-50 text-red-600"
                : "bg-green-50 text-green-600"
            }`}
            onClick={() => toggleCommissionStatus(commission.id)}
          >
            {commission.isActive
              ? t("commissionManagement.deactivate")
              : t("commissionManagement.activate")}
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {t("commissionManagement.title")}
        </h1>
        {(() => {
          const existingServices = commissions.map((c) =>
            c.serviceType?.trim().toLowerCase()
          );

          const requiredServices = ["bus", "hotel", "taxi", "bike", "user"];

          const allServicesAdded = requiredServices.every((service) =>
            existingServices.includes(service)
          );

          // const existingServices = commissions.map((c) => c.serviceType);
          // const allServicesAdded = [
          //   "Bus",
          //   "Hotel",
          //   "Taxi",
          //   "Bike",
          //   "user",
          // ].every((service) => existingServices.includes(service));

          return !allServicesAdded ? (
            <Button onClick={handleAddNew} className="flex items-center gap-2">
              <Plus size={16} />
              {t("commissionManagement.addNew")}
            </Button>
          ) : null;
        })()}
      </div>

      <DataTable
        columns={columns}
        data={commissions}
        keyExtractor={(item) => item.id}
        searchable={false}
        paginate={false}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing
                ? t("commissionManagement.edit")
                : t("commissionManagement.addNew")}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("commissionManagement.serviceType")}
              </label>
              <Select
                value={currentCommission.serviceType}
                onValueChange={(value: any) =>
                  handleInputChange("serviceType", value)
                }
                disabled={isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bus">
                    {t("commissionManagement.serviceTypes.bus")}
                  </SelectItem>
                  <SelectItem value="Hotel">
                    {t("commissionManagement.serviceTypes.hotel")}
                  </SelectItem>
                  <SelectItem value="Taxi">
                    {t("commissionManagement.serviceTypes.taxi")}
                  </SelectItem>
                  <SelectItem value="Bike">
                    {t("commissionManagement.serviceTypes.bike")}
                  </SelectItem>
                  <SelectItem value="User">
                    {t("commissionManagement.serviceTypes.user")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("commissionManagement.commissionType")}
              </label>
              <RadioGroup
                value={currentCommission.commissionType}
                onValueChange={(value) =>
                  handleCommissionTypeChange(value as "percentage" | "fixed")
                }
                className="flex"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="percentage" id="percentage" />
                  <Label htmlFor="percentage" className="flex items-center">
                    <Percent size={16} className="mr-1" />{" "}
                    {t("commissionManagement.percentage")}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fixed" id="fixed" />
                  <Label htmlFor="fixed" className="flex items-center">
                    <DollarSign size={16} className="mr-1" />{" "}
                    {t("commissionManagement.fixedRate")}
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {currentCommission.commissionType === "percentage" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("commissionManagement.commissionPercentage")}
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    value={
                      currentCommission.percentage !== null
                        ? currentCommission.percentage
                        : 0
                    }
                    onChange={(e) =>
                      handleInputChange(
                        "percentage",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="pr-8"
                    min={0}
                    max={100}
                  />
                  <Percent
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                    size={16}
                  />
                </div>
              </div>
            )}

            {currentCommission.commissionType === "fixed" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("commissionManagement.fixedRateCurrency")}
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    value={
                      currentCommission.fixedRate !== null
                        ? currentCommission.fixedRate
                        : 0
                    }
                    onChange={(e) =>
                      handleInputChange(
                        "fixedRate",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="pl-8"
                    min={0}
                  />
                  <DollarSign
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                    size={16}
                  />
                </div>
              </div>
            )}

            {/* <div className="space-y-2">
              <label className="text-sm font-medium">Start Date and Time</label>
              <Input
                type="datetime-local"
                value={currentCommission.effectiveFrom}
                onChange={(e) =>
                  handleInputChange("effectiveFrom", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">End Date and Time</label>
              <Input
                type="datetime-local"
                value={currentCommission.effectiveTo}
                onChange={(e) =>
                  handleInputChange("effectiveTo", e.target.value)
                }
              />
            </div> */}

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("commissionManagement.status")}
              </label>
              <Select
                value={currentCommission.isActive ? "active" : "inactive"}
                onValueChange={(value) =>
                  handleInputChange("isActive", value === "active")
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">
                    {t("commissionManagement.active")}
                  </SelectItem>
                  <SelectItem value="inactive">
                    {t("commissionManagement.inactive")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {t("commissionManagement.cancel")}
            </Button>
            <Button onClick={handleSaveCommission}>
              {t("commissionManagement.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CommissionManagement;
