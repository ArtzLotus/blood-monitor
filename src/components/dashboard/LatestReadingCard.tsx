import React from 'react';
import { Activity } from 'lucide-react';
import type { MeasurementRecord } from '../../types';

interface Props {
  record: MeasurementRecord;
}

export const LatestReadingCard: React.FC<Props> = ({ record }) => {
  return (
    <div className="bg-brand-light rounded-3xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4 text-brand-dark font-semibold">
        <Activity className="w-5 h-5" />
        <span>Latest Reading</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Box Pengukuran Darah */}
        <div className="bg-brand-medium rounded-2xl p-4 text-white flex flex-col justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider opacity-80 block text-center">SYS</span>
            <div className="text-3xl font-extrabold text-center mt-1">
              {record.sensorData.systolic} <span className="text-xs font-normal opacity-80">mmHg</span>
            </div>
          </div>
          <div className="my-2 border-t border-white/20" />
          <div>
            <span className="text-xs uppercase tracking-wider opacity-80 block text-center">DIA</span>
            <div className="text-3xl font-extrabold text-center mt-1">
              {record.sensorData.diastolic} <span className="text-xs font-normal opacity-80">mmHg</span>
            </div>
          </div>
          <div className="my-2 border-t border-white/20" />
          <div>
            <span className="text-xs uppercase tracking-wider opacity-80 block text-center">Pulse</span>
            <div className="text-2xl font-bold text-center mt-1">
              {record.sensorData.heartRate} <span className="text-xs font-normal opacity-80">bpm</span>
            </div>
          </div>
        </div>

        {/* Box Risiko Hipertensi */}
        <div className="bg-brand-medium rounded-2xl p-4 text-white flex flex-col justify-between text-center">
          <span className="text-[10px] uppercase font-bold tracking-wider bg-white/20 py-1 px-2 rounded-full inline-block mx-auto mb-2">
            HYPERTENSION RISK
          </span>
          <div>
            <span className="text-xs opacity-80 block">Risk Probability</span>
            <div className="text-3xl font-extrabold mt-1">
              {record.prediction.riskProbability}%
            </div>
          </div>
          <div className="my-2 border-t border-white/20" />
          <div>
            <span className="text-xs opacity-80 block">Hypertension</span>
            <div className="text-2xl font-extrabold mt-1 tracking-wider uppercase">
              {record.prediction.isHypertension ? 'YES' : 'NO'}
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-brand-dark/70 mt-4 font-medium">
        Measured at {record.timestamp}
      </p>
    </div>
  );
};