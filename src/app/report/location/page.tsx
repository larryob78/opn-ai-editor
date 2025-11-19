'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MapComponent from '@/components/MapComponent';
import LoadingSpinner from '@/components/LoadingSpinner';
import { getCurrentPosition } from '@/lib/utils/maps';

export default function LocationPage() {
  const router = useRouter();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [accuracy, setAccuracy] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const position = await getCurrentPosition();
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      setAccuracy(position.coords.accuracy);
    } catch (err) {
      setError('Unable to get your location. Please enable location services and try again.');
      console.error('Geolocation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setLocation({ lat, lng });
  };

  const handleContinue = () => {
    if (location) {
      sessionStorage.setItem('report_location', JSON.stringify({ ...location, accuracy }));
      router.push('/report/risk');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Report Location</h1>
          <p className="text-gray-600">
            Pin the exact location where you saw the person
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {isLoading ? (
            <div className="py-12">
              <LoadingSpinner size="lg" />
              <p className="text-center text-gray-600 mt-4">Getting your location...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-danger-600 mb-4">{error}</p>
              <button
                onClick={getLocation}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Try Again
              </button>
            </div>
          ) : location ? (
            <>
              <MapComponent
                latitude={location.lat}
                longitude={location.lng}
                onLocationSelect={handleLocationSelect}
                height="500px"
                zoom={16}
                markers={[
                  {
                    id: 'report',
                    lat: location.lat,
                    lng: location.lng,
                    title: 'Report Location',
                  },
                ]}
              />
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> Tap on the map to adjust the pin location if needed
                </p>
                {accuracy > 0 && (
                  <p className="text-xs text-blue-700 mt-1">
                    GPS accuracy: ±{Math.round(accuracy)}m
                  </p>
                )}
              </div>
            </>
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
            disabled={!location}
            className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 transition-colors font-medium"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
