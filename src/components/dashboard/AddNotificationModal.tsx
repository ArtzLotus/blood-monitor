// src/components/dashboard/AddNotificationModal.tsx
import React, { useState } from 'react';
import { Bell, Clock, X, Check, AlertCircle } from 'lucide-react';
import type { NotificationItem } from '../../types';

interface AddNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingNotifications: NotificationItem[]; // Menerima list notifikasi saat ini
  onAddNotification: (newNotif: NotificationItem) => void;
}

export const AddNotificationModal: React.FC<AddNotificationModalProps> = ({
  isOpen,
  onClose,
  existingNotifications,
  onAddNotification,
}) => {
  const [selectedTime, setSelectedTime] = useState('08:00');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const formatTo12Hour = (time24: string) => {
    const [hoursStr, minutesStr] = time24.split(':');
    let hours = parseInt(hoursStr, 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
    return `${formattedHours}:${minutesStr} ${ampm}`;
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(e.target.value);
    setErrorMessage(null); // Reset pesan error saat user mengubah jam
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedTime = formatTo12Hour(selectedTime);

    // CEK DUPLIKASI: Cek apakah jam sudah terdaftar
    const isDuplicate = existingNotifications.some(
      (item) => item.time.toLowerCase() === formattedTime.toLowerCase()
    );

    if (isDuplicate) {
      setErrorMessage(`Time ${formattedTime} already exists in the notification list!`);
      return;
    }

    const newNotifItem: NotificationItem = {
      id: Date.now(),
      time: formattedTime,
      active: true,
    };

    onAddNotification(newNotifItem);
    setErrorMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-brand-dark/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-brand-bg w-full max-w-sm rounded-3xl p-6 shadow-2xl border-2 border-white/40 text-brand-dark relative">
        
        {/* Tombol Close */}
        <button
          onClick={() => {
            setErrorMessage(null);
            onClose();
          }}
          className="absolute top-4 right-4 text-brand-dark/60 hover:text-brand-dark cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Modal */}
        <div className="flex flex-col items-center text-center my-2">
          <div className="w-14 h-14 bg-brand-medium text-white rounded-2xl flex items-center justify-center mb-3 shadow-xs">
            <Bell className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-brand-deep">Set Notification</h3>
          <p className="text-xs text-brand-dark/70 mt-1">
            Add a new reminder time for your blood pressure measurement. You can set multiple reminders.
          </p>
        </div>

        {/* Form Input Time */}
        <form onSubmit={handleSave} className="mt-4 space-y-4">
          <div className="bg-brand-light/40 rounded-2xl p-4 border border-brand-medium/20 flex flex-col items-center">
            <label className="text-[11px] font-bold text-brand-deep uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-brand-medium" /> Select Time (Hour : Minute)
            </label>
            
            <input
              type="time"
              value={selectedTime}
              onChange={handleTimeChange}
              className="bg-white px-6 py-3 rounded-2xl text-2xl font-extrabold text-brand-deep border border-brand-medium/30 focus:outline-none focus:border-brand-medium shadow-inner tracking-widest cursor-pointer text-center"
              required
            />

            <span className="text-[10px] text-brand-dark/60 mt-2">
              Preview Format: <strong className="text-brand-deep font-bold">{formatTo12Hour(selectedTime)}</strong>
            </span>

            {/* Alert Error jika Duplikat */}
            {errorMessage && (
              <div className="flex items-center gap-1.5 mt-3 text-rose-600 bg-rose-50 border border-rose-200 px-3 py-2 rounded-xl text-xs font-semibold text-center">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setErrorMessage(null);
                onClose();
              }}
              className="w-full bg-slate-300 hover:bg-slate-400 text-brand-dark font-bold py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
            <button
              type="submit"
              className="w-full bg-brand-medium hover:bg-brand-deep text-white font-bold py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Check className="w-4 h-4" /> Save
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};