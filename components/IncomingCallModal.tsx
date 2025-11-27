
import React from 'react';
import { PhoneOffIcon, VideoIcon } from './Icons';

interface IncomingCallModalProps {
  caller: { name: string; specialty: string };
  onAccept: () => void;
  onDecline: () => void;
}

export const IncomingCallModal: React.FC<IncomingCallModalProps> = ({ caller, onAccept, onDecline }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center sm:justify-end">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-2xl p-6">
        <div className="text-center">
          <p className="text-sm text-gray-500">Incoming Call from</p>
          <h3 className="text-xl font-bold text-gray-900 mt-1">{caller.name}</h3>
          <p className="text-gray-600">{caller.specialty}</p>
        </div>
        <div className="flex justify-center items-center space-x-6 mt-6">
          <button onClick={onDecline} className="flex flex-col items-center text-red-600 hover:text-red-800">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
              <PhoneOffIcon className="w-7 h-7" />
            </div>
            <span className="mt-2 text-sm font-medium">Decline</span>
          </button>
          <button onClick={onAccept} className="flex flex-col items-center text-green-600 hover:text-green-800">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
              <VideoIcon className="w-7 h-7" />
            </div>
            <span className="mt-2 text-sm font-medium">Accept</span>
          </button>
        </div>
      </div>
    </div>
  );
};
