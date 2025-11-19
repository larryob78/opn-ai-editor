import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { Organisation, Country, OrganisationType, CoverageZone } from '@/types';

const COLLECTION = 'organisations';

export async function createOrganisation(data: {
  id: string;
  name: string;
  type: OrganisationType;
  primaryContactEmail: string;
  primaryContactPhone: string;
  active: boolean;
  country: Country;
  coverageZones: CoverageZone[];
  coverageCenterLat: number;
  coverageCenterLng: number;
}): Promise<Organisation> {
  const now = Timestamp.now();
  const organisation: Organisation = {
    ...data,
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(doc(db, COLLECTION, data.id), organisation);
  return organisation;
}

export async function getOrganisationById(id: string): Promise<Organisation | null> {
  const docRef = doc(db, COLLECTION, id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return docSnap.data() as Organisation;
}

export async function getAllOrganisations(): Promise<Organisation[]> {
  const snapshot = await getDocs(collection(db, COLLECTION));
  return snapshot.docs.map((doc) => doc.data() as Organisation);
}

export async function getActiveOrganisations(): Promise<Organisation[]> {
  const q = query(collection(db, COLLECTION), where('active', '==', true));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as Organisation);
}

export async function updateOrganisation(
  id: string,
  data: Partial<Omit<Organisation, 'id' | 'createdAt'>>
): Promise<void> {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

export async function getOrganisationsByCountry(country: Country): Promise<Organisation[]> {
  const q = query(collection(db, COLLECTION), where('country', '==', country));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as Organisation);
}
