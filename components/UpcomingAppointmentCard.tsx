
import React from 'react';
import type { Appointment } from '../types';
import { VideoIcon, CalendarIcon, ClockIcon } from './Icons';

interface UpcomingAppointmentCardProps {
  appointment: Appointment;
  onStartCall: (appointment: Appointment) => void;
}

const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

const formatTime = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    return new Date(dateString).toLocaleTimeString(undefined, options);
}

export const UpcomingAppointmentCard: React.FC<UpcomingAppointmentCardProps> = ({ appointment, onStartCall }) => {
  return (
    <div className="bg-blue-600 text-white rounded-2xl p-6 md:p-8 shadow-lg flex flex-col md:flex-row items-center gap-6">
      <div className="flex-shrink-0">
        <img className="w-24 h-24 rounded-full border-4 border-blue-400 object-cover" src={appointment.avatarUrl} alt={appointment.doctorName} />
      </div>
      <div className="flex-1 text-center md:text-left">
        <p className="text-sm uppercase tracking-wider text-blue-200 font-semibold">Your Next Appointment</p>
        <h3 className="text-2xl md:text-3xl font-bold mt-1">
          {appointment.doctorName}
        </h3>
        <p className="text-blue-100 text-lg">{appointment.specialty}</p>
        <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-blue-50">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            <span>{formatDate(appointment.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <ClockIcon className="w-5 h-5" />
            <span>{formatTime(appointment.date)}</span>
          </div>
        </div>
      </div>
      <div className="w-full md:w-auto mt-4 md:mt-0">
        <button 
          onClick={() => onStartCall(appointment)}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-white text-blue-600 font-bold py-3 px-6 rounded-lg hover:bg-blue-50 transition-colors duration-300 transform hover:scale-105">
          <VideoIcon className="w-5 h-5" />
          Join Video Call
        </button>
      </div>
    </div>
  );
};
