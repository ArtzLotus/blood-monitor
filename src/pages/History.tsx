// src/pages/History.tsx
import React, { useState, useEffect } from 'react';
import { Home, User, Clock, Loader2 } from 'lucide-react';
import type { MeasurementRecord } from '../types';
import { auth } from '../services/firebase';
import { getMeasurementRecords } from '../services/dbService';

interface HistoryPageProps {
  onNavigate: (page: 'dashboard' | 'history' | 'profile') => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ onNavigate }) => {
  const [historyData, setHistoryData] = useState<MeasurementRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const user = auth.currentUser;
      if (user) {
        const records = await getMeasurementRecords(user.uid);
        setHistoryData(records);
      }
      setIsLoading(false);
    };

    fetchHistory();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-medium" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg w-full text-brand-dark font-sans pb-12">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        
        {/* Header Navigasi */}
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-brand-deep">Measure History</h1>
            <p className="text-xs md:text-sm text-brand-medium font-medium">How's the result?</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('dashboard')}
              className="w-10 h-10 rounded-full bg-brand-medium text-white flex items-center justify-center shadow-xs hover:bg-brand-deep transition-colors cursor-pointer"
              title="Back to Dashboard"
            >
              <Home className="w-5 h-5" />
            </button>
            <button
              onClick={() => onNavigate('profile')}
              className="w-10 h-10 rounded-full bg-white text-brand-medium flex items-center justify-center shadow-xs hover:bg-slate-50 transition-colors cursor-pointer"
              title="Profile Page"
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Card Pembungkus Utama */}
        <div className="bg-brand-light rounded-[32px] p-5 md:p-6 shadow-sm border border-white/40 mb-6">
          <div className="flex items-center gap-2 mb-4 text-brand-dark font-semibold">
            <Clock className="w-5 h-5 text-brand-deep" />
            <span className="text-base text-brand-deep font-bold">Measure History</span>
          </div>

          {historyData.length === 0 ? (
            <div className="text-center text-xs text-brand-deep font-semibold py-8 bg-brand-bg/50 rounded-2xl border border-brand-medium/20">
              Belum ada riwayat pengukuran yang tersimpan.
            </div>
          ) : (
            /* Grid 2 Kolom untuk Item Riwayat */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {historyData.map((record) => {
                const isHigh = record.riskLevel === 'HIGH';
                const riskText = isHigh ? '50% Risk - No' : '50% Risk - No';
                const dateText = record.date && record.time 
                  ? `Measured at ${record.date} ${record.time}` 
                  : 'Measured at June 29, 2026 8:00 AM';

                return (
                  <div
                    key={record.id}
                    className="bg-brand-medium text-white rounded-2xl p-3.5 shadow-xs border border-white/20 flex flex-col justify-between"
                  >
                    {/* Baris Atas: Tensi & Prediksi Risiko */}
                    <div className="grid grid-cols-2 text-center text-sm font-bold pb-2 border-b border-white/30">
                      <div className="border-r border-white/30 pr-2 flex items-center justify-center">
                        {record.sysBP}/{record.diaBP} mmHg
                      </div>
                      <div className="pl-2 flex items-center justify-center text-xs font-semibold">
                        {riskText}
                      </div>
                    </div>

                    {/* Baris Tengah: Grid 2 Kolom Parameter */}
                    <div className="grid grid-cols-2 text-[11px] py-2 border-b border-white/30 font-medium leading-relaxed">
                      {/* Kolom Kiri */}
                      <div className="border-r border-white/30 pr-2 space-y-0.5">
                        <div className="flex justify-between">
                          <span className="opacity-90">Pulse</span>
                          <span>: {record.bpm} bpm</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="opacity-90">Age</span>
                          <span>: {record.age ?? 20} yrs</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="opacity-90">Gender</span>
                          <span>: {record.gender ?? 'Male'}</span>
                        </div>
                      </div>

                      {/* Kolom Kanan */}
                      <div className="pl-2.5 space-y-0.5">
                        <div className="flex justify-between">
                          <span className="opacity-90">BMI</span>
                          <span>: {record.bmi ? Number(record.bmi).toFixed(1) : '18,5'} kg/m²</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="opacity-90">Smoke</span>
                          <span>: {record.smoke ? 'Yes' : 'No'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="opacity-90">Diabet</span>
                          <span>: {record.diabet ? 'Yes' : 'No'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Baris Bawah: Timestamp */}
                    <div className="text-center text-[10px] opacity-80 pt-1.5 font-normal tracking-wide">
                      {dateText}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Tombol Back to Home */}
        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          className="w-full bg-brand-light hover:bg-brand-medium text-white font-extrabold text-lg md:text-xl py-4 rounded-3xl shadow-md transition-all cursor-pointer border-2 border-white/40 text-center"
        >
          Back to Home
        </button>

      </div>
    </div>
  );
};