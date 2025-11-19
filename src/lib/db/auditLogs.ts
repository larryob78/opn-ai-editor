import { collection, addDoc, getDocs, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { AuditLog } from '@/types';

const COLLECTION = 'auditLogs';

export async function createAuditLog(data: {
  type: string;
  reportId?: string;
  userId?: string;
  metadata: Record<string, any>;
}): Promise<AuditLog> {
  const now = Timestamp.now();
  const log = {
    ...data,
    createdAt: now,
  };

  const docRef = await addDoc(collection(db, COLLECTION), log);

  return {
    id: docRef.id,
    ...log,
  };
}

export async function getAuditLogsByReport(reportId: string): Promise<AuditLog[]> {
  const q = query(
    collection(db, COLLECTION),
    where('reportId', '==', reportId),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as AuditLog[];
}

export async function getAuditLogsByType(
  type: string,
  maxResults: number = 100
): Promise<AuditLog[]> {
  const q = query(
    collection(db, COLLECTION),
    where('type', '==', type),
    orderBy('createdAt', 'desc'),
    limit(maxResults)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as AuditLog[];
}

export async function getAllAuditLogs(maxResults: number = 100): Promise<AuditLog[]> {
  const q = query(
    collection(db, COLLECTION),
    orderBy('createdAt', 'desc'),
    limit(maxResults)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as AuditLog[];
}
