import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, SquarePen } from "lucide-react";
import UploadField from "@/components/ui/UploadField";
import BranchSelect from "@/components/branch-select/BranchSelect";
import dummyProfile from "@/assets/dummy-data/user-image.jpg";
import dummyIdFront from "@/assets/dummy-data/id-front.jpg";
import dummyIdBack from "@/assets/dummy-data/id-back.jpg";
import dummyBankDetails from "@/assets/dummy-data/hdfc.jpg";
import axiosInstance from "@/api/axiosInstance";
import CustomerDetailsSkeleton from "@/components/ui/loader-skeleton";
import { useToast } from "@/hooks/use-toast";

const CustomerDetails = () => {
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [operator, setOperator] = useState({
    id: "",
    fullName: "",
    phone: "",
    email: "",
    dob: "",
    gender: "",
    zoneCode: "",
    area: "",
    city: "",
    status: "",
    nationality: "Cameroon",
    nationalIdExpiry: "",
    profilePicture: dummyProfile,
    idCardFront: dummyIdFront,
    idCardBack: dummyIdBack,
  });

  const statusOptions = [
    "approved",
    "processing",
    "submitted",
    "rejected",
    "blocked",
  ];
  const [selectedBranch, setSelectedBranch] = useState<string | undefined>(
    undefined
  );

  const [remarks, setRemarks] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setOperator({ ...operator, [name]: value });

    // Reset remarks if status changes
    if (name === "status") {
      setRemarks("");
    }
  };

  // const handleFileChange = (field: string, file: File) => {
  //   setOperator({ ...operator, [field]: file });
  // };

  const handleFileChange = (field: string, file: File | File[]) => {
    const selectedFile = Array.isArray(file) ? file[0] : file;
    setOperator({ ...operator, [field]: selectedFile });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.put(
        `/user-management/users/verify/${id}`,
        {
          status: operator.status,
          remarks: remarks || "",
        }
      );

      if (response.data?.success) {
        toast({
          title: "Success",
          description: "User verification status updated successfully!",
        });
        setIsEditMode(false);
      } else {
        toast({
          title: "Error",
          description: response.data?.message || "Failed to update status.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error updating verification status:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Something went wrong. Try again!",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      setLoading(true);
      try {
        if (!id) return;
        console.log("Fetching user with ID:", id);

        const response = await axiosInstance.get(
          `/user-management/users/${id}`,
          {
            params: { page: 1, limit: 5 },
          }
        );

        if (response.data?.success) {
          const user = response.data.data;

          // Map API response to your local state structure
          setOperator({
            id: user._id || "",
            fullName: user.fullName || "",
            phone: user.phoneNumber || "",
            email: user.email || "",
            dob: user.dob ? user.dob.split("T")[0] : "",
            gender: user.gender || "",
            zoneCode: user.zoneCode || "",
            area: user.area || "",
            city: user.city || "",
            status: user.verificationStatus || "",
            nationality: user.nationality
              ? user.nationality.charAt(0).toUpperCase() +
                user.nationality.slice(1)
              : "Cameroon",
            nationalIdExpiry: user.nationIdExpiry
              ? user.nationIdExpiry.split("T")[0]
              : "",
            profilePicture: user.avatar?.url || dummyProfile,
            idCardFront:
              user.document?.documentIds?.find(
                (doc) => doc.documentType === "national_identity_card_front"
              )?.file?.url || dummyIdFront,
            idCardBack:
              user.document?.documentIds?.find(
                (doc) => doc.documentType === "national_identity_card_back"
              )?.file?.url || dummyIdBack,
          });
        }
      } catch (error) {
        console.error("Error fetching customer details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerDetails();
  }, [id]);

  if (loading) {
    return (
      <>
        <div className="mb-6">
          <button
            onClick={() => navigate("/customer-management")}
            className="flex items-center text-green-700 hover:text-green-900 mb-4"
          >
            <ArrowLeft size={18} className="mr-1" />
            Back to Users
          </button>
        </div>
        <CustomerDetailsSkeleton />
      </>
    );
  }

  return (
    <>
      <div className="mb-6">
        <button
          onClick={() => navigate("/customer-management")}
          className="flex items-center text-green-700 hover:text-green-900 mb-4"
        >
          <ArrowLeft size={18} className="mr-1" />
          Back to Users
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6">
            {/* Basic Information */}
            <div className="form-section col-span-full">
              <h2 className="form-section-title">Personal Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Profile Picture */}
                <div className="md:col-span-2">
                  <UploadField
                    label="Profile Picture"
                    value={operator.profilePicture}
                    onChange={(file) =>
                      handleFileChange("profilePicture", file)
                    }
                    // showCloseButton={isEditMode}
                    showCloseButton={false}
                  />
                </div>
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={operator.fullName}
                    onChange={handleInputChange}
                    className="filter-input w-full"
                    // disabled={!isEditMode}
                    disabled={true}
                    style={{ outline: "none" }}
                    required
                  />
                </div>
                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={operator.phone}
                    onChange={handleInputChange}
                    className="filter-input w-full"
                    // disabled={!isEditMode}
                    disabled={true}
                    style={{ outline: "none" }}
                    required
                  />
                </div>
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={operator.email}
                    onChange={handleInputChange}
                    className="filter-input w-full"
                    // disabled={!isEditMode}
                    disabled={true}
                    style={{ outline: "none" }}
                    required
                  />
                </div>
                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={operator.dob}
                    onChange={handleInputChange}
                    className="filter-input w-full"
                    // disabled={!isEditMode}
                    disabled={true}
                    style={{ outline: "none" }}
                  />
                </div>
                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={operator.gender}
                    onChange={handleInputChange}
                    className="filter-select w-full"
                    // disabled={!isEditMode}
                    disabled={true}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={operator.status}
                    onChange={handleInputChange}
                    className="filter-select w-full"
                    disabled={!isEditMode}
                  >
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Remarks field - appears below the grid when status is rejected/blocked */}
                {(operator.status === "rejected" ||
                  operator.status === "blocked") && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Remarks
                    </label>
                    <textarea
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      className="filter-input w-full resize-none"
                      style={{ outline: "none" }}
                      rows={4}
                      placeholder="Enter remarks for rejection or blocking..."
                      disabled={!isEditMode}
                    />
                  </div>
                )}
                {/* Address */}
                {/* <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={operator.address}
                    onChange={handleInputChange}
                    className="filter-input w-full resize-none"
                    // disabled={!isEditMode}
                    disabled={true}
                    style={{ outline: "none" }}
                    rows={3}
                  />
                </div> */}

                {/* Address Fields */}
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Zone Code */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Zone Code
                    </label>
                    <input
                      type="text"
                      name="zoneCode"
                      value={operator.zoneCode || ""}
                      onChange={handleInputChange}
                      className="filter-input w-full"
                      disabled={!isEditMode}
                      style={{ outline: "none" }}
                      placeholder="Enter zone code"
                    />
                  </div>

                  {/* Area */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Area
                    </label>
                    <input
                      type="text"
                      name="area"
                      value={operator.area || ""}
                      onChange={handleInputChange}
                      className="filter-input w-full"
                      disabled={!isEditMode}
                      style={{ outline: "none" }}
                      placeholder="Enter area"
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={operator.city || ""}
                      onChange={handleInputChange}
                      className="filter-input w-full"
                      disabled={!isEditMode}
                      style={{ outline: "none" }}
                      placeholder="Enter city"
                    />
                  </div>
                </div>

                {/* Nationality */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nationality
                  </label>
                  <input
                    type="text"
                    name="nationality"
                    value={operator.nationality || "Cameroon"}
                    onChange={handleInputChange}
                    className="filter-input w-full"
                    // disabled={!isEditMode}
                    disabled={true}
                    style={{ outline: "none" }}
                  />
                </div>
                {/* National ID Expiry Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    National ID Expiry Date
                  </label>
                  <input
                    type="date"
                    name="nationalIdExpiry"
                    value={operator.nationalIdExpiry}
                    onChange={handleInputChange}
                    className="filter-input w-full"
                    // disabled={!isEditMode}
                    disabled={true}
                    style={{ outline: "none" }}
                  />
                </div>
                {/* ID Card Front */}
                <UploadField
                  label="National ID Card Front"
                  value={operator.idCardFront}
                  onChange={(file) => handleFileChange("idCardFront", file)}
                  // showCloseButton={isEditMode}
                  showCloseButton={false}
                />
                {/* ID Card Back */}
                <UploadField
                  label="National ID Card Back"
                  value={operator.idCardBack}
                  onChange={(file) => handleFileChange("idCardBack", file)}
                  // showCloseButton={isEditMode}
                  showCloseButton={false}
                />
              </div>
            </div>

            {/* Buttons */}
            {/* <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={() => navigate("/user-management")}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mr-3"
              >
                Cancel
              </button>

              {!isEditMode ? (
                <button
                  type="button"
                  onClick={() => setIsEditMode(true)}
                  className="flex items-center px-4 py-2 bg-green-700 text-white rounded-md shadow-sm text-sm font-medium hover:bg-green-900"
                >
                  <SquarePen size={18} className="mr-2" />
                  Edit Status
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex items-center px-4 py-2 bg-green-700 text-white rounded-md shadow-sm text-sm font-medium hover:bg-green-900"
                >
                  <Save size={18} className="mr-2" />
                  Save Status
                </button>
              )}
            </div> */}
            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={() => navigate("/customer-management")}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mr-3"
              >
                Cancel
              </button>

              {!isEditMode ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault(); // prevent form submit
                    setIsEditMode(true);
                  }}
                  className="flex items-center px-4 py-2 bg-green-700 text-white rounded-md shadow-sm text-sm font-medium hover:bg-green-900"
                >
                  <SquarePen size={18} className="mr-2" />
                  Edit Status
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex items-center px-4 py-2 bg-green-700 text-white rounded-md shadow-sm text-sm font-medium hover:bg-green-900"
                >
                  <Save size={18} className="mr-2" />
                  Save Status
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default CustomerDetails;
