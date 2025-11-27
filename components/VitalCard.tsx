
import React from 'react';
import type { Vital } from '../types';

interface VitalCardProps {
  vital: Vital;
}

export const VitalCard: React.FC<VitalCardProps> = ({ vital }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md flex items-center gap-4">
      <div className="bg-gray-100 p-3 rounded-full">
        {vital.icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{vital.name}</p>
        <p className="text-2xl font-bold text-gray-800">
          {vital.value} <span className="text-base font-normal text-gray-600">{vital.unit}</span>
        </p>
      </div>
    </div>
  );
};
