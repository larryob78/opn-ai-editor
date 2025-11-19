import { NextRequest, NextResponse } from 'next/server';
import { getWeatherData, calculateRiskLevel } from '@/lib/utils/weather';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const latitude = parseFloat(searchParams.get('latitude') || '0');
    const longitude = parseFloat(searchParams.get('longitude') || '0');

    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    const weatherData = await getWeatherData(latitude, longitude);
    const riskLevel = calculateRiskLevel(weatherData);

    return NextResponse.json({
      success: true,
      weather: weatherData,
      riskLevel,
    });
  } catch (error) {
    console.error('Error fetching weather:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data', details: (error as Error).message },
      { status: 500 }
    );
  }
}
