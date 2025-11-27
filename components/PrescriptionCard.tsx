
import React from 'react';
import type { Prescription, PrescriptionStatus } from '../types';
import { CalendarIcon, StethoscopeIcon, ClipboardListIcon } from './Icons';

interface PrescriptionCardProps {
  prescription: Prescription;
  onRequestRefill: (prescription: Prescription) => void;
}

const statusStyles: Record<PrescriptionStatus, string> = {
  Active: 'bg-green-100 text-green-800',
  Filled: 'bg-blue-100 text-blue-800',
  Expired: 'bg-red-100 text-red-800',
};

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

export const PrescriptionCard: React.FC<PrescriptionCardProps> = ({ prescription, onRequestRefill }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-blue-500">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <ClipboardListIcon className="w-6 h-6 text-blue-500"/>
            <h3 className="text-xl font-bold text-gray-800">{prescription.medication}</h3>
          </div>
          <p className="text-gray-600">{prescription.dosage} - {prescription.frequency}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <StethoscopeIcon className="w-4 h-4" />
              <span>Prescribed by: {prescription.doctorName}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4" />
              <span>{formatDate(prescription.date_issued)}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start sm:items-end gap-2">
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusStyles[prescription.status]}`}>
                {prescription.status}
            </span>
            <button 
                onClick={() => onRequestRefill(prescription)}
                disabled={prescription.status === 'Expired'}
                className="mt-2 text-sm font-semibold text-white bg-blue-500 py-1 px-3 rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
                Request Refill
            </button>
        </div>
      </div>
    </div>
  );
};
