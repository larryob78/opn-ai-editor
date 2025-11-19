'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const reportId = searchParams.get('reportId');

  return (
    <div className="min-h-screen bg-gradient-to-b from-success-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">✓</div>
          <h1 className="text-4xl font-bold text-success-900 mb-4">Report Submitted</h1>
          <p className="text-xl text-gray-700">
            Thank you for helping someone in need
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-gray-700 mb-4">
                Your report has been sent to local support services. They have been notified and
                will respond as quickly as possible.
              </p>
              {reportId && (
                <div className="bg-gray-50 rounded-lg p-4 inline-block">
                  <p className="text-sm text-gray-600">Report ID</p>
                  <p className="font-mono font-semibold text-gray-900">{reportId}</p>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-semibold text-gray-900 mb-3">What happens next?</h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">1.</span>
                  <span>Local charity teams have received your report</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">2.</span>
                  <span>They will prioritize based on risk level and location</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">3.</span>
                  <span>A responder will visit the location to offer support</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">4.</span>
                  <span>
                    The person will be offered shelter, warm clothing, and access to services
                  </span>
                </li>
              </ul>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-semibold text-gray-900 mb-3">Important Reminders</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Response times vary based on demand and risk level</li>
                <li>• In a medical emergency, always call 999 or 112</li>
                <li>• You can submit additional reports if needed</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            Return to Home
          </Link>

          {reportId && (
            <div className="text-sm text-gray-600">
              <Link href={`/status/${reportId}`} className="text-primary-600 hover:text-primary-700">
                Check report status
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
