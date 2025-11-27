
import React, { useState } from 'react';
import type { Prescription, LabOrder } from '../types';
import { PrescriptionCard } from '../components/PrescriptionCard';
import { LabOrderCard } from '../components/LabOrderCard';
import { RequestRefillModal } from '../components/RequestRefillModal';
import { LabResultsModal } from '../components/LabResultsModal';
import { ClipboardListIcon, BeakerIcon } from '../components/Icons';

interface MedicalRecordsPageProps {
  prescriptions: Prescription[];
  labOrders: LabOrder[];
}

export const MedicalRecordsPage: React.FC<MedicalRecordsPageProps> = ({ prescriptions, labOrders }) => {
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [selectedLabOrder, setSelectedLabOrder] = useState<LabOrder | null>(null);

  const handleRequestRefill = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
  };
  
  const handleConfirmRefill = () => {
    alert(`Refill requested for ${selectedPrescription?.medication}. Your doctor's office will be in touch.`);
    setSelectedPrescription(null);
  };

  const handleViewResults = (order: LabOrder) => {
    setSelectedLabOrder(order);
  };
  
  const sortedPrescriptions = [...prescriptions].sort((a, b) => new Date(b.date_issued).getTime() - new Date(a.date_issued).getTime());
  const sortedLabOrders = [...labOrders].sort((a, b) => new Date(b.date_ordered).getTime() - new Date(a.date_ordered).getTime());

  return (
    <>
        <div className="space-y-8">
            {/* Prescription History */}
            <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <ClipboardListIcon className="w-6 h-6 text-blue-500" />
                    Prescription History
                </h3>
                {sortedPrescriptions.length > 0 ? (
                    <div className="space-y-4">
                        {sortedPrescriptions.map(p => <PrescriptionCard key={p.id} prescription={p} onRequestRefill={handleRequestRefill} />)}
                    </div>
                ) : (
                    <p className="text-gray-500 bg-white p-6 rounded-lg shadow-sm">No prescriptions on record.</p>
                )}
            </div>

            {/* Laboratory History */}
             <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <BeakerIcon className="w-6 h-6 text-indigo-500" />
                    Laboratory History
                </h3>
                {sortedLabOrders.length > 0 ? (
                    <div className="space-y-4">
                        {sortedLabOrders.map(l => <LabOrderCard key={l.id} order={l} onViewResults={handleViewResults} />)}
                    </div>
                ) : (
                    <p className="text-gray-500 bg-white p-6 rounded-lg shadow-sm">No lab orders on record.</p>
                )}
            </div>
        </div>
        
        {selectedPrescription && (
            <RequestRefillModal
                isOpen={!!selectedPrescription}
                onClose={() => setSelectedPrescription(null)}
                onConfirm={handleConfirmRefill}
                prescription={selectedPrescription}
            />
        )}

        {selectedLabOrder && (
            <LabResultsModal
                isOpen={!!selectedLabOrder}
                onClose={() => setSelectedLabOrder(null)}
                order={selectedLabOrder}
            />
        )}
    </>
  );
};
