import React from 'react';
import { Bell, Plus } from 'lucide-react';
import type { NotificationItem } from '../../types';

interface Props {
  notifications: NotificationItem[];
  onToggle: (id: number) => void;
}

export const NotificationCard: React.FC<Props> = ({ notifications, onToggle }) => {
  return (
    <div className="bg-brand-light rounded-3xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4 text-brand-dark font-semibold">
        <Bell className="w-5 h-5" />
        <span>Notification</span>
      </div>

      <div className="space-y-3">
        {notifications.map((item) => (
          <div
            key={item.id}
            className="bg-brand-medium rounded-2xl px-4 py-3 text-white flex items-center justify-between"
          >
            <span className="font-bold text-base tracking-wide">{item.time}</span>
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
        ))}

        <button className="w-full bg-brand-medium hover:bg-brand-deep transition-colors text-white font-medium py-3 rounded-2xl flex items-center justify-center gap-2 text-sm mt-2 cursor-pointer">
          <Plus className="w-4 h-4" /> Add Notification
        </button>
      </div>
    </div>
  );
};