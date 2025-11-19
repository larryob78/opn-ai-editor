import { NextRequest, NextResponse } from 'next/server';
import { reverseGeocode } from '@/lib/utils/maps';

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

    const addressData = await reverseGeocode(latitude, longitude);

    return NextResponse.json({
      success: true,
      address: addressData,
    });
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return NextResponse.json(
      { error: 'Failed to reverse geocode', details: (error as Error).message },
      { status: 500 }
    );
  }
}
