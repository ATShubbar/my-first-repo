'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { HiPlus, HiPencil, HiTrash, HiSparkles, HiEye, HiEyeOff } from 'react-icons/hi';
import {
  collection,
  query,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  orderBy,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Style, Category } from '@/types';
import { Button, Card, Input, Modal, Spinner, Badge } from '@/components/ui';
import { generateId } from '@/utils/helpers';
import toast from 'react-hot-toast';

export default function AdminStylesPage() {
  const { user } = useAuth();

  const [styles, setStyles] = useState<Style[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStyle, setEditingStyle] = useState<Style | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [styleToDelete, setStyleToDelete] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    prompt: '',
    categoryId: '',
    isActive: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch categories
      const categoriesQuery = query(collection(db, 'categories'), orderBy('order', 'asc'));
      const categoriesSnapshot = await getDocs(categoriesQuery);
      const categoriesData = categoriesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Category[];
      setCategories(categoriesData);

      // Fetch styles
      const stylesSnapshot = await getDocs(collection(db, 'styles'));
      const stylesData = stylesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Style[];
      setStyles(stylesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      prompt: '',
      categoryId: '',
      isActive: true,
    });
    setImageFile(null);
    setImagePreview(null);
    setEditingStyle(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (style: Style) => {
    setEditingStyle(style);
    setFormData({
      name: style.name,
      description: style.description,
      prompt: style.prompt,
      categoryId: style.categoryId,
      isActive: style.isActive,
    });
    setImagePreview(style.imageUrl);
    setShowModal(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.name || !formData.prompt) {
      toast.error('Name and prompt are required');
      return;
    }

    setIsSaving(true);

    try {
      let imageUrl = editingStyle?.imageUrl || '';

      // Upload image if new one selected
      if (imageFile) {
        const imageRef = ref(storage, `styles/${generateId()}`);
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      if (editingStyle) {
        // Update existing style
        await updateDoc(doc(db, 'styles', editingStyle.id), {
          name: formData.name,
          description: formData.description,
          prompt: formData.prompt,
          categoryId: formData.categoryId,
          isActive: formData.isActive,
          imageUrl,
          updatedAt: serverTimestamp(),
        });

        setStyles((prev) =>
          prev.map((s) =>
            s.id === editingStyle.id
              ? { ...s, ...formData, imageUrl, updatedAt: new Date() }
              : s
          )
        );

        toast.success('Style updated!');
      } else {
        // Create new style
        const docRef = await addDoc(collection(db, 'styles'), {
          name: formData.name,
          description: formData.description,
          prompt: formData.prompt,
          categoryId: formData.categoryId,
          isActive: formData.isActive,
          imageUrl,
          createdBy: user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        setStyles((prev) => [
          ...prev,
          {
            id: docRef.id,
            ...formData,
            imageUrl,
            createdBy: user.uid,
            createdAt: new Date(),
            updatedAt: new Date(),
          } as Style,
        ]);

        toast.success('Style created!');
      }

      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving style:', error);
      toast.error('Failed to save style');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!styleToDelete) return;

    try {
      await deleteDoc(doc(db, 'styles', styleToDelete));
      setStyles((prev) => prev.filter((s) => s.id !== styleToDelete));
      toast.success('Style deleted');
    } catch (error) {
      console.error('Error deleting style:', error);
      toast.error('Failed to delete style');
    } finally {
      setShowDeleteConfirm(false);
      setStyleToDelete(null);
    }
  };

  const toggleActive = async (style: Style) => {
    try {
      await updateDoc(doc(db, 'styles', style.id), {
        isActive: !style.isActive,
        updatedAt: serverTimestamp(),
      });

      setStyles((prev) =>
        prev.map((s) =>
          s.id === style.id ? { ...s, isActive: !s.isActive } : s
        )
      );

      toast.success(style.isActive ? 'Style hidden' : 'Style visible');
    } catch (error) {
      console.error('Error toggling style:', error);
      toast.error('Failed to update style');
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Styles</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage AI art styles available to users.
          </p>
        </div>
        <Button leftIcon={<HiPlus className="w-5 h-5" />} onClick={openCreateModal}>
          Add Style
        </Button>
      </div>

      {/* Styles Grid */}
      {styles.length === 0 ? (
        <Card className="text-center py-12">
          <HiSparkles className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No styles yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Create your first style to get started.
          </p>
          <Button onClick={openCreateModal}>Add Style</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {styles.map((style) => (
            <Card key={style.id} padding="none" className="overflow-hidden">
              <div className="relative aspect-square">
                {style.imageUrl ? (
                  <Image
                    src={style.imageUrl}
                    alt={style.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center">
                    <HiSparkles className="w-12 h-12 text-purple-400" />
                  </div>
                )}
                {!style.isActive && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="default">Hidden</Badge>
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                    {style.name}
                  </h3>
                  <Badge variant={style.isActive ? 'success' : 'default'} size="sm">
                    {style.isActive ? 'Active' : 'Hidden'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
                  {style.description || 'No description'}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditModal(style)}
                  >
                    <HiPencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleActive(style)}
                  >
                    {style.isActive ? (
                      <HiEyeOff className="w-4 h-4" />
                    ) : (
                      <HiEye className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => {
                      setStyleToDelete(style.id);
                      setShowDeleteConfirm(true);
                    }}
                  >
                    <HiTrash className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingStyle ? 'Edit Style' : 'Create Style'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Impressionist"
            required
          />

          <Input
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Brief description of the style"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Prompt (Hidden from users)
            </label>
            <textarea
              value={formData.prompt}
              onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
              placeholder="AI prompt for generating this style..."
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Category
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Style Image
            </label>
            <div className="flex items-center gap-4">
              {imagePreview && (
                <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <label className="cursor-pointer inline-block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <span className="inline-flex items-center justify-center px-4 py-2 border-2 border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-600 hover:text-white transition-colors cursor-pointer">
                  {imagePreview ? 'Change Image' : 'Upload Image'}
                </span>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700 dark:text-gray-200">
              Active (visible to users)
            </label>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSaving}>
              {editingStyle ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Style"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete this style? This action cannot be undone.
          </p>
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
