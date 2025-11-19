'use client';

import Link from 'next/link';
import { getRiskColor } from '@/lib/utils/weather';
import type { Report } from '@/types';

interface ReportCardProps {
  report: Report;
  showActions?: boolean;
}

export default function ReportCard({ report, showActions = false }: ReportCardProps) {
  const createdAt = new Date(report.createdAt.seconds * 1000);
  const timeAgo = getTimeAgo(createdAt);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`${getRiskColor(report.riskLevel)} px-2 py-1 rounded text-xs font-bold`}>
              {report.riskLevel}
            </span>
            <span className="text-xs text-gray-500">{timeAgo}</span>
          </div>
          <h3 className="font-semibold text-gray-900">{report.geocodedAddress}</h3>
          <p className="text-sm text-gray-600">
            {report.city}, {report.county}
          </p>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-4 text-sm">
          <div>
            <span className="text-gray-500">Temp:</span>{' '}
            <span className="font-medium">{report.temperatureC}°C</span>
          </div>
          <div>
            <span className="text-gray-500">Feels:</span>{' '}
            <span className="font-medium">{report.feelsLikeC}°C</span>
          </div>
        </div>
        <div className="text-sm">
          <span className="text-gray-500">Status:</span>{' '}
          <span className="font-medium capitalize">{report.status.replace(/_/g, ' ')}</span>
        </div>
      </div>

      {report.notes && (
        <div className="text-sm text-gray-700 mb-3 p-2 bg-gray-50 rounded">
          {report.notes}
        </div>
      )}

      {showActions && (
        <Link
          href={`/responder/report/${report.id}`}
          className="block w-full text-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
        >
          View Details
        </Link>
      )}
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' years ago';

  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months ago';

  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';

  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours ago';

  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutes ago';

  return 'Just now';
}
