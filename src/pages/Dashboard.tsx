// src/pages/Dashboard.tsx
import React, { useState } from 'react';
import { User } from 'lucide-react';

import { mockUserName, mockLatestReading, mockHistoryData, mockNotifications } from '../data/dataDummy';
import { LatestReadingCard, NotificationCard, MeasureHistoryCard, MeasureModal } from '../components/dashboard';
import type { NotificationItem, MeasurementRecord } from '../types';

interface DashboardProps {
  onNavigate: (page: 'dashboard' | 'history' | 'profile') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [historyList, setHistoryList] = useState<MeasurementRecord[]>(mockHistoryData);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleNotification = (id: number) => {
    setNotifications(prev =>
      prev.map(item => item.id === id ? { ...item, active: !item.active } : item)
    );
  };

  const handleSaveNewRecord = (newRecord: MeasurementRecord) => {
    setHistoryList(prev => [newRecord, ...prev]);
  };

  // Ambil record paling atas sebagai Latest Reading
  const latestRecord = historyList[0] || mockLatestReading;

  return (
    <div className="min-h-screen bg-brand-bg w-full text-brand-dark font-sans">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-brand-deep">BP Monitor</h1>
            <p className="text-sm text-brand-medium font-medium">Welcome back {mockUserName}!</p>
          </div>
          <button
            onClick={() => onNavigate('profile')}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-brand-medium shadow-xs hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <User className="w-5 h-5" />
          </button>
        </header>

        {/* Grid Utama */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Kolom Kiri */}
          <div className="space-y-5">
            <LatestReadingCard record={latestRecord} />
            <NotificationCard notifications={notifications} onToggle={toggleNotification} />
          </div>

          {/* Kolom Kanan */}
          <MeasureHistoryCard historyData={historyList} onViewMore={() => onNavigate('history')} />
        </div>

        {/* Tombol Utama Measured Now */}
        <div className="mt-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-brand-light hover:bg-brand-medium text-white font-extrabold text-xl md:text-2xl py-4 rounded-3xl shadow-md transition-all cursor-pointer border-2 border-white/30"
          >
            Measured Now
          </button>
        </div>

        {/* Modal Flow Pengukuran */}
        <MeasureModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSaveRecord={handleSaveNewRecord}
        />

      </div>
    </div>
  );
};