
import React from 'react';
import type { Activity } from '../types';
import { FileTextIcon, MessageSquareIcon, BeakerIcon } from './Icons';

interface RecentActivityItemProps {
  activity: Activity;
}

const typeConfig = {
    prescription: { icon: <FileTextIcon className="w-5 h-5 text-purple-500"/>, color: 'bg-purple-100' },
    message: { icon: <MessageSquareIcon className="w-5 h-5 text-green-500"/>, color: 'bg-green-100' },
    result: { icon: <BeakerIcon className="w-5 h-5 text-yellow-500"/>, color: 'bg-yellow-100' }
};

export const RecentActivityItem: React.FC<RecentActivityItemProps> = ({ activity }) => {
  const { icon, color } = typeConfig[activity.type];
  return (
    <li className="flex items-start gap-4">
        <div className={`p-2 rounded-full ${color}`}>
            {icon}
        </div>
      <div>
        <p className="text-sm font-medium text-gray-700">{activity.description}</p>
        <p className="text-xs text-gray-500">{activity.timestamp}</p>
      </div>
    </li>
  );
};
