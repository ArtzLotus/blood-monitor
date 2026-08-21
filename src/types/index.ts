// src/types/index.ts

export interface UserData {
  age: number;
  weight: number;
  height: number;
  bmi: number;
  gender: 'Male' | 'Female';
  smoke: boolean;
  diabet: boolean;
}

export interface SensorData {
  systolic: number;
  diastolic: number;  
  heartRate: number;  
}

export interface PredictionResult {
  riskProbability: number;
  isHypertension: boolean;
}

export interface MeasurementRecord {
  id: string | number;
  date: string;
  time: string;
  sysBP: number;
  diaBP: number;
  bpm: number;
  probability: number;
  riskLevel: 'NORMAL' | 'HIGH';
  status: string;
  note?: string;
  createdAt?: number;
  age?: number;
  gender?: string;
  bmi?: number;
  smoke?: boolean;
  diabet?: boolean;
}

export interface NotificationItem {
  id: number;
  time: string;
  active: boolean;
}