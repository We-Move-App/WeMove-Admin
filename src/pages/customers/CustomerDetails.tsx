import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, SquarePen } from "lucide-react";
import UploadField from "@/components/ui/UploadField";
import BranchSelect from "@/components/branch-select/BranchSelect";
import dummyProfile from "@/assets/dummy-data/user-image.jpg";
import dummyIdFront from "@/assets/dummy-data/id-front.jpg";
import dummyIdBack from "@/assets/dummy-data/id-back.jpg";
import dummyBankDetails from "@/assets/dummy-data/hdfc.jpg";

const CustomerDetails = () => {
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(true);

  const [operator, setOperator] = useState({
    id: "1",
    name: "",
    companyName: "",
    mobile: "",
    email: "",
    branch: "",
    status: "pending",
    profilePhoto: dummyProfile,
    address: "",
    idCardFront: dummyIdFront,
    idCardBack: dummyIdBack,
    bankName: "",
    bankAccountNumber: "",
    accountHolderName: "",
    bankAccountDetails: dummyBankDetails,
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

  const handleFileChange = (field: string, file: File) => {
    setOperator({ ...operator, [field]: file });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", operator);
  };

  return (
    <>
      <div className="mb-6">
        <button
          onClick={() => navigate("/bus-management/operators")}
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
              <h2 className="form-section-title">Basic Information</h2>
              <div className="grid grid-cols-1 gap-4">
                <UploadField
                  label="Profile Photo"
                  value={operator.profilePhoto}
                  onChange={(file) => handleFileChange("profilePhoto", file)}
                  showCloseButton={isEditMode}
                />

                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
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

                    {(operator.status === "rejected" ||
                      operator.status === "blocked") && (
                      <div className="mt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Remarks
                        </label>
                        <textarea
                          value={remarks}
                          onChange={(e) => setRemarks(e.target.value)}
                          className="filter-input w-full h-20"
                          placeholder="Enter remarks..."
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Choose Branch
                    </label>
                    <BranchSelect
                      value={selectedBranch}
                      onChange={setSelectedBranch}
                    />
                  </div>
                </div> */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
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
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Choose Branch
                    </label>
                    <BranchSelect
                      value={selectedBranch}
                      onChange={setSelectedBranch}
                    />
                  </div>
                </div>

                {/* Remarks field - appears below the grid when status is rejected/blocked */}
                {(operator.status === "rejected" ||
                  operator.status === "blocked") && (
                  <div className="mt-4">
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
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Company Information */}
            <div className="form-section col-span-full">
              <h2 className="form-section-title">Company Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={operator.companyName}
                    onChange={handleInputChange}
                    className="filter-input w-full"
                    style={{ outline: "none" }}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Address
                  </label>
                  <textarea
                    name="address"
                    value={operator.address}
                    onChange={(e) =>
                      setOperator({ ...operator, address: e.target.value })
                    }
                    className="filter-input w-full h-24"
                  />
                </div>
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
                  showCloseButton
                />

                <UploadField
                  label="ID Card Back"
                  value={operator.idCardBack}
                  onChange={(file) => handleFileChange("idCardBack", file)}
                  showCloseButton
                />
              </div>
            </div>

            {/* Bank Details */}
            <div className="form-section col-span-full">
              <h2 className="form-section-title">Bank Details</h2>
              <div className="flex flex-col flex-col-reverse gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      name="bankName"
                      value={operator.bankName}
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
                      value={operator.bankAccountNumber}
                      onChange={handleInputChange}
                      className="filter-input w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Holder Name
                    </label>
                    <input
                      type="text"
                      name="accountHolderName"
                      value={operator.accountHolderName}
                      onChange={handleInputChange}
                      className="filter-input w-full"
                    />
                  </div>
                </div>

                <UploadField
                  label="Bank Account Details"
                  value={operator.bankAccountDetails}
                  onChange={(file) =>
                    handleFileChange("bankAccountDetails", file)
                  }
                  showCloseButton
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={() => navigate("/bus-management/operators")}
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
                  Edit
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex items-center px-4 py-2 bg-green-700 text-white rounded-md shadow-sm text-sm font-medium hover:bg-green-900"
                >
                  <Save size={18} className="mr-2" />
                  Save
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
