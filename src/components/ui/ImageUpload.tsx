'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { HiCloudUpload, HiX, HiPhotograph } from 'react-icons/hi';
import { clsx } from 'clsx';
import { validateImageFile, formatFileSize } from '@/utils/helpers';
import Image from 'next/image';

interface ImageUploadProps {
  onImageSelect: (file: File, preview: string) => void;
  onImageRemove?: () => void;
  currentImage?: string | null;
  maxSize?: number;
  className?: string;
  disabled?: boolean;
}

export default function ImageUpload({
  onImageSelect,
  onImageRemove,
  currentImage,
  maxSize = 5 * 1024 * 1024,
  className,
  disabled = false,
}: ImageUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentImage || null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);

      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      const validation = validateImageFile(file);

      if (!validation.valid) {
        setError(validation.error || 'Invalid file');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const previewUrl = reader.result as string;
        setPreview(previewUrl);
        onImageSelect(file, previewUrl);
      };
      reader.readAsDataURL(file);
    },
    [onImageSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'image/gif': ['.gif'],
    },
    maxSize,
    multiple: false,
    disabled,
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    setError(null);
    onImageRemove?.();
  };

  if (preview) {
    return (
      <div className={clsx('relative rounded-xl overflow-hidden', className)}>
        <div className="relative aspect-square w-full">
          <Image
            src={preview}
            alt="Uploaded image"
            fill
            className="object-cover"
          />
        </div>
        {!disabled && (
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
          >
            <HiX className="w-5 h-5" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      <div
        {...getRootProps()}
        className={clsx(
          'relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200',
          isDragActive
            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
            : 'border-gray-300 dark:border-gray-700 hover:border-purple-400 hover:bg-gray-50 dark:hover:bg-gray-800/50',
          disabled && 'opacity-50 cursor-not-allowed',
          error && 'border-red-500'
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          {isDragActive ? (
            <>
              <HiCloudUpload className="w-12 h-12 text-purple-500 mb-3" />
              <p className="text-purple-600 dark:text-purple-400 font-medium">
                Drop your image here
              </p>
            </>
          ) : (
            <>
              <HiPhotograph className="w-12 h-12 text-gray-400 mb-3" />
              <p className="text-gray-700 dark:text-gray-300 font-medium mb-1">
                Drag & drop an image here
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                or click to browse
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">
                JPG, PNG, WebP, GIF up to {formatFileSize(maxSize)}
              </p>
            </>
          )}
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
