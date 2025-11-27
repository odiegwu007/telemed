
import React, { useState } from 'react';
import { PrescriptionCard } from '../components/PrescriptionCard';
import { PlusIcon } from '../components/Icons';
import type { Prescription } from '../types';
import { RequestRefillModal } from '../components/RequestRefillModal';

interface PrescriptionPageProps {
  prescriptions: Prescription[];
}

export const PrescriptionPage: React.FC<PrescriptionPageProps> = ({ prescriptions }) => {
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

  const handleRequestRefill = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
  };
  
  const handleConfirmRefill = () => {
    alert(`Refill requested for ${selectedPrescription?.medication}. Your doctor's office will be in touch.`);
    setSelectedPrescription(null);
  };

  return (
    <>
      <div className="space-y-6">
          <div className="flex justify-end">
              <button 
                  onClick={() => alert("Functionality to request a new prescription is coming soon!")}
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300">
                  <PlusIcon className="w-5 h-5" />
                  Request New Prescription
              </button>
          </div>

          {prescriptions.length > 0 ? (
              <div className="space-y-4">
                  {prescriptions.map(rx => (
                      <PrescriptionCard key={rx.id} prescription={rx} onRequestRefill={handleRequestRefill} />
                  ))}
              </div>
          ) : (
              <div className="text-center bg-white rounded-2xl p-12">
                  <h3 className="text-xl font-semibold text-gray-700">No Prescriptions Found</h3>
                  <p className="text-gray-500 mt-2">You currently have no active or past prescriptions.</p>
              </div>
          )}
      </div>

      {selectedPrescription && (
        <RequestRefillModal
            isOpen={!!selectedPrescription}
            onClose={() => setSelectedPrescription(null)}
            onConfirm={handleConfirmRefill}
            prescription={selectedPrescription}
        />
      )}
    </>
  );
};
