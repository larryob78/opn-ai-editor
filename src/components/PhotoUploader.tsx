'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface PhotoUploaderProps {
  onPhotoSelect: (file: File) => void;
  onPhotoRemove: () => void;
  currentPhoto?: string | null;
}

export default function PhotoUploader({
  onPhotoSelect,
  onPhotoRemove,
  currentPhoto,
}: PhotoUploaderProps) {
  const [preview, setPreview] = useState<string | null>(currentPhoto || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      onPhotoSelect(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onPhotoRemove();
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600">
        Adding a photo helps responders identify and locate the person. Photos are optional.
      </div>

      {!preview ? (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
            id="photo-upload"
          />
          <label
            htmlFor="photo-upload"
            className="block w-full p-8 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <div className="space-y-2">
              <div className="text-4xl">📷</div>
              <div className="font-medium text-gray-700">Take or Upload Photo</div>
              <div className="text-sm text-gray-500">Optional - Tap to add</div>
            </div>
          </label>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative aspect-video w-full bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-contain"
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Remove Photo
          </button>
        </div>
      )}
    </div>
  );
}
