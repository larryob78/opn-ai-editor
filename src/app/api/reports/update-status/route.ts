import { NextRequest, NextResponse } from 'next/server';
import { updateReportStatus } from '@/lib/db/reports';
import { createAuditLog } from '@/lib/db/auditLogs';
import { requireAuth } from '@/lib/utils/auth';
import type { ReportStatus } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request, ['RESPONDER', 'ADMIN']);
    const body = await request.json();

    const { reportId, status } = body;

    if (!reportId || !status) {
      return NextResponse.json(
        { error: 'Report ID and status are required' },
        { status: 400 }
      );
    }

    await updateReportStatus(reportId, status as ReportStatus);

    await createAuditLog({
      type: 'STATUS_UPDATE',
      reportId,
      userId: user.uid,
      metadata: {
        newStatus: status,
        updatedBy: user.email,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Error updating report status:', error);
    return NextResponse.json(
      { error: 'Failed to update report status', details: (error as Error).message },
      { status: 500 }
    );
  }
}
