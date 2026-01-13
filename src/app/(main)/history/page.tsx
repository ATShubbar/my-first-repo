'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { HiDownload, HiShare, HiTrash, HiSparkles } from 'react-icons/hi';
import { collection, query, where, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Generation } from '@/types';
import { Button, Card, Spinner, Modal } from '@/components/ui';
import { formatRelativeTime, downloadImage, shareImage } from '@/utils/helpers';
import toast from 'react-hot-toast';

export default function HistoryPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [generations, setGenerations] = useState<Generation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGeneration, setSelectedGeneration] = useState<Generation | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [generationToDelete, setGenerationToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      fetchGenerations();
    }
  }, [user, authLoading, router]);

  const fetchGenerations = async () => {
    if (!user) return;

    try {
      const generationsQuery = query(
        collection(db, 'generations'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(generationsQuery);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        completedAt: doc.data().completedAt?.toDate(),
      })) as Generation[];
      setGenerations(data);
    } catch (error) {
      console.error('Error fetching generations:', error);
      toast.error('Failed to load history');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (generation: Generation) => {
    try {
      await downloadImage(
        generation.generatedImageUrl,
        `styleai-${generation.styleName}-${generation.id}.jpg`
      );
      toast.success('Image downloaded!');
    } catch {
      toast.error('Failed to download image');
    }
  };

  const handleShare = async (generation: Generation) => {
    try {
      await shareImage(
        generation.generatedImageUrl,
        `Created with StyleAI - ${generation.styleName}`
      );
      toast.success('Link copied to clipboard!');
    } catch {
      toast.error('Failed to share image');
    }
  };

  const handleDelete = async () => {
    if (!generationToDelete) return;

    try {
      await deleteDoc(doc(db, 'generations', generationToDelete));
      setGenerations((prev) => prev.filter((g) => g.id !== generationToDelete));
      toast.success('Generation deleted');
    } catch {
      toast.error('Failed to delete generation');
    } finally {
      setShowDeleteConfirm(false);
      setGenerationToDelete(null);
    }
  };

  const confirmDelete = (id: string) => {
    setGenerationToDelete(id);
    setShowDeleteConfirm(true);
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            My Creations
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            View and manage all your AI-generated artwork.
          </p>
        </div>

        {/* Generations Grid */}
        {generations.length === 0 ? (
          <div className="text-center py-20">
            <HiSparkles className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No creations yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Start creating amazing AI art!
            </p>
            <Button onClick={() => router.push('/generate')}>
              Create Your First Artwork
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {generations.map((generation) => (
              <Card key={generation.id} padding="none" className="group overflow-hidden">
                <div
                  className="relative aspect-square cursor-pointer"
                  onClick={() => setSelectedGeneration(generation)}
                >
                  <Image
                    src={generation.generatedImageUrl}
                    alt={`${generation.styleName} artwork`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(generation);
                        }}
                        className="p-2 bg-white rounded-full text-gray-900 hover:bg-gray-100"
                      >
                        <HiDownload className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(generation);
                        }}
                        className="p-2 bg-white rounded-full text-gray-900 hover:bg-gray-100"
                      >
                        <HiShare className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmDelete(generation.id);
                        }}
                        className="p-2 bg-white rounded-full text-red-600 hover:bg-gray-100"
                      >
                        <HiTrash className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white truncate">
                    {generation.styleName}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {generation.createdAt ? formatRelativeTime(generation.createdAt) : 'Recently'}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      <Modal
        isOpen={!!selectedGeneration}
        onClose={() => setSelectedGeneration(null)}
        size="full"
      >
        {selectedGeneration && (
          <div className="space-y-4">
            <div className="relative aspect-square max-h-[70vh] rounded-xl overflow-hidden">
              <Image
                src={selectedGeneration.generatedImageUrl}
                alt={`${selectedGeneration.styleName} artwork`}
                fill
                className="object-contain"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {selectedGeneration.styleName}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedGeneration.createdAt
                    ? formatRelativeTime(selectedGeneration.createdAt)
                    : 'Recently'}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  leftIcon={<HiDownload className="w-5 h-5" />}
                  onClick={() => handleDownload(selectedGeneration)}
                >
                  Download
                </Button>
                <Button
                  variant="secondary"
                  leftIcon={<HiShare className="w-5 h-5" />}
                  onClick={() => handleShare(selectedGeneration)}
                >
                  Share
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Creation"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete this creation? This action cannot be undone.
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
