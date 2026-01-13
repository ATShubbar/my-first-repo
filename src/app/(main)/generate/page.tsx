'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { HiSparkles, HiArrowRight, HiDownload, HiShare, HiRefresh } from 'react-icons/hi';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useAppStore } from '@/lib/store';
import { Button, Card, ImageUpload, Spinner, Modal } from '@/components/ui';
import { fileToBase64, downloadImage, shareImage, generateId } from '@/utils/helpers';
import toast from 'react-hot-toast';

export default function GeneratePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const {
    selectedStyle,
    setSelectedStyle,
    uploadedImage,
    uploadedImageFile,
    setUploadedImage,
    isGenerating,
    setIsGenerating,
  } = useAppStore();

  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [showStylePicker, setShowStylePicker] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Please sign in to generate images');
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleImageSelect = (file: File, preview: string) => {
    setUploadedImage(preview, file);
    setGeneratedImage(null);
    setError(null);
  };

  const handleImageRemove = () => {
    setUploadedImage(null, null);
    setGeneratedImage(null);
    setError(null);
  };

  const handleGenerate = async () => {
    if (!uploadedImageFile || !selectedStyle || !user) {
      toast.error('Please upload an image and select a style');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Get the style's prompt from Firestore
      const styleDoc = await getDoc(doc(db, 'styles', selectedStyle.id));
      if (!styleDoc.exists()) {
        throw new Error('Style not found');
      }
      const styleData = styleDoc.data();

      // Upload original image to Firebase Storage
      const originalImageRef = ref(
        storage,
        `uploads/${user.uid}/${generateId()}-original.jpg`
      );
      await uploadBytes(originalImageRef, uploadedImageFile);
      const originalImageUrl = await getDownloadURL(originalImageRef);

      // Convert image to base64 for Gemini API
      const imageBase64 = await fileToBase64(uploadedImageFile);

      // Call our API to generate the styled image
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64,
          stylePrompt: styleData.prompt,
          styleName: selectedStyle.name,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate image');
      }

      const data = await response.json();

      // For demo purposes, we'll use a placeholder
      // In production, this would be the actual generated image URL
      const generatedImageUrl = data.generatedImageUrl || originalImageUrl;

      setGeneratedImage(generatedImageUrl);

      // Save generation to Firestore
      await addDoc(collection(db, 'generations'), {
        userId: user.uid,
        styleId: selectedStyle.id,
        styleName: selectedStyle.name,
        originalImageUrl,
        generatedImageUrl,
        status: 'completed',
        createdAt: serverTimestamp(),
        completedAt: serverTimestamp(),
      });

      toast.success('Image generated successfully!');
    } catch (error) {
      console.error('Generation error:', error);
      setError((error as Error).message);
      toast.error((error as Error).message || 'Failed to generate image');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedImage) return;
    try {
      await downloadImage(generatedImage, `styleai-${selectedStyle?.name || 'generated'}.jpg`);
      toast.success('Image downloaded!');
    } catch {
      toast.error('Failed to download image');
    }
  };

  const handleShare = async () => {
    if (!generatedImage) return;
    try {
      await shareImage(generatedImage, `Created with StyleAI - ${selectedStyle?.name}`);
      toast.success('Link copied to clipboard!');
    } catch {
      toast.error('Failed to share image');
    }
  };

  const handleReset = () => {
    setUploadedImage(null, null);
    setGeneratedImage(null);
    setError(null);
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Create Your Artwork
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Upload a photo, select a style, and watch AI transform it into stunning art.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Upload & Style */}
          <div className="space-y-6">
            {/* Upload Section */}
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                1. Upload Your Photo
              </h2>
              <ImageUpload
                onImageSelect={handleImageSelect}
                onImageRemove={handleImageRemove}
                currentImage={uploadedImage}
                disabled={isGenerating}
              />
            </Card>

            {/* Style Selection */}
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                2. Select a Style
              </h2>
              {selectedStyle ? (
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    {selectedStyle.imageUrl ? (
                      <Image
                        src={selectedStyle.imageUrl}
                        alt={selectedStyle.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center">
                        <HiSparkles className="w-8 h-8 text-purple-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {selectedStyle.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                      {selectedStyle.description}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedStyle(null)}
                    disabled={isGenerating}
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <HiSparkles className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    No style selected
                  </p>
                  <Link href="/styles">
                    <Button>Browse Styles</Button>
                  </Link>
                </div>
              )}
            </Card>

            {/* Generate Button */}
            <Button
              size="lg"
              className="w-full"
              disabled={!uploadedImage || !selectedStyle || isGenerating}
              onClick={handleGenerate}
              isLoading={isGenerating}
              rightIcon={!isGenerating && <HiArrowRight className="w-5 h-5" />}
            >
              {isGenerating ? 'Generating...' : 'Generate Artwork'}
            </Button>
          </div>

          {/* Right Column - Result */}
          <div>
            <Card className="h-full">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                3. Your Artwork
              </h2>

              {isGenerating ? (
                <div className="aspect-square flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="relative">
                    <Spinner size="lg" />
                    <div className="absolute inset-0 animate-pulse-glow rounded-full" />
                  </div>
                  <p className="mt-4 text-gray-600 dark:text-gray-400">
                    Creating your masterpiece...
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    This may take a moment
                  </p>
                </div>
              ) : generatedImage ? (
                <div className="space-y-4">
                  <div className="relative aspect-square rounded-xl overflow-hidden">
                    <Image
                      src={generatedImage}
                      alt="Generated artwork"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      className="flex-1"
                      leftIcon={<HiDownload className="w-5 h-5" />}
                      onClick={handleDownload}
                    >
                      Download
                    </Button>
                    <Button
                      variant="secondary"
                      className="flex-1"
                      leftIcon={<HiShare className="w-5 h-5" />}
                      onClick={handleShare}
                    >
                      Share
                    </Button>
                    <Button
                      variant="ghost"
                      leftIcon={<HiRefresh className="w-5 h-5" />}
                      onClick={handleReset}
                    >
                      New
                    </Button>
                  </div>
                </div>
              ) : error ? (
                <div className="aspect-square flex flex-col items-center justify-center bg-red-50 dark:bg-red-900/20 rounded-xl">
                  <p className="text-red-600 dark:text-red-400 text-center px-4">
                    {error}
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setError(null)}
                  >
                    Try Again
                  </Button>
                </div>
              ) : (
                <div className="aspect-square flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <HiSparkles className="w-16 h-16 text-gray-300 dark:text-gray-700 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 text-center">
                    Your generated artwork will appear here
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
