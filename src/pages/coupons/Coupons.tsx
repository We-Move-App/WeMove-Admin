import { useEffect, useState } from "react";
import { Plus, Tag, Percent, DollarSign } from "lucide-react";
// import Layout from '@/components/layout/Layout';
import DataTable from "@/components/ui/DataTable";
import { Coupon } from "@/types/admin";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import axiosInstance from "@/api/axiosInstance";
import { useTranslation } from "react-i18next";

// Modified mock data for coupons to include discount type
// const mockCoupons: Coupon[] = [
//   {
//     id: "1",
//     name: "WELCOME10",
//     code: "WELCOME10",
//     serviceType: "All",
//     discountType: "percentage",
//     discountPercentage: 10,
//     discountAmount: null,
//     startDate: "2023-06-01T00:00",
//     expiryDate: "2023-12-31T23:59",
//     isActive: true
//   },
//   {
//     id: "2",
//     name: "SUMMER20",
//     code: "SUMMER20",
//     serviceType: "Hotel",
//     discountType: "percentage",
//     discountPercentage: 20,
//     discountAmount: null,
//     startDate: "2023-05-01T00:00",
//     expiryDate: "2023-09-30T23:59",
//     isActive: true
//   },
//   {
//     id: "3",
//     name: "RIDE15",
//     code: "RIDE15",
//     serviceType: "Taxi",
//     discountType: "percentage",
//     discountPercentage: 15,
//     discountAmount: null,
//     startDate: "2023-07-01T00:00",
//     expiryDate: "2023-10-15T23:59",
//     isActive: true
//   },
//   {
//     id: "4",
//     name: "BUS100",
//     code: "BUS100",
//     serviceType: "Bus",
//     discountType: "fixed",
//     discountPercentage: null,
//     discountAmount: 100,
//     startDate: "2023-06-15T00:00",
//     expiryDate: "2023-11-30T23:59",
//     isActive: false
//   }
// ];

const Coupons = () => {
  // const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState<Coupon>({
    id: "",
    name: "",
    code: "",
    serviceType: "All",
    discount: "",
    discountType: "percentage",
    discountPercentage: 0,
    discountAmount: null,
    startDate: new Date().toISOString().split(".")[0].slice(0, 16),
    expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
      .toISOString()
      .split(".")[0]
      .slice(0, 16),
    isActive: true,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCoupons, setTotalCoupons] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Record<string, string | null>>({});
  const { i18n, t } = useTranslation();

  useEffect(() => {
    const fetchCoupons = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/auth/all-coupons", {
          params: {
            vehicleType: "taxi",
            page: currentPage,
            limit: pageSize,
            search: searchTerm,
            serviceType: filters.serviceType || undefined,
            // status: filters.isActive || undefined,
            status:
              filters.isActive === "true"
                ? "Active"
                : filters.isActive === "false"
                ? "Inactive"
                : undefined,
          },
        });

        // const mapped = response.data.data.map((item: any) => {
        //   // handle discount parsing
        //   let discountType: "percentage" | "amount" = "amount";
        //   let discountAmount: number | null = null;
        //   let discountPercentage: number | null = null;

        //   if (item.discount.includes("%")) {
        //     discountType = "percentage";
        //     discountPercentage = parseInt(item.discount.replace("%", ""), 10);
        //   } else if (item.discount.includes("₹")) {
        //     discountType = "amount";
        //     discountAmount = parseInt(item.discount.replace("₹", ""), 10);
        //   }

        //   return {
        //     // id: item.actions.update.split("/").pop(),
        //     id: item.couponId,
        //     name: item.couponName,
        //     code: item.couponCode,
        //     serviceType: item.serviceType,
        //     discountType,
        //     discountAmount,
        //     discountPercentage,
        //     startDate: item.startDate,
        //     expiryDate: item.expiryDate,
        //     isActive: item.status.toLowerCase() === "active",
        //     actions: item.actions
        //   };
        // });
        const mapped = response.data.data.map((item: any) => {
          let discountType: "percentage" | "amount" = "amount";
          let discountAmount: number | null = null;
          let discountPercentage: number | null = null;

          const rawDiscount = item.discount.trim();

          if (rawDiscount.includes("%")) {
            discountType = "percentage";
            discountPercentage = parseInt(
              rawDiscount.replace(/[^0-9]/g, ""),
              10
            );
          } else {
            discountType = "amount";
            discountAmount = parseInt(rawDiscount.replace(/[^0-9]/g, ""), 10);
          }

          return {
            id: item.couponId,
            name: item.couponName,
            code: item.couponCode,
            serviceType: item.serviceType,
            discountType,
            discountAmount,
            discountPercentage,
            startDate: item.startDate,
            expiryDate: item.expiryDate,
            isActive: item.status.toLowerCase() === "active",
            actions: item.actions,
          };
        });

        setCoupons(mapped);
        setTotalCoupons(response.data.total || mapped.length);
      } catch (error) {
        console.error("Error fetching coupons:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, [currentPage, pageSize, searchTerm, filters]);

  const handleAddNew = () => {
    setIsEditing(false);
    setCurrentCoupon({
      id: undefined,
      name: "",
      code: "",
      serviceType: "All",
      discount: "",
      discountType: "percentage",
      discountPercentage: 0,
      discountAmount: null,
      startDate: new Date().toISOString().split(".")[0].slice(0, 16),
      expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
        .toISOString()
        .split(".")[0]
        .slice(0, 16),
      isActive: true,
    });
    setIsDialogOpen(true);
  };

  // const handleEditCoupon = (coupon: Coupon) => {
  //   setIsEditing(true);
  //   setCurrentCoupon({ ...coupon });
  //   setIsDialogOpen(true);
  // };

  const handleEditCoupon = async (couponId: string) => {
    try {
      const res = await axiosInstance.get(`/auth/get-coupon/${couponId}`);
      const formatDateForInput = (isoString: string) => {
        if (!isoString) return "";
        const date = new Date(isoString);
        // toISOString gives: 2025-08-28T03:38:00.000Z
        // slice(0,16) -> 2025-08-28T03:38
        return date.toISOString().slice(0, 16);
      };

      if (res.data?.success && res.data.data?.length > 0) {
        const coupon = res.data.data[0];

        // Determine discount type
        let discountType: "percentage" | "fixed" = "fixed";
        let discountPercentage: number | undefined;
        let discountAmount: number | undefined;

        if (coupon.discount.includes("%")) {
          discountType = "percentage";
          discountPercentage = parseFloat(coupon.discount.replace("%", ""));
        } else {
          discountType = "fixed";
          discountAmount = parseFloat(coupon.discount.replace(/[^0-9.]/g, ""));
        }

        setIsEditing(true);
        setCurrentCoupon({
          id: couponId,
          name: coupon.couponName,
          code: coupon.couponCode,
          serviceType: coupon.serviceType,
          discount: coupon.discount,
          discountType,
          discountPercentage,
          discountAmount,
          startDate: formatDateForInput(coupon.startDate),
          expiryDate: formatDateForInput(coupon.expiryDate),
          isActive: coupon.status === "Active",
        });
        setIsDialogOpen(true);
      }
    } catch (error) {
      console.error("Failed to fetch coupon details", error);
    }
  };

  const handleInputChange = (field: keyof Coupon, value: any) => {
    setCurrentCoupon((prev) => ({ ...prev, [field]: value }));
  };

  const handleDiscountTypeChange = (type: "percentage" | "fixed") => {
    setCurrentCoupon((prev) => ({
      ...prev,
      discountType: type,
      discountPercentage:
        type === "percentage" ? prev.discountPercentage || 0 : null,
      discountAmount: type === "fixed" ? prev.discountAmount || 0 : null,
    }));
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

  // const handleSaveCoupon = async () => {
  //   try {
  //     if (isEditing) {
  //       // Call PUT update API (you can implement later)
  //       return;
  //     }

  //     const payload = {
  //       couponName: currentCoupon.name,
  //       couponCode: currentCoupon.code,
  //       // minOrderAmount: currentCoupon.minOrderAmount || 0,
  //       serviceType: currentCoupon.serviceType,
  //       discountType: currentCoupon.discountType === "percentage" ? "Percentage" : "Fixed Amount",
  //       discountPercentage: currentCoupon.discountType === "percentage" ? currentCoupon.discountPercentage : undefined,
  //       discountAmount: currentCoupon.discountType === "fixed" ? currentCoupon.discountAmount : undefined,
  //       startDate: new Date(currentCoupon.startDate).toISOString(),
  //       expiryDate: new Date(currentCoupon.expiryDate).toISOString(),
  //       status: currentCoupon.isActive ? "Active" : "Inactive",
  //       // maxUsage: currentCoupon.maxUsage || 1,
  //     };

  //     const res = await axiosInstance.post("/auth/create-coupon", payload);

  //     if (res.status === 200 || res.status === 201) {
  //       toast({
  //         title: "Coupon Created",
  //         description: `${res.data.data.couponName} has been added successfully.`,
  //       });

  //       setIsDialogOpen(false);
  //       // fetchCoupons();
  //     }
  //   } catch (error: any) {
  //     const message =
  //       error.response?.data?.message ||
  //       error.message ||
  //       "Failed to create coupon.";

  //     toast({
  //       title: "Error",
  //       description: message,
  //       variant: "destructive",
  //     });

  //     console.error("Coupon creation failed:", error.response || error);
  //   }
  // };

  const handleSaveCoupon = async () => {
    try {
      const payload = {
        couponName: currentCoupon.name,
        couponCode: currentCoupon.code,
        serviceType: currentCoupon.serviceType,
        discountType:
          currentCoupon.discountType === "percentage"
            ? "Percentage"
            : "Fixed Amount",
        discountPercentage:
          currentCoupon.discountType === "percentage"
            ? currentCoupon.discountPercentage
            : undefined,
        discountAmount:
          currentCoupon.discountType === "fixed"
            ? currentCoupon.discountAmount
            : undefined,
        startDate: new Date(currentCoupon.startDate).toISOString(),
        expiryDate: new Date(currentCoupon.expiryDate).toISOString(),
        status: currentCoupon.isActive ? "Active" : "Inactive",
        // minOrderAmount: currentCoupon.minOrderAmount || 0,
        // maxUsage: currentCoupon.maxUsage || 1,
      };

      let res;

      if (isEditing) {
        // Assuming you have currentCoupon.id
        res = await axiosInstance.put(
          `/auth/update-coupon/${currentCoupon.id}`,
          payload
        );

        if (res.status === 200) {
          toast({
            title: "Coupon Updated",
            description: `${res.data.data.couponName} has been updated successfully.`,
          });
        }
      } else {
        res = await axiosInstance.post("/auth/create-coupon", payload);

        if (res.status === 200 || res.status === 201) {
          toast({
            title: "Coupon Created",
            description: `${res.data.data.couponName} has been added successfully.`,
          });
        }
      }

      setIsDialogOpen(false);
      // fetchCoupons(); // Refresh after update or create
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to save coupon.";

      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });

      console.error("Coupon save failed:", error.response || error);
    }
  };

  const toggleCouponStatus = async (id: string) => {
    const coupon = coupons.find((c) => c.id === id);
    if (!coupon) return;

    try {
      // Call API
      const response = await axiosInstance.put(
        `/auth/update-couponStatus/${id}`,
        {
          status: coupon.isActive ? "Inactive" : "Active", // sending new status
        }
      );

      if (response.data.success) {
        // Update UI state only if API succeeds
        setCoupons((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, isActive: !item.isActive } : item
          )
        );

        toast({
          title: coupon.isActive ? "Coupon Deactivated" : "Coupon Activated",
          description: `Coupon ${coupon.name} has been ${
            coupon.isActive ? "deactivated" : "activated"
          }.`,
        });
      }
    } catch (error) {
      console.error("Failed to update coupon status:", error);
      toast({
        title: "Error",
        description: "Failed to update coupon status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const columns = [
    { key: "name" as keyof Coupon, header: t("coupons.tableHeaders.name") },
    { key: "code" as keyof Coupon, header: t("coupons.tableHeaders.code") },
    {
      key: "serviceType" as keyof Coupon,
      header: t("coupons.tableHeaders.serviceType"),
    },
    {
      key: "discount" as string,
      header: t("coupons.tableHeaders.discount"),
      render: (coupon: Coupon) => (
        <div className="flex items-center">
          {coupon.discountType === "percentage" ? (
            <span>{coupon.discountPercentage}%</span>
          ) : (
            <span>₹{coupon.discountAmount}</span>
          )}
        </div>
      ),
    },
    {
      key: "startDate" as keyof Coupon,
      header: t("coupons.tableHeaders.startDate"),
      render: (coupon: Coupon) => (
        <span>
          {coupon.startDate ? formatDateTime(coupon.startDate) : "N/A"}
        </span>
      ),
    },
    {
      key: "expiryDate" as keyof Coupon,
      header: t("coupons.tableHeaders.expiryDate"),
      render: (coupon: Coupon) => (
        <span>{formatDateTime(coupon.expiryDate)}</span>
      ),
    },
    {
      key: "isActive" as keyof Coupon,
      header: t("coupons.tableHeaders.status"),
      render: (coupon: Coupon) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            coupon.isActive
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {coupon.isActive
            ? t("coupons.statusLabels.active")
            : t("coupons.statusLabels.inactive")}
        </span>
      ),
    },
    {
      key: "actions" as string,
      header: t("coupons.tableHeaders.actions"),
      render: (coupon: Coupon) => (
        <div className="flex items-center space-x-2">
          <button
            className="action-button"
            onClick={() => handleEditCoupon(coupon.id)}
          >
            {t("coupons.actions.edit")}
          </button>
          <button
            className={`action-button ${
              coupon.isActive
                ? "bg-red-50 text-red-600"
                : "bg-green-50 text-green-600"
            }`}
            onClick={() => toggleCouponStatus(coupon.id)}
          >
            {coupon.isActive
              ? t("coupons.actions.deactivate")
              : t("coupons.actions.activate")}
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t("coupons.title")}</h1>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus size={16} /> {t("coupons.addNew")}
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={coupons}
        keyExtractor={(item) => item.id}
        searchable={true}
        filterable={true}
        filterOptions={[
          {
            key: "serviceType" as keyof Coupon,
            label: t("coupons.filters.serviceType"),
            options: [
              {
                label: t("coupons.filters.options.allServices"),
                value: "All Services",
              },
              { label: t("coupons.filters.options.bus"), value: "Bus" },
              { label: t("coupons.filters.options.hotel"), value: "Hotel" },
              { label: t("coupons.filters.options.taxi"), value: "Taxi" },
              { label: t("coupons.filters.options.bike"), value: "Bike" },
            ],
          },
          {
            key: "isActive" as keyof Coupon,
            label: t("coupons.filters.status"),
            options: [
              { label: t("coupons.statusLabels.active"), value: "true" },
              { label: t("coupons.statusLabels.inactive"), value: "false" },
            ],
          },
        ]}
        filters={filters}
        onFilterChange={(newFilters) => {
          setFilters(newFilters);
          setCurrentPage(1);
        }}
        paginate
        pageSize={pageSize}
        currentPage={currentPage}
        totalItems={totalCoupons}
        onPageChange={setCurrentPage}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? t("coupons.edit") : t("coupons.addNew")}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("coupons.labels.name")}
              </label>
              <Input
                value={currentCoupon.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder={t("coupons.labels.placeholder.name")}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("coupons.labels.code")}
              </label>
              <Input
                value={currentCoupon.code}
                onChange={(e) => handleInputChange("code", e.target.value)}
                placeholder={t("coupons.labels.placeholder.code")}
              />
              <p className="text-xs text-gray-500">
                {t("coupons.labels.description")}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("coupons.labels.serviceType")}
              </label>
              <Select
                value={currentCoupon.serviceType}
                onValueChange={(value: any) =>
                  handleInputChange("serviceType", value)
                }
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t(
                      "coupons.labels.placeholder.selectServiceType"
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Services">
                    {t("coupons.filters.options.allServices")}
                  </SelectItem>
                  <SelectItem value="Bus">
                    {t("coupons.filters.options.bus")}
                  </SelectItem>
                  <SelectItem value="Hotel">
                    {t("coupons.filters.options.hotel")}
                  </SelectItem>
                  <SelectItem value="Taxi">
                    {t("coupons.filters.options.taxi")}
                  </SelectItem>
                  <SelectItem value="Bike">
                    {t("coupons.filters.options.bike")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("coupons.labels.discountType")}
              </label>
              <RadioGroup
                value={currentCoupon.discountType}
                onValueChange={(value) =>
                  handleDiscountTypeChange(value as "percentage" | "fixed")
                }
                className="flex"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="percentage" id="percentage-discount" />
                  <Label
                    htmlFor="percentage-discount"
                    className="flex items-center"
                  >
                    <Percent size={16} className="mr-1" />
                    {t("coupons.discountTypes.percentage")}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fixed" id="fixed-discount" />
                  <Label htmlFor="fixed-discount" className="flex items-center">
                    <DollarSign size={16} className="mr-1" />{" "}
                    {t("coupons.discountTypes.fixed")}
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {currentCoupon.discountType === "percentage" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("coupons.labels.discountPercentage")}
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    value={
                      currentCoupon.discountPercentage !== null
                        ? currentCoupon.discountPercentage
                        : 0
                    }
                    onChange={(e) =>
                      handleInputChange(
                        "discountPercentage",
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

            {currentCoupon.discountType === "fixed" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("coupons.labels.discountAmount")}
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    value={
                      currentCoupon.discountAmount !== null
                        ? currentCoupon.discountAmount
                        : 0
                    }
                    onChange={(e) =>
                      handleInputChange(
                        "discountAmount",
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

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("coupons.labels.startDate")}
              </label>
              <Input
                type="datetime-local"
                value={currentCoupon.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("coupons.labels.expiryDate")}
              </label>
              <Input
                type="datetime-local"
                value={currentCoupon.expiryDate}
                onChange={(e) =>
                  handleInputChange("expiryDate", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("coupons.labels.status")}
              </label>
              <Select
                value={currentCoupon.isActive ? "active" : "inactive"}
                onValueChange={(value) =>
                  handleInputChange("isActive", value === "active")
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">
                    {t("coupons.statusLabels.active")}
                  </SelectItem>
                  <SelectItem value="inactive">
                    {t("coupons.statusLabels.inactive")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {t("coupons.buttons.cancel")}
            </Button>
            <Button onClick={handleSaveCoupon}>
              {t("coupons.buttons.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Coupons;
