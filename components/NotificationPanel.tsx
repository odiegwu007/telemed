
import React from 'react';
import type { Notification } from '../types';
import { BellIcon } from './Icons';

// Function to calculate time ago
const timeSince = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return "Just now";
};

interface NotificationPanelProps {
  notifications: Notification[];
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ notifications }) => {
  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
      <div className="p-4 border-b font-semibold text-gray-800">
        Notifications
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length > 0 ? (
          <ul>
            {notifications.map((notification) => (
              <li key={notification.id} className="p-4 border-b hover:bg-gray-50">
                <p className="text-sm text-gray-700">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">{timeSince(new Date(notification.created_at))}</p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <BellIcon className="w-12 h-12 mx-auto text-gray-300 mb-2"/>
            <p>No new notifications</p>
          </div>
        )}
      </div>
    </div>
  );
};
