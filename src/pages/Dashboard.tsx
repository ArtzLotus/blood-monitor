// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { User, Activity, Bluetooth, Loader2 } from 'lucide-react';
import { 
  LatestReadingCard, 
  NotificationCard, 
  MeasureHistoryCard, 
  MeasureModal,
  BleConnectModal,
  AddNotificationModal
} from '../components/dashboard';
import type { NotificationItem, MeasurementRecord } from '../types';
import { auth } from '../services/firebase';
import { 
  getUserProfile, 
  getMeasurementRecords, 
  getUserNotifications, 
  saveUserNotifications, 
  addMeasurementRecord 
} from '../services/dbService';
import { notificationService } from '../services/notificationService';
import { bleService } from '../services/bluetooth';
import { getLatestMeasurement } from '../services/dbService';

interface DashboardProps {
  onNavigate: (page: 'dashboard' | 'history' | 'profile') => void;
}

const parseTimeToMinutes = (timeStr: string): number => {
  const [time, modifier] = timeStr.trim().split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (modifier === 'PM' && hours < 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

const sortNotifications = (items: NotificationItem[]): NotificationItem[] => {
  return [...items].sort((a, b) => parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time));
};

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('User');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [historyList, setHistoryList] = useState<MeasurementRecord[]>([]);
  const [latestData, setLatestData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [isBleModalOpen, setIsBleModalOpen] = useState(false);
  const [isBleConnected, setIsBleConnected] = useState(false);

  // Ambil data pengukuran terbaru secara real-time
  useEffect(() => {
    const unsubscribe = getLatestMeasurement((data) => {
      setLatestData(data);
    });
    
    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  // Sync status BLE saat komponen mount
  useEffect(() => {
    // Sync status awal
    setIsBleConnected(bleService.isConnected());

    // Dengarkan event disconnect / connect otomatis
    bleService.onConnectionChange((connected) => {
      setIsBleConnected(connected);
    });
  }, []);

  const handleToggleBle = async () => {
    if (isBleConnected) {
      bleService.disconnect();
    } else {
      try {
        const success = await bleService.connect();
        setIsBleConnected(success);
      } catch (err) {
        console.warn('Batal pairing Bluetooth / error:', err);
      }
    }
  };

  // Notification Permission Request on Dashboard Load
  useEffect(() => {
    // Minta izin saat dashboard dibuka
    notificationService.requestPermission();
  }, []);

  useEffect(() => {
    // Jalankan interval scheduler berdasarkan list notifikasi aktif
    if (notifications.length > 0) {
      notificationService.startScheduler(notifications);
    }

    return () => {
      notificationService.stopScheduler();
    };
  }, [notifications]);

  // Ambil Data Firestore saat Dashboard dimuat
  useEffect(() => {
    const loadDashboardData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        // 1. Profil / Nama
        const profile = await getUserProfile(user.uid);
        if (profile?.name) setUserName(profile.name);

        // 2. Riwayat Pengukuran
        const records = await getMeasurementRecords(user.uid);
        setHistoryList(records);

        // 3. Notifikasi
        const notifs = await getUserNotifications(user.uid);
        setNotifications(sortNotifications(notifs));
      } catch (err) {
        console.error("Gagal memuat data dashboard:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const latestRecord = historyList.length > 0 ? historyList[0] : null;

  // Toggle Status Notifikasi
  const toggleNotification = async (id: number) => {
    const updated = notifications.map((item) =>
      item.id === id ? { ...item, active: !item.active } : item
    );
    setNotifications(updated);
    if (auth.currentUser) {
      await saveUserNotifications(auth.currentUser.uid, updated);
    }
  };

  // Tambah Notifikasi Baru
  const handleAddNotification = async (newNotif: NotificationItem) => {
    const updated = sortNotifications([...notifications, newNotif]);
    setNotifications(updated);
    if (auth.currentUser) {
      await saveUserNotifications(auth.currentUser.uid, updated);
    }
  };

  // Hapus Notifikasi
  const handleDeleteNotification = async (id: number) => {
    const updated = notifications.filter((item) => item.id !== id);
    setNotifications(updated);
    if (auth.currentUser) {
      await saveUserNotifications(auth.currentUser.uid, updated);
    }
  };

  // Simpan Hasil Pengukuran Selesai
  const handleSaveNewMeasurement = async (newRecord: MeasurementRecord) => {
    const user = auth.currentUser;
    if (user) {
      const { id, ...recordData } = newRecord;
      const docId = await addMeasurementRecord(user.uid, recordData);
      setHistoryList((prev) => [{ ...newRecord, id: docId }, ...prev]);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-medium" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg w-full text-brand-dark font-sans">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-brand-deep">BP Monitor</h1>
            <p className="text-sm text-brand-medium font-medium">Welcome back {userName}!</p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBleModalOpen(true)}
              className={`h-10 px-3.5 rounded-full flex items-center gap-1.5 text-xs font-bold cursor-pointer transition-all shadow-xs border border-white/40 ${
                isBleConnected
                  ? 'bg-brand-medium text-white hover:bg-brand-deep'
                  : 'bg-white/80 text-brand-dark/70 hover:bg-white'
              }`}
              title="Status Koneksi ESP32"
            >
              <Bluetooth className={`w-4 h-4 ${isBleConnected ? 'text-white' : 'text-brand-medium'}`} />
              <span>{isBleConnected ? 'Connected' : 'Offline'}</span>
            </button>

            <button
              onClick={() => onNavigate('profile')}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-brand-medium shadow-xs hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Dashboard Grid Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Kolom Kiri */}
          <div className="space-y-5">
            {latestRecord ? (
              <LatestReadingCard record={latestData} />
            ) : (
              <div className="bg-brand-light rounded-3xl p-5 shadow-sm text-center text-xs text-brand-deep font-semibold py-8 border border-white/40">
                Belum ada data pengukuran tensi darah. Klik "Measured Now" untuk mulai.
              </div>
            )}

            <NotificationCard
              notifications={notifications}
              onToggle={toggleNotification}
              onDelete={handleDeleteNotification}
              onOpenAddModal={() => setIsNotifModalOpen(true)}
            />
          </div>

          {/* Kolom Kanan */}
          <MeasureHistoryCard
            historyData={historyList}
            onViewMore={() => onNavigate('history')}
          />
        </div>

        {/* Tombol Pengukuran Floating */}
        <div className="fixed bottom-6 left-0 right-0 max-w-4xl mx-auto px-4 md:px-8 z-30">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-brand-light hover:bg-brand-medium text-white font-extrabold text-lg py-4 rounded-3xl shadow-xl flex items-center justify-center gap-3 transition-all cursor-pointer border-2 border-white/40 tracking-wider"
          >
            <Activity className="w-6 h-6 animate-pulse text-brand-dark" />
            MEASURED NOW
          </button>
        </div>

        {/* Modals */}
        <MeasureModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSaveRecord={handleSaveNewMeasurement}
          isConnected={isBleConnected}
        />

        <AddNotificationModal
          isOpen={isNotifModalOpen}
          onClose={() => setIsNotifModalOpen(false)}
          existingNotifications={notifications}
          onAddNotification={handleAddNotification}
        />

        <BleConnectModal
          isOpen={isBleModalOpen}
          onClose={() => setIsBleModalOpen(false)}
          isConnected={isBleConnected}
          onConnectionChange={(connected) => setIsBleConnected(connected)}
        />

      </div>
    </div>
  );
};