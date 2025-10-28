import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import Layout from '@/components/layout/Layout';
import DataTable from "@/components/ui/DataTable";
import { Eye, Plus, Check, X, ChevronLeft } from "lucide-react";
import { Commission, User } from "@/types/admin";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandInput,
} from "@/components/ui/command";
import fileUploadInstance from "@/api/fileUploadInstance";
import axiosInstance from "@/api/axiosInstance";
import { permission } from "process";

// Mock user data
// const mockUsers: User[] = [
//   {
//     id: '1',
//     name: 'Admin',
//     email: 'admin@example.com',
//     role: 'Admin',
//     permissions: ['all'],
//     createdAt: '2023-01-01'
//   },
//   // {
//   //   id: '2',
//   //   name: 'Manager User',
//   //   email: 'manager@example.com',
//   //   role: 'Manager',
//   //   permissions: ['view_reports', 'manage_bookings'],
//   //   createdAt: '2023-03-15'
//   // },
//   {
//     id: '3',
//     name: 'Subadmin',
//     email: 'subadmin@example.com',
//     role: 'Subadmin',
//     permissions: ['view_reports', 'manage_bookings', 'manage_customers'],
//     createdAt: '2023-04-20'
//   }
// ];

// Available permissions
const availablePermissions = [
  { id: "reportsAnalytics", label: "Dashboard" },
  { id: "busManagement", label: "Manage Bus Operators" },
  { id: "hotelManagement", label: "Manage Hotels" },
  { id: "taxiManagement", label: "Manage Taxis" },
  { id: "bikeManagement", label: "Manage Bikes" },
  { id: "userManagement", label: "Manage Users" },
  // { id: 'subadminManagement', label: 'Manage Sub-admins' },
  { id: "commissionManagement", label: "Manage Commissions" },
  { id: "couponManagement", label: "Manage Coupons" },
  { id: "roleManagement", label: "Manage Roles" },
  // { id: "notifications", label: "Manage Notifications" },
  // { id: "walletManagement", label: "Wallet Management" },
];

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState<{
    name: string;
    email: string;
    phoneNumber: string;
    // password: string;
    role: "SuperAdmin" | "Admin" | "SubAdmin";
    permissions: string[];
    branchId: string;
    branchName: string;
    adminId: string;
  }>({
    name: "",
    email: "",
    phoneNumber: "",
    // password: '',
    role: "Admin",
    permissions: [],
    branchId: "",
    branchName: "",
    adminId: "",
  });
  const [branches, setBranches] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
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
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [admins, setAdmins] = useState<any[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalBookings, setTotalBookings] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [role, setRole] = useState<string | null>(null);
  const [adminProfile, setAdminProfile] = useState<any>(null);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim().length > 2) {
        fetchBranches(query);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  useEffect(() => {
    const fetchAdmins = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axiosInstance.get("/auth/all-admins", {
          params: { page: currentPage, limit: pageSize, search: searchTerm },
        });

        console.log("Fetched admins:", res.data);
        const usersData = res.data?.data?.data || [];
        const total = res.data?.data?.total || res.data?.total || 0;
        setUsers(
          usersData.map((user: any) => ({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            permissionsCount: user.permissionsCount,
            createdAt: user.createdAt,
            branch: user.branch,
          }))
        );
        setTotalBookings(total);
      } catch (err: any) {
        console.error("Failed to fetch users:", err);
        setError(err?.response?.data?.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, [currentPage, pageSize, searchTerm]);

  useEffect(() => {
    if (newUser.role === "SubAdmin") {
      const fetchAdmins = async () => {
        setLoadingAdmins(true);
        try {
          const res = await axiosInstance.get("/auth/all-admins?role=Admin");
          const adminsData = res.data?.data?.data || [];
          setAdmins(adminsData);
        } catch (err) {
          console.error("Failed to fetch admins:", err);
        } finally {
          setLoadingAdmins(false);
        }
      };

      fetchAdmins();
    }
  }, [newUser.role]);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const storedProfile = localStorage.getItem("AdminProfile");

    if (storedRole) setRole(storedRole);
    if (storedProfile) setAdminProfile(JSON.parse(storedProfile));
  }, []);

  const handleInputChange = (field: keyof Commission, value: any) => {
    setCurrentCommission((prev) => ({ ...prev, [field]: value }));
  };

  const togglePermission = (permission: string) => {
    setNewUser((prev) => {
      if (prev.permissions.includes(permission)) {
        return {
          ...prev,
          permissions: prev.permissions.filter((p) => p !== permission),
        };
      } else {
        return { ...prev, permissions: [...prev.permissions, permission] };
      }
    });
  };

  const columns = [
    { key: "name" as keyof User, header: "Name" },
    { key: "email" as keyof User, header: "Email" },
    { key: "role" as keyof User, header: "Role" },
    {
      key: "permissions" as keyof User,
      header: "Permissions",
      render: (user: any) => (
        <span className="text-sm">
          {user.role === "SuperAdmin"
            ? "Full Access"
            : `${user.permissionsCount} permissions`}
        </span>
      ),
    },
    // { key: 'createdAt' as keyof User, header: 'Created At' },
    {
      key: "branch" as keyof User,
      header: "Branch",
      render: (user: any) => (
        <span className="text-sm">{user.branch?.location || "N/A"}</span>
      ),
    },
    {
      key: "actions" as "actions",
      header: "Actions",
      render: (user: User) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/admin-management/${user.id}`);
          }}
          className="action-button flex items-center"
        >
          <Eye size={16} className="mr-1" />
          View Details
        </button>
      ),
    },
  ];
  const fetchBranches = async (address: string) => {
    setLoading(true);
    try {
      const res = await fileUploadInstance.get(
        `/google-search?address=${address}`
      );
      if (res.data?.data) {
        // Convert string[] → {id, name}[]
        const formatted = res.data.data.map((item: string) => ({
          id: item,
          name: item,
        }));
        setBranches(formatted);
      }
    } catch (err) {
      console.error("Failed to fetch branches:", err);
    } finally {
      setLoading(false);
    }
  };

  // const handleAddUser = async () => {
  //   if (!newUser.name || !newUser.email || !newUser.phoneNumber) {
  //     toast({ title: "Please fill in all required fields.." });
  //     return;
  //   }

  //   try {
  //     let branchId = newUser.branchId;

  //     // Only Admins can create/select branch
  //     if (newUser.role === "Admin") {
  //       if (!newUser.branchName) {
  //         toast({ title: "Please select a branch for Admin" });
  //         return;
  //       }

  //       const branchPayload = {
  //         name: newUser.branchName,
  //         location: query,
  //       };

  //       const branchRes = await axiosInstance.post("/branch", branchPayload);
  //       branchId = branchRes.data?.data?.branch?._id;
  //       console.log("Branch created/confirmed with ID:", branchId);
  //     }

  //     //  Permissions payload
  //     const allBackendKeys = [
  //       "reportsAnalytics",
  //       "busManagement",
  //       "hotelManagement",
  //       "taxiManagement",
  //       "bikeManagement",
  //       "userManagement",
  //       "roleManagement",
  //       "commissionManagement",
  //       "couponManagement",
  //       "notifications",
  //       "walletManagement",
  //     ];

  //     const permissionsPayload: Record<string, boolean> = {};
  //     allBackendKeys.forEach((key) => {
  //       permissionsPayload[key] =
  //         key === "reportsAnalytics" ? true : newUser.permissions.includes(key);
  //     });

  //     // Build user payload
  //     const userPayload: any = {
  //       email: newUser.email,
  //       userName: newUser.name,
  //       phoneNumber: newUser.phoneNumber,
  //       role: newUser.role,
  //       permissions: permissionsPayload,
  //       branch: branchId,
  //     };

  //     if (newUser.role === "SubAdmin") {
  //       userPayload.reportingManger = newUser.adminId;
  //     }

  //     console.log("Creating user with payload:", userPayload);

  //     // API call
  //     let userRes;
  //     if (newUser.role === "Admin") {
  //       userRes = await axiosInstance.post("/auth/add-admin", userPayload);
  //     } else if (newUser.role === "SubAdmin") {
  //       userRes = await axiosInstance.post("/auth/add-SubAdmin", userPayload);
  //     }

  //     toast({ title: `${newUser.role} created successfully!` });

  //     // Update local state
  //     setUsers((prev) => [
  //       ...prev,
  //       { ...userRes!.data, id: userRes!.data.id || Date.now().toString() },
  //     ]);

  //     // Reset form
  //     setNewUser({
  //       name: "",
  //       email: "",
  //       phoneNumber: "",
  //       role: "Admin",
  //       permissions: [],
  //       branchId: "",
  //       branchName: "",
  //       adminId: "",
  //     });
  //     setQuery("");
  //     setIsDialogOpen(false);
  //   } catch (error: any) {
  //     console.error(error);
  //     toast({ title: `Failed to create ${newUser.role}.` });
  //   }
  // };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.phoneNumber) {
      toast({ title: "Please fill in all required fields.." });
      return;
    }

    try {
      let branchId = newUser.branchId;

      // 🔑 Permissions payload
      const allBackendKeys = [
        "reportsAnalytics",
        "busManagement",
        "hotelManagement",
        "taxiManagement",
        "bikeManagement",
        "userManagement",
        "roleManagement",
        "commissionManagement",
        "couponManagement",
        "notifications",
        "walletManagement",
      ];

      const permissionsPayload: Record<string, boolean> = {};
      allBackendKeys.forEach((key) => {
        permissionsPayload[key] =
          key === "reportsAnalytics" ? true : newUser.permissions.includes(key);
      });

      // 👤 Build base payload
      const userPayload: any = {
        email: newUser.email,
        userName: newUser.name,
        phoneNumber: newUser.phoneNumber,
        permissions: permissionsPayload,
      };

      // --- Role-based branching ---
      let userRes;

      // 🏢 SuperAdmin → Admin
      if (role === "SuperAdmin" && newUser.role === "Admin") {
        if (!newUser.branchName) {
          toast({ title: "Please select a branch for Admin" });
          return;
        }

        const branchPayload = { name: newUser.branchName, location: query };
        const branchRes = await axiosInstance.post("/branch", branchPayload);
        branchId = branchRes.data?.data?.branch?._id;

        userPayload.role = "Admin";
        userPayload.branch = branchId;

        userRes = await axiosInstance.post("/auth/add-admin", userPayload);
      }

      // ⚡ SuperAdmin → SubAdmin
      else if (role === "SuperAdmin" && newUser.role === "SubAdmin") {
        if (!newUser.adminId) {
          toast({ title: "Please assign an Admin for the Sub-Admin" });
          return;
        }

        userPayload.role = "SubAdmin";
        userPayload.reportingManager = newUser.adminId;
        userPayload.branch = branchId;

        userRes = await axiosInstance.post("/auth/add-SubAdmin", userPayload);
      }

      // ⚡ Admin → SubAdmin
      else if (role === "Admin") {
        userPayload.role = "SubAdmin";
        // No branch, no reportingManager
        userRes = await axiosInstance.post("/auth/add-SubAdmin", userPayload);
      } else {
        throw new Error("Invalid role combination for user creation");
      }

      toast({ title: `${userPayload.role} created successfully!` });

      // Update local state
      setUsers((prev) => [
        ...prev,
        { ...userRes!.data, id: userRes!.data.id || Date.now().toString() },
      ]);

      // Reset form
      setNewUser({
        name: "",
        email: "",
        phoneNumber: "",
        role: "Admin",
        permissions: [],
        branchId: "",
        branchName: "",
        adminId: "",
      });
      setQuery("");
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error(error);
      toast({ title: `Failed to create ${newUser.role}.` });
    }
  };

  const handleRowClick = (user: User) => {
    navigate(`/user-management/${user.id}`);
  };

  const filteredPermissions = availablePermissions.filter((perm) => {
    // Hide "Manage Roles" if logged-in user is Admin
    if (role === "Admin" && perm.id === "roleManagement") {
      return false;
    }

    // If logged-in is SuperAdmin but creating SubAdmin → hide "Manage Roles"
    if (
      role === "SuperAdmin" &&
      newUser.role === "SubAdmin" &&
      perm.id === "roleManagement"
    ) {
      return false;
    }

    return true;
  });

  return (
    <>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Role Management</h1>
          {/* <p className="text-gray-600">
            Manage admin, sub-admin roles and their permissions
          </p> */}
          {role === "Admin"
            ? "Manage sub-admin roles and their permissions"
            : "Manage admin, sub-admin roles and their permissions"}
        </div>

        <Button
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          {/* Add Admin / Sub-admin */}
          {role === "Admin" ? "Add Sub-Admin" : "Add Admin / Sub-admin"}
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={users}
        keyExtractor={(item) => item.id}
        onRowClick={handleRowClick}
        paginate
        pageSize={pageSize}
        currentPage={currentPage}
        totalItems={totalBookings}
        onPageChange={setCurrentPage}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        // searchable={true}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {role === "Admin"
                ? "Add New Sub-Admin"
                : "Add New Admin / Sub-admin"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
                placeholder="Enter full name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Mobile Number</label>
              <Input
                value={newUser.phoneNumber}
                onChange={(e) =>
                  setNewUser({ ...newUser, phoneNumber: e.target.value })
                }
                placeholder="Enter mobile number"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                placeholder="Enter email address"
              />
            </div>
            {role !== "Admin" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <Select
                  value={newUser.role}
                  onValueChange={(value: "Admin" | "SubAdmin") =>
                    setNewUser({ ...newUser, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="SubAdmin">Sub-Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* {newUser.role === "SubAdmin" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Assign Admin</label>
                <Select
                  value={newUser.adminId || ""}
                  onValueChange={(value) => {
                    const selectedAdmin = admins.find(
                      (admin) => admin._id === value
                    );
                    if (selectedAdmin) {
                      console.log("Admin ID:", selectedAdmin._id);
                      console.log("Branch ID:", selectedAdmin.branch.branchId);

                      setNewUser({
                        ...newUser,
                        adminId: selectedAdmin._id,
                        branchId: selectedAdmin.branch.branchId,
                      });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an Admin" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingAdmins ? (
                      <div className="p-2 text-sm">Loading admins...</div>
                    ) : admins.length === 0 ? (
                      <div className="p-2 text-sm">No admins found</div>
                    ) : (
                      admins.map((admin) => (
                        <SelectItem key={admin._id} value={admin._id}>
                          {admin.name} ({admin.branch.location})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            )} */}
            {role !== "Admin" && newUser.role === "SubAdmin" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Assign Admin</label>
                <Select
                  value={newUser.adminId || ""}
                  onValueChange={(value) => {
                    const selectedAdmin = admins.find(
                      (admin) => admin._id === value
                    );
                    if (selectedAdmin) {
                      console.log("Admin ID:", selectedAdmin._id);
                      console.log("Branch ID:", selectedAdmin.branch.branchId);

                      setNewUser({
                        ...newUser,
                        adminId: selectedAdmin._id,
                        branchId: selectedAdmin.branch.branchId,
                      });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an Admin" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingAdmins ? (
                      <div className="p-2 text-sm">Loading admins...</div>
                    ) : admins.length === 0 ? (
                      <div className="p-2 text-sm">No admins found</div>
                    ) : (
                      admins.map((admin) => (
                        <SelectItem key={admin._id} value={admin._id}>
                          {admin.name} ({admin.branch.location})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}
            {/* 
            {newUser.role === "Admin" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Choose Branch</label>
                <Command className="border rounded-md">
                  <CommandInput
                    placeholder="Type city name..."
                    value={query}
                    onValueChange={(val) => setQuery(val)}
                  />
                  <CommandList>
                    {loading && <div className="p-2 text-sm">Loading...</div>}
                    {!loading && branches.length === 0 && query.length > 2 && (
                      <div className="p-2 text-sm">No results found</div>
                    )}
                    <CommandGroup>
                      {branches.map((branch) => (
                        <CommandItem
                          key={branch.id}
                          onSelect={() =>
                            setNewUser({
                              ...newUser,
                              branchId: branch.id,
                              branchName: branch.name,
                            })
                          }
                        >
                          {branch.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
                {newUser.branchName && (
                  <p className="text-xs text-gray-400">
                    Selected: {newUser.branchName}
                  </p>
                )}
              </div>
            )} */}

            {role !== "Admin" && newUser.role === "Admin" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Choose Branch</label>
                <Command className="border rounded-md">
                  <CommandInput
                    placeholder="Type city name..."
                    value={query}
                    onValueChange={(val) => setQuery(val)}
                  />
                  <CommandList>
                    {loading && <div className="p-2 text-sm">Loading...</div>}
                    {!loading && branches.length === 0 && query.length > 2 && (
                      <div className="p-2 text-sm">No results found</div>
                    )}
                    <CommandGroup>
                      {branches.map((branch) => (
                        <CommandItem
                          key={branch.id}
                          onSelect={() =>
                            setNewUser({
                              ...newUser,
                              branchId: branch.id,
                              branchName: branch.name,
                            })
                          }
                        >
                          {branch.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
                {newUser.branchName && (
                  <p className="text-xs text-gray-400">
                    Selected: {newUser.branchName}
                  </p>
                )}
              </div>
            )}

            {/* <div className="space-y-2">
              <label className="text-sm font-medium">Permissions</label>
              <div className="border rounded-md p-4 max-h-48 overflow-y-auto">
                <div className="space-y-2">
                  {availablePermissions.map((permission) => {
                    const isDashboard = permission.id === "reportsAnalytics";
                    return (
                      <div
                        key={permission.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`permission-${permission.id}`}
                          checked={
                            isDashboard ||
                            newUser.permissions.includes(permission.id)
                          }
                          disabled={isDashboard}
                          onCheckedChange={() => {
                            if (!isDashboard) togglePermission(permission.id);
                          }}
                        />
                        <label
                          htmlFor={`permission-${permission.id}`}
                          className="text-sm font-medium leading-none cursor-pointer"
                        >
                          {permission.label}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div> */}

            <div className="space-y-2">
              <label className="text-sm font-medium">Permissions</label>
              <div className="border rounded-md p-4 max-h-48 overflow-y-auto">
                <div className="space-y-2">
                  {filteredPermissions.map((permission) => {
                    const isDashboard = permission.id === "reportsAnalytics";
                    return (
                      <div
                        key={permission.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`permission-${permission.id}`}
                          checked={
                            isDashboard ||
                            newUser.permissions.includes(permission.id)
                          }
                          disabled={isDashboard}
                          onCheckedChange={() => {
                            if (!isDashboard) togglePermission(permission.id);
                          }}
                        />
                        <label
                          htmlFor={`permission-${permission.id}`}
                          className="text-sm font-medium leading-none cursor-pointer"
                        >
                          {permission.label}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser}>
              {role === "Admin" ? "Add Sub-admin" : "Add Admin / Sub-admin"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserManagement;
