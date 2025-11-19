import { NextRequest, NextResponse } from 'next/server';
import { getActiveOrganisations } from '@/lib/db/organisations';
import { findNearestOrganisation } from '@/lib/utils/distance';

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

    const organisations = await getActiveOrganisations();
    const nearest = findNearestOrganisation(latitude, longitude, organisations);

    if (!nearest) {
      return NextResponse.json(
        { error: 'No active organisations found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      organisationId: nearest.id,
      distanceKm: nearest.distance,
    });
  } catch (error) {
    console.error('Error finding nearest organisation:', error);
    return NextResponse.json(
      { error: 'Failed to find nearest organisation', details: (error as Error).message },
      { status: 500 }
    );
  }
}
