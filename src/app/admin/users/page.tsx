'use client';

import { useState, useEffect } from 'react';
import { HiSearch, HiUsers, HiShieldCheck, HiBan, HiMail } from 'react-icons/hi';
import { collection, query, getDocs, updateDoc, doc, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User } from '@/types';
import { Button, Card, Input, Spinner, Badge, Avatar, Modal } from '@/components/ui';
import { formatDate } from '@/utils/helpers';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersQuery = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(usersQuery);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as User[];
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      user.email?.toLowerCase().includes(searchLower) ||
      user.displayName?.toLowerCase().includes(searchLower) ||
      user.phone?.includes(searchQuery)
    );
  });

  const handleRoleChange = async (newRole: 'user' | 'admin') => {
    if (!selectedUser) return;

    try {
      await updateDoc(doc(db, 'users', selectedUser.id), {
        role: newRole,
      });

      setUsers((prev) =>
        prev.map((u) => (u.id === selectedUser.id ? { ...u, role: newRole } : u))
      );

      toast.success(`User role updated to ${newRole}`);
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update role');
    } finally {
      setShowRoleModal(false);
      setSelectedUser(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage user accounts and permissions.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Input
          placeholder="Search by name, email, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<HiSearch className="w-5 h-5" />}
          className="max-w-md"
        />
      </div>

      {/* Users Table */}
      {filteredUsers.length === 0 ? (
        <Card className="text-center py-12">
          <HiUsers className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {searchQuery ? 'No users found' : 'No users yet'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {searchQuery ? 'Try adjusting your search query' : 'Users will appear here when they sign up'}
          </p>
        </Card>
      ) : (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={user.photoURL}
                          alt={user.displayName || 'User'}
                          size="md"
                        />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {user.displayName || 'No name'}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            ID: {user.id.slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        {user.email && (
                          <p className="text-gray-900 dark:text-white">{user.email}</p>
                        )}
                        {user.phone && (
                          <p className="text-gray-500 dark:text-gray-400">{user.phone}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={user.role === 'admin' ? 'purple' : 'default'}>
                        {user.role === 'admin' ? (
                          <>
                            <HiShieldCheck className="w-3 h-3 mr-1" />
                            Admin
                          </>
                        ) : (
                          'User'
                        )}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {user.createdAt ? formatDate(user.createdAt) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowRoleModal(true);
                        }}
                      >
                        Change Role
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Role Change Modal */}
      <Modal
        isOpen={showRoleModal}
        onClose={() => {
          setShowRoleModal(false);
          setSelectedUser(null);
        }}
        title="Change User Role"
        size="sm"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Avatar
                src={selectedUser.photoURL}
                alt={selectedUser.displayName || 'User'}
                size="md"
              />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {selectedUser.displayName || 'No name'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedUser.email || selectedUser.phone}
                </p>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400">
              Select a new role for this user:
            </p>

            <div className="space-y-2">
              <button
                onClick={() => handleRoleChange('user')}
                className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                  selectedUser.role === 'user'
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                }`}
              >
                <p className="font-medium text-gray-900 dark:text-white">User</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Standard user access
                </p>
              </button>
              <button
                onClick={() => handleRoleChange('admin')}
                className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                  selectedUser.role === 'admin'
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                }`}
              >
                <p className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <HiShieldCheck className="w-4 h-4 text-purple-600" />
                  Admin
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Full access to admin panel
                </p>
              </button>
            </div>

            <Button
              variant="ghost"
              className="w-full"
              onClick={() => {
                setShowRoleModal(false);
                setSelectedUser(null);
              }}
            >
              Cancel
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
