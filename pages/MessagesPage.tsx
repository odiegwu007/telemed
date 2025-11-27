
import React, { useState, useMemo } from 'react';
import type { Appointment, Message, DoctorContact } from '../types';
import { DoctorContactList } from '../components/DoctorContactList';
import { ConversationView } from '../components/ConversationView';
import { MessageSquareIcon } from '../components/Icons';

interface MessagesPageProps {
  appointments: Appointment[];
  messages: Message[];
  onSendMessage: (newMessage: Omit<Message, 'id' | 'created_at'>) => void;
}

export const MessagesPage: React.FC<MessagesPageProps> = ({ appointments, messages, onSendMessage }) => {
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);

  const doctorContacts = useMemo(() => {
    const contacts: DoctorContact[] = [];
    const seenDoctorIds = new Set<string>();

    appointments.forEach(app => {
        if (app.doctorId && !seenDoctorIds.has(app.doctorId)) {
            contacts.push({
                id: app.id, // Use appointment ID for selection
                name: app.doctorName,
                specialty: app.specialty,
                avatarUrl: app.avatarUrl
            });
            seenDoctorIds.add(app.doctorId);
        }
    });
    return contacts;
  }, [appointments]);

  if (selectedAppointmentId === null && doctorContacts.length > 0) {
      setSelectedAppointmentId(doctorContacts[0].id);
  }

  const selectedAppointment = appointments.find(app => app.id === selectedAppointmentId);
  const conversationMessages = messages.filter(msg => msg.appointment_id === selectedAppointmentId);

  return (
    <div className="bg-white rounded-2xl shadow-md h-[calc(100vh-10rem)] flex">
        <DoctorContactList 
            contacts={doctorContacts}
            selectedContactId={selectedAppointmentId}
            onSelectContact={setSelectedAppointmentId}
        />
        <div className="flex-1 flex flex-col">
            {selectedAppointment ? (
                <ConversationView 
                    appointment={selectedAppointment}
                    messages={conversationMessages}
                    sender="patient"
                    onSendMessage={onSendMessage}
                />
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                    <MessageSquareIcon className="w-16 h-16 mb-4 text-gray-300"/>
                    <h3 className="text-xl font-semibold">Your Messages</h3>
                    <p>Select a conversation to begin.</p>
                </div>
            )}
        </div>
    </div>
  );
};
