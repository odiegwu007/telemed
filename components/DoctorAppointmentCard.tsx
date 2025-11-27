
import React from 'react';
import type { Appointment } from '../types';
import { CalendarIcon, ClockIcon, StethoscopeIcon } from './Icons';

interface DoctorAppointmentCardProps {
  appointment: Appointment;
  onSelect: () => void;
}

const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

const formatTime = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    return new Date(dateString).toLocaleTimeString(undefined, options);
}

export const DoctorAppointmentCard: React.FC<DoctorAppointmentCardProps> = ({ appointment, onSelect }) => {
  return (
    <button onClick={onSelect} className="w-full text-left bg-white rounded-2xl shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg hover:border-green-600 transition-all duration-200">
      <div className="flex flex-col sm:flex-row gap-4">
        <img 
          className="w-16 h-16 rounded-full object-cover self-center sm:self-start" 
          src={appointment.avatarUrl} 
          alt={appointment.patientName} 
        />
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-xl font-bold text-gray-800">{appointment.patientName}</h3>
          <p className="text-md text-gray-600">Appointment</p>
          <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-2 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4" />
              <span>{formatDate(appointment.date)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ClockIcon className="w-4 h-4" />
              <span>{formatTime(appointment.date)}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-start gap-3 text-sm text-gray-700">
            <StethoscopeIcon className="w-5 h-5 mt-0.5 text-green-500 flex-shrink-0" />
            <p><span className="font-semibold">Reason for Visit:</span> {appointment.reason}</p>
        </div>
      </div>
    </button>
  );
};
