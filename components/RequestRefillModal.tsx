
import React from 'react';
import { Modal } from './Modal';
import type { Prescription } from '../types';

interface RequestRefillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  prescription: Prescription;
}

export const RequestRefillModal: React.FC<RequestRefillModalProps> = ({ isOpen, onClose, onConfirm, prescription }) => {
  if (!prescription) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Confirm Refill Request</h2>
        <p className="text-gray-600">
            Are you sure you want to request a refill for <span className="font-semibold">{prescription.medication} ({prescription.dosage})</span>?
        </p>
        <div className="mt-8 flex justify-center gap-4">
            <button type="button" onClick={onClose} className="py-2 px-6 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300">
                Cancel
            </button>
            <button type="button" onClick={onConfirm} className="py-2 px-6 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700">
                Confirm
            </button>
        </div>
      </div>
    </Modal>
  );
};
