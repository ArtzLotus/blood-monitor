// src/components/dashboard/BleConnectModal.tsx
import React, { useState } from 'react';
import { X, Bluetooth, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { bleService } from '../../services/bluetooth';

interface BleConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  isConnected: boolean;
  onConnectionChange: (connected: boolean) => void;
}

export const BleConnectModal: React.FC<BleConnectModalProps> = ({
  isOpen,
  onClose,
  isConnected,
  onConnectionChange,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConnect = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const success = await bleService.connect();
      onConnectionChange(success);
      if (success) {
        onClose();
      }
    } catch (err: any) {
      console.warn('BLE connect error:', err);
      setErrorMsg(err.message || 'Gagal menghubungkan ke perangkat ESP32.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    bleService.disconnect();
    onConnectionChange(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-brand-dark/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-brand-bg w-full max-w-sm rounded-[32px] p-6 shadow-2xl border-2 border-white/40 text-brand-dark relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-brand-dark/60 hover:text-brand-dark cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-4">
          <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center shadow-inner ${
            isConnected ? 'bg-emerald-100 text-emerald-600' : 'bg-brand-light text-brand-deep'
          }`}>
            <Bluetooth className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-brand-deep">
              {isConnected ? 'ESP32 Connected' : 'Connect to ESP32'}
            </h3>
            <p className="text-xs text-brand-dark/70 mt-1">
              {isConnected
                ? 'Blood pressure monitor is ready to use. Measurement data will be automatically received by the app.'
                : 'Make sure your ESP32 device is powered on and Bluetooth is active.'}
            </p>
          </div>

          {errorMsg && (
            <div className="bg-rose-500/10 border border-rose-400 text-rose-800 p-2.5 rounded-2xl flex items-center gap-2 text-xs font-semibold text-left">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Info Status Box */}
          <div className="bg-brand-light/60 rounded-2xl p-4 border border-brand-medium/20 text-xs text-left space-y-2 font-medium">
            <div className="flex justify-between items-center">
              <span className="text-brand-dark/70">Device Name:</span>
              <span className="font-bold text-brand-deep">
                {isConnected ? 'ESP32-BPMonitor' : '-'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-brand-dark/70">Status BLE:</span>
              <span className={`font-bold flex items-center gap-1 ${
                isConnected ? 'text-emerald-700' : 'text-amber-700'
              }`}>
                {isConnected ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                  </>
                ) : (
                  'Disconnected'
                )}
              </span>
            </div>
          </div>

          {/* Tombol Aksi */}
          {isConnected ? (
            <button
              type="button"
              onClick={handleDisconnect}
              className="w-full bg-brand-medium hover:bg-brand-dark text-white font-bold py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xs"
            >
              DISCONNECT
            </button>
          ) : (
            <button
              type="button"
              onClick={handleConnect}
              disabled={isLoading}
              className="w-full bg-brand-medium hover:bg-brand-deep text-white font-bold py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bluetooth className="w-4 h-4" />}
              CONNECT BLUETOOTH
            </button>
          )}
        </div>
      </div>
    </div>
  );
};