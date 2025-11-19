'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import { getRiskColor } from '@/lib/utils/weather';

export default function ConfirmPage() {
  const router = useRouter();
  const [reportData, setReportData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Gather all report data from sessionStorage
    const location = JSON.parse(sessionStorage.getItem('report_location') || 'null');
    const risk = JSON.parse(sessionStorage.getItem('report_risk') || 'null');
    const notes = sessionStorage.getItem('report_notes') || '';
    const hasPhoto = sessionStorage.getItem('report_has_photo') === 'true';
    const contact = JSON.parse(sessionStorage.getItem('report_contact') || 'null');

    if (!location || !risk) {
      router.push('/report/location');
      return;
    }

    setReportData({
      location,
      risk,
      notes,
      hasPhoto,
      contact,
    });
  }, [router]);

  const handleSubmit = async () => {
    if (!reportData) return;

    setIsSubmitting(true);

    try {
      let photoUrl = null;

      // Upload photo if exists
      if (reportData.hasPhoto && (window as any).reportPhotoFile) {
        const formData = new FormData();
        formData.append('file', (window as any).reportPhotoFile);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const uploadData = await uploadResponse.json();
        if (uploadData.success) {
          photoUrl = uploadData.url;
        }
      }

      // Create report
      const response = await fetch('/api/reports/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: reportData.location.lat,
          longitude: reportData.location.lng,
          gpsAccuracyMeters: reportData.location.accuracy || 0,
          notes: reportData.notes,
          hasPhoto: !!photoUrl,
          photoUrl,
          contactPreference: reportData.contact.preference,
          contactName: reportData.contact.name,
          contactPhone: reportData.contact.phone,
          contactEmail: reportData.contact.email,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Clear session storage
        sessionStorage.removeItem('report_location');
        sessionStorage.removeItem('report_risk');
        sessionStorage.removeItem('report_notes');
        sessionStorage.removeItem('report_has_photo');
        sessionStorage.removeItem('report_contact');
        delete (window as any).reportPhotoFile;

        // Redirect to thank you page
        router.push(`/thank-you?reportId=${data.report.id}`);
      } else {
        alert('Failed to submit report. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!reportData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Confirm Report</h1>
          <p className="text-gray-600">
            Please review your report before submitting
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6 space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
            <p className="text-gray-700">
              Latitude: {reportData.location.lat.toFixed(6)}, Longitude:{' '}
              {reportData.location.lng.toFixed(6)}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Risk Level</h3>
            <span className={`${getRiskColor(reportData.risk.riskLevel)} px-3 py-1 rounded text-sm font-bold`}>
              {reportData.risk.riskLevel}
            </span>
            <p className="text-sm text-gray-600 mt-2">
              Temperature: {reportData.risk.weatherData.temperatureC}°C, Feels like:{' '}
              {reportData.risk.weatherData.feelsLikeC}°C
            </p>
          </div>

          {reportData.notes && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{reportData.notes}</p>
            </div>
          )}

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Photo</h3>
            <p className="text-gray-700">{reportData.hasPhoto ? 'Photo attached' : 'No photo'}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Contact Preference</h3>
            <p className="text-gray-700 capitalize">
              {reportData.contact.preference.replace(/_/g, ' ')}
            </p>
            {reportData.contact.name && (
              <p className="text-sm text-gray-600 mt-1">Name: {reportData.contact.name}</p>
            )}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            By submitting this report, you confirm that the information provided is accurate to the
            best of your knowledge. The report will be sent to local support services who will
            respond as quickly as possible.
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:bg-gray-400 transition-colors font-medium"
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 transition-colors font-medium"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <LoadingSpinner size="sm" />
                Submitting...
              </span>
            ) : (
              'Submit Report'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
