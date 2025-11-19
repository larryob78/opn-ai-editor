'use client';

import { getRiskDescription, getRiskColor } from '@/lib/utils/weather';
import type { RiskLevel } from '@/types';

interface RiskSelectorProps {
  selectedRisk: RiskLevel | null;
  weatherData?: {
    temperatureC: number;
    feelsLikeC: number;
    description: string;
  };
  autoCalculatedRisk?: RiskLevel;
  readOnly?: boolean;
}

export default function RiskSelector({
  selectedRisk,
  weatherData,
  autoCalculatedRisk,
  readOnly = true,
}: RiskSelectorProps) {
  const riskToDisplay = selectedRisk || autoCalculatedRisk || 'GREEN';

  return (
    <div className="space-y-4">
      {weatherData && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Current Weather</h3>
          <div className="space-y-1 text-sm">
            <p className="text-blue-800">
              <span className="font-medium">Temperature:</span> {weatherData.temperatureC}°C
            </p>
            <p className="text-blue-800">
              <span className="font-medium">Feels Like:</span> {weatherData.feelsLikeC}°C
            </p>
            <p className="text-blue-800">
              <span className="font-medium">Conditions:</span> {weatherData.description}
            </p>
          </div>
        </div>
      )}

      <div className={`${getRiskColor(riskToDisplay)} rounded-lg p-6 text-center`}>
        <div className="text-3xl font-bold mb-2">{riskToDisplay} RISK</div>
        <p className="text-sm opacity-90">{getRiskDescription(riskToDisplay)}</p>
      </div>

      {autoCalculatedRisk && (
        <div className="text-sm text-gray-600 text-center">
          Risk level automatically calculated based on weather conditions
        </div>
      )}
    </div>
  );
}
