import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { Assignment } from '@/types';

const COLLECTION = 'assignments';

export async function createAssignment(data: {
  reportId: string;
  responderId: string;
  organisationId: string;
}): Promise<Assignment> {
  const now = Timestamp.now();
  const assignment = {
    ...data,
    assignedAt: now,
  };

  const docRef = await addDoc(collection(db, COLLECTION), assignment);

  return {
    id: docRef.id,
    ...assignment,
  };
}

export async function getAssignmentById(id: string): Promise<Assignment | null> {
  const docRef = doc(db, COLLECTION, id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as Assignment;
}

export async function acceptAssignment(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, {
    acceptedAt: Timestamp.now(),
  });
}

export async function completeAssignment(id: string, outcome: string): Promise<void> {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, {
    completedAt: Timestamp.now(),
    outcome,
  });
}

export async function getAssignmentsByReport(reportId: string): Promise<Assignment[]> {
  const q = query(
    collection(db, COLLECTION),
    where('reportId', '==', reportId),
    orderBy('assignedAt', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Assignment[];
}

export async function getAssignmentsByResponder(responderId: string): Promise<Assignment[]> {
  const q = query(
    collection(db, COLLECTION),
    where('responderId', '==', responderId),
    orderBy('assignedAt', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Assignment[];
}
