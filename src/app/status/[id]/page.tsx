'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';
import { getRiskColor } from '@/lib/utils/weather';
import type { Report } from '@/types';

export default function StatusPage() {
  const params = useParams();
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReport();
  }, [params.id]);

  const fetchReport = async () => {
    try {
      const response = await fetch(`/api/reports/by-id?id=${params.id}`);
      const data = await response.json();

      if (data.success) {
        setReport(data.report);
      } else {
        setError('Report not found');
      }
    } catch (err) {
      setError('Failed to load report');
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

  if (error || !report) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-danger-600 mb-4">{error || 'Report not found'}</p>
          <Link href="/" className="text-primary-600 hover:text-primary-700">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const statusDescriptions: Record<string, string> = {
    NEW: 'Report received and pending assignment',
    ASSIGNED: 'Assigned to a responder',
    IN_PROGRESS: 'Responder is on the way',
    RESOLVED: 'Report has been resolved',
    COULD_NOT_FIND: 'Person could not be located',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Report Status</h1>
          <p className="text-gray-600">Track the progress of your report</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6 space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Current Status</h3>
            <p className="text-2xl font-bold text-primary-600 capitalize mb-2">
              {report.status.replace(/_/g, ' ')}
            </p>
            <p className="text-sm text-gray-600">{statusDescriptions[report.status]}</p>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-semibold text-gray-900 mb-3">Report Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Risk Level:</span>
                <span className={`${getRiskColor(report.riskLevel)} px-2 py-1 rounded text-xs font-bold`}>
                  {report.riskLevel}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Location:</span>
                <span className="text-gray-900">{report.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Temperature:</span>
                <span className="text-gray-900">{report.temperatureC}°C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Reported:</span>
                <span className="text-gray-900">
                  {new Date(report.createdAt.seconds * 1000).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                This page shows the current status of your report. Please note that response times
                vary based on the severity of the situation and availability of responders.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
