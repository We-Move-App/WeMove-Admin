
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import Layout from '@/components/layout/Layout';
import DataTable from '@/components/ui/DataTable';
import { Eye, Plus, Check, X, ChevronLeft } from 'lucide-react';
import { Commission, User } from '@/types/admin';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { Command, CommandGroup, CommandItem, CommandList, CommandInput } from "@/components/ui/command";
import fileUploadInstance from '@/api/fileUploadInstance';

// Mock user data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin',
    email: 'admin@example.com',
    role: 'Admin',
    permissions: ['all'],
    createdAt: '2023-01-01'
  },
  // {
  //   id: '2',
  //   name: 'Manager User',
  //   email: 'manager@example.com',
  //   role: 'Manager',
  //   permissions: ['view_reports', 'manage_bookings'],
  //   createdAt: '2023-03-15'
  // },
  {
    id: '3',
    name: 'Subadmin',
    email: 'subadmin@example.com',
    role: 'Subadmin',
    permissions: ['view_reports', 'manage_bookings', 'manage_customers'],
    createdAt: '2023-04-20'
  }
];

// Available permissions
const availablePermissions = [
  { id: 'view_reports', label: 'View Reports' },
  { id: 'manage_bookings', label: 'Manage Bookings' },
  { id: 'manage_customers', label: 'Manage Customers' },
  { id: 'manage_operators', label: 'Manage Bus Operators' },
  { id: 'manage_hotels', label: 'Manage Hotels' },
  { id: 'manage_taxis', label: 'Manage Taxis' },
  { id: 'manage_bikes', label: 'Manage Bikes' },
  { id: 'manage_users', label: 'Manage Users' },
  { id: 'manage_commissions', label: 'Manage Commissions' },
  { id: 'manage_coupons', label: 'Manage Coupons' }
];

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState<{
    name: string;
    email: string;
    password: string;
    role: 'Admin' | 'Subadmin';
    permissions: string[];
    branchId: string;
    branchName: string;
  }>({
    name: '',
    email: '',
    password: '',
    role: 'Admin',
    permissions: [],
    branchId: "",
    branchName: "",
  });
  const [branches, setBranches] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [currentCommission, setCurrentCommission] = useState<Commission>({
    id: '',
    serviceType: 'Bus',
    percentage: 0,
    fixedRate: null,
    commissionType: 'percentage',
    effectiveFrom: new Date().toISOString().split('.')[0].slice(0, 16),
    effectiveTo: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('.')[0].slice(0, 16),
    isActive: true
  });

  const handleInputChange = (field: keyof Commission, value: any) => {
    setCurrentCommission(prev => ({ ...prev, [field]: value }));
  };

  const [isEditing, setIsEditing] = useState(false);

  const handleAddUser = () => {
    // Validate form
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    // Add new user
    const user: User = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      permissions: newUser.permissions,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setUsers([...users, user]);
    setIsDialogOpen(false);
    resetForm();

    toast({
      title: "Success",
      description: "User has been created successfully",
    });
  };

  const resetForm = () => {
    setNewUser({
      name: '',
      email: '',
      password: '',
      role: 'Admin',
      permissions: [],
      branchId: '',
      branchName: '',
    });
  };

  const togglePermission = (permission: string) => {
    setNewUser(prev => {
      if (prev.permissions.includes(permission)) {
        return { ...prev, permissions: prev.permissions.filter(p => p !== permission) };
      } else {
        return { ...prev, permissions: [...prev.permissions, permission] };
      }
    });
  };

  const columns = [
    { key: 'name' as keyof User, header: 'Name' },
    { key: 'email' as keyof User, header: 'Email' },
    { key: 'role' as keyof User, header: 'Role' },
    {
      key: 'permissions' as keyof User,
      header: 'Permissions',
      render: (user: User) => (
        <span className="text-sm">
          {user.role === 'Admin' ? 'Full Access' : `${user.permissions.length} permissions`}
        </span>
      )
    },
    { key: 'createdAt' as keyof User, header: 'Created At' },
    {
      key: 'actions' as 'actions',
      header: 'Actions',
      render: (user: User) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/user-management/${user.id}`);
          }}
          className="action-button flex items-center"
        >
          <Eye size={16} className="mr-1" />
          View Details
        </button>
      )
    }
  ];

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim().length > 2) {
        fetchBranches(query);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const fetchBranches = async (address: string) => {
    setLoading(true);
    try {
      const res = await fileUploadInstance.get(`/google-search?address=${address}`);
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


  const handleRowClick = (user: User) => {
    navigate(`/user-management/${user.id}`);
  };

  return (
    <>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Role Management</h1>
          <p className="text-gray-600">Manage admin, sub-admin roles and their permissions</p>
        </div>

        <Button
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          Add Admin / Sub-admin
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={users}
        keyExtractor={(item) => item.id}
        onRowClick={handleRowClick}
      // searchable={true}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                placeholder="Enter full name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="Enter email address"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                placeholder="Create password"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Select
                value={newUser.role}
                onValueChange={(value: 'Admin' | 'Subadmin') => setNewUser({ ...newUser, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Subadmin">Sub-Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Service Type</label>
              <Select
                value={currentCommission.serviceType}
                onValueChange={(value: any) => handleInputChange('serviceType', value)}
                disabled={isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bus">Bus</SelectItem>
                  <SelectItem value="Hotel">Hotel</SelectItem>
                  <SelectItem value="Taxi">Taxi</SelectItem>
                  <SelectItem value="Bike">Bike</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
                <p className="text-xs text-gray-400">Selected: {newUser.branchName}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Permissions</label>
              <div className="border rounded-md p-4 max-h-48 overflow-y-auto">
                <div className="space-y-2">
                  {availablePermissions.map((permission) => (
                    <div key={permission.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`permission-${permission.id}`}
                        checked={newUser.permissions.includes(permission.id)}
                        onCheckedChange={() => togglePermission(permission.id)}
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
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddUser}>Add User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserManagement;
