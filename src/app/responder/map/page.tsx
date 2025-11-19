'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase/config';
import MapComponent from '@/components/MapComponent';
import LoadingSpinner from '@/components/LoadingSpinner';
import type { Report } from '@/types';

export default function ResponderMapPage() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push('/responder/login');
      } else {
        setUser(user);
        fetchReports(user);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const fetchReports = async (user: any) => {
    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/reports/list', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

  const handleSignOut = async () => {
    await auth.signOut();
    router.push('/');
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
    title: `${report.riskLevel} - ${report.city}`,
    riskLevel: report.riskLevel,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Responder Dashboard</h1>
            <p className="text-sm text-gray-600">{user?.email}</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/responder/list')}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              List View
            </button>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-danger-600 text-white rounded-lg hover:bg-danger-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Active Reports Map</h2>
              <div className="flex gap-2 text-sm">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-danger-500" />
                  RED
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-warning-500" />
                  AMBER
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-success-500" />
                  GREEN
                </span>
              </div>
            </div>

            <MapComponent
              latitude={53.3498}
              longitude={-6.2603}
              markers={markers}
              height="600px"
              zoom={12}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="text-3xl font-bold text-danger-600">{reports.filter(r => r.riskLevel === 'RED').length}</div>
              <div className="text-sm text-gray-600">RED Risk Reports</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="text-3xl font-bold text-warning-600">{reports.filter(r => r.riskLevel === 'AMBER').length}</div>
              <div className="text-sm text-gray-600">AMBER Risk Reports</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="text-3xl font-bold text-primary-600">{reports.length}</div>
              <div className="text-sm text-gray-600">Total Active Reports</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
