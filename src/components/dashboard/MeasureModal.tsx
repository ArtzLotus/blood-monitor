// src/components/dashboard/MeasureModal.tsx
import React, { useState, useEffect } from 'react';
import { Activity, FileText, Bluetooth, AlertCircle } from 'lucide-react';
import type { MeasurementRecord } from '../../types';
import { bleService } from '../../services/bluetooth';
import { auth } from '../../services/firebase';
import { getUserProfile } from '../../services/dbService';

// Import aset gambar & GIF lokal
import cuffGuideImg from '../../assets/measure/how_to_apply_a_cuff.png';
import timerGif from '../../assets/loading/timer.gif';
import checkIconGif from '../../assets/loading/check_icon.gif';

interface MeasureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveRecord: (newRecord: MeasurementRecord) => void;
  isConnected: boolean; // Prop status Bluetooth dari Dashboard
}

type MeasureStep = 'PREPARE' | 'WAITING' | 'COMPLETE' | 'RESULT';

export const MeasureModal: React.FC<MeasureModalProps> = ({
  isOpen,
  onClose,
  onSaveRecord,
  isConnected,
}) => {
  const [step, setStep] = useState<MeasureStep>('PREPARE');
  const [hasDiabetes, setHasDiabetes] = useState<boolean>(false);
  const [result, setResult] = useState<MeasurementRecord | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStep('PREPARE');
      setHasDiabetes(false);
      setResult(null);
      setErrorMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStartMeasurement = async () => {
    // Validasi: Wajib terhubung ke ESP32 tensimeter
    if (!isConnected && !bleService.isConnected()) {
      setErrorMessage('Tensimeter belum terhubung! Silakan sambungkan Bluetooth ke ESP32 terlebih dahulu.');
      return;
    }

    setErrorMessage(null);
    setStep('WAITING');

    // 1. Ambil data profil aktif dari Firestore
    const user = auth.currentUser;
    const profile = user ? await getUserProfile(user.uid) : null;

    let age = 20;
    let bmi = 22.5;
    let isMale = true;
    let isSmoker = false;
    let genderStr = 'Male';

    if (profile) {
      isMale = profile.gender === 'Male';
      genderStr = profile.gender;
      isSmoker = Boolean(profile.smoke);

      const weight = Number(profile.weight) || 60;
      const heightInMeters = (Number(profile.height) || 170) / 100;
      const calculatedBmi = weight / (heightInMeters * heightInMeters);
      bmi = Number(calculatedBmi.toFixed(1));

      if (profile.birthDate && profile.birthDate.includes('-')) {
        const parts = profile.birthDate.split('-');
        const birthYear = parseInt(parts[parts.length - 1], 10);
        const currentYear = new Date().getFullYear();
        if (!isNaN(birthYear)) {
          age = Math.max(1, currentYear - birthYear);
        }
      }
    }

    const processResultData = (record: MeasurementRecord) => {
      setResult(record);
      setStep('COMPLETE');
      setTimeout(() => {
        setStep('RESULT');
      }, 1800);
    };

    // 2. Kirim profil & dengarkan pembacaan sensor tensi dari ESP32
    try {
      if (bleService.isConnected()) {
        await bleService.sendUserProfile({ age, isMale, bmi, isSmoker });

        await bleService.startListeningMeasurements((data) => {
          const now = new Date();
          const record: MeasurementRecord = {
            id: Date.now().toString(),
            date: now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            time: now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
            sysBP: data.sysBP,
            diaBP: data.diaBP,
            bpm: data.bpm,
            riskLevel: data.riskLevel,
            status: data.status,
            age,
            gender: genderStr,
            bmi,
            smoke: isSmoker,
            diabet: hasDiabetes,
          };
          processResultData(record);
        });
      } else {
        // Fallback jika state connected adalah mock/simulasi
        setTimeout(() => {
          const now = new Date();
          const mockSys = Math.floor(Math.random() * (135 - 115 + 1)) + 115;
          const mockDia = Math.floor(Math.random() * (85 - 70 + 1)) + 70;
          const mockBpm = Math.floor(Math.random() * (80 - 68 + 1)) + 68;
          const isHigh = mockSys >= 130 || mockDia >= 85;

          const record: MeasurementRecord = {
            id: Date.now().toString(),
            date: now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            time: now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
            sysBP: mockSys,
            diaBP: mockDia,
            bpm: mockBpm,
            riskLevel: isHigh ? 'HIGH' : 'NORMAL',
            status: isHigh ? 'High Risk' : 'Normal',
            age,
            gender: genderStr,
            bmi,
            smoke: isSmoker,
            diabet: hasDiabetes,
          };
          processResultData(record);
        }, 3800);
      }
    } catch (err: any) {
      console.error('Koneksi BLE error saat pengukuran:', err);
      setErrorMessage(err.message || 'Terjadi kesalahan saat berkomunikasi dengan ESP32.');
      setStep('PREPARE');
    }
  };

  const handleFinishAndSave = () => {
    if (result) {
      onSaveRecord(result);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-brand-dark/50 backdrop-blur-xs flex items-center justify-center p-3 md:p-4 overflow-y-auto">
      <div className="bg-brand-light w-full max-w-xs md:max-w-sm rounded-[32px] p-5 shadow-2xl border-2 border-white/40 text-brand-dark my-auto">
        
        {/* STEP 1: PERSIAPAN & DIABETES */}
        {step === 'PREPARE' && (
          <div className="space-y-4">
            <div className="text-center border-b border-white/30 pb-2">
              <h3 className="text-xs font-black tracking-wider text-brand-deep uppercase">
                DO THIS BEFORE TAKING A<br />MEASUREMENT
              </h3>
            </div>

            {/* Peringatan jika belum terkoneksi ke Bluetooth ESP32 */}
            {!isConnected && (
              <div className="bg-rose-500/10 border border-rose-400 text-rose-800 p-2.5 rounded-2xl flex items-center gap-2 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>ESP32 tensimeter Offline. Sambungkan Bluetooth terlebih dahulu.</span>
              </div>
            )}

            {errorMessage && (
              <div className="bg-rose-500/10 border border-rose-400 text-rose-800 p-2.5 rounded-2xl flex items-center gap-2 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* 1. Panduan Manset */}
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-brand-deep">1. Use a Cuff</p>
              <div className="bg-white rounded-2xl p-2 border border-white/50 shadow-inner flex items-center justify-center">
                <img
                  src={cuffGuideImg}
                  alt="How to apply cuff"
                  className="w-full h-auto object-contain rounded-xl"
                />
              </div>
            </div>

            {/* 2. Pertanyaan Diabetes */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-brand-deep">2. Are you have a Diabetes?</p>
              <div className="grid grid-cols-2 rounded-2xl overflow-hidden border-2 border-white/50 p-0.5 bg-brand-medium/40">
                <button
                  type="button"
                  onClick={() => setHasDiabetes(false)}
                  className={`py-2 text-xs font-black transition-all cursor-pointer rounded-xl ${
                    !hasDiabetes
                      ? 'bg-brand-medium text-white shadow-xs'
                      : 'text-brand-deep hover:bg-white/30'
                  }`}
                >
                  No
                </button>
                <button
                  type="button"
                  onClick={() => setHasDiabetes(true)}
                  className={`py-2 text-xs font-black transition-all cursor-pointer rounded-xl ${
                    hasDiabetes
                      ? 'bg-brand-medium text-white shadow-xs'
                      : 'text-brand-deep hover:bg-white/30'
                  }`}
                >
                  Yes
                </button>
              </div>
            </div>

            {/* Tombol Cancel & Ready */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full bg-brand-medium/80 hover:bg-brand-medium text-white font-black py-3 rounded-2xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xs border border-white/20"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleStartMeasurement}
                disabled={!isConnected}
                className={`w-full font-black py-3 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-xs border border-white/20 flex items-center justify-center gap-1.5 ${
                  isConnected
                    ? 'bg-brand-medium hover:bg-brand-deep text-white cursor-pointer'
                    : 'bg-brand-medium/40 text-white/50 cursor-not-allowed'
                }`}
              >
                {!isConnected && <Bluetooth className="w-3.5 h-3.5" />}
                READY
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: WAITING THE MEASUREMENT */}
        {step === 'WAITING' && (
          <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
            <h3 className="text-sm font-black text-white tracking-wide">
              Waiting The<br />Measurement...
            </h3>
            <div className="w-36 h-36 rounded-full flex items-center justify-center overflow-hidden">
              <img
                src={timerGif}
                alt="Measuring in progress"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        )}

        {/* STEP 3: MEASUREMENT COMPLETE */}
        {step === 'COMPLETE' && (
          <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
            <h3 className="text-base font-black text-white tracking-wide">
              Measurement<br />Complete
            </h3>
            <div className="w-36 h-36 rounded-full flex items-center justify-center overflow-hidden">
              <img
                src={checkIconGif}
                alt="Measurement complete"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        )}

        {/* STEP 4: HASIL PENGUKURAN */}
        {step === 'RESULT' && result && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-1.5 mb-2 font-bold text-brand-deep">
                <Activity className="w-4 h-4 text-brand-deep" />
                <span className="text-xs font-black">Measure Result</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 items-stretch">
                <div className="bg-brand-medium text-white rounded-2xl p-2.5 flex flex-col justify-between shadow-xs border border-white/20 text-center">
                  <div className="pb-1">
                    <span className="text-[10px] font-bold opacity-90 block">SYS</span>
                    <div className="flex items-baseline justify-center gap-0.5">
                      <span className="text-2xl font-black">{result.sysBP}</span>
                      <span className="text-[9px] opacity-80">mmHg</span>
                    </div>
                  </div>
                  <div className="w-full h-px bg-white/30 my-0.5" />
                  <div className="py-1">
                    <span className="text-[10px] font-bold opacity-90 block">DIA</span>
                    <div className="flex items-baseline justify-center gap-0.5">
                      <span className="text-2xl font-black">{result.diaBP}</span>
                      <span className="text-[9px] opacity-80">mmHg</span>
                    </div>
                  </div>
                  <div className="w-full h-px bg-white/30 my-0.5" />
                  <div className="pt-1">
                    <span className="text-[10px] font-bold opacity-90 block">Pulse</span>
                    <div className="flex items-baseline justify-center gap-0.5">
                      <span className="text-2xl font-black">{result.bpm}</span>
                      <span className="text-[9px] opacity-80">bpm</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="bg-brand-medium text-white rounded-xl py-1.5 text-center text-[9px] font-black tracking-wider uppercase shadow-xs border border-white/20">
                    HYPERTENSION RISK
                  </div>
                  <div className="bg-brand-medium text-white rounded-2xl p-2.5 flex-1 flex flex-col justify-around text-center shadow-xs border border-white/20">
                    <div className="pb-1">
                      <span className="text-[10px] font-medium opacity-90 block">Risk Probability</span>
                      <span className="text-2xl font-black">{result.riskLevel === 'HIGH' ? '75%' : '50%'}</span>
                    </div>
                    <div className="w-full h-px bg-white/30 my-0.5" />
                    <div className="pt-1">
                      <span className="text-[10px] font-medium opacity-90 block">Hypertension</span>
                      <span className="text-2xl font-black">{result.riskLevel === 'HIGH' ? 'YES' : 'NO'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 mb-2 font-bold text-brand-deep">
                <FileText className="w-4 h-4 text-brand-deep" />
                <span className="text-xs font-black">Measure Details Result</span>
              </div>

              <div className="bg-brand-medium text-white rounded-2xl p-3 shadow-xs border border-white/20">
                <div className="grid grid-cols-2 text-center text-xs font-bold pb-2 border-b border-white/30">
                  <div className="border-r border-white/30 pr-1">
                    {result.sysBP}/{result.diaBP} mmHg
                  </div>
                  <div className="pl-1">
                    {result.riskLevel === 'HIGH' ? '50% Risk - No' : '50% Risk - No'}
                  </div>
                </div>

                <div className="grid grid-cols-2 text-[10px] py-2 border-b border-white/30 font-medium leading-relaxed">
                  <div className="border-r border-white/30 pr-2 space-y-0.5">
                    <div className="flex justify-between">
                      <span className="opacity-90">Pulse</span>
                      <span>: {result.bpm} bpm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-90">Age</span>
                      <span>: {result.age ?? 20} yrs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-90">Gender</span>
                      <span>: {result.gender ?? 'Male'}</span>
                    </div>
                  </div>

                  <div className="pl-2 space-y-0.5">
                    <div className="flex justify-between">
                      <span className="opacity-90">BMI</span>
                      <span>: {result.bmi ? result.bmi.toFixed(1) : '22.5'} kg/m²</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-90">Smoke</span>
                      <span>: {result.smoke ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-90">Diabet</span>
                      <span>: {result.diabet ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>

                <div className="text-center text-[9px] opacity-80 pt-1.5">
                  Measured at {result.date} {result.time}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleFinishAndSave}
              className="w-full bg-brand-medium hover:bg-brand-deep text-white font-black py-3.5 rounded-2xl text-sm transition-all cursor-pointer shadow-xs border border-white/20 text-center uppercase tracking-wider"
            >
              Back to Home
            </button>
          </div>
        )}

      </div>
    </div>
  );
};