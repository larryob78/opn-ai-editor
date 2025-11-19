'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase/config';
import MapComponent from '@/components/MapComponent';
import LoadingSpinner from '@/components/LoadingSpinner';
import { getRiskColor } from '@/lib/utils/weather';
import type { Report } from '@/types';

export default function ResponderReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [outcome, setOutcome] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push('/responder/login');
      } else {
        fetchReport();
      }
    });

    return () => unsubscribe();
  }, [router, params.id]);

  const fetchReport = async () => {
    try {
      const response = await fetch(`/api/reports/by-id?id=${params.id}`);
      const data = await response.json();

      if (data.success) {
        setReport(data.report);
      }
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!report) return;

    setIsUpdating(true);
    try {
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();
      const response = await fetch('/api/reports/update-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reportId: report.id,
          status: newStatus,
        }),
      });

      if (response.ok) {
        await fetchReport();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAcceptCase = async () => {
    if (!report) return;

    setIsUpdating(true);
    try {
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();
      const response = await fetch('/api/reports/assignment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: 'accept',
          reportId: report.id,
        }),
      });

      if (response.ok) {
        await fetchReport();
      }
    } catch (error) {
      console.error('Error accepting case:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCompleteCase = async () => {
    if (!report || !outcome.trim()) {
      alert('Please enter an outcome before completing');
      return;
    }

    setIsUpdating(true);
    try {
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();
      const response = await fetch('/api/reports/assignment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: 'complete',
          reportId: report.id,
          outcome,
        }),
      });

      if (response.ok) {
        await fetchReport();
        setOutcome('');
      }
    } catch (error) {
      console.error('Error completing case:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-danger-600 mb-4">Report not found</p>
          <button
            onClick={() => router.push('/responder/list')}
            className="text-primary-600 hover:text-primary-700"
          >
            Back to List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Report Details</h1>
            <p className="text-sm text-gray-600">ID: {report.id}</p>
          </div>
          <button
            onClick={() => router.push('/responder/list')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            ← Back to List
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Status & Risk</h2>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Status:</span>
                  <p className="font-semibold text-lg capitalize">{report.status.replace(/_/g, ' ')}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Risk Level:</span>
                  <div className="mt-1">
                    <span className={`${getRiskColor(report.riskLevel)} px-3 py-1 rounded font-bold`}>
                      {report.riskLevel}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Location</h2>
              <p className="text-gray-700 mb-2">{report.geocodedAddress}</p>
              <p className="text-sm text-gray-600">
                {report.city}, {report.county}, {report.country}
              </p>
              <div className="mt-4">
                <MapComponent
                  latitude={report.latitude}
                  longitude={report.longitude}
                  height="300px"
                  zoom={16}
                  markers={[
                    {
                      id: report.id,
                      lat: report.latitude,
                      lng: report.longitude,
                      title: 'Report Location',
                      riskLevel: report.riskLevel,
                    },
                  ]}
                />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Weather Conditions</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Temperature:</span>
                  <span className="font-medium">{report.temperatureC}°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Feels Like:</span>
                  <span className="font-medium">{report.feelsLikeC}°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Conditions:</span>
                  <span className="font-medium capitalize">{report.weatherDescription}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {report.notes && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Reporter Notes</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{report.notes}</p>
              </div>
            )}

            {report.contactName && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>{' '}
                    <span className="font-medium">{report.contactName}</span>
                  </div>
                  {report.contactPhone && (
                    <div>
                      <span className="text-gray-600">Phone:</span>{' '}
                      <span className="font-medium">{report.contactPhone}</span>
                    </div>
                  )}
                  {report.contactEmail && (
                    <div>
                      <span className="text-gray-600">Email:</span>{' '}
                      <span className="font-medium">{report.contactEmail}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Actions</h2>
              <div className="space-y-3">
                {report.status === 'NEW' && (
                  <button
                    onClick={handleAcceptCase}
                    disabled={isUpdating}
                    className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 transition-colors font-medium"
                  >
                    Accept Case
                  </button>
                )}

                {report.status === 'ASSIGNED' && (
                  <button
                    onClick={() => handleUpdateStatus('IN_PROGRESS')}
                    disabled={isUpdating}
                    className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 transition-colors font-medium"
                  >
                    Start Response
                  </button>
                )}

                {report.status === 'IN_PROGRESS' && (
                  <>
                    <div>
                      <label htmlFor="outcome" className="block text-sm font-medium text-gray-700 mb-2">
                        Outcome Notes:
                      </label>
                      <textarea
                        id="outcome"
                        rows={4}
                        value={outcome}
                        onChange={(e) => setOutcome(e.target.value)}
                        placeholder="Describe what happened and any services provided..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      />
                    </div>
                    <button
                      onClick={handleCompleteCase}
                      disabled={isUpdating || !outcome.trim()}
                      className="w-full py-3 bg-success-600 text-white rounded-lg hover:bg-success-700 disabled:bg-gray-400 transition-colors font-medium"
                    >
                      Mark as Resolved
                    </button>
                    <button
                      onClick={() => handleUpdateStatus('COULD_NOT_FIND')}
                      disabled={isUpdating}
                      className="w-full py-3 bg-warning-600 text-white rounded-lg hover:bg-warning-700 disabled:bg-gray-400 transition-colors font-medium"
                    >
                      Could Not Find Person
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
