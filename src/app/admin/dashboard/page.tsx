'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase/config';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
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
          fetchStats(user);
        }
      }
    });

    return () => unsubscribe();
  }, [router]);

  const fetchStats = async (user: any) => {
    try {
      const token = await user.getIdToken();
      const [reportsResponse, orgsResponse] = await Promise.all([
        fetch('/api/reports/list', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/organisations/list'),
      ]);

      const reportsData = await reportsResponse.json();
      const orgsData = await orgsResponse.json();

      if (reportsData.success && orgsData.success) {
        const reports = reportsData.reports;
        setStats({
          totalReports: reports.length,
          redRisk: reports.filter((r: any) => r.riskLevel === 'RED').length,
          amberRisk: reports.filter((r: any) => r.riskLevel === 'AMBER').length,
          greenRisk: reports.filter((r: any) => r.riskLevel === 'GREEN').length,
          newReports: reports.filter((r: any) => r.status === 'NEW').length,
          inProgress: reports.filter((r: any) => r.status === 'IN_PROGRESS').length,
          resolved: reports.filter((r: any) => r.status === 'RESOLVED').length,
          totalOrgs: orgsData.organisations.length,
          activeOrgs: orgsData.organisations.filter((o: any) => o.active).length,
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex gap-4">
            <Link
              href="/admin/organisations"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Organizations
            </Link>
            <Link
              href="/admin/map"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Map View
            </Link>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-danger-600 text-white rounded-lg hover:bg-danger-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-4xl font-bold text-primary-600">{stats?.totalReports || 0}</div>
            <div className="text-sm text-gray-600 mt-1">Total Reports</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-4xl font-bold text-danger-600">{stats?.redRisk || 0}</div>
            <div className="text-sm text-gray-600 mt-1">RED Risk</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-4xl font-bold text-warning-600">{stats?.amberRisk || 0}</div>
            <div className="text-sm text-gray-600 mt-1">AMBER Risk</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-4xl font-bold text-success-600">{stats?.greenRisk || 0}</div>
            <div className="text-sm text-gray-600 mt-1">GREEN Risk</div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Report Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">New</span>
                <span className="font-bold text-primary-600">{stats?.newReports || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">In Progress</span>
                <span className="font-bold text-warning-600">{stats?.inProgress || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Resolved</span>
                <span className="font-bold text-success-600">{stats?.resolved || 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Organizations</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total</span>
                <span className="font-bold text-gray-900">{stats?.totalOrgs || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active</span>
                <span className="font-bold text-success-600">{stats?.activeOrgs || 0}</span>
              </div>
            </div>
            <Link
              href="/admin/organisations"
              className="block mt-4 text-center text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Manage Organizations →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                href="/admin/map"
                className="block w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-center text-sm"
              >
                View Map
              </Link>
              <Link
                href="/admin/organisations"
                className="block w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-center text-sm"
              >
                Organizations
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">System Information</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• All times are displayed in your local timezone</li>
            <li>• Reports are routed to organizations based on location and temperature</li>
            <li>• RED risk reports (≤5°C in Dublin) are prioritized to Beta</li>
            <li>• Peter McVerry Trust receives copies of all RED risk Dublin reports</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
