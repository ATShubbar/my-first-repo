'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HiUser, HiMail, HiPhone, HiCamera } from 'react-icons/hi';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Button, Input, Card, Avatar, Spinner } from '@/components/ui';
import { validateImageFile } from '@/utils/helpers';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const router = useRouter();
  const { user, userData, loading: authLoading } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (userData) {
      setDisplayName(userData.displayName || '');
    }
  }, [user, userData, authLoading, router]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error || 'Invalid file');
      return;
    }

    setIsUploadingPhoto(true);

    try {
      const photoRef = ref(storage, `avatars/${user.uid}`);
      await uploadBytes(photoRef, file);
      const photoURL = await getDownloadURL(photoRef);

      await updateProfile(user, { photoURL });
      await updateDoc(doc(db, 'users', user.uid), {
        photoURL,
        updatedAt: serverTimestamp(),
      });

      toast.success('Profile photo updated!');
      // Force refresh
      window.location.reload();
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Failed to update photo');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);

    try {
      await updateProfile(user, { displayName });
      await updateDoc(doc(db, 'users', user.uid), {
        displayName,
        updatedAt: serverTimestamp(),
      });

      toast.success('Profile updated!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Profile
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Manage your account settings.
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Photo */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Profile Photo
            </h2>
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar
                  src={user?.photoURL}
                  alt={userData?.displayName || 'User'}
                  size="xl"
                />
                {isUploadingPhoto && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                    <Spinner size="sm" />
                  </div>
                )}
              </div>
              <div>
                <label className="cursor-pointer inline-block">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                    disabled={isUploadingPhoto}
                  />
                  <span className="inline-flex items-center justify-center px-4 py-2 border-2 border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-600 hover:text-white transition-colors cursor-pointer">
                    <HiCamera className="w-5 h-5 mr-2" />
                    {isUploadingPhoto ? 'Uploading...' : 'Change Photo'}
                  </span>
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  JPG, PNG up to 5MB
                </p>
              </div>
            </div>
          </Card>

          {/* Profile Info */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Profile Information
            </h2>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <Input
                label="Display Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                leftIcon={<HiUser className="w-5 h-5" />}
                placeholder="Your name"
              />

              <Input
                label="Email"
                value={user?.email || ''}
                leftIcon={<HiMail className="w-5 h-5" />}
                disabled
                helperText="Email cannot be changed"
              />

              {user?.phoneNumber && (
                <Input
                  label="Phone"
                  value={user.phoneNumber}
                  leftIcon={<HiPhone className="w-5 h-5" />}
                  disabled
                />
              )}

              <Button type="submit" isLoading={isLoading}>
                Save Changes
              </Button>
            </form>
          </Card>

          {/* Account Info */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Account
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-800">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Account Type
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {userData?.role === 'admin' ? 'Administrator' : 'User'}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Member Since
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user?.metadata?.creationTime
                      ? new Date(user.metadata.creationTime).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
