// src/components/dashboard/MeasureHistoryCard.tsx
import React from 'react';
import { Clock } from 'lucide-react';
import type { MeasurementRecord } from '../../types';

interface Props {
  historyData: MeasurementRecord[];
  onViewMore: () => void;
}

export const MeasureHistoryCard: React.FC<Props> = ({ historyData, onViewMore }) => {
  return (
    <div className="bg-brand-light rounded-3xl p-5 shadow-sm flex flex-col justify-between border border-white/40">
      <div>
        {/* Header Title */}
        <div className="flex items-center gap-2 mb-4 text-brand-dark font-semibold">
          <Clock className="w-5 h-5 text-brand-deep" />
          <span className="text-base text-brand-deep font-bold">Measure History</span>
        </div>

        {/* List 3 Riwayat Terbaru */}
        <div className="space-y-3.5">
          {historyData.length === 0 ? (
            <div className="text-center text-xs text-brand-deep font-semibold py-8 bg-brand-bg/50 rounded-2xl border border-brand-medium/20">
              Belum ada riwayat pengukuran yang tersimpan.
            </div>
          ) : (
            historyData.slice(0, 3).map((record) => {
              const isHigh = record?.riskLevel === 'HIGH';
              const riskText = isHigh? 'High Risk - Yes' : 'Normal - No';
              const riskProb = record?.probability !== undefined
                ? (record.probability * 100).toFixed(2) + '%'
                : '0%';
              const formattedDate = record?.date && record?.time 
                ? `Measured at ${record.date} ${record.time}`
                : 'Measured recently';

              return (
                <div
                  key={record.id}
                  className="bg-brand-medium/90 text-white rounded-2xl p-3.5 shadow-xs border border-white/20"
                >
                  {/* Baris Atas: Tensi & Prediksi Risiko */}
                  <div className="grid grid-cols-2 text-center text-sm font-bold pb-2 border-b border-white/30">
                    <div className="border-r border-white/30 pr-2 flex items-center justify-center">
                      {record.sysBP}/{record.diaBP} mmHg
                    </div>
                    <div className="pl-2 flex items-center justify-center text-xs font-semibold">
                      {riskProb} {isHigh ? 'High Risk - Yes' : 'Normal - No'}
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
                        <span>: {record.age !== undefined ? `${record.age} yrs` : '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-90">Gender</span>
                        <span>: {record.gender ?? '-'}</span>
                      </div>
                    </div>

                    {/* Kolom Kanan */}
                    <div className="pl-2.5 space-y-0.5">
                      <div className="flex justify-between">
                        <span className="opacity-90">BMI</span>
                        <span>: {record.bmi !== undefined ? `${Number(record.bmi).toFixed(1)} kg/m²` : '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-90">Smoke</span>
                        <span>: {record.smoke !== undefined ? (record.smoke ? 'Yes' : 'No') : '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-90">Diabet</span>
                        <span>: {record.diabet !== undefined ? (record.diabet ? 'Yes' : 'No') : '-'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Baris Bawah: Timestamp */}
                  <div className="text-center text-[10px] opacity-80 pt-1.5 font-normal tracking-wide">
                    {formattedDate}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Tombol View More */}
      <button
        type="button"
        onClick={onViewMore}
        className="w-full bg-brand-medium hover:bg-brand-deep text-white font-bold py-3.5 rounded-2xl text-base transition-all cursor-pointer shadow-xs border border-white/20 mt-4 text-center"
      >
        View More...
      </button>
    </div>
  );
};