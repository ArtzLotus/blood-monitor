// src/services/dbService.ts
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy,
  onSnapshot,
  limit, 
} from 'firebase/firestore';
import { db, auth } from './firebase';
import type { MeasurementRecord, NotificationItem } from '../types';

export interface UserProfileData {
  name: string;
  email: string;
  birthDate: string;
  gender: string;
  weight: number;
  height: number;
  smoke: boolean;
}

// 1. Profil Pengguna
export const saveUserProfile = async (uid: string, profile: UserProfileData) => {
  await setDoc(doc(db, 'users', uid), profile, { merge: true });
};

export const getUserProfile = async (uid: string): Promise<UserProfileData | null> => {
  const docRef = doc(db, 'users', uid);
  const snap = await getDoc(docRef);
  return snap.exists() ? (snap.data() as UserProfileData) : null;
};

// 2. Simpan & Ambil Pengukuran
export const addMeasurementRecord = async (uid: string, record: Omit<MeasurementRecord, 'id'>) => {
  const recordsCol = collection(db, 'users', uid, 'measurements');
  const docRef = await addDoc(recordsCol, {
    ...record,
    createdAt: Date.now(),
  });
  return docRef.id;
};

export const getMeasurementRecords = async (uid: string): Promise<MeasurementRecord[]> => {
  const recordsCol = collection(db, 'users', uid, 'measurements');
  const q = query(recordsCol, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      date: data.date ?? '',
      time: data.time ?? '',
      sysBP: Number(data.sysBP ?? 0),
      diaBP: Number(data.diaBP ?? 0),
      bpm: Number(data.bpm ?? 0),
      probability: Number(data.probability ?? 0),
      riskLevel: data.riskLevel === 'HIGH' ? 'HIGH' : 'NORMAL',
      status: data.status ?? 'Normal',
      note: data.note ?? '',
      // PASTIKAN FIELD INI DI-LOAD DARI FIRESTORE:
      age: data.age !== undefined ? Number(data.age) : undefined,
      gender: data.gender ?? undefined,
      bmi: data.bmi !== undefined ? Number(data.bmi) : undefined,
      smoke: data.smoke !== undefined ? Boolean(data.smoke) : undefined,
      diabet: data.diabet !== undefined ? Boolean(data.diabet) : undefined,
    };
  });
};

// 3. Notifikasi
export const saveUserNotifications = async (uid: string, notifications: NotificationItem[]) => {
  await setDoc(doc(db, 'users', uid, 'settings', 'notifications'), {
    list: notifications,
  });
};

export const getUserNotifications = async (uid: string): Promise<NotificationItem[]> => {
  const docRef = doc(db, 'users', uid, 'settings', 'notifications');
  const snap = await getDoc(docRef);
  if (snap.exists() && snap.data().list) {
    return snap.data().list as NotificationItem[];
  }
  return [];
};

export const getLatestMeasurement = (callback: (data:any) => void) => {
  const user = auth.currentUser;
  if (!user) return () => {};

  const q = query(
    collection(db, 'users', user.uid, 'measurements'),
    orderBy('createdAt', 'desc'),
    limit(1)
  );

  return onSnapshot(q, (snapshot) => {
    if (!snapshot.empty) {
      const latestDoc = snapshot.docs[0].data();
      callback({ id: snapshot.docs[0].id, ...latestDoc});
    } else {
      callback(null);
    }
  });
};