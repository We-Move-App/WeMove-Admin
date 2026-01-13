import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import Layout from '@/components/layout/Layout';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "@/types/admin";
import { toast } from "@/hooks/use-toast";
import { ChevronLeft } from "lucide-react";
import axiosInstance from "@/api/axiosInstance";
import fileUploadInstance from "@/api/fileUploadInstance";
import CustomerDetailsSkeleton from "@/components/ui/loader-skeleton";
import { useTranslation } from "react-i18next";

// Available permissions
const availablePermissions = [
  { id: "userManagement", label: "Manage Users" },
  { id: "busManagement", label: "Manage Bus Operators" },
  { id: "taxiManagement", label: "Manage Taxis" },
  { id: "bikeManagement", label: "Manage Bikes" },
  { id: "hotelManagement", label: "Manage Hotels" },
  // { id: "walletManagement", label: "Wallet Management" },
  // { id: "reportsAnalytics", label: "Dashboard" },
  // { id: "notifications", label: "Notifications" },
  { id: "roleManagement", label: "Role Management" },
  { id: "commissionManagement", label: "Commission Management" },
  { id: "couponManagement", label: "Coupon Management" },
];

const UserDetails = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User>({
    ...user,
    branch: user?.branch ?? {
      branchId: "",
      name: "",
      location: "",
    },
  });

  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState<any[]>([]);
  const [activityLoading, setActivityLoading] = useState(false);
  const [branches, setBranches] = useState<any[]>([]);
  const [searchAddress, setSearchAddress] = useState("");
  const { i18n, t } = useTranslation();

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/auth/details/${userId}`);
        if (res.data?.data) {
          const userData = res.data.data;
          const formattedUser = {
            ...userData,
            branch: userData.branch
              ? {
                  branchId: userData.branch.branchId,
                  name: userData.branch.name,
                  location: userData.branch.location,
                }
              : null,
          };

          setUser(formattedUser);
          setEditedUser(formattedUser);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    const fetchActivity = async () => {
      setActivityLoading(true);
      try {
        const res = await axiosInstance.get(`/auth/activity/${userId}`);
        if (res.data?.data) {
          setActivity(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching activity:", err);
      } finally {
        setActivityLoading(false);
      }
    };

    fetchActivity();
  }, [userId]);

  useEffect(() => {
    if (!isEditing || !searchAddress) return;

    const timeout = setTimeout(async () => {
      try {
        const res = await fileUploadInstance.get(
          `/google-search?address=${searchAddress}`
        );
        console.log("Branch API response:", res.data.data);
        setBranches(res.data.data || []);
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [isEditing, searchAddress]);

  useEffect(() => {
    if (isEditing && editedUser) {
      setSearchAddress(editedUser.branch?.name || "");
    }
  }, [isEditing, editedUser]);

  const handleSave = async () => {
    try {
      const updatedPermissions = {
        ...editedUser.permissions,
        reportsAnalytics: true,
      };

      const userPayload = {
        userName: editedUser.userName,
        email: editedUser.email,
        role: editedUser.role,
        permissions: updatedPermissions,
      };

      console.log("User Payload:", userPayload);
      await axiosInstance.put(`/auth/updateAdmin/${userId}`, userPayload);
      if (editedUser.branch?.branchId) {
        const branchPayload = {
          name: editedUser.branch.name,
          location: editedUser.branch.location || editedUser.branch.name,
        };

        console.log("Payload:", branchPayload);

        await axiosInstance.put(
          `/branch/${editedUser.branch.branchId}`,
          branchPayload
        );
      }
      setIsEditing(false);
      setUser({ ...editedUser, permissions: updatedPermissions });
    } catch (err) {
      console.error("Failed to update user", err);
    }
  };

  const togglePermission = (id: string) => {
    if (!editedUser) return;
    setEditedUser((prev) =>
      prev
        ? {
            ...prev,
            permissions: {
              ...prev.permissions,
              [id]: !prev.permissions[id],
            },
          }
        : prev
    );
  };

  const handleRoleChange = (role: string) => {
    setEditedUser((prev) => {
      if (!prev) return prev;
      if (role === "Admin") {
        return {
          ...prev,
          role: role as User["role"],
          permissions: ["all"],
        };
      }
      if (prev.role === "Admin") {
        return {
          ...prev,
          role: role as User["role"],
          permissions: ["view_reports"],
        };
      }
      return {
        ...prev,
        role: role as User["role"],
      };
    });
  };

  if (loading) return <CustomerDetailsSkeleton />;

  if (!user || !editedUser) {
    return (
      <>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-red-500">
            {t("adminManagement.notFound")}
          </h1>
        </div>
      </>
    );
  }

  return (
    <>
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate("/admin-management")}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />{" "}
        {t("adminManagement.backButton")}
      </Button>

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {" "}
            {t("adminManagement.pageTitle")}
          </h1>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)}>
              {t("adminManagement.buttons.edit")}
            </Button>
          )}
        </div>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="details">
              {t("adminManagement.tabs.details")}
            </TabsTrigger>
            <TabsTrigger value="permissions">
              {t("adminManagement.tabs.permissions")}
            </TabsTrigger>
            <TabsTrigger value="activity">
              {t("adminManagement.tabs.activity")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>
                  {t("adminManagement.detailsSection.title")}
                </CardTitle>
                <CardDescription>
                  {isEditing
                    ? t("adminManagement.detailsSection.editDescription")
                    : t("adminManagement.detailsSection.viewDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {t("adminManagement.detailsSection.fields.name")}
                    </label>
                    {isEditing ? (
                      <Input
                        value={editedUser.userName}
                        onChange={(e) =>
                          setEditedUser({
                            ...editedUser,
                            userName: e.target.value,
                          })
                        }
                        placeholder={t(
                          "adminManagement.detailsSection.fields.placeholder.name"
                        )}
                      />
                    ) : (
                      <p className="text-gray-700">{user.userName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {t("adminManagement.detailsSection.fields.email")}
                    </label>
                    {isEditing ? (
                      <Input
                        type="email"
                        value={editedUser.email}
                        onChange={(e) =>
                          setEditedUser({
                            ...editedUser,
                            email: e.target.value,
                          })
                        }
                        placeholder={t(
                          "adminManagement.detailsSection.fields.placeholder.email"
                        )}
                      />
                    ) : (
                      <p className="text-gray-700">{user.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {t("adminManagement.detailsSection.fields.mobileNumber")}
                    </label>
                    {isEditing ? (
                      <Input
                        type="tel"
                        value={editedUser.phoneNumber}
                        onChange={(e) =>
                          setEditedUser({
                            ...editedUser,
                            phoneNumber: e.target.value,
                          })
                        }
                        placeholder={t(
                          "adminManagement.detailsSection.fields.placeholder.mobileNumber"
                        )}
                      />
                    ) : (
                      <p className="text-gray-700">{user.phoneNumber}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {t("adminManagement.detailsSection.fields.role")}
                    </label>
                    {isEditing ? (
                      <Select
                        value={editedUser.role}
                        onValueChange={(value) => handleRoleChange(value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Admin">
                            {t(
                              "adminManagement.detailsSection.fields.roleOptions.admin"
                            )}
                          </SelectItem>
                          <SelectItem value="Subadmin">
                            {t(
                              "adminManagement.detailsSection.fields.roleOptions.subadmin"
                            )}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-gray-700">{user.role}</p>
                    )}
                  </div>

                  {/* <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {isEditing ? "Choose Branch" : "Branch"}
                    </label>

                    {isEditing ? (
                      <>
                        <Input
                          placeholder="Type city or branch..."
                          value={searchAddress}
                          onChange={(e) => setSearchAddress(e.target.value)}
                        />
                        {branches.length > 0 && (
                          <div className="border rounded-md bg-white mt-2 max-h-48 overflow-y-auto">
                            {branches.map((branchName, idx) => (
                              <div
                                key={idx}
                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                  setSearchAddress(branchName);
                                  setEditedUser({
                                    ...editedUser,
                                    branch: {
                                      branchId:
                                        editedUser.branch?.branchId || "",
                                      name: branchName,
                                      location: branchName,
                                    },
                                  });
                                  setBranches([]);
                                }}
                              >
                                {branchName}
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-gray-700">
                        {user.branch?.name || "N/A"}
                      </p>
                    )}
                  </div> */}
                </div>
              </CardContent>

              {isEditing && (
                <CardFooter className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setEditedUser({ ...user });
                    }}
                  >
                    {t("adminManagement.buttons.cancel")}
                  </Button>
                  <Button type="button" onClick={handleSave}>
                    {t("adminManagement.buttons.save")}
                  </Button>
                </CardFooter>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="permissions">
            <Card>
              <CardHeader>
                <CardTitle>
                  {t("adminManagement.permissionsSection.title")}
                </CardTitle>
                <CardDescription>
                  {user.role === "Admin"
                    ? t("adminManagement.permissionsSection.description.admin")
                    : t(
                        "adminManagement.permissionsSection.description.subadmin"
                      )}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="border rounded-md p-4 max-h-96 overflow-y-auto">
                  <div className="space-y-4">
                    {availablePermissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`permission-${permission.id}`}
                          checked={Boolean(
                            editedUser.permissions?.[permission.id]
                          )}
                          onCheckedChange={() =>
                            togglePermission(permission.id)
                          }
                          disabled={!isEditing}
                        />
                        <label
                          htmlFor={`permission-${permission.id}`}
                          className="text-sm font-medium leading-none cursor-pointer"
                        >
                          {permission.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              {isEditing && (
                <CardFooter className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setEditedUser({ ...user });
                    }}
                  >
                    {t("adminManagement.buttons.cancel")}
                  </Button>
                  <Button onClick={handleSave}>
                    {t("adminManagement.buttons.save")}
                  </Button>
                </CardFooter>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>
                  {t("adminManagement.activitySection.title")}
                </CardTitle>
                <CardDescription>
                  {t("adminManagement.activitySection.description")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activityLoading ? (
                  <p className="text-sm text-gray-500">
                    {t("adminManagement.activitySection.loading")}
                  </p>
                ) : activity.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    {t("adminManagement.activitySection.noActivity")}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {activity.map((act, index) => {
                      // Pick border color based on type
                      let borderColor = "border-gray-400";
                      if (act.type === "login")
                        borderColor = "border-green-500";
                      if (act.type === "update")
                        borderColor = "border-blue-500";
                      if (act.type === "delete") borderColor = "border-red-500";

                      return (
                        <div
                          key={index}
                          className={`border-l-4 ${borderColor} pl-4 py-2`}
                        >
                          <p className="text-sm text-gray-500">{act.time}</p>
                          <p className="font-medium">{act.activity}</p>
                          <p className="text-xs text-gray-400">
                            By {act.performedBy?.email} ({act.performedBy?.role}
                            )
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default UserDetails;
