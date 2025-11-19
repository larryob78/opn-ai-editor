'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase/config';
import MapComponent from '@/components/MapComponent';
import LoadingSpinner from '@/components/LoadingSpinner';
import type { Report } from '@/types';

export default function AdminMapPage() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.push('/admin/login');
      } else {
        const idTokenResult = await user.getIdTokenResult();
        if (idTokenResult.claims.role !== 'ADMIN') {
          router.push('/');
        } else {
          fetchReports(user);
        }
      }
    });

    return () => unsubscribe();
  }, [router]);

  const fetchReports = async (user: any) => {
    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/reports/list', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (data.success) {
        setReports(data.reports);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const markers = reports.map((report) => ({
    id: report.id,
    lat: report.latitude,
    lng: report.longitude,
    title: `${report.riskLevel} - ${report.city} (${report.status})`,
    riskLevel: report.riskLevel,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">System Map View</h1>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">All Reports ({reports.length})</h2>
            <div className="flex gap-2 text-sm">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-danger-500" />
                RED ({reports.filter((r) => r.riskLevel === 'RED').length})
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-warning-500" />
                AMBER ({reports.filter((r) => r.riskLevel === 'AMBER').length})
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-success-500" />
                GREEN ({reports.filter((r) => r.riskLevel === 'GREEN').length})
              </span>
            </div>
          </div>

          <MapComponent
            latitude={53.3498}
            longitude={-6.2603}
            markers={markers}
            height="700px"
            zoom={10}
          />
        </div>
      </div>
    </div>
  );
}
