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
  limit,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { Report, ReportStatus, RiskLevel, ContactPreference } from '@/types';

const COLLECTION = 'reports';

export async function createReport(data: {
  spotterId?: string;
  latitude: number;
  longitude: number;
  geocodedAddress: string;
  city: string;
  county: string;
  country: string;
  temperatureC: number;
  feelsLikeC: number;
  weatherDescription: string;
  gpsAccuracyMeters: number;
  riskLevel: RiskLevel;
  notes?: string;
  hasPhoto: boolean;
  photoUrl?: string;
  contactPreference: ContactPreference;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  organisationId: string;
}): Promise<Report> {
  const now = Timestamp.now();
  const report = {
    ...data,
    status: 'NEW' as ReportStatus,
    createdAt: now,
    updatedAt: now,
  };

  const docRef = await addDoc(collection(db, COLLECTION), report);

  return {
    id: docRef.id,
    ...report,
  };
}

export async function getReportById(id: string): Promise<Report | null> {
  const docRef = doc(db, COLLECTION, id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as Report;
}

export async function updateReportStatus(
  id: string,
  status: ReportStatus
): Promise<void> {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, {
    status,
    updatedAt: Timestamp.now(),
  });
}

export async function updateReport(
  id: string,
  data: Partial<Omit<Report, 'id' | 'createdAt'>>
): Promise<void> {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

export async function getReportsByOrganisation(
  organisationId: string,
  maxResults: number = 100
): Promise<Report[]> {
  const q = query(
    collection(db, COLLECTION),
    where('organisationId', '==', organisationId),
    orderBy('createdAt', 'desc'),
    limit(maxResults)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Report[];
}

export async function getReportsByStatus(
  status: ReportStatus,
  maxResults: number = 100
): Promise<Report[]> {
  const q = query(
    collection(db, COLLECTION),
    where('status', '==', status),
    orderBy('createdAt', 'desc'),
    limit(maxResults)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Report[];
}

export async function getAllReports(maxResults: number = 100): Promise<Report[]> {
  const q = query(
    collection(db, COLLECTION),
    orderBy('createdAt', 'desc'),
    limit(maxResults)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Report[];
}
