// src/components/dashboard/LatestReadingCard.tsx
import React from 'react';
import { Activity } from 'lucide-react';
import type { MeasurementRecord } from '../../types';

interface Props {
  record: MeasurementRecord;
}

export const LatestReadingCard: React.FC<Props> = ({ record }) => {
  const isHigh = record.riskLevel === 'HIGH';
  const isHypertension = isHigh ? 'YES' : 'NO';
  // Hitung persentase probabilitas jika ada atau fallback berbasis tensi
  const probability = isHigh ? '75%' : '50%';

  return (
    <div className="bg-brand-light rounded-3xl p-5 shadow-sm border border-white/40 text-brand-dark">
      {/* Header Title */}
      <div className="flex items-center gap-2 mb-4 font-bold text-brand-deep">
        <Activity className="w-5 h-5 text-brand-deep" />
        <span className="text-base">Latest Reading</span>
      </div>

      {/* Grid Utama 2 Kolom */}
      <div className="grid grid-cols-2 gap-3.5 items-stretch">
        
        {/* Kolom Kiri: SYS, DIA, Pulse */}
        <div className="bg-brand-medium text-white rounded-3xl p-3.5 flex flex-col justify-between shadow-xs border border-white/20 text-center">
          {/* SYS */}
          <div className="pb-2">
            <span className="text-[11px] font-bold tracking-wider opacity-90 block">SYS</span>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-3xl font-black">{record.sysBP}</span>
              <span className="text-[10px] font-medium opacity-80">mmHg</span>
            </div>
          </div>

          <div className="w-full h-px bg-white/30 my-0.5" />

          {/* DIA */}
          <div className="py-2">
            <span className="text-[11px] font-bold tracking-wider opacity-90 block">DIA</span>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-3xl font-black">{record.diaBP}</span>
              <span className="text-[10px] font-medium opacity-80">mmHg</span>
            </div>
          </div>

          <div className="w-full h-px bg-white/30 my-0.5" />

          {/* Pulse */}
          <div className="pt-2">
            <span className="text-[11px] font-bold tracking-wider opacity-90 block">Pulse</span>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-3xl font-black">{record.bpm}</span>
              <span className="text-[10px] font-medium opacity-80">bpm</span>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Header Pill & Risk Box */}
        <div className="flex flex-col gap-2.5">
          {/* Badge Pill Atas */}
          <div className="bg-brand-medium text-white rounded-2xl py-2 px-2 text-center text-[10px] font-black tracking-wider uppercase shadow-xs border border-white/20">
            HYPERTENSION RISK
          </div>

          {/* Box Risk Probability & Hypertension Status */}
          <div className="bg-brand-medium text-white rounded-3xl p-3.5 flex-1 flex flex-col justify-around text-center shadow-xs border border-white/20">
            {/* Risk Probability */}
            <div className="pb-2">
              <span className="text-[11px] font-medium opacity-90 block mb-0.5">
                Risk Probability
              </span>
              <span className="text-3xl font-black tracking-tight">
                {record?.probability !== undefined
                  ? (record.probability * 100).toFixed(2) + '%'
                  : '0%'
                }
              </span>
            </div>

            <div className="w-full h-px bg-white/30 my-0.5" />

            {/* Hypertension YES / NO */}
            <div className="pt-2">
              <span className="text-[11px] font-medium opacity-90 block mb-0.5">
                Hypertension
              </span>
              <span className="text-3xl font-black tracking-wider">{record?.riskLevel === 'HIGH' ? 'YES' : 'NO'}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Footer Timestamp */}
      <div className="text-center text-[11px] text-brand-deep font-semibold mt-4">
        Measured at {record?.date} {record?.time}
      </div>
    </div>
  );
};