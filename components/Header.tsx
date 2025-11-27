
import React, { useState, useRef, useEffect } from 'react';
import { SearchIcon, BellIcon } from './Icons';
import type { Notification } from '../types';
import { NotificationPanel } from './NotificationPanel';

interface HeaderProps {
  patientName: string;
  notifications: Notification[];
  onMarkNotificationsAsRead: () => void;
}

export const Header: React.FC<HeaderProps> = ({ patientName, notifications, onMarkNotificationsAsRead }) => {
  const [isPanelOpen, setPanelOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.is_read).length;
  const panelRef = useRef<HTMLDivElement>(null);

  const handleBellClick = () => {
      setPanelOpen(prev => !prev);
      if (!isPanelOpen && unreadCount > 0) {
        onMarkNotificationsAsRead();
      }
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
            setPanelOpen(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [panelRef]);


  return (
    <header className="flex items-center justify-between h-20 px-6 bg-white border-b border-gray-200">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold">
          Hello, <span className="text-blue-600">{patientName}!</span>
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <SearchIcon className="absolute w-5 h-5 text-gray-400 left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 w-full text-sm bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="relative" ref={panelRef}>
            <button onClick={handleBellClick} className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <BellIcon className="w-6 h-6 text-gray-500" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                        {unreadCount}
                    </span>
                )}
            </button>
            {isPanelOpen && <NotificationPanel notifications={notifications} />}
        </div>

        <img
          className="w-10 h-10 rounded-full object-cover"
          src="https://xsgames.co/randomusers/assets/avatars/female/46.jpg"
          alt="Patient Avatar"
        />
      </div>
    </header>
  );
};
