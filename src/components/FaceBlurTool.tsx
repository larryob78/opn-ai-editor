'use client';

import { useState, useRef, useEffect } from 'react';
import { loadImageFromFile, blurRegion, canvasToBlob } from '@/lib/utils/blur';

interface FaceBlurToolProps {
  imageFile: File;
  onBlurComplete: (blurredFile: File) => void;
  onSkip: () => void;
}

export default function FaceBlurTool({ imageFile, onBlurComplete, onSkip }: FaceBlurToolProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [blurRegions, setBlurRegions] = useState<Array<{ x: number; y: number; width: number; height: number }>>([]);

  useEffect(() => {
    loadImage();
  }, [imageFile]);

  const loadImage = async () => {
    try {
      const img = await loadImageFromFile(imageFile);
      const canvas = canvasRef.current;

      if (canvas) {
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
        }
      }
    } catch (error) {
      console.error('Error loading image:', error);
    }
  };

  const applyBlur = async () => {
    setIsProcessing(true);

    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Apply blur to entire image for privacy
      // In production, use TensorFlow.js BlazeFace to detect faces
      const fullImageBlur = {
        x: 0,
        y: 0,
        width: canvas.width,
        height: canvas.height,
      };

      blurRegion(canvas, ctx, fullImageBlur, 15);

      // Convert to blob and file
      const blob = await canvasToBlob(canvas);
      const blurredFile = new File([blob], imageFile.name, { type: 'image/jpeg' });

      onBlurComplete(blurredFile);
    } catch (error) {
      console.error('Error applying blur:', error);
      alert('Failed to blur image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-900 mb-2">Privacy Protection</h3>
        <p className="text-sm text-yellow-800">
          We recommend blurring faces to protect the privacy of the person you&apos;re reporting.
        </p>
      </div>

      <div className="border border-gray-300 rounded-lg overflow-hidden bg-gray-100">
        <canvas ref={canvasRef} className="w-full h-auto" />
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={applyBlur}
          disabled={isProcessing}
          className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 transition-colors font-medium"
        >
          {isProcessing ? 'Blurring...' : 'Blur Image'}
        </button>
        <button
          type="button"
          onClick={onSkip}
          className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
        >
          Skip Blur
        </button>
      </div>
    </div>
  );
}
