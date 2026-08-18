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
  id: string;
  timestamp: string;
  inputData: UserData;
  sensorData: SensorData;
  prediction: PredictionResult;
}

export interface NotificationItem {
  id: number;
  time: string;
  active: boolean;
}