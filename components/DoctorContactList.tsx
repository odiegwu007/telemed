
import React from 'react';
import type { DoctorContact } from '../types';

interface DoctorContactListProps {
  contacts: DoctorContact[];
  selectedContactId: number | null;
  onSelectContact: (id: number) => void;
}

export const DoctorContactList: React.FC<DoctorContactListProps> = ({ contacts, selectedContactId, onSelectContact }) => {
  return (
    <div className="w-1/3 border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Conversations</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {contacts.map(contact => (
          <button
            key={contact.id}
            onClick={() => onSelectContact(contact.id)}
            className={`w-full text-left p-4 flex items-center gap-3 transition-colors duration-200 ${
              selectedContactId === contact.id ? 'bg-blue-50' : 'hover:bg-gray-50'
            }`}
          >
            <img src={contact.avatarUrl} alt={contact.name} className="w-12 h-12 rounded-full object-cover" />
            <div>
              <p className="font-semibold text-gray-900">{contact.name}</p>
              <p className="text-sm text-gray-500">{contact.specialty}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
