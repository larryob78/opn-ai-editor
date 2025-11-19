import { NextRequest, NextResponse } from 'next/server';
import { getAllOrganisations, getActiveOrganisations } from '@/lib/db/organisations';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('activeOnly') === 'true';

    const organisations = activeOnly
      ? await getActiveOrganisations()
      : await getAllOrganisations();

    return NextResponse.json({
      success: true,
      organisations,
    });
  } catch (error) {
    console.error('Error fetching organisations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch organisations', details: (error as Error).message },
      { status: 500 }
    );
  }
}
