import { NextRequest, NextResponse } from 'next/server';
import { createAssignment, acceptAssignment, completeAssignment } from '@/lib/db/assignments';
import { updateReportStatus } from '@/lib/db/reports';
import { createAuditLog } from '@/lib/db/auditLogs';
import { requireAuth } from '@/lib/utils/auth';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request, ['RESPONDER', 'ADMIN']);
    const body = await request.json();

    const { action, reportId, assignmentId, outcome } = body;

    if (action === 'create') {
      // Create new assignment
      if (!reportId || !user.organisationId) {
        return NextResponse.json(
          { error: 'Report ID and organisation are required' },
          { status: 400 }
        );
      }

      const assignment = await createAssignment({
        reportId,
        responderId: user.uid,
        organisationId: user.organisationId,
      });

      await updateReportStatus(reportId, 'ASSIGNED');

      await createAuditLog({
        type: 'ASSIGNMENT_CREATED',
        reportId,
        userId: user.uid,
        metadata: {
          assignmentId: assignment.id,
        },
      });

      return NextResponse.json({
        success: true,
        assignment,
      });
    } else if (action === 'accept') {
      // Accept assignment
      if (!assignmentId) {
        return NextResponse.json(
          { error: 'Assignment ID is required' },
          { status: 400 }
        );
      }

      await acceptAssignment(assignmentId);
      await updateReportStatus(reportId, 'IN_PROGRESS');

      await createAuditLog({
        type: 'ASSIGNMENT_ACCEPTED',
        reportId,
        userId: user.uid,
        metadata: {
          assignmentId,
        },
      });

      return NextResponse.json({
        success: true,
      });
    } else if (action === 'complete') {
      // Complete assignment
      if (!assignmentId || !outcome) {
        return NextResponse.json(
          { error: 'Assignment ID and outcome are required' },
          { status: 400 }
        );
      }

      await completeAssignment(assignmentId, outcome);
      await updateReportStatus(reportId, 'RESOLVED');

      await createAuditLog({
        type: 'ASSIGNMENT_COMPLETED',
        reportId,
        userId: user.uid,
        metadata: {
          assignmentId,
          outcome,
        },
      });

      return NextResponse.json({
        success: true,
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error handling assignment:', error);
    return NextResponse.json(
      { error: 'Failed to handle assignment', details: (error as Error).message },
      { status: 500 }
    );
  }
}
