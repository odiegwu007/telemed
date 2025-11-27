
import React, { useState, useRef, useEffect } from 'react';
import { PaperclipIcon, XIcon } from '../components/Icons';
import type { Attachment, NewAppointmentDetails } from '../types';
import type { Profile } from '../supabaseClient';

interface BookAppointmentPageProps {
  doctors: Profile[];
  onBookAppointment: (details: { newAppointment: NewAppointmentDetails; attachment: Attachment | null }) => void;
}

export const BookAppointmentPage: React.FC<BookAppointmentPageProps> = ({ doctors, onBookAppointment }) => {
    const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [reason, setReason] = useState('');
    const [attachment, setAttachment] = useState<Attachment | null>(null);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Auto-select the first doctor when the list loads
        if (doctors.length > 0 && !selectedDoctorId) {
            setSelectedDoctorId(doctors[0].id);
        }
    }, [doctors, selectedDoctorId]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setAttachment({
                name: file.name,
                size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDoctorId || !date || !time || !reason.trim()) {
            setError('Please fill out all fields.');
            return;
        }
        setError('');

        const combinedDateTime = `${date}T${time}:00`;

        onBookAppointment({
            newAppointment: {
                doctorId: selectedDoctorId,
                date: combinedDateTime,
                reason: reason,
            },
            attachment: attachment
        });
    };

    return (
        <div className="bg-white rounded-2xl shadow-md p-8 max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="doctor" className="block text-sm font-medium text-gray-700">
                        Select Doctor
                    </label>
                    <select
                        id="doctor"
                        value={selectedDoctorId}
                        onChange={(e) => setSelectedDoctorId(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                        {doctors.length === 0 && <option>Loading doctors...</option>}
                        {doctors.map((doc) => (
                            <option key={doc.id} value={doc.id}>
                                {doc.full_name} - {doc.specialty}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                            Date
                        </label>
                        <input
                            type="date"
                            id="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                            Time
                        </label>
                        <input
                            type="time"
                            id="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                        Reason for Appointment
                    </label>
                    <textarea
                        id="reason"
                        rows={4}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Briefly describe the reason for your visit..."
                    ></textarea>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Attach a file (optional)
                    </label>
                    {attachment ? (
                         <div className="mt-1 flex justify-between items-center bg-gray-100 p-2 rounded-md">
                            <span className="text-sm text-gray-700">{attachment.name} ({attachment.size})</span>
                            <button type="button" onClick={() => setAttachment(null)} className="p-1 text-red-500 hover:text-red-700">
                                <XIcon className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="mt-1 w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-600 font-medium py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-300 border border-dashed border-gray-300"
                        >
                            <PaperclipIcon className="w-5 h-5" />
                            Select File
                        </button>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <div className="flex justify-end items-center gap-4">
                    <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Confirm Booking
                    </button>
                </div>
            </form>
        </div>
    );
};
