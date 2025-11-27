
import React from 'react';
import type { Page, UserRole } from '../types';
import {
  LayoutDashboardIcon,
  CalendarIcon,
  MessageSquareIcon,
  FileTextIcon,
  SettingsIcon,
  LogInIcon,
  HeartPulseIcon,
  BeakerIcon,
  ClipboardListIcon
} from './Icons';

interface NavItemProps {
  icon: React.ReactNode;
  label: Page;
  active?: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 text-lg font-medium rounded-lg transition-colors duration-200 text-left ${
      active
        ? 'bg-blue-600 text-white'
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`}
  >
    {icon}
    <span className="ml-4">{label}</span>
  </button>
);

interface SidebarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
  userRole: UserRole;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, userRole, onLogout }) => {
  const baseNavItems: Page[] = ['Dashboard', 'Appointments'];
  
  const patientNavItems: Page[] = [...baseNavItems, 'Messages', 'Laboratory', 'Prescription', 'Medical Records', 'Settings'];
  const doctorNavItems: Page[] = [...baseNavItems, 'Settings'];

  const navItems = userRole === 'patient' ? patientNavItems : doctorNavItems;

  const getIcon = (item: Page) => {
    switch (item) {
        case 'Dashboard': return <LayoutDashboardIcon className="w-6 h-6" />;
        case 'Appointments': return <CalendarIcon className="w-6 h-6" />;
        case 'Messages': return <MessageSquareIcon className="w-6 h-6" />;
        case 'Laboratory': return <BeakerIcon className="w-6 h-6" />;
        case 'Prescription': return <ClipboardListIcon className="w-6 h-6" />;
        case 'Medical Records': return <FileTextIcon className="w-6 h-6" />;
        case 'Settings': return <SettingsIcon className="w-6 h-6" />;
        default: return null;
    }
  }

  return (
    <div className="hidden md:flex flex-col w-64 bg-gray-800 text-white">
      <div className="flex items-center justify-center h-20 border-b border-gray-700">
        <HeartPulseIcon className="w-8 h-8 text-blue-400" />
        <h1 className="text-2xl font-bold ml-2">TeleHealth</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <NavItem
            key={item}
            icon={getIcon(item)}
            label={item}
            active={activePage === item}
            onClick={() => setActivePage(item)}
          />
        ))}
      </nav>
      <div className="px-4 py-6 border-t border-gray-700">
        <button
          onClick={onLogout}
          className="flex items-center w-full px-4 py-3 text-lg font-medium text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white"
        >
          <LogInIcon className="w-6 h-6" />
          <span className="ml-4">Logout</span>
        </button>
      </div>
    </div>
  );
};
