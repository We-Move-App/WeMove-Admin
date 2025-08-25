
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import Layout from '@/components/layout/Layout';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User } from '@/types/admin';
import { toast } from '@/hooks/use-toast';
import { ChevronLeft } from 'lucide-react';
import axiosInstance from '@/api/axiosInstance';
import fileUploadInstance from '@/api/fileUploadInstance';

// Available permissions
const availablePermissions = [
  { id: "userManagement", label: "Manage Users" },
  { id: "busManagement", label: "Manage Bus Operators" },
  { id: "taxiManagement", label: "Manage Taxis" },
  { id: "bikeManagement", label: "Manage Bikes" },
  { id: "hotelManagement", label: "Manage Hotels" },
  { id: "walletManagement", label: "Wallet Management" },
  // { id: "reportsAnalytics", label: "Dashboard" },
  { id: "notifications", label: "Notifications" },
  { id: "roleManagement", label: "Role Management" },
  { id: "commissionManagement", label: "Commission Management" },
  { id: "couponManagement", label: "Coupon Management" },
];


const UserDetails = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  // const [editedUser, setEditedUser] = useState<User | null>(user ? { ...user } : null);
  const [editedUser, setEditedUser] = useState<User>({
    ...user,
    branch: user?.branch ?? {
      branchId: "",
      name: "",
      location: ""
    }
  });

  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState<any[]>([]);
  const [activityLoading, setActivityLoading] = useState(false);
  const [branches, setBranches] = useState<any[]>([]);
  const [searchAddress, setSearchAddress] = useState("");


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
      // Build permissions object (Dashboard always disabled)
      const updatedPermissions = {
        ...editedUser.permissions,
        reportsAnalytics: true, // Dashboard enabled
      };

      // Prepare user payload
      const userPayload = {
        userName: editedUser.userName,
        email: editedUser.email,
        role: editedUser.role,
        permissions: updatedPermissions,
      };

      console.log("User Payload:", userPayload);

      // Update user first
      await axiosInstance.put(`/auth/updateAdmin/${userId}`, userPayload);

      // If branch details exist, update branch too
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

      // Update local state
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
    setEditedUser(prev => {
      if (!prev) return prev;

      // If changing to Admin, set all permissions
      if (role === 'Admin') {
        return {
          ...prev,
          role: role as User['role'],
          permissions: ['all']
        };
      }

      // If changing from Admin, set some default permissions
      if (prev.role === 'Admin') {
        return {
          ...prev,
          role: role as User['role'],
          permissions: ['view_reports']
        };
      }

      return {
        ...prev,
        role: role as User['role']
      };
    });
  };

  if (loading) return <p className="p-6">Loading user details...</p>;

  if (!user || !editedUser) {
    return (
      <>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-red-500">User not found</h1>
        </div>
      </>
    );
  }

  return (
    <>

      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate('/user-management')}
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Back to All Admins / Sub-admins
      </Button>

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin / Sub-admin Details</h1>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)}>
              Edit Admin / Sub-admin
            </Button>
          )}
        </div>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="details">Admin / Sub-admin Details</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Admin / Sub-admin Information</CardTitle>
                <CardDescription>
                  {isEditing ? "Edit Admin / Sub-admin details" : "View Admin / Sub-admin details"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    {isEditing ? (
                      <Input
                        value={editedUser.userName}
                        onChange={(e) => setEditedUser({ ...editedUser, userName: e.target.value })}
                        placeholder="Enter full name"
                      />
                    ) : (
                      <p className="text-gray-700">{user.userName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    {isEditing ? (
                      <Input
                        type="email"
                        value={editedUser.email}
                        onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                        placeholder="Enter email address"
                      />
                    ) : (
                      <p className="text-gray-700">{user.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Role</label>
                    {isEditing ? (
                      <Select
                        value={editedUser.role}
                        onValueChange={(value) => handleRoleChange(value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Subadmin">Subadmin</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-gray-700">{user.role}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {isEditing ? "Choose Branch" : "Branch"}
                    </label>

                    {isEditing ? (
                      <>
                        {/* Search input */}
                        <Input
                          placeholder="Type city or branch..."
                          value={searchAddress}
                          onChange={(e) => setSearchAddress(e.target.value)}
                        />

                        {/* Dropdown results */}
                        {/* {branches.length > 0 && (
                          <div className="border rounded-md bg-white mt-2 max-h-48 overflow-y-auto">
                            {branches.map((branch, idx) => (
                              <div
                                key={idx}
                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                  setSearchAddress(branch.name);
                                  setEditedUser({
                                    ...editedUser,
                                    branch: {
                                      branchId: branch.branchId,
                                      name: branch.name,
                                      location: branch.location || branch.name,
                                    },
                                  });
                                  setBranches([]);
                                }}
                              >
                                {branch.name}
                              </div>
                            ))}
                          </div>
                        )} */}
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
                                      branchId: editedUser.branch?.branchId || "",
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
                      <p className="text-gray-700">{user.branch?.name || "N/A"}</p>
                    )}
                  </div>
                </div>
              </CardContent>

              {isEditing && (
                <CardFooter className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => {
                    setIsEditing(false);
                    setEditedUser({ ...user });
                  }}>
                    Cancel
                  </Button>
                  <Button type="button" onClick={handleSave}>Save Changes</Button>
                </CardFooter>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="permissions">
            <Card>
              <CardHeader>
                <CardTitle>User Permissions</CardTitle>
                <CardDescription>
                  {user.role === 'Admin'
                    ? "Admin users have full access to all features"
                    : "Manage what this user can access and modify"}
                </CardDescription>
              </CardHeader>


              <CardContent>
                <div className="border rounded-md p-4 max-h-96 overflow-y-auto">
                  <div className="space-y-4">
                    {availablePermissions.map((permission) => (
                      <div key={permission.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`permission-${permission.id}`}
                          checked={Boolean(editedUser.permissions?.[permission.id])}
                          onCheckedChange={() => togglePermission(permission.id)}
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
                  <Button variant="outline" onClick={() => {
                    setIsEditing(false);
                    setEditedUser({ ...user });
                  }}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>Save Changes</Button>
                </CardFooter>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Activity Log</CardTitle>
                <CardDescription>Recent activities performed by this user</CardDescription>
              </CardHeader>
              <CardContent>
                {activityLoading ? (
                  <p className="text-sm text-gray-500">Loading activity...</p>
                ) : activity.length === 0 ? (
                  <p className="text-sm text-gray-500">No activity found.</p>
                ) : (
                  <div className="space-y-4">
                    {activity.map((act, index) => {
                      // Pick border color based on type
                      let borderColor = "border-gray-400";
                      if (act.type === "login") borderColor = "border-green-500";
                      if (act.type === "update") borderColor = "border-blue-500";
                      if (act.type === "delete") borderColor = "border-red-500";

                      return (
                        <div
                          key={index}
                          className={`border-l-4 ${borderColor} pl-4 py-2`}
                        >
                          <p className="text-sm text-gray-500">{act.time}</p>
                          <p className="font-medium">{act.activity}</p>
                          <p className="text-xs text-gray-400">
                            By {act.performedBy?.email} ({act.performedBy?.role})
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
