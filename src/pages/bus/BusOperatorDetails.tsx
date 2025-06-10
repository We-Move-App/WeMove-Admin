import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import Layout from "@/components/layout/Layout";
import UploadField from "@/components/ui/UploadField";
import { ArrowLeft, Save, SquarePen } from "lucide-react";
import { busOperators } from "@/data/mockData";
import { BusOperator } from "@/types/admin";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/api/axiosInstance";
import dummyProfile from "@/assets/dummy-data/user-image.jpg";
import dummyIdFront from "@/assets/dummy-data/id-front.jpg";
import dummyIdBack from "@/assets/dummy-data/id-back.jpg";
import dummyLicense from "@/assets/dummy-data/bus-license.png";
import dummyBankDetails from "@/assets/dummy-data/hdfc.jpg";
import Loader from "@/components/ui/loader";

const BusOperatorDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [operator, setOperator] = useState<BusOperator | null>(null);
  const [loading, setLoading] = useState(true);

  const isNewOperator = id === "new";
  const pageTitle = isNewOperator ? "Add Bus Operator" : "Edit Bus Operator";

  const [isEditMode, setIsEditMode] = useState(isNewOperator);
  // Status options
  const statusOptions = ["Approved", "Processing", "Submitted"];
  useEffect(() => {
    const fetchOperator = async () => {
      if (isNewOperator) {
        setOperator({
          id: "new",
          name: "",
          mobile: "",
          email: "",
          status: "Pending",
          numberOfBuses: 0,
          profilePhoto: dummyProfile,
          address: "",
          idCardFront: dummyIdFront,
          idCardBack: dummyIdBack,
          businessLicense: dummyLicense,
          bankName: "",
          bankAccountNumber: "",
          accountHolderName: "",
          bankAccountDetails: dummyBankDetails,
        });
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get(
          `/bus-management/bus-operators/${id}`
        );
        const userData = response.data?.data?.user;

        if (userData) {
          setOperator({
            id: userData._id,
            name: userData.fullName || "",
            mobile: userData.phoneNumber || "",
            email: userData.email || "",
            status: userData.verificationStatus || "Pending",
            numberOfBuses: 0,
            profilePhoto: userData.profilePhoto || dummyProfile,
            address: "Some Address",
            idCardFront: userData.idCardFront || dummyIdFront,
            idCardBack: userData.idCardBack || dummyIdBack,
            businessLicense: userData.businessLicense || dummyLicense,
            bankName: "HDFC Bank",
            bankAccountNumber: "Bank Account Number",
            accountHolderName: userData.fullName || "",
            bankAccountDetails: userData.bankAccountDetails || dummyBankDetails,
          });
        } else {
          setOperator(null);
        }
      } catch (error) {
        console.error("Failed to fetch bus operator:", error);
        setOperator(null);
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
  }, [id, isNewOperator]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (operator) {
      setOperator({
        ...operator,
        [name]: name === "numberOfBuses" ? parseInt(value) : value,
      });
    }
  };

  const handleFileChange = (
    fieldName: keyof BusOperator,
    file: File | null
  ) => {
    if (operator) {
      setOperator({
        ...operator,
        [fieldName]: file ? URL.createObjectURL(file) : null,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit logic would go here
    toast({
      title: isNewOperator ? "Bus Operator Added" : "Bus Operator Updated",
      description: `${operator?.name} has been ${isNewOperator ? "added" : "updated"
        } successfully.`,
    });

    navigate("/bus-management/operators");
  };

  const handleEdit = () => {
    if (isEditMode) {
      // Trigger form submission
      const form = document.querySelector("form");
      if (form) {
        form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
      }
    } else {
      setIsEditMode(true);
    }
  };


  if (loading) {
    return <Loader />
  }

  if (!operator) {
    return (
      <>
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-xl text-gray-600 mb-4">Bus Operator not found</p>
          <button
            onClick={() => navigate("/bus-management/operators")}
            className="action-button"
          >
            Back to Bus Operators
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mb-6">
        <button
          onClick={() => navigate("/bus-management/operators")}
          className="flex items-center text-green-700 hover:text-green-900 mb-4"
        >
          <ArrowLeft size={18} className="mr-1" />
          Back to Bus Operators
        </button>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{pageTitle}</h1>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate("/bus-management/operators")}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mr-3"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleEdit}
              className="flex items-center px-4 py-2 bg-green-700 text-white rounded-md shadow-sm text-sm font-medium hover:bg-green-900"
            >
              {isEditMode ? <Save size={18} className="mr-2" /> : <SquarePen size={18} className="mr-2" />}
              {isEditMode ? "Save" : "Edit"}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6">
            {/* Basic Information */}
            <div className="form-section col-span-full">
              <h2 className="form-section-title">Basic Information</h2>
              <div className="grid grid-cols-1  gap-4">
                <UploadField
                  label="Profile Photo"
                  value={operator.profilePhoto}
                  onChange={(file) => handleFileChange("profilePhoto", file)}
                  showCloseButton={isEditMode}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      readOnly={!isEditMode}
                      value={operator.name}
                      onChange={handleInputChange}
                      className="filter-input w-full"
                      style={{ outline: "none" }}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mobile
                    </label>
                    <input
                      type="text"
                      name="mobile"
                      readOnly={!isEditMode}
                      value={operator.mobile}
                      onChange={handleInputChange}
                      className="filter-input w-full"
                      style={{ outline: "none" }}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email ID
                    </label>
                    <input
                      type="email"
                      name="email"
                      readOnly={!isEditMode}
                      value={operator.email}
                      onChange={handleInputChange}
                      className="filter-input w-full"
                      style={{ outline: "none" }}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    {isEditMode ? (
                      <select
                        name="status"
                        value={operator.status}
                        onChange={handleInputChange}
                        className="filter-select w-full"
                      >
                        {statusOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="filter-select w-full">{operator.status}</p>
                    )}
                  </div>


                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Buses
                    </label>
                    <input
                      type="number"
                      name="numberOfBuses"
                      value={operator.numberOfBuses}
                      readOnly={!isEditMode}
                      onChange={handleInputChange}
                      className="filter-input w-full"
                      style={{ outline: "none" }}
                      min="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="form-section col-span-full">
              <h2 className="form-section-title">Address</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  name="address"
                  readOnly={!isEditMode}
                  value={operator.address || ""}
                  onChange={(e) =>
                    setOperator({ ...operator, address: e.target.value })
                  }
                  className="filter-input w-full h-24"
                />
              </div>
            </div>

            {/* Identity Verification */}
            <div className="form-section col-span-full">
              <h2 className="form-section-title">Identity Verification</h2>
              <div className="grid grid-cols-1 gap-4">
                <UploadField
                  label="ID Card Front"
                  value={operator.idCardFront}
                  onChange={(file) => handleFileChange("idCardFront", file)}
                  showCloseButton={isEditMode}
                />

                <UploadField
                  label="ID Card Back"
                  value={operator.idCardBack}
                  onChange={(file) => handleFileChange("idCardBack", file)}
                  showCloseButton={isEditMode}
                />

                <UploadField
                  label="Business License"
                  value={operator.businessLicense}
                  onChange={(file) => handleFileChange("businessLicense", file)}
                  showCloseButton={isEditMode}
                />
              </div>
            </div>

            {/* Bank Details */}
            <div className="form-section col-span-full">
              <h2 className="form-section-title">Bank Details</h2>
              <div className="flex flex-col flex-col-reverse gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      name="bankName"
                      readOnly={!isEditMode}
                      value={operator.bankName || ""}
                      onChange={handleInputChange}
                      className="filter-input w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Number
                    </label>
                    <input
                      type="text"
                      name="bankAccountNumber"
                      readOnly={!isEditMode}
                      value={operator.bankAccountNumber || ""}
                      onChange={handleInputChange}
                      className="filter-input w-full"
                      style={{ outline: "none" }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Holder Name
                    </label>
                    <input
                      type="text"
                      name="accountHolderName"
                      readOnly={!isEditMode}
                      value={operator.accountHolderName || ""}
                      onChange={handleInputChange}
                      className="filter-input w-full"
                      style={{ outline: "none" }}
                    />
                  </div>
                </div>

                <UploadField
                  label="Bank Account Details"
                  value={operator.bankAccountDetails}
                  onChange={(file) =>
                    handleFileChange("bankAccountDetails", file)
                  }
                  showCloseButton={isEditMode}
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={() => navigate("/bus-management/operators")}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mr-3"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleEdit}
              className="flex items-center px-4 py-2 bg-green-700 text-white rounded-md shadow-sm text-sm font-medium hover:bg-green-900"
            >
              {isEditMode ? <Save size={18} className="mr-2" /> : <SquarePen size={18} className="mr-2" />}
              {isEditMode ? "Save" : "Edit"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default BusOperatorDetails;