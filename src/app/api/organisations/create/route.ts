import { NextRequest, NextResponse } from 'next/server';
import { createOrganisation } from '@/lib/db/organisations';
import { requireAuth } from '@/lib/utils/auth';
import type { Country, OrganisationType, CoverageZone } from '@/types';

export async function POST(request: NextRequest) {
  try {
    await requireAuth(request, ['ADMIN']);

    const body = await request.json();

    const {
      id,
      name,
      type,
      primaryContactEmail,
      primaryContactPhone,
      active,
      country,
      coverageZones,
      coverageCenterLat,
      coverageCenterLng,
    } = body;

    if (!id || !name || !primaryContactEmail || !coverageCenterLat || !coverageCenterLng) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const organisation = await createOrganisation({
      id,
      name,
      type: type || 'PRIMARY',
      primaryContactEmail,
      primaryContactPhone: primaryContactPhone || '',
      active: active !== false,
      country: country || 'IE',
      coverageZones: coverageZones || [],
      coverageCenterLat,
      coverageCenterLng,
    });

    return NextResponse.json({
      success: true,
      organisation,
    });
  } catch (error) {
    console.error('Error creating organisation:', error);
    return NextResponse.json(
      { error: 'Failed to create organisation', details: (error as Error).message },
      { status: 500 }
    );
  }
}
