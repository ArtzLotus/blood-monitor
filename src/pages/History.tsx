// src/pages/HistoryPage.tsx
import React from 'react';
import { Clock, Home, User } from 'lucide-react';
import { mockHistoryData } from '../data/dataDummy';

interface HistoryPageProps {
  onNavigate: (page: 'dashboard' | 'history' | 'profile') => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-brand-bg w-full text-brand-dark font-sans">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        
        {/* Header Navigasi */}
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-brand-deep">Measure History</h1>
            <p className="text-sm text-brand-medium font-medium">How's the result?</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('dashboard')}
              className="w-10 h-10 rounded-full bg-brand-medium text-white flex items-center justify-center shadow-xs hover:bg-brand-deep transition-colors cursor-pointer"
            >
              <Home className="w-5 h-5" />
            </button>
            <button
              onClick={() => onNavigate('profile')}
              className="w-10 h-10 rounded-full bg-white text-brand-medium flex items-center justify-center shadow-xs hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Card Main Container */}
        <div className="bg-brand-light rounded-3xl p-5 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-4 text-brand-dark font-semibold">
            <Clock className="w-5 h-5" />
            <span>Measure History</span>
          </div>

          {/* Grid 2 Kolom untuk Riwayat */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockHistoryData.map((record) => (
              <div key={record.id} className="bg-brand-medium rounded-2xl p-4 text-white">
                <div className="grid grid-cols-2 gap-2 text-sm font-bold border-b border-white/20 pb-2 mb-2">
                  <div>{record.sensorData.systolic}/{record.sensorData.diastolic} mmHg</div>
                  <div>
                    {record.prediction.riskProbability}% Risk - {record.prediction.isHypertension ? 'Yes' : 'No'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs opacity-90 font-medium">
                  <div>Pulse : {record.sensorData.heartRate} bpm</div>
                  <div>BMI : {record.inputData.bmi} kg/m²</div>
                  <div>Age : {record.inputData.age} yrs</div>
                  <div>Smoke : {record.inputData.smoke ? 'Yes' : 'No'}</div>
                  <div>Gender : {record.inputData.gender}</div>
                  <div>Diabet : {record.inputData.diabet ? 'Yes' : 'No'}</div>
                </div>

                <div className="text-center text-[10px] opacity-75 mt-2 italic">
                  Measured at {record.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tombol Back to Home */}
        <button
          onClick={() => onNavigate('dashboard')}
          className="w-full bg-brand-light hover:bg-brand-medium text-white font-extrabold text-xl py-4 rounded-3xl shadow-md transition-all cursor-pointer border-2 border-white/30"
        >
          Back to Home
        </button>

      </div>
    </div>
  );
};