// src/data/dataDummy.ts
import type { MeasurementRecord, NotificationItem } from '../types';

export const mockUserName = "Budi";

export const mockNotifications: NotificationItem[] = [
  { id: 1, time: '07:00 AM', active: true },
  { id: 2, time: '08:00 AM', active: true },
  { id: 3, time: '09:00 AM', active: true },
];

export const mockHistoryData: MeasurementRecord[] = [
  {
    id: 'rec_01',
    timestamp: 'June 29, 2026 8:00 AM',
    sensorData: {
      systolic: 120,
      diastolic: 80,
      heartRate: 72,
    },
    inputData: {
      age: 20,
      gender: 'Male',
      height: 170,
      weight: 53.5,
      bmi: 18.5,
      smoke: false,
      diabet: false,
    },
    prediction: {
      riskProbability: 50,
      isHypertension: false,
    },
  },
  {
    id: 'rec_02',
    timestamp: 'June 28, 2026 8:00 AM',
    sensorData: {
      systolic: 138,
      diastolic: 92,
      heartRate: 78,
    },
    inputData: {
      age: 20,
      gender: 'Male',
      height: 170,
      weight: 53.5,
      bmi: 18.5,
      smoke: true,
      diabet: false,
    },
    prediction: {
      riskProbability: 82,
      isHypertension: true,
    },
  },
  {
    id: 'rec_03',
    timestamp: 'June 27, 2026 8:00 AM',
    sensorData: {
      systolic: 118,
      diastolic: 78,
      heartRate: 70,
    },
    inputData: {
      age: 20,
      gender: 'Male',
      height: 170,
      weight: 53.5,
      bmi: 18.5,
      smoke: false,
      diabet: false,
    },
    prediction: {
      riskProbability: 15,
      isHypertension: false,
    },
  },
  {
    id: 'rec_04',
    timestamp: 'June 26, 2026 8:00 AM',
    sensorData: {
      systolic: 150,
      diastolic: 100,
      heartRate: 99,
    },
    inputData: {
      age: 60,
      gender: 'Male',
      height: 170,
      weight: 59.5,
      bmi: 20.5,
      smoke: true,
      diabet: true,
    },
    prediction: {
      riskProbability: 100,
      isHypertension: true,
    },
  },
];

// Ambil riwayat paling baru sebagai Latest Reading
export const mockLatestReading: MeasurementRecord = mockHistoryData[0];

// Tambahkan di src/data/mockData.ts

export const mockUserProfile = {
  name: 'Budi',
  email: 'Budi1998@gmail.com',
  birthDate: '29-06-2005',
  gender: 'Male',
  weight: 60,
  height: 170,
  smoke: false,
};