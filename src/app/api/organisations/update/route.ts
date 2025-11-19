import { NextRequest, NextResponse } from 'next/server';
import { updateOrganisation } from '@/lib/db/organisations';
import { requireAuth } from '@/lib/utils/auth';

export async function POST(request: NextRequest) {
  try {
    await requireAuth(request, ['ADMIN']);

    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Organisation ID is required' },
        { status: 400 }
      );
    }

    await updateOrganisation(id, data);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Error updating organisation:', error);
    return NextResponse.json(
      { error: 'Failed to update organisation', details: (error as Error).message },
      { status: 500 }
    );
  }
}
