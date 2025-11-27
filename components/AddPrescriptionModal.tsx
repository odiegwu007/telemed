import React, { useState } from 'react';
import { Modal } from './Modal';
import type { Prescription } from '../types';

interface AddPrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Pick<Prescription, 'medication' | 'dosage' | 'frequency'>) => void;
}

export const AddPrescriptionModal: React.FC<AddPrescriptionModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [medication, setMedication] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medication || !dosage || !frequency) {
      setError('Please fill out all fields.');
      return;
    }
    onSubmit({ medication, dosage, frequency });
    // Reset form
    setMedication('');
    setDosage('');
    setFrequency('');
    setError('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">New Prescription</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="medication" className="block text-sm font-medium text-gray-700">Medication Name</label>
            <input type="text" id="medication" value={medication} onChange={e => setMedication(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="e.g., Lisinopril" />
          </div>
          <div>
            <label htmlFor="dosage" className="block text-sm font-medium text-gray-700">Dosage</label>
            <input type="text" id="dosage" value={dosage} onChange={e => setDosage(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="e.g., 10mg" />
          </div>
          <div>
            <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">Frequency</label>
            <input type="text" id="frequency" value={frequency} onChange={e => setFrequency(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="e.g., Once daily" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300">Cancel</button>
            <button type="submit" className="py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700">Add Prescription</button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
