
import React, { useState } from 'react';
import type { Appointment, Message, Prescription, LabOrder } from '../types';
import { ConversationView } from '../components/ConversationView';
import { PrescriptionCard } from '../components/PrescriptionCard';
import { LabOrderCard } from '../components/LabOrderCard';
import { RequestRefillModal } from '../components/RequestRefillModal';
import { LabResultsModal } from '../components/LabResultsModal';
import { ArrowLeftIcon, CalendarIcon, ClockIcon, StethoscopeIcon } from '../components/Icons';

interface PatientAppointmentDetailsPageProps {
  appointment: Appointment;
  messages: Message[];
  prescriptions: Prescription[];
  labOrders: LabOrder[];
  onSendMessage: (newMessage: Omit<Message, 'id' | 'created_at'>) => void;
  onBack: () => void;
}

const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

const formatTime = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    return new Date(dateString).toLocaleTimeString(undefined, options);
}

export const PatientAppointmentDetailsPage: React.FC<PatientAppointmentDetailsPageProps> = ({
  appointment,
  messages,
  prescriptions,
  labOrders,
  onSendMessage,
  onBack,
}) => {
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

  return (
    <>
      <div className="flex flex-col h-[calc(100vh-10rem)]">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button onClick={onBack} className="p-2 mr-4 rounded-full hover:bg-gray-200 transition-colors">
            <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
          </button>
          <h2 className="text-2xl font-semibold text-gray-700">
            Appointment Details
          </h2>
        </div>

        {/* Main Content */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
          {/* Left Column */}
          <div className="lg:col-span-1 flex flex-col gap-6 overflow-y-auto pr-2 pb-6">
            {/* Appointment Info */}
            <div className="bg-white rounded-2xl shadow-md p-6">
                <div className="flex items-center gap-4">
                    <img src={appointment.avatarUrl} alt={appointment.doctorName} className="w-16 h-16 rounded-full object-cover"/>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">{appointment.doctorName}</h3>
                        <p className="text-gray-600">{appointment.specialty}</p>
                    </div>
                </div>
                <div className="mt-4 space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2"><CalendarIcon className="w-4 h-4 text-gray-400"/><span>{formatDate(appointment.date)}</span></div>
                    <div className="flex items-center gap-2"><ClockIcon className="w-4 h-4 text-gray-400"/><span>{formatTime(appointment.date)}</span></div>
                </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2"><StethoscopeIcon className="w-5 h-5 text-blue-500"/>Reason for Visit</h4>
                  <p className="text-sm text-gray-600">{appointment.reason}</p>
              </div>
            </div>

            {/* Prescriptions */}
            {prescriptions.length > 0 && (
                <div className="bg-white rounded-2xl shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Prescriptions from this visit</h3>
                    <div className="space-y-4">
                        {prescriptions.map(p => <PrescriptionCard key={p.id} prescription={p} onRequestRefill={handleRequestRefill} />)}
                    </div>
                </div>
            )}
            
            {/* Lab Orders */}
            {labOrders.length > 0 && (
                 <div className="bg-white rounded-2xl shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Lab Orders from this visit</h3>
                     <div className="space-y-4">
                        {labOrders.map(l => <LabOrderCard key={l.id} order={l} onViewResults={handleViewResults} />)}
                    </div>
                </div>
            )}
          </div>

          {/* Right Column - Chat */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-md overflow-hidden">
            <ConversationView
              appointment={appointment}
              messages={messages}
              sender="patient"
              onSendMessage={onSendMessage}
            />
          </div>
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
