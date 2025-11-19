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
import type { User, UserRole } from '@/types';

const COLLECTION = 'users';

export async function createUser(
  id: string,
  data: {
    role: UserRole;
    name: string;
    email: string;
    phone?: string;
    organisationId?: string;
  }
): Promise<User> {
  const now = Timestamp.now();
  const user: User = {
    id,
    ...data,
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(doc(db, COLLECTION, id), user);
  return user;
}

export async function getUserById(id: string): Promise<User | null> {
  const docRef = doc(db, COLLECTION, id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return docSnap.data() as User;
}

export async function updateUser(
  id: string,
  data: Partial<Omit<User, 'id' | 'createdAt'>>
): Promise<void> {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

export async function getUsersByOrganisation(organisationId: string): Promise<User[]> {
  const q = query(collection(db, COLLECTION), where('organisationId', '==', organisationId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => doc.data() as User);
}

export async function getUsersByRole(role: UserRole): Promise<User[]> {
  const q = query(collection(db, COLLECTION), where('role', '==', role));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => doc.data() as User);
}
