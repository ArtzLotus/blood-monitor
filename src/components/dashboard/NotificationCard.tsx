// src/components/dashboard/NotificationCard.tsx
import React from 'react';
import { Bell, Plus, Trash2 } from 'lucide-react';
import type { NotificationItem } from '../../types';

interface Props {
  notifications: NotificationItem[];
  onToggle: (id: number) => void;
  onDelete?: (id: number) => void;
  onOpenAddModal: () => void;
}

export const NotificationCard: React.FC<Props> = ({
  notifications,
  onToggle,
  onDelete,
  onOpenAddModal,
}) => {
  return (
    <div className="bg-brand-light rounded-3xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-brand-dark font-semibold">
          <Bell className="w-5 h-5" />
          <span>Notification</span>
        </div>
        <span className="text-[10px] font-bold text-white bg-brand-medium px-2.5 py-0.5 rounded-full">
          {notifications.filter(n => n.active).length} Aktif
        </span>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <p className="text-center text-xs text-white/80 py-4 italic">
            Belum ada jadwal pengingat tensi.
          </p>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              className="bg-brand-medium rounded-2xl px-4 py-3 text-white flex items-center justify-between shadow-xs"
            >
              <span className="font-bold text-base tracking-wide">{item.time}</span>
              
              <div className="flex items-center gap-2">
                {onDelete && (
                  <button
                    onClick={() => onDelete(item.id)}
                    className="p-1 text-white/60 hover:text-white transition-colors cursor-pointer mr-1"
                    title="Hapus Pengingat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                {/* Toggle Switch */}
                <button
                  onClick={() => onToggle(item.id)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer flex items-center ${
                    item.active ? 'bg-white justify-end' : 'bg-brand-dark/40 justify-start'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full transition-transform ${
                      item.active ? 'bg-brand-medium' : 'bg-white'
                    }`}
                  />
                </button>
              </div>
            </div>
          ))
        )}

        <button
          onClick={onOpenAddModal}
          className="w-full bg-brand-medium hover:bg-brand-deep transition-colors text-white font-medium py-3 rounded-2xl flex items-center justify-center gap-2 text-sm mt-2 cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" /> Add Notification
        </button>
      </div>
    </div>
  );
};