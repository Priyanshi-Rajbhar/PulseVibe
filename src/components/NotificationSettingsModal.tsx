import React, { useState } from 'react';
import { 
  Bell, 
  X, 
  Check, 
  AlertCircle, 
  Volume2, 
  VolumeX, 
  Calendar, 
  Clock, 
  Send 
} from 'lucide-react';
import { storage } from '../services/storage';
import { notificationService } from '../services/notificationService';
import { NotificationSchedule } from '../types';

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const [schedule, setSchedule] = useState<NotificationSchedule>(
    storage.getNotificationSchedule()
  );
  const [permission, setPermission] = useState<NotificationPermission>(
    notificationService.getPermission()
  );
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleRequestPermission = async () => {
    const perm = await notificationService.requestPermission();
    setPermission(perm);
    if (perm === 'granted') {
      notificationService.playChime();
    }
  };

  const handleSave = () => {
    storage.saveNotificationSchedule(schedule);
    onClose();
  };

  const handleTestReminder = () => {
    const res = notificationService.triggerTestReminder();
    setTestResult(res.message);
    setTimeout(() => {
      setTestResult(null);
    }, 4000);
  };

  const daysOfWeek = [
    { id: 1, name: 'Monday' },
    { id: 2, name: 'Tuesday' },
    { id: 3, name: 'Wednesday' },
    { id: 4, name: 'Thursday' },
    { id: 5, name: 'Friday (Recommended)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Weekly Push Reminders
              </h3>
              <p className="text-[11px] text-slate-500">
                Protect your check-in streak and elevate team voice
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs">
          {/* Permission Status Box */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-slate-800">
                Browser Notification Access
              </span>
              {permission === 'granted' ? (
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 font-semibold rounded text-[11px] flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-600" />
                  Enabled
                </span>
              ) : permission === 'denied' ? (
                <span className="px-2 py-0.5 bg-rose-50 text-rose-800 font-semibold rounded text-[11px] flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-rose-600" />
                  Blocked
                </span>
              ) : (
                <span className="px-2 py-0.5 bg-amber-50 text-amber-800 font-semibold rounded text-[11px]">
                  Not Configured
                </span>
              )}
            </div>

            {permission !== 'granted' ? (
              <div className="space-y-2 mt-2">
                <p className="text-slate-600 text-[11px]">
                  Enable web push to receive subtle, non-intrusive reminder banners when the weekly pulse opens.
                </p>
                <button
                  type="button"
                  onClick={handleRequestPermission}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs transition-colors"
                >
                  Enable Browser Push Notifications
                </button>
              </div>
            ) : (
              <p className="text-slate-600 text-[11px]">
                Your device will receive weekly reminders on your configured schedule.
              </p>
            )}
          </div>

          {/* Schedule Settings */}
          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="font-semibold text-slate-900">
                Scheduled Weekly Reminders
              </span>
              <input
                type="checkbox"
                checked={schedule.enabled}
                onChange={(e) => setSchedule({ ...schedule, enabled: e.target.checked })}
                className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900 cursor-pointer"
              />
            </label>

            {schedule.enabled && (
              <div className="space-y-3 pt-2">
                {/* Day of Week */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Reminder Day
                  </label>
                  <div className="relative">
                    <select
                      value={schedule.dayOfWeek}
                      onChange={(e) => setSchedule({ ...schedule, dayOfWeek: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    >
                      {daysOfWeek.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Time of Day */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Reminder Time
                  </label>
                  <input
                    type="time"
                    value={schedule.time}
                    onChange={(e) => setSchedule({ ...schedule, time: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                {/* Sound Chime Toggle */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    {schedule.soundEnabled ? (
                      <Volume2 className="w-4 h-4 text-slate-600" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-slate-400" />
                    )}
                    <span className="text-slate-700">Audio Chime</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={schedule.soundEnabled}
                    onChange={(e) => setSchedule({ ...schedule, soundEnabled: e.target.checked })}
                    className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900 cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Test Reminder Trigger */}
          <div className="border-t border-slate-200 pt-3">
            <button
              type="button"
              onClick={handleTestReminder}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5 text-slate-600" />
              <span>Test Push Notification Now</span>
            </button>

            {testResult && (
              <p className="text-[11px] text-emerald-700 mt-2 text-center font-medium">
                {testResult}
              </p>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 font-medium rounded-lg"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-1.5 text-xs bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
