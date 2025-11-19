'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase/config';
import ReportCard from '@/components/ReportCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import type { Report } from '@/types';

export default function ResponderListPage() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'NEW' | 'ASSIGNED' | 'IN_PROGRESS'>('ALL');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push('/responder/login');
      } else {
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

  const filteredReports = filter === 'ALL'
    ? reports
    : reports.filter(r => r.status === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Reports List</h1>
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/responder/map')}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Map View
            </button>
            <button
              onClick={() => auth.signOut().then(() => router.push('/'))}
              className="px-4 py-2 bg-danger-600 text-white rounded-lg hover:bg-danger-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'ALL'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            All ({reports.length})
          </button>
          <button
            onClick={() => setFilter('NEW')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'NEW'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            New ({reports.filter(r => r.status === 'NEW').length})
          </button>
          <button
            onClick={() => setFilter('ASSIGNED')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'ASSIGNED'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Assigned ({reports.filter(r => r.status === 'ASSIGNED').length})
          </button>
          <button
            onClick={() => setFilter('IN_PROGRESS')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'IN_PROGRESS'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            In Progress ({reports.filter(r => r.status === 'IN_PROGRESS').length})
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600">No reports found</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredReports.map((report) => (
              <ReportCard key={report.id} report={report} showActions />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
