
import React from 'react';
import { AppointmentCard } from '../components/AppointmentCard';
import { DoctorAppointmentCard } from '../components/DoctorAppointmentCard';
import { CalendarPlusIcon } from '../components/Icons';
import type { Appointment, Page, UserRole } from '../types';

interface AppointmentsPageProps {
  appointments: Appointment[];
  userRole: UserRole;
  setActivePage: (page: Page) => void;
  onSelectAppointment: (appointmentId: number) => void;
}

export const AppointmentsPage: React.FC<AppointmentsPageProps> = ({ appointments, userRole, setActivePage, onSelectAppointment }) => {
  const sortedAppointments = [...appointments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
        {userRole === 'patient' && (
            <div className="flex justify-end">
                <button 
                    onClick={() => setActivePage('Book Appointment')}
                    className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300">
                    <CalendarPlusIcon className="w-5 h-5" />
                    Book New Appointment
                </button>
            </div>
        )}

        {sortedAppointments.length > 0 ? (
            <div className="space-y-4">
                {sortedAppointments.map(app => (
                    userRole === 'patient' 
                        ? (
                            <button key={app.id} onClick={() => onSelectAppointment(app.id)} className="w-full text-left hover:opacity-90 transition-opacity">
                                <AppointmentCard appointment={app} />
                            </button>
                        )
                        : <DoctorAppointmentCard key={app.id} appointment={app} onSelect={() => onSelectAppointment(app.id)} />
                ))}
            </div>
        ) : (
            <div className="text-center bg-white rounded-2xl p-12">
                <h3 className="text-xl font-semibold text-gray-700">No Appointments Found</h3>
                <p className="text-gray-500 mt-2">
                    {userRole === 'patient' 
                        ? "You have no upcoming or past appointments scheduled." 
                        : "There are no appointments in your schedule."
                    }
                </p>
            </div>
        )}
    </div>
  );
};
