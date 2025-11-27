
import React from 'react';
import { DoctorAppointmentCard } from '../components/DoctorAppointmentCard';
import type { Appointment } from '../types';

interface DoctorDashboardPageProps {
  appointments: Appointment[];
  onSelectAppointment: (appointmentId: number) => void;
}

export const DoctorDashboardPage: React.FC<DoctorDashboardPageProps> = ({ appointments, onSelectAppointment }) => {
  const sortedAppointments = [...appointments]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-700 mb-4">Your Appointments</h3>
      {sortedAppointments.length > 0 ? (
        <div className="space-y-4">
          {sortedAppointments.map(app => (
            <DoctorAppointmentCard key={app.id} appointment={app} onSelect={() => onSelectAppointment(app.id)} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 text-center shadow-md">
            <h3 className="text-xl font-semibold text-gray-700">No Appointments Found</h3>
            <p className="text-gray-500 mt-2">There are no appointments in your schedule yet.</p>
        </div>
      )}
    </div>
  );
};
