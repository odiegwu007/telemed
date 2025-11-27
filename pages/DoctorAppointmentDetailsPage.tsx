
import React, { useState } from 'react';
import type { Appointment, Message, Attachment, Prescription, LabOrder } from '../types';
import { ConversationView } from '../components/ConversationView';
import { UploadedFileItem } from '../components/UploadedFileItem';
import { Modal } from '../components/Modal';
import { FilePreview } from '../components/FilePreview';
import { AddPrescriptionModal } from '../components/AddPrescriptionModal';
import { AddLabOrderModal } from '../components/AddLabOrderModal';
import { LabResultsModal } from '../components/LabResultsModal';
import { LabOrderCard } from '../components/LabOrderCard';
import { ArrowLeftIcon, VideoIcon, PlusIcon, ClipboardListIcon, BeakerIcon } from '../components/Icons';

interface DoctorAppointmentDetailsPageProps {
  appointment: Appointment;
  messages: Message[];
  prescriptions: Prescription[];
  labOrders: LabOrder[];
  onSendMessage: (newMessage: Omit<Message, 'id' | 'created_at'>) => void;
  onBack: () => void;
  onStartCall: (appointment: Appointment) => void;
  onPrescribe: (data: any, appointment: Appointment) => void;
  onOrderLab: (data: any, appointment: Appointment) => void;
}

const SummaryPrescriptionItem: React.FC<{ prescription: Prescription }> = ({ prescription }) => (
    <div className="p-3 bg-gray-50 rounded-lg">
        <p className="font-semibold text-gray-800">{prescription.medication}</p>
        <p className="text-sm text-gray-600">{prescription.dosage} - {prescription.frequency}</p>
    </div>
);

export const DoctorAppointmentDetailsPage: React.FC<DoctorAppointmentDetailsPageProps> = ({
  appointment,
  messages,
  prescriptions,
  labOrders,
  onSendMessage,
  onBack,
  onStartCall,
  onPrescribe,
  onOrderLab,
}) => {
  const [selectedFile, setSelectedFile] = useState<Attachment | null>(null);
  const [isPrescriptionModalOpen, setPrescriptionModalOpen] = useState(false);
  const [isLabModalOpen, setLabModalOpen] = useState(false);
  const [selectedLabOrder, setSelectedLabOrder] = useState<LabOrder | null>(null);

  const attachments = messages.map(msg => ({
    id: msg.id,
    name: msg.attachment_name || 'Unnamed File',
    size: msg.attachment_size || '0 MB'
  })).filter(msg => msg.name !== 'Unnamed File');

  const handleViewFileDetails = (file: Attachment) => setSelectedFile(file);
  const handleCloseModal = () => setSelectedFile(null);
  const handleViewResults = (order: LabOrder) => setSelectedLabOrder(order);

  const handlePrescribeSubmit = (data: any) => {
    onPrescribe(data, appointment);
    setPrescriptionModalOpen(false);
  };

  const handleOrderLabSubmit = (data: any) => {
    onOrderLab(data, appointment);
    setLabModalOpen(false);
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
            Appointment with <span className="text-blue-600">{appointment.patientName}</span>
          </h2>
        </div>

        {/* Main Content */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
          {/* Left Column */}
          <div className="lg:col-span-1 flex flex-col gap-6 overflow-y-auto pr-2 pb-6">
            {/* Patient Info & Actions */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex flex-col items-center text-center">
                <img
                  src={appointment.avatarUrl}
                  alt={appointment.patientName}
                  className="w-24 h-24 rounded-full object-cover mb-4"
                />
                <h3 className="text-xl font-bold text-gray-800">{appointment.patientName}</h3>
                <div className="w-full mt-6 space-y-3">
                  <button
                    onClick={() => onStartCall(appointment)}
                    className="w-full flex items-center justify-center gap-2 bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition-colors duration-300"
                  >
                    <VideoIcon className="w-5 h-5" />
                    Start Video Call
                  </button>
                  <button
                    onClick={() => setPrescriptionModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                  >
                    <PlusIcon className="w-5 h-5" />
                    Prescribe Medication
                  </button>
                  <button
                    onClick={() => setLabModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-600 transition-colors duration-300"
                  >
                    <PlusIcon className="w-5 h-5" />
                    Order Lab Test
                  </button>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-700 mb-2">Reason for Visit</h4>
                  <p className="text-sm text-gray-600">{appointment.reason}</p>
              </div>
               <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-700 mb-2">Consultation Notes</h4>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{appointment.notes || 'No notes have been added for this consultation.'}</p>
                </div>
            </div>

            {/* Prescriptions Issued */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><ClipboardListIcon className="w-5 h-5 text-blue-500"/>Prescriptions Issued</h3>
              {prescriptions.length > 0 ? (
                  <ul className="space-y-3">
                      {prescriptions.map(p => (
                          <li key={p.id}><SummaryPrescriptionItem prescription={p} /></li>
                      ))}
                  </ul>
              ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No prescriptions issued during this visit.</p>
              )}
            </div>
            
            {/* Lab Orders Placed */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><BeakerIcon className="w-5 h-5 text-indigo-500"/>Lab Orders Placed</h3>
              {labOrders.length > 0 ? (
                  <ul className="space-y-3">
                      {labOrders.map(l => (
                          <li key={l.id}><LabOrderCard order={l} onViewResults={handleViewResults} /></li>
                      ))}
                  </ul>
              ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No lab tests ordered during this visit.</p>
              )}
            </div>

            {/* Uploaded Files */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Uploaded Documents</h3>
              {attachments.length > 0 ? (
                  <ul className="space-y-3">
                      {attachments.map(file => (
                          <UploadedFileItem key={file.id} file={file} onViewDetails={() => handleViewFileDetails(file)} />
                      ))}
                  </ul>
              ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No documents have been uploaded.</p>
              )}
            </div>
          </div>

          {/* Right Column - Chat */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-md overflow-hidden">
            <ConversationView
              appointment={appointment}
              messages={messages}
              sender="doctor"
              onSendMessage={onSendMessage}
            />
          </div>
        </div>
      </div>
      
      <Modal isOpen={!!selectedFile} onClose={handleCloseModal}>
        {selectedFile && <FilePreview file={selectedFile} />}
      </Modal>

      <AddPrescriptionModal 
        isOpen={isPrescriptionModalOpen}
        onClose={() => setPrescriptionModalOpen(false)}
        onSubmit={handlePrescribeSubmit}
      />

      <AddLabOrderModal
        isOpen={isLabModalOpen}
        onClose={() => setLabModalOpen(false)}
        onSubmit={handleOrderLabSubmit}
      />

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