
import React from 'react';
import { DoctorAppointmentCard } from '../components/DoctorAppointmentCard';
import type { Appointment } from '../types';

interface DoctorDashboardPageProps {
  appointments: Appointment[];
  onSelectAppointment: (appointmentId: number) => void;
}

export const DoctorDashboardPage: React.FC<DoctorDashboardPageProps> = ({ appointments, onSelectAppointment }) => {
  const upcomingAppointments = appointments
    .filter(app => new Date(app.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-700 mb-4">Upcoming Appointments</h3>
      {upcomingAppointments.length > 0 ? (
        <div className="space-y-4">
          {upcomingAppointments.map(app => (
            <DoctorAppointmentCard key={app.id} appointment={app} onSelect={() => onSelectAppointment(app.id)} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 text-center shadow-md">
            <h3 className="text-xl font-semibold text-gray-700">No Upcoming Appointments</h3>
            <p className="text-gray-500 mt-2">Your schedule is clear.</p>
        </div>
      )}
    </div>
  );
};
