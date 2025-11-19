'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PhotoUploader from '@/components/PhotoUploader';
import FaceBlurTool from '@/components/FaceBlurTool';

export default function PhotoPage() {
  const router = useRouter();
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [showBlurTool, setShowBlurTool] = useState(false);
  const [finalPhoto, setFinalPhoto] = useState<File | null>(null);

  const handlePhotoSelect = (file: File) => {
    setPhotoFile(file);
    setShowBlurTool(true);
  };

  const handlePhotoRemove = () => {
    setPhotoFile(null);
    setFinalPhoto(null);
    setShowBlurTool(false);
  };

  const handleBlurComplete = (blurredFile: File) => {
    setFinalPhoto(blurredFile);
    setShowBlurTool(false);
  };

  const handleSkipBlur = () => {
    setFinalPhoto(photoFile);
    setShowBlurTool(false);
  };

  const handleContinue = () => {
    if (finalPhoto) {
      // Store file reference
      sessionStorage.setItem('report_has_photo', 'true');
      // We'll upload the photo on final submission
      (window as any).reportPhotoFile = finalPhoto;
    } else {
      sessionStorage.setItem('report_has_photo', 'false');
    }
    router.push('/report/contact');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add Photo (Optional)</h1>
          <p className="text-gray-600">
            A photo can help responders locate and identify the person
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {!showBlurTool ? (
            <PhotoUploader
              onPhotoSelect={handlePhotoSelect}
              onPhotoRemove={handlePhotoRemove}
              currentPhoto={finalPhoto ? URL.createObjectURL(finalPhoto) : null}
            />
          ) : photoFile ? (
            <FaceBlurTool
              imageFile={photoFile}
              onBlurComplete={handleBlurComplete}
              onSkip={handleSkipBlur}
            />
          ) : null}
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => router.back()}
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Back
          </button>
          <button
            onClick={handleContinue}
            className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
