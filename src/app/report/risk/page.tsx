'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RiskSelector from '@/components/RiskSelector';
import LoadingSpinner from '@/components/LoadingSpinner';
import type { RiskLevel } from '@/types';

export default function RiskPage() {
  const router = useRouter();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [riskLevel, setRiskLevel] = useState<RiskLevel | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedLocation = sessionStorage.getItem('report_location');
    if (!savedLocation) {
      router.push('/report/location');
      return;
    }

    const loc = JSON.parse(savedLocation);
    setLocation(loc);
    fetchWeatherData(loc.lat, loc.lng);
  }, [router]);

  const fetchWeatherData = async (lat: number, lng: number) => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/weather/get?latitude=${lat}&longitude=${lng}`);
      const data = await response.json();

      if (data.success) {
        setWeatherData(data.weather);
        setRiskLevel(data.riskLevel);
      }
    } catch (error) {
      console.error('Error fetching weather:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    if (riskLevel) {
      sessionStorage.setItem('report_risk', JSON.stringify({ riskLevel, weatherData }));
      router.push('/report/notes');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Risk Assessment</h1>
          <p className="text-gray-600">
            We automatically assess the risk based on current weather conditions
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {isLoading ? (
            <div className="py-12">
              <LoadingSpinner size="lg" />
              <p className="text-center text-gray-600 mt-4">Checking weather conditions...</p>
            </div>
          ) : (
            <RiskSelector
              selectedRisk={riskLevel}
              weatherData={weatherData}
              autoCalculatedRisk={riskLevel || undefined}
              readOnly
            />
          )}
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
            disabled={!riskLevel}
            className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 transition-colors font-medium"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
