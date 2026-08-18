import React from 'react';
import { Clock } from 'lucide-react';
import type { MeasurementRecord } from '../../types';

interface Props {
  historyData: MeasurementRecord[];
  onViewMore: () => void;
}

export const MeasureHistoryCard: React.FC<Props> = ({ historyData, onViewMore }) => {
  return (
    <div className="bg-brand-light rounded-3xl p-5 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-4 text-brand-dark font-semibold">
          <Clock className="w-5 h-5" />
          <span>Measure History</span>
        </div>

        {/* Hanya menampilkan 3 riwayat terbaru */}
        <div className="space-y-3">
          {historyData.slice(0, 3).map((record) => (
            <div key={record.id} className="bg-brand-medium rounded-2xl p-4 text-white">
              <div className="divide-x divide-white/20 grid grid-cols-2 gap-2 text-sm font-bold border-b border-white/20 pb-2 mb-2">
                <div>{record.sensorData.systolic}/{record.sensorData.diastolic} mmHg</div>
                <div>
                  {record.prediction.riskProbability}% Risk - {record.prediction.isHypertension ? 'Yes' : 'No'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-2 text-xs opacity-90 font-medium border-b border-white/20 pb-2 mb-2">
                <div className="border-r border-white/20">Pulse : {record.sensorData.heartRate} bpm</div>
                <div>BMI : {record.inputData.bmi} kg/m²</div>
                <div className="border-r border-white/20">Age : {record.inputData.age} yrs</div>
                <div>Smoke : {record.inputData.smoke ? 'Yes' : 'No'}</div>
                <div className="border-r border-white/20">Gender : {record.inputData.gender}</div>
                <div>Diabet : {record.inputData.diabet ? 'Yes' : 'No'}</div>
              </div>

              <div className="text-center text-[10px] opacity-75 mt-2 italic">
                Measured at {record.timestamp}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onViewMore}
        className="w-full bg-brand-medium hover:bg-brand-deep transition-colors text-white font-medium py-3 rounded-2xl text-sm mt-4 cursor-pointer"
      >
        View More...
      </button>
    </div>
  );
};