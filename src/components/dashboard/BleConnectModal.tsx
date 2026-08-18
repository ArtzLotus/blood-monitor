// src/components/dashboard/BleConnectModal.tsx
import React, { useState } from 'react';
import { Bluetooth, RefreshCw, CheckCircle2, AlertCircle, X } from 'lucide-react';

interface BleConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  isConnected: boolean;
  onToggleConnect: (status: boolean) => void;
}

export const BleConnectModal: React.FC<BleConnectModalProps> = ({
  isOpen,
  onClose,
  isConnected,
  onToggleConnect,
}) => {
  const [isScanning, setIsScanning] = useState(false);

  if (!isOpen) return null;

  const handleScanDevice = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      onToggleConnect(!isConnected);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-brand-dark/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-brand-bg w-full max-w-sm rounded-3xl p-6 shadow-2xl border-2 border-white/40 text-brand-dark relative">
        
        {/* Tombol Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-brand-dark/60 hover:text-brand-dark cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Status Icon */}
        <div className="flex flex-col items-center text-center my-2">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 shadow-inner ${
            isConnected ? 'bg-brand-medium text-white' : 'bg-brand-light text-white/80'
          }`}>
            <Bluetooth className={`w-8 h-8 ${isScanning ? 'animate-pulse' : ''}`} />
          </div>

          <h3 className="text-lg font-bold text-brand-deep">
            {isConnected ? 'ESP32 Connected' : 'ESP32 Disconnected'}
          </h3>
          
          <p className="text-xs text-brand-dark/70 mt-1 max-w-xs">
            {isConnected
              ? 'Blood pressure monitor is ready to use. Measurement data will be automatically received by the app.'
              : 'Make sure the ESP32 module is powered on and your phone\'s Bluetooth is enabled.'}
          </p>
        </div>

        {/* Card Info Device */}
        <div className="bg-brand-light/40 rounded-2xl p-3.5 my-4 border border-brand-medium/20 text-xs space-y-2 font-medium">
          <div className="flex justify-between items-center">
            <span className="text-brand-dark/70">Device Name:</span>
            <span className="font-bold text-brand-deep">ESP32_BloodMonitor</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-brand-dark/70">Status BLE:</span>
            <span className="font-bold flex items-center gap-1 text-brand-deep">
              {isConnected ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-deep" /> Connected
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-brand-medium" /> Disconnected
                </>
              )}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleScanDevice}
          disabled={isScanning}
          className="w-full bg-brand-medium hover:bg-brand-deep text-white font-bold py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
        >
          {isScanning ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" /> Searching for Device...
            </>
          ) : isConnected ? (
            'Disconnect'
          ) : (
            'Connect to ESP32'
          )}
        </button>

      </div>
    </div>
  );
};