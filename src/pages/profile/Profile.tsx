import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  Lock,
  Camera,
  ArrowLeft,
  Eye,
  EyeOff,
  Key,
  AlertCircle,
} from "lucide-react";
import axiosInstance from "@/api/axiosInstance";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

interface ProfileProps {
  onBack?: () => void;
}

interface ProfileState {
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
  avatarFile: File | null;
  avatarPreview: string | null;
}

const Profile: React.FC<ProfileProps> = ({ onBack }) => {
  const [profile, setProfile] = useState<ProfileState>({
    name: "",
    email: "",
    phone: "",
    avatar: "",
    avatarFile: null,
    avatarPreview: null,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const storedProfile = localStorage.getItem("adminProfile");
    const storedAvatar = localStorage.getItem("adminAvatar");

    if (storedProfile) {
      const parsed = JSON.parse(storedProfile);
      setProfile({
        name: parsed?.userName || "Admin",
        email: parsed?.email || "",
        phone: parsed?.phoneNumber || "",
        avatar: storedAvatar || null,
        avatarFile: null,
        avatarPreview: storedAvatar || null,
      });
    }
  }, []);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);

    try {
      if (profile.avatarFile) {
        const formData = new FormData();
        formData.append("avatar", profile.avatarFile);

        await axiosInstance.put("/auth/add-avatar", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const res = await axiosInstance.get("/auth/avtatar");
        if (res.data.success) {
          const newAvatarUrl = res.data.data.url;
          localStorage.setItem("adminAvatar", newAvatarUrl);
          setProfile((prev) => ({
            ...prev,
            avatar: newAvatarUrl,
            avatarPreview: newAvatarUrl,
            avatarFile: null,
          }));
        }

        toast({
          title: "Profile updated",
          description: "Your avatar has been updated successfully!",
        });
      } else {
        toast({
          title: "No new avatar",
          description: "Please upload a valid avatar file before saving.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const res = await axiosInstance.put("/auth/change-password", {
        oldPassword,
        newPassword,
        confirmPassword,
      });

      if (res.data.success) {
        toast({
          title: "Password Updated",
          description: "Your password has been changed successfully",
        });
        setShowResetModal(false);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to update password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle forgot password logic here
    setShowForgotModal(false);
    setResetEmail("");
    alert("Password reset link sent to your email!");
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile((prev) => ({
          ...prev,
          avatarFile: file,
          avatarPreview: e.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {/* <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <button
                                onClick={onBack}
                                className="flex items-center text-gray-600 hover:text-green-600 transition-colors"
                            >
                                <ArrowLeft className="h-5 w-5 mr-2" />
                                Back to Dashboard
                            </button>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
                    </div>
                </div>
            </div> */}

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Profile Information Card */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {t("profile.personalInfoTitle") ?? " Personal Information"}
                </h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 bg-green-900 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {isEditing ? t("profile.cancel") : t("profile.editProfile")}
                </button>
              </div>

              <div className="flex items-center mb-8">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center overflow-hidden">
                    {profile.avatarPreview ? (
                      <img
                        src={profile.avatarPreview}
                        alt="Avatar"
                        className="h-24 w-24 object-cover"
                      />
                    ) : (
                      <User className="h-12 w-12 text-green-900" />
                    )}
                  </div>
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-green-900 rounded-full p-2 cursor-pointer hover:bg-green-700 transition-colors">
                      <Camera className="h-4 w-4 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <div className="ml-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {profile.name}
                  </h3>
                  <p className="text-gray-600">
                    {t("profile.administratorRole")}
                  </p>
                </div>
              </div>

              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="inline h-4 w-4 mr-1" />
                      {t("profile.fullNameLabel")}
                    </label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      // disabled={!isEditing}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50 transition-colors"
                      placeholder={t("profile.fullNameLabel")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="inline h-4 w-4 mr-1" />
                      {t("profile.emailLabel")}
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      // disabled={!isEditing}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50 transition-colors"
                      placeholder={t("profile.emailLabel")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="inline h-4 w-4 mr-1" />
                      {t("profile.phoneLabel")}
                    </label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      // disabled={!isEditing}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50 transition-colors"
                      placeholder={t("profile.phoneLabel")}
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-green-900 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      {t("profile.saveChanges")}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Security Settings Card */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {t("profile.securitySettingsTitle")}
              </h2>
              <div className="space-y-4">
                <button
                  onClick={() => setShowResetModal(true)}
                  className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors group"
                >
                  <div className="flex items-center">
                    <Key className="h-5 w-5 text-gray-400 group-hover:text-green-600 mr-3" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">
                        {t("profile.updatePasswordTitle")}
                      </p>
                      <p className="text-sm text-gray-500">
                        {t("profile.updatePasswordDesc")}
                      </p>
                    </div>
                  </div>
                  <ArrowLeft className="h-5 w-5 text-gray-400 group-hover:text-green-600 rotate-180" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Password Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t("profile.updatePasswordTitle")}
            </h3>
            <form onSubmit={handlePasswordReset} className="space-y-4">
              {/* Current Password */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("profile.currentPassword")}
                </label>
                <input
                  type={showOld ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowOld(!showOld)}
                  className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                >
                  {showOld ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>

              {/* New Password */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("profile.newPassword")}
                </label>
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                >
                  {showNew ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>

              {/* Confirm New Password */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("profile.confirmNewPassword")}
                </label>
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                >
                  {showConfirm ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {t("profile.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {loading
                    ? t("profile.updating")
                    : t("profile.updatePasswordButton")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Forgot Password
            </h3>
            <p className="text-gray-600 mb-4">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
