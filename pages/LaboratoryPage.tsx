
import React, { useState } from 'react';
import { LabOrderCard } from '../components/LabOrderCard';
import { PlusIcon } from '../components/Icons';
import type { LabOrder } from '../types';
import { RequestLabTestModal } from '../components/RequestLabTestModal';
import { LabResultsModal } from '../components/LabResultsModal';

interface LaboratoryPageProps {
  labOrders: LabOrder[];
  onRequestTest: (data: { testName: string; reason: string }) => void;
}

export const LaboratoryPage: React.FC<LaboratoryPageProps> = ({ labOrders, onRequestTest }) => {
  const [isRequestModalOpen, setRequestModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<LabOrder | null>(null);

  const handleViewResults = (order: LabOrder) => {
    setSelectedOrder(order);
  };

  const handleRequestSubmit = (data: { testName: string; reason: string }) => {
    onRequestTest(data);
    setRequestModalOpen(false);
  };

  return (
    <>
      <div className="space-y-6">
          <div className="flex justify-end">
              <button 
                  onClick={() => setRequestModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-300">
                  <PlusIcon className="w-5 h-5" />
                  Request a Test
              </button>
          </div>

          {labOrders.length > 0 ? (
              <div className="space-y-4">
                  {labOrders.map(order => (
                      <LabOrderCard key={order.id} order={order} onViewResults={handleViewResults} />
                  ))}
              </div>
          ) : (
              <div className="text-center bg-white rounded-2xl p-12">
                  <h3 className="text-xl font-semibold text-gray-700">No Lab Orders Found</h3>
                  <p className="text-gray-500 mt-2">Your doctor has not ordered any lab tests for you yet.</p>
              </div>
          )}
      </div>

      <RequestLabTestModal
        isOpen={isRequestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        onSubmit={handleRequestSubmit}
      />

      {selectedOrder && (
        <LabResultsModal
            isOpen={!!selectedOrder}
            onClose={() => setSelectedOrder(null)}
            order={selectedOrder}
        />
      )}
    </>
  );
};
