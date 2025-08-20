
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import Layout from '@/components/layout/Layout';
import DataTable from '@/components/ui/DataTable';
import { Eye, Plus, Check, X } from 'lucide-react';
import { User } from '@/types/admin';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';

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
    role: 'Subadmin' | 'Manager';
    permissions: string[];
  }>({
    name: '',
    email: '',
    password: '',
    role: 'Manager',
    permissions: []
  });

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
      role: 'Manager',
      permissions: []
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
                onValueChange={(value: 'Subadmin' | 'Manager') => setNewUser({ ...newUser, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Subadmin">Subadmin</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                </SelectContent>
              </Select>
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
