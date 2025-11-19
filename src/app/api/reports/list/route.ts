import { NextRequest, NextResponse } from 'next/server';
import { getAllReports, getReportsByOrganisation, getReportsByStatus } from '@/lib/db/reports';
import { requireAuth } from '@/lib/utils/auth';

export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const user = await requireAuth(request, ['RESPONDER', 'ADMIN']);

    const { searchParams } = new URL(request.url);
    const organisationId = searchParams.get('organisationId');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '100');

    let reports;

    if (user.role === 'RESPONDER' && user.organisationId) {
      // Responders can only see reports for their organisation
      reports = await getReportsByOrganisation(user.organisationId, limit);
    } else if (organisationId) {
      reports = await getReportsByOrganisation(organisationId, limit);
    } else if (status) {
      reports = await getReportsByStatus(status as any, limit);
    } else {
      reports = await getAllReports(limit);
    }

    return NextResponse.json({
      success: true,
      reports,
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports', details: (error as Error).message },
      { status: 500 }
    );
  }
}
