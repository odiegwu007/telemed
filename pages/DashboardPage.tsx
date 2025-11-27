
import React from 'react';
import { UpcomingAppointmentCard } from '../components/UpcomingAppointmentCard';
import { VitalCard } from '../components/VitalCard';
import { RecentActivityItem } from '../components/RecentActivityItem';
import { DocumentPlusIcon, CalendarDaysIcon } from '../components/Icons';
import type { Appointment, Vital, Activity, Page } from '../types';

interface DashboardPageProps {
  appointment?: Appointment;
  vitals: Vital[];
  activities: Activity[];
  setActivePage: (page: Page) => void;
  onStartCall: (appointment: Appointment) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ appointment, vitals, activities, setActivePage, onStartCall }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column */}
      <div className="lg:col-span-2 space-y-8">
        {appointment ? (
            <UpcomingAppointmentCard appointment={appointment} onStartCall={onStartCall} />
        ) : (
            <div className="bg-white text-gray-800 rounded-2xl p-8 shadow-md text-center">
                <h3 className="text-2xl font-bold mb-2">No Upcoming Appointments</h3>
                <p className="text-gray-600 mb-4">Book a new appointment to see it here.</p>
            </div>
        )}
        
        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Your Vitals</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {vitals.map(vital => (
              <VitalCard key={vital.name} vital={vital} />
            ))}
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="lg:col-span-1 space-y-8">
         <div className="bg-white p-6 rounded-2xl shadow-md">
           <h3 className="text-xl font-semibold text-gray-700 mb-4">Quick Actions</h3>
           <div className="space-y-3">
              <button 
                onClick={() => setActivePage('Book Appointment')}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300">
                <CalendarDaysIcon className="w-5 h-5" />
                Book New Appointment
              </button>
              <button 
                onClick={() => alert('Opening file upload dialog...')}
                className="w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-300">
                <DocumentPlusIcon className="w-5 h-5" />
                Upload Documents
              </button>
           </div>
         </div>

        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Recent Activity</h3>
          <ul className="space-y-4">
            {activities.map((activity, index) => (
              <RecentActivityItem key={index} activity={activity} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
