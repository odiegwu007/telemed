
import React, { useState, useEffect, useRef } from 'react';
import { MicIcon, MicOffIcon, VideoIcon, VideoOffIcon, PhoneOffIcon } from './Icons';
import type { UserRole, Appointment } from '../types';
import { InCallDocForm } from './InCallDocForm';

interface VideoCallViewProps {
  localStream: MediaStream;
  remoteStream: MediaStream | null;
  onEndCall: () => void;
  userRole: UserRole;
  appointment: Appointment;
  onSaveNotes: (notes: string) => Promise<void>;
}

export const VideoCallView: React.FC<VideoCallViewProps> = ({ localStream, remoteStream, onEndCall, userRole, appointment, onSaveNotes }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  useEffect(() => {
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const toggleMute = () => {
    localStream.getAudioTracks().forEach(track => {
      track.enabled = !track.enabled;
    });
    setIsMuted(!isMuted);
  };

  const toggleCamera = () => {
    localStream.getVideoTracks().forEach(track => {
      track.enabled = !track.enabled;
    });
    setIsCameraOff(!isCameraOff);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center">
        <div className="relative w-full h-full max-w-6xl max-h-[90vh] bg-gray-900 rounded-lg shadow-2xl overflow-hidden flex">
            <div className="flex-grow relative">
                <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <video ref={localVideoRef} autoPlay playsInline muted className="absolute w-48 h-36 bottom-28 md:bottom-4 right-4 rounded-md border-2 border-gray-600" />

                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent flex justify-center items-center">
                    <div className="flex items-center space-x-4">
                        <button onClick={toggleMute} className={`p-3 rounded-full transition-colors ${isMuted ? 'bg-red-500 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'}`}>
                            {isMuted ? <MicOffIcon className="w-6 h-6" /> : <MicIcon className="w-6 h-6" />}
                        </button>
                        <button onClick={toggleCamera} className={`p-3 rounded-full transition-colors ${isCameraOff ? 'bg-red-500 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'}`}>
                            {isCameraOff ? <VideoOffIcon className="w-6 h-6" /> : <VideoIcon className="w-6 h-6" />}
                        </button>
                        <button onClick={onEndCall} className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors">
                            <PhoneOffIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
            {userRole === 'doctor' && (
                <div className="w-96 flex-shrink-0 bg-white h-full shadow-lg">
                    <InCallDocForm appointment={appointment} onSaveNotes={onSaveNotes} />
                </div>
            )}
        </div>
    </div>
  );
};
