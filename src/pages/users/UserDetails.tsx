
import { useState } from 'react';
import { useParams } from 'react-router-dom';
// import Layout from '@/components/layout/Layout';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User } from '@/types/admin';
import { toast } from '@/hooks/use-toast';

// Mock user data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'Admin',
    permissions: ['all'],
    createdAt: '2023-01-01'
  },
  {
    id: '2',
    name: 'Manager User',
    email: 'manager@example.com',
    role: 'Manager',
    permissions: ['view_reports', 'manage_bookings'],
    createdAt: '2023-03-15'
  },
  {
    id: '3',
    name: 'Subadmin User',
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

const UserDetails = () => {
  const { userId } = useParams();
  const user = mockUsers.find(u => u.id === userId);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(user ? { ...user } : null);

  if (!user || !editedUser) {
    return (
      <>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-red-500">User not found</h1>
        </div>
      </>
    );
  }

  const handleSave = () => {
    // In a real app, this would update the data in the backend
    toast({
      title: "User updated",
      description: `User ${editedUser.name} has been updated successfully`,
    });
    setIsEditing(false);
  };

  const togglePermission = (permission: string) => {
    if (editedUser.role === 'Admin') return; // Admins have all permissions

    setEditedUser(prev => {
      if (!prev) return prev;

      if (prev.permissions.includes(permission)) {
        return {
          ...prev,
          permissions: prev.permissions.filter(p => p !== permission)
        };
      } else {
        return {
          ...prev,
          permissions: [...prev.permissions, permission]
        };
      }
    });
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

  return (
    <>
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
                        value={editedUser.name}
                        onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                        placeholder="Enter full name"
                      />
                    ) : (
                      <p className="text-gray-700">{user.name}</p>
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
                          <SelectItem value="Manager">Manager</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-gray-700">{user.role}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Created At</label>
                    <p className="text-gray-700">{user.createdAt}</p>
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
                          checked={editedUser.role === 'Admin' || editedUser.permissions.includes(permission.id)}
                          onCheckedChange={() => togglePermission(permission.id)}
                          disabled={!isEditing || editedUser.role === 'Admin'}
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
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4 py-2">
                    <p className="text-sm text-gray-500">Today, 10:30 AM</p>
                    <p className="font-medium">Logged in successfully</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4 py-2">
                    <p className="text-sm text-gray-500">Yesterday, 3:45 PM</p>
                    <p className="font-medium">Updated customer record #4328</p>
                  </div>
                  <div className="border-l-4 border-amber-500 pl-4 py-2">
                    <p className="text-sm text-gray-500">Yesterday, 1:20 PM</p>
                    <p className="font-medium">Generated monthly report</p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4 py-2">
                    <p className="text-sm text-gray-500">2 days ago, 11:15 AM</p>
                    <p className="font-medium">Added new coupon code</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default UserDetails;
