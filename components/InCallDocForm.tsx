
import React, { useState } from 'react';
import type { Appointment } from '../types';
import { ClipboardListIcon } from './Icons';

interface InCallDocFormProps {
  appointment: Appointment;
  onSaveNotes: (notes: string) => Promise<void>;
}

export const InCallDocForm: React.FC<InCallDocFormProps> = ({ appointment, onSaveNotes }) => {
  const [notes, setNotes] = useState(appointment.notes || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await onSaveNotes(notes);
    setIsSaving(false);
  };

  return (
    <div className="flex flex-col h-full p-4 bg-gray-50">
      <div className="pb-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <ClipboardListIcon className="w-5 h-5 text-blue-500" />
            Consultation Notes
        </h3>
        <p className="text-sm text-gray-600">
            For: <span className="font-medium">{appointment.patientName}</span>
        </p>
      </div>
      
      <div className="flex-1 my-4">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Enter patient history, symptoms, and diagnosis..."
          className="w-full h-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
        />
      </div>

      <button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full py-3 px-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
      >
        {isSaving ? 'Saving...' : 'Save Notes'}
      </button>
    </div>
  );
};