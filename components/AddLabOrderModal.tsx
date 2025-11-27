
import React, { useState } from 'react';
import { Modal } from './Modal';
import type { AvailableLabTest } from '../types';

interface AddLabOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { test_name: string }) => void;
}

const availableTests: AvailableLabTest[] = [
    { name: 'Select a test...', instructions: '' },
    { name: 'Complete Blood Count (CBC)', instructions: 'No special preparation is needed for this test.' },
    { name: 'Lipid Panel', instructions: 'Patient must fast for 9-12 hours before this test. Water is permitted.' },
    { name: 'Thyroid Panel (TSH)', instructions: 'No special preparation needed, but confirm patient\'s thyroid medications.' },
    { name: 'Fasting Blood Sugar', instructions: 'Patient must not eat or drink anything except water for at least 8 hours before the test.' },
    { name: 'Vitamin D Level', instructions: 'No special preparation is necessary for this test.' },
];

export const AddLabOrderModal: React.FC<AddLabOrderModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [selectedTestIndex, setSelectedTestIndex] = useState(0);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTestIndex === 0) {
      setError('Please select a test to order.');
      return;
    }
    const selectedTest = availableTests[selectedTestIndex];
    onSubmit({ test_name: selectedTest.name });
    // Reset form
    setSelectedTestIndex(0);
    setError('');
  };

  const selectedTest = availableTests[selectedTestIndex];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">New Lab Order</h2>
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
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                <p className="text-sm font-semibold text-blue-800">Preparation Instructions for Patient:</p>
                <p className="text-sm text-blue-700 mt-1">{selectedTest.instructions}</p>
            </div>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300">Cancel</button>
            <button type="submit" className="py-2 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700">Order Test</button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
