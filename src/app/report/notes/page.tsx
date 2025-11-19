'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NotesPage() {
  const router = useRouter();
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const savedNotes = sessionStorage.getItem('report_notes');
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, []);

  const handleContinue = () => {
    sessionStorage.setItem('report_notes', notes);
    router.push('/report/photo');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Additional Notes</h1>
          <p className="text-gray-600">
            Add any details that might help responders (optional)
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="mb-4">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              What did you observe?
            </label>
            <textarea
              id="notes"
              rows={8}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="E.g., Person appears to be sleeping in a doorway, has a sleeping bag, looks unwell, etc."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-900 mb-2">Helpful information to include:</h3>
            <ul className="space-y-1 text-sm text-yellow-800">
              <li>• Physical description (clothing, age estimate, etc.)</li>
              <li>• Immediate concerns (looks unwell, inadequate shelter, etc.)</li>
              <li>• Exact location details (e.g., &quot;in doorway of closed shop&quot;)</li>
              <li>• Any belongings visible (bags, blankets, etc.)</li>
            </ul>
          </div>
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
            className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
