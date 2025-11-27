import React from 'react';
import { Modal } from './Modal';
import type { LabOrder } from '../types';
import { BeakerIcon, CalendarIcon, StethoscopeIcon } from './Icons';

interface LabResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: LabOrder;
}

const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

export const LabResultsModal: React.FC<LabResultsModalProps> = ({ isOpen, onClose, order }) => {
  if (!order) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-8">
        <div className="flex items-center gap-3 mb-4">
            <BeakerIcon className="w-8 h-8 text-indigo-600"/>
            <h2 className="text-2xl font-bold text-gray-800">Lab Results</h2>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">{order.test_name}</h3>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-1.5">
                    <CalendarIcon className="w-4 h-4" />
                    <span>Ordered on: {formatDate(order.date_ordered)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <StethoscopeIcon className="w-4 h-4" />
                    <span>Ordered by: {order.doctorName}</span>
                </div>
            </div>
        </div>

        <div className="mt-6">
            <h4 className="font-semibold text-gray-700 mb-2">Results:</h4>
            <div className="prose prose-sm max-w-none p-4 bg-white border border-gray-200 rounded-md">
                <p>{order.results || "Results are not yet available."}</p>
            </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button type="button" onClick={onClose} className="py-2 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700">Close</button>
        </div>
      </div>
    </Modal>
  );
};
