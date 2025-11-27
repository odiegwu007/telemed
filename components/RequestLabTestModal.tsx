
import React, { useState } from 'react';
import { Modal } from './Modal';
import type { AvailableLabTest } from '../types';

interface RequestLabTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { testName: string; reason: string }) => void;
}

const availableTests: AvailableLabTest[] = [
    { name: 'Select a test...', instructions: '' },
    { name: 'Complete Blood Count (CBC)', instructions: 'No special preparation is needed for this test.' },
    { name: 'Lipid Panel', instructions: 'You must fast for 9-12 hours before this test. You may drink water.' },
    { name: 'Thyroid Panel (TSH)', instructions: 'No special preparation needed, but inform the technician of any thyroid medications you are taking.' },
    { name: 'Fasting Blood Sugar', instructions: 'Do not eat or drink anything except water for at least 8 hours before your test.' },
    { name: 'Vitamin D Level', instructions: 'No special preparation is necessary for this test.' },
];

export const RequestLabTestModal: React.FC<RequestLabTestModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [selectedTestIndex, setSelectedTestIndex] = useState(0);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTestIndex === 0 || !reason.trim()) {
      setError('Please select a test and provide a reason.');
      return;
    }
    const selectedTest = availableTests[selectedTestIndex];
    onSubmit({ testName: selectedTest.name, reason });
    // Reset form
    setSelectedTestIndex(0);
    setReason('');
    setError('');
  };

  const selectedTest = availableTests[selectedTestIndex];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Request a Lab Test</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="testName" className="block text-sm font-medium text-gray-700">Select Test</label>
            <select
                id="testName"
                value={selectedTestIndex}
                onChange={(e) => setSelectedTestIndex(parseInt(e.target.value, 10))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
                {availableTests.map((test, index) => (
                    <option key={index} value={index} disabled={index === 0}>
                        {test.name}
                    </option>
                ))}
            </select>
          </div>
          
          {selectedTest && selectedTest.instructions && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <p className="text-sm font-semibold text-yellow-800">Preparation Instructions:</p>
                <p className="text-sm text-yellow-700 mt-1">{selectedTest.instructions}</p>
            </div>
          )}

          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Reason for Request</label>
            <textarea id="reason" rows={3} value={reason} onChange={e => setReason(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Please describe your symptoms or reason for this request..."></textarea>
          </div>
          
          {error && <p className="text-sm text-red-600">{error}</p>}
          
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300">Cancel</button>
            <button type="submit" className="py-2 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700">Submit Request</button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
