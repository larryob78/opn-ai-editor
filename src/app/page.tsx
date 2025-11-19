'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-primary-900 mb-4">StreetCheck</h1>
          <p className="text-xl text-gray-700">
            Help someone sleeping rough get the support they need
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">🏠</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Report Someone in Need
              </h2>
              <p className="text-gray-600 mb-6">
                If you see someone sleeping rough who may be at risk from cold weather,
                you can quickly report their location to local support services.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4">
                <div className="text-3xl mb-2">📍</div>
                <h3 className="font-semibold text-gray-900">Share Location</h3>
                <p className="text-sm text-gray-600">
                  Pin the exact location for responders
                </p>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl mb-2">🌡️</div>
                <h3 className="font-semibold text-gray-900">Weather Check</h3>
                <p className="text-sm text-gray-600">
                  We assess the risk based on temperature
                </p>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl mb-2">🚨</div>
                <h3 className="font-semibold text-gray-900">Fast Response</h3>
                <p className="text-sm text-gray-600">
                  Local charities are notified immediately
                </p>
              </div>
            </div>

            <Link
              href="/report/location"
              className="block w-full py-4 bg-primary-600 text-white text-center rounded-lg hover:bg-primary-700 transition-colors text-lg font-semibold"
            >
              Start Report
            </Link>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-blue-900 mb-2">Your Privacy Matters</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>✓ You can remain completely anonymous</li>
            <li>✓ Photos are optional and can be blurred</li>
            <li>✓ Only share contact details if you choose to</li>
            <li>✓ Your report goes directly to local support services</li>
          </ul>
        </div>

        <div className="text-center space-y-4">
          <div className="flex justify-center gap-4">
            <Link
              href="/responder/login"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Responder Login
            </Link>
            <span className="text-gray-300">|</span>
            <Link
              href="/admin/login"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Admin Login
            </Link>
          </div>

          <p className="text-sm text-gray-500">
            In an emergency, always call 999 or 112
          </p>
        </div>
      </div>
    </div>
  );
}
