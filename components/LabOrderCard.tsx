
import React from 'react';
import type { LabOrder, LabOrderStatus } from '../types';
import { CalendarIcon, StethoscopeIcon, BeakerIcon } from './Icons';

interface LabOrderCardProps {
  order: LabOrder;
  onViewResults: (order: LabOrder) => void;
}

const statusStyles: Record<LabOrderStatus, string> = {
  Ordered: 'bg-yellow-100 text-yellow-800',
  Completed: 'bg-blue-100 text-blue-800',
  'Results In': 'bg-green-100 text-green-800',
};

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

export const LabOrderCard: React.FC<LabOrderCardProps> = ({ order, onViewResults }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-indigo-500">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <BeakerIcon className="w-6 h-6 text-indigo-500"/>
            <h3 className="text-xl font-bold text-gray-800">{order.test_name}</h3>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <StethoscopeIcon className="w-4 h-4" />
              <span>{order.doctorName === 'Pending Review' ? 'Requested by you' : `Ordered by: ${order.doctorName}`}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4" />
              <span>{formatDate(order.date_ordered)}</span>
            </div>
          </div>
          {order.reason && (
            <p className="text-sm text-gray-600 mt-2 italic">Reason for request: "{order.reason}"</p>
          )}
        </div>
        <div className="flex flex-col items-start sm:items-end gap-2">
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusStyles[order.status]}`}>
                {order.status}
            </span>
            <button 
                onClick={() => onViewResults(order)}
                disabled={order.status !== 'Results In'}
                className="mt-2 text-sm font-semibold text-white bg-indigo-500 py-1 px-3 rounded-md hover:bg-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
                View Results
            </button>
        </div>
      </div>
    </div>
  );
};
