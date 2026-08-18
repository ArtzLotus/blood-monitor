// src/components/dashboard/MeasureModal.tsx
import React, { useState } from 'react';
import { Activity, X } from 'lucide-react';
import type { MeasurementRecord } from '../../types';
import { mockUserProfile } from '../../data/dataDummy';
import image from '../../assets/measure/how_to_apply_a_cuff.png';
import loadingGif from '../../assets/loading/timer.gif';
import checkmarkGif from '../../assets/loading/check_icon.gif';

interface MeasureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveRecord: (newRecord: MeasurementRecord) => void;
}

type MeasureStep = 'PREPARE' | 'WAITING' | 'COMPLETE' | 'RESULT';

export const MeasureModal: React.FC<MeasureModalProps> = ({
  isOpen,
  onClose,
  onSaveRecord,
}) => {
  const [step, setStep] = useState<MeasureStep>('PREPARE');
  const [hasDiabetes, setHasDiabetes] = useState<boolean>(false);
  const [measurementResult, setMeasurementResult] = useState<MeasurementRecord | null>(null);

  if (!isOpen) return null;

  // Simulasi Proses Pengukuran
  const handleStartMeasurement = () => {
    setStep('WAITING');

    // Step 1: Simulasi Menunggu Pengukuran Alat (3 Detik)
    setTimeout(() => {
      setStep('COMPLETE');

      // Hitung BMI dari Profile
      const bmiVal = Number((mockUserProfile.weight / Math.pow(mockUserProfile.height / 100, 2)).toFixed(1));

      // Buat Data Hasil Pengukuran Baru (Mock)
      const newRecord: MeasurementRecord = {
        id: `rec_${Date.now()}`,
        timestamp: new Date().toLocaleString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }),
        sensorData: {
          systolic: 120,
          diastolic: 80,
          heartRate: 72,
        },
        inputData: {
          age: 20, // Diambil dari profil
          gender: mockUserProfile.gender as 'Male' | 'Female',
          height: mockUserProfile.height,
          weight: mockUserProfile.weight,
          bmi: bmiVal,
          smoke: mockUserProfile.smoke,
          diabet: hasDiabetes, // Input dari modal step 1
        },
        prediction: {
          riskProbability: 50,
          isHypertension: false,
        },
      };

      setMeasurementResult(newRecord);

      // Step 2: Tampilkan Complete selama 1.5 Detik lalu ke Result
      setTimeout(() => {
        setStep('RESULT');
        onSaveRecord(newRecord);
      }, 1500);
    }, 3000);
  };

  const handleResetModal = () => {
    setStep('PREPARE');
    setHasDiabetes(false);
    setMeasurementResult(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-brand-dark/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-brand-bg w-full max-w-sm rounded-3xl p-5 shadow-2xl border-2 border-white/40 text-brand-dark relative max-h-[90vh] overflow-y-auto">
        
        {/* STEP 1: PREPARE (DO THIS BEFORE TAKING A MEASUREMENT) */}
        {step === 'PREPARE' && (
          <div className="space-y-4">
            <div className="text-center border-b border-brand-medium/20 pb-3">
              <h3 className="font-extrabold text-sm tracking-wider text-brand-deep uppercase">
                DO THIS BEFORE TAKING A
              </h3>
              <p className="font-extrabold text-sm tracking-wider text-brand-deep uppercase">
                MEASUREMENT
              </p>
            </div>

            {/* Instruksi Cuff */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-brand-dark block">1. Use a Cuff</span>
              <div className="bg-white rounded-2xl p-1 border border-brand-light flex flex-col items-center">
                <img
                  src={image}
                  alt="How to apply cuff"
                  className="w-full object-cover rounded-xl"
                />
              </div>
            </div>

            {/* Pertanyaan Diabetes */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-brand-dark block">2. Are you have a Diabetes?</span>
              <div className="grid grid-cols-2 gap-2 bg-brand-light p-1.5 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setHasDiabetes(false)}
                  className={`py-2 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                    !hasDiabetes
                      ? 'bg-brand-medium text-white shadow-xs'
                      : 'text-brand-dark/70 hover:text-brand-dark'
                  }`}
                >
                  No
                </button>
                <button
                  type="button"
                  onClick={() => setHasDiabetes(true)}
                  className={`py-2 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                    hasDiabetes
                      ? 'bg-brand-medium text-white shadow-xs'
                      : 'text-brand-dark/70 hover:text-brand-dark'
                  }`}
                >
                  Yes
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleResetModal}
                className="bg-brand-medium hover:bg-brand-deep text-white font-bold py-3 rounded-2xl text-xs uppercase tracking-wider cursor-pointer transition-colors"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleStartMeasurement}
                className="bg-brand-medium hover:bg-brand-deep text-white font-bold py-3 rounded-2xl text-xs uppercase tracking-wider cursor-pointer transition-colors"
              >
                READY
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: WAITING */}
        {step === 'WAITING' && (
          <div className="bg-brand-light rounded-3xl p-8 text-center flex flex-col items-center justify-center my-6 space-y-6">
            <h3 className="font-extrabold text-lg text-white">
              Waiting The<br />Measurement...
            </h3>
            
            <img
                src={loadingGif}
                alt="Measuring..."
                className="w-24 h-20 object-contain my-2"
            />
          </div>
        )}

        {/* STEP 3: COMPLETE */}
        {step === 'COMPLETE' && (
          <div className="bg-brand-light rounded-3xl p-12 text-center my-6 flex flex-col items-center justify-center">
            <h3 className="font-extrabold text-xl text-white tracking-wide">
              Measurement<br />Complete
            </h3>

            <img
                src={checkmarkGif}
                alt="Measurement Complete"
                className="w-24 h-20 object-contain my-2"
            />
          </div>
        )}

        {/* STEP 4: RESULT */}
        {step === 'RESULT' && measurementResult && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-brand-dark font-semibold text-sm">
              <Activity className="w-4 h-4" />
              <span>Measure Result</span>
            </div>

            {/* Card Result Ringkas */}
            <div className="bg-brand-light rounded-3xl p-4 shadow-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-brand-medium rounded-2xl p-3 text-white flex flex-col justify-between text-center">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider opacity-80 block">SYS</span>
                    <div className="text-2xl font-extrabold mt-0.5">
                      {measurementResult.sensorData.systolic} <span className="text-[10px] font-normal opacity-80">mmHg</span>
                    </div>
                  </div>
                  <div className="my-1.5 border-t border-white/20" />
                  <div>
                    <span className="text-[10px] uppercase tracking-wider opacity-80 block">DIA</span>
                    <div className="text-2xl font-extrabold mt-0.5">
                      {measurementResult.sensorData.diastolic} <span className="text-[10px] font-normal opacity-80">mmHg</span>
                    </div>
                  </div>
                  <div className="my-1.5 border-t border-white/20" />
                  <div>
                    <span className="text-[10px] uppercase tracking-wider opacity-80 block">Pulse</span>
                    <div className="text-xl font-bold mt-0.5">
                      {measurementResult.sensorData.heartRate} <span className="text-[10px] font-normal opacity-80">bpm</span>
                    </div>
                  </div>
                </div>

                <div className="bg-brand-medium rounded-2xl p-3 text-white flex flex-col justify-between text-center">
                  <span className="text-[8px] uppercase font-bold tracking-wider bg-white/20 py-0.5 px-1.5 rounded-full inline-block mx-auto mb-1">
                    HYPERTENSION RISK
                  </span>
                  <div>
                    <span className="text-[10px] opacity-80 block">Risk Probability</span>
                    <div className="text-2xl font-extrabold mt-0.5">
                      {measurementResult.prediction.riskProbability}%
                    </div>
                  </div>
                  <div className="my-1.5 border-t border-white/20" />
                  <div>
                    <span className="text-[10px] opacity-80 block">Hypertension</span>
                    <div className="text-xl font-extrabold mt-0.5 tracking-wider uppercase">
                      {measurementResult.prediction.isHypertension ? 'YES' : 'NO'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Measure Details Result */}
            <div className="bg-brand-light rounded-3xl p-4 space-y-2">
              <span className="text-xs font-semibold text-brand-dark block">
                Measure Details Result
              </span>
              <div className="bg-brand-medium rounded-2xl p-3 text-white">
                <div className="grid grid-cols-2 gap-2 text-xs font-bold border-b border-white/20 pb-2 mb-2">
                  <div>{measurementResult.sensorData.systolic}/{measurementResult.sensorData.diastolic} mmHg</div>
                  <div>
                    {measurementResult.prediction.riskProbability}% Risk - {measurementResult.prediction.isHypertension ? 'Yes' : 'No'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] opacity-90 font-medium">
                  <div>Pulse : {measurementResult.sensorData.heartRate} bpm</div>
                  <div>BMI : {measurementResult.inputData.bmi} kg/m²</div>
                  <div>Age : {measurementResult.inputData.age} yrs</div>
                  <div>Smoke : {measurementResult.inputData.smoke ? 'Yes' : 'No'}</div>
                  <div>Gender : {measurementResult.inputData.gender}</div>
                  <div>Diabet : {measurementResult.inputData.diabet ? 'Yes' : 'No'}</div>
                </div>

                <div className="text-center text-[9px] opacity-75 mt-2 italic">
                  Measured at {measurementResult.timestamp}
                </div>
              </div>
            </div>

            {/* Tombol Back to Home */}
            <button
              type="button"
              onClick={handleResetModal}
              className="w-full bg-brand-medium hover:bg-brand-deep text-white font-bold py-3 rounded-2xl text-sm transition-colors cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        )}

      </div>
    </div>
  );
};