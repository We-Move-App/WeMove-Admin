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
  const mode: 'add' | 'view' | 'edit' = isNewOperator
    ? 'add'
    : isEditMode
      ? 'edit'
      : 'view';


  const statusOptions = ["approved", "processing", "submitted"];
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
          profilePhoto: null,
          address: "",
          idCardFront: null,
          idCardBack: null,
          businessLicense: null,
          bankName: "",
          bankAccountNumber: "",
          accountHolderName: "",
          bankAccountDetails: null,
        });
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get(
          `/bus-management/bus-operators/${id}`
        );
        const data = response.data?.data;
        const user = data?.user;
        const docs = data?.docs?.documentIds || [];
        const getDocUrl = (name: string) => {
          return docs.find(doc => doc.documentName === name)?.file.url || null;
        };

        if (user) {
          setOperator({
            id: user._id,
            name: user.fullName || "",
            mobile: user.phoneNumber || "",
            email: user.email || "",
            status: user.verificationStatus || "Pending",
            numberOfBuses: 0,
            profilePhoto: user.avatar?.url || dummyProfile,
            address: user?.companyAddress || "",
            idCardFront: getDocUrl("national_identity_card_front") || dummyIdFront,
            idCardBack: getDocUrl("national_identity_card_back") || dummyIdBack,
            businessLicense: getDocUrl("business_license") || dummyLicense,
            bankName: "",
            bankAccountNumber: "",
            accountHolderName: "",
            bankAccountDetails: null,
          });
        }
        else {
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

  // const handleFileChange = (
  //   fieldName: keyof BusOperator,
  //   file: File | null
  // ) => {
  //   if (operator) {
  //     setOperator({
  //       ...operator,
  //       [fieldName]: file ? URL.createObjectURL(file) : null,
  //     });
  //   }
  // };

  const handleFileChange = (field: string, file: File) => {
    setOperator((prev: any) => ({
      ...prev,
      [field]: file, // this should be a File object
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isNewOperator) {
        // ADD NEW OPERATOR (POST)
        const formData = {
          name: operator?.name,
          mobile: operator?.mobile,
          email: operator?.email,
          status: operator?.status,
          address: operator?.address,
          bankName: operator?.bankName,
          bankAccountNumber: operator?.bankAccountNumber,
          accountHolderName: operator?.accountHolderName,
        };

        await axiosInstance.post(`/bus-management/bus-operators/register`, formData);

        toast({
          title: "Bus Operator Added",
          description: `${operator?.name} has been added successfully.`,
        });

      } else {
        await Promise.all([
          axiosInstance.put(`/bus-management/bus-operators/verify/${id}`, {
            status: operator?.status,
          }),
          axiosInstance.put(`/bus-management/bus-operators/updateBusOperator/${id}`, {
            fullName: operator?.name,
            companyAddress: operator?.address,
            national_identity_card_front: operator?.idCardFront,
            national_identity_card_back: operator?.idCardBack,
            avatar: operator?.profilePhoto,
            bankName: operator?.bankName,
            bankAccountNumber: operator?.bankAccountNumber,
            accountHolderName: operator?.accountHolderName,
            bank_details: operator?.bankAccountDetails,
            email: operator?.email,
            phoneNumber: operator?.mobile,
          }),
        ]);
        toast({ title: "Operator updated successfully" });

        toast({
          title: "Bus Operator Updated",
          description: `${operator?.name} has been verified successfully.`,
        });
      }

      setIsEditMode(false);
      navigate("/bus-management/operators");
    } catch (error: any) {
      console.error("Form submission failed:", error);
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to submit form.",
        variant: "destructive",
      });
    }
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

  // console.log("profilePhoto", operator?.profilePhoto);


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
                  value={operator?.profilePhoto ?? null}
                  onChange={(file) => handleFileChange("profilePhoto", file)}
                  showCloseButton={mode === 'edit' || mode === 'add'}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    {mode === "view" ? (
                      <p className="filter-input w-full bg-gray-100">{operator.name}</p>
                    ) : (
                      <input
                        type="text"
                        name="name"
                        value={operator.name}
                        onChange={handleInputChange}
                        className="filter-input w-full"
                        style={{ outline: "none" }}
                        required
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name
                    </label>
                    {mode === "view" ? (
                      <p className="filter-input w-full bg-gray-100">{operator.name}</p>
                    ) : (
                      <input
                        type="text"
                        name="name"
                        value={operator.name}
                        onChange={handleInputChange}
                        className="filter-input w-full"
                        style={{ outline: "none" }}
                        required
                      />
                    )}
                  </div>



                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mobile
                    </label>
                    {mode === "view" ? (
                      <p className="filter-input w-full bg-gray-100">{operator.mobile}</p>
                    ) : (
                      <input
                        type="text"
                        name="mobile"
                        value={operator.mobile}
                        onChange={handleInputChange}
                        className="filter-input w-full"
                        style={{ outline: "none" }}
                        required
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email ID
                    </label>
                    {mode === "view" ? (
                      <p className="filter-input w-full bg-gray-100">{operator.email}</p>
                    ) : (
                      <input
                        type="email"
                        name="email"
                        value={operator.email}
                        onChange={handleInputChange}
                        className="filter-input w-full"
                        style={{ outline: "none" }}
                        required
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    {mode === "view" ? (
                      <p className="filter-input w-full bg-gray-100">{operator.status}</p>
                    ) : (
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
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="form-section col-span-full">
              <h2 className="form-section-title">Address</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Address
                </label>
                {mode === "view" ? (
                  <p className="filter-input w-full bg-gray-100 whitespace-pre-wrap">
                    {operator.address || "N/A"}
                  </p>
                ) : (
                  <textarea
                    name="address"
                    value={operator.address || ""}
                    onChange={(e) => setOperator({ ...operator, address: e.target.value })}
                    className="filter-input w-full h-24"
                  />
                )}
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
                  showCloseButton={mode === 'edit' || mode === 'add'}
                />

                <UploadField
                  label="ID Card Back"
                  value={operator.idCardBack}
                  onChange={(file) => handleFileChange("idCardBack", file)}
                  showCloseButton={mode === 'edit' || mode === 'add'}
                />
              </div>
            </div>
            {/* Bank Details */}
            <div className="form-section col-span-full">
              <h2 className="form-section-title">Bank Details</h2>

              <div className="flex flex-col flex-col-reverse gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Bank Name */}
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

                  {/* Account Number */}
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
                    />
                  </div>

                  {/* Account Holder Name */}
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
                    />
                  </div>
                </div>

                {/* Upload Field */}
                {isEditMode ? (
                  <UploadField
                    label="Bank Account Details"
                    value={operator.bankAccountDetails}
                    onChange={(file) => handleFileChange("bankAccountDetails", file)}
                    showCloseButton
                    disabled={false}
                  />
                ) : operator.bankAccountDetails ? (
                  <div className="text-sm text-gray-800">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bank Account Details
                    </label>
                    <a
                      href={operator.bankAccountDetails}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View Uploaded Document
                    </a>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 italic">No bank document uploaded.</div>
                )}
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

              {mode === "view" && (
                <button
                  type="button"
                  onClick={() => setIsEditMode(true)}
                  className="flex items-center px-4 py-2 bg-green-700 text-white rounded-md shadow-sm text-sm font-medium hover:bg-green-900"
                >
                  <SquarePen size={18} className="mr-2" />
                  Edit
                </button>
              )}

              {(mode === "add" || mode === "edit") && (
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

export default BusOperatorDetails;