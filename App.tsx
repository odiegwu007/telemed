
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { supabase, Profile } from './supabaseClient';
import type { Session } from '@supabase/supabase-js';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardPage } from './pages/DashboardPage';
import { DoctorDashboardPage } from './pages/DoctorDashboardPage';
import { AppointmentsPage } from './pages/AppointmentsPage';
import { BookAppointmentPage } from './pages/BookAppointmentPage';
import { MessagesPage } from './pages/MessagesPage';
import { DoctorAppointmentDetailsPage } from './pages/DoctorAppointmentDetailsPage';
import { PatientAppointmentDetailsPage } from './pages/PatientAppointmentDetailsPage';
import { PlaceholderPage } from './components/PlaceholderPage';
import { AuthPage } from './pages/AuthPage';
import { LaboratoryPage } from './pages/LaboratoryPage';
import { PrescriptionPage } from './pages/PrescriptionPage';
import { MedicalRecordsPage } from './pages/MedicalRecordsPage';
import { VideoCallView } from './components/VideoCallView';
import { IncomingCallModal } from './components/IncomingCallModal';
import { 
  SettingsIcon,
  HeartIcon,
  ChartBarIcon,
  BeakerIcon
} from './components/Icons';
import type { Appointment, Vital, Activity, Page, Message, UserRole, Attachment, CallState, Prescription, LabOrder, Notification, NewAppointmentDetails } from './types';

// Mock Data for Vitals & Activities (can be moved to DB later)
const vitals: Vital[] = [
  { name: "Heart Rate", value: "72", unit: "bpm", icon: <HeartIcon className="w-6 h-6 text-red-500" /> },
  { name: "Blood Pressure", value: "120/80", unit: "mmHg", icon: <ChartBarIcon className="w-6 h-6 text-blue-500" /> },
  { name: "Blood Sugar", value: "95", unit: "mg/dL", icon: <BeakerIcon className="w-6 h-6 text-purple-500" /> },
];
const recentActivities: Activity[] = [
  { description: "New prescription for Metformin available.", timestamp: "2 hours ago", type: "prescription" },
  { description: "Dr. Okoro sent you a message.", timestamp: "1 day ago", type: "message" },
  { description: "Lab results for 'Annual Blood Panel' are in.", timestamp: "3 days ago", type: "result" },
];

const STUN_SERVERS = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [activePage, setActivePage] = useState<Page>('Dashboard');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [labOrders, setLabOrders] = useState<LabOrder[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [doctors, setDoctors] = useState<Profile[]>([]);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);

  // Video Call State
  const [callState, setCallState] = useState<CallState>('idle');
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [incomingCallFrom, setIncomingCallFrom] = useState<Appointment | null>(null);
  const [activeCallAppointment, setActiveCallAppointment] = useState<Appointment | null>(null);
  
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const callStateRef = useRef(callState);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const activeCallAppointmentRef = useRef(activeCallAppointment);

  useEffect(() => {
    callStateRef.current = callState;
  }, [callState]);

  useEffect(() => {
    activeCallAppointmentRef.current = activeCallAppointment;
  }, [activeCallAppointment]);


  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      fetchProfileAndData();
    } else {
      setLoading(false);
    }
  }, [session]);

  const fetchAllData = useCallback(async (currentProfile: Profile) => {
    if (!currentProfile) return;
    const isPatient = currentProfile.role === 'patient';

    // Step 1: Fetch all primary data without joins
    const appointmentBaseQuery = supabase.from('appointments').select(`id, date, reason, patient_id, doctor_id`);
    const { data: appointmentData, error: appointmentError } = await (isPatient
      ? appointmentBaseQuery.eq('patient_id', currentProfile.id)
      : appointmentBaseQuery.eq('doctor_id', currentProfile.id));

    const queryCol = isPatient ? 'patient_id' : 'doctor_id';
    const { data: prescriptionsData, error: prescriptionsError } = await supabase.from('prescriptions').select(`*`).eq(queryCol, currentProfile.id);
    const { data: labOrdersData, error: labOrdersError } = await supabase.from('lab_orders').select(`*`).eq(queryCol, currentProfile.id);

    // --- Error Handling ---
    if (appointmentError) console.error('Error fetching appointments:', appointmentError.message);
    if (prescriptionsError) console.error('Error fetching prescriptions:', prescriptionsError.message);
    if (labOrdersError) console.error('Error fetching lab orders:', labOrdersError.message);

    // Step 2: Collect all unique profile IDs from all data sources
    const profileIds = new Set<string>();
    appointmentData?.forEach(a => {
      if (a.doctor_id) profileIds.add(a.doctor_id);
      if (a.patient_id) profileIds.add(a.patient_id);
    });
    prescriptionsData?.forEach(p => {
      if (p.doctor_id) profileIds.add(p.doctor_id);
      if (p.patient_id) profileIds.add(p.patient_id);
    });
    labOrdersData?.forEach(l => {
      if (l.doctor_id) profileIds.add(l.doctor_id);
      if (l.patient_id) profileIds.add(l.patient_id);
    });

    // Step 3: Fetch all required profiles in one go
    let profilesMap = new Map<string, Partial<Profile>>();
    if (profileIds.size > 0) {
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, specialty, avatar_url')
        .in('id', Array.from(profileIds));

      if (profilesError) {
        console.warn('Could not fetch all profiles, some data may be incomplete:', profilesError.message);
      } else if (profilesData) {
        profilesData.forEach(p => profilesMap.set(p.id, p));
      }
    }

    // Step 4: Process and set state for each data type
    // Appointments
    if (appointmentData) {
      const processedAppointments = appointmentData.map((a: any) => {
        const doctor = profilesMap.get(a.doctor_id);
        const patient = profilesMap.get(a.patient_id);
        if (!doctor) return null;
        return {
          id: a.id,
          doctorName: doctor.full_name || 'N/A',
          patientName: patient?.full_name || `Patient (${a.patient_id.slice(0, 8)})`,
          specialty: doctor.specialty || 'N/A',
          avatarUrl: isPatient ? (doctor.avatar_url || '') : (patient?.avatar_url || `https://xsgames.co/randomusers/assets/avatars/pixel/7.jpg`),
          date: a.date, reason: a.reason, notes: a.notes || '', patientId: a.patient_id, doctorId: a.doctor_id,
        };
      }).filter(Boolean);
      setAppointments(processedAppointments as Appointment[]);
      const appointmentIds = processedAppointments.map(a => a.id);
      if (appointmentIds.length > 0) {
        const { data: messagesData } = await supabase.from('messages').select('*').in('appointment_id', appointmentIds);
        setMessages((messagesData as Message[]) || []);
      } else { setMessages([]); }
    } else { setAppointments([]); setMessages([]); }

    // Prescriptions
    if (prescriptionsData) {
      const processedPrescriptions = prescriptionsData.map((p: any) => {
        const doctor = profilesMap.get(p.doctor_id);
        const patient = profilesMap.get(p.patient_id);
        if (!doctor || !patient) return null;
        return { ...p, doctorName: doctor.full_name, patientName: patient.full_name };
      }).filter(Boolean);
      setPrescriptions(processedPrescriptions as Prescription[]);
    } else { setPrescriptions([]); }

    // Lab Orders
    if (labOrdersData) {
      const processedLabOrders = labOrdersData.map((l: any) => {
        const doctor = profilesMap.get(l.doctor_id);
        const patient = profilesMap.get(l.patient_id);
        if (!patient) return null;
        return { ...l, doctorName: doctor?.full_name || 'Pending Review', patientName: patient.full_name };
      }).filter(Boolean);
      setLabOrders(processedLabOrders as LabOrder[]);
    } else { setLabOrders([]); }

    // --- Fetch notifications and doctors list (these are fine) ---
    const { data: notificationsData } = await supabase.from('notifications').select('*').eq('user_id', currentProfile.id).order('created_at', { ascending: false });
    setNotifications((notificationsData as Notification[]) || []);

    if (isPatient) {
      const { data: doctorsData, error: doctorsError } = await supabase.from('profiles').select('*').eq('role', 'doctor');
      if (doctorsError) console.error('Error fetching doctors:', doctorsError.message);
      else setDoctors(doctorsData || []);
    }
  }, []);

  useEffect(() => {
    if (!session?.user?.id || !profile) return;
    
    const channel = supabase.channel('realtime-changes');
    channelRef.current = channel;

    channel
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${session.user.id}` }, payload => {
        setNotifications(prev => {
          const newNotification = payload.new as Notification;
          return [newNotification, ...prev.filter(n => n.id !== newNotification.id)];
        });
        if (profile) fetchAllData(profile);
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, async (payload) => {
        const newMessage = payload.new as any;
        if (newMessage.sender_id !== session.user.id) {
          const { data } = await supabase.from('appointments').select('id').or(`patient_id.eq.${session.user.id},doctor_id.eq.${session.user.id}`);
          const userAppointmentIds = data?.map(a => a.id) || [];
          if (userAppointmentIds.includes(newMessage.appointment_id)) {
              setMessages(prev => [...prev, newMessage]);
          }
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, () => {
        if (profile) fetchAllData(profile);
      })
      .on('broadcast', { event: 'video-call' }, ({ payload }) => {
          if (callStateRef.current === 'idle' && profile.role === 'patient' && payload.patientId === profile.id) {
              const appointmentForCall = appointments.find(a => a.id === payload.appointmentId);
              setIncomingCallFrom(appointmentForCall || {
                  id: payload.appointmentId,
                  doctorName: payload.doctorName,
                  specialty: payload.specialty,
                  doctorId: payload.doctorId,
              } as Appointment);
              setCallState('incoming');
          }
      })
      .on('broadcast', { event: 'webrtc-offer' }, ({ payload }) => {
        if (profile?.id === payload.patientId && callStateRef.current === 'incoming') {
          setIncomingCallFrom(prev => (prev ? { ...prev, offer: payload.offer } : null));
        }
      })
      .on('broadcast', { event: 'webrtc-answer' }, async ({ payload }) => {
        if (profile?.id === payload.doctorId && peerConnectionRef.current) {
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(payload.answer));
        }
      })
      .on('broadcast', { event: 'webrtc-ice-candidate' }, async ({ payload }) => {
        if (profile?.id === payload.targetId && peerConnectionRef.current) {
          try {
            await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(payload.candidate));
          } catch (e) {
            console.error('Error adding received ice candidate', e);
          }
        }
      })
      .on('broadcast', { event: 'end-call' }, ({ payload }) => {
          if (callStateRef.current === 'active' && activeCallAppointmentRef.current?.id === payload.appointmentId) {
              handleEndCall(false); // Don't broadcast again
          }
      })
      .subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [session, profile, fetchAllData, appointments, localStream]);

  const fetchProfileAndData = useCallback(async () => {
    if (!session?.user) return;
    setLoading(true);
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      await supabase.auth.signOut();
    } else {
      setProfile(profileData);
      await fetchAllData(profileData);
    }
    setLoading(false);
  }, [session, fetchAllData]);
  
    const handleLogout = async () => {
        await supabase.auth.signOut();
        setProfile(null);
        setSession(null);
        setActivePage('Dashboard');
        setSelectedAppointmentId(null);
        setAppointments([]);
        setMessages([]);
        setPrescriptions([]);
        setLabOrders([]);
        setNotifications([]);
        setDoctors([]);
    };

    const handleBookAppointment = async (details: { newAppointment: NewAppointmentDetails; attachment: Attachment | null }) => {
       if (!profile) return;
       const { data, error } = await supabase.from('appointments').insert({
           patient_id: profile.id,
           doctor_id: details.newAppointment.doctorId,
           date: details.newAppointment.date,
           reason: details.newAppointment.reason,
       }).select().single();
       if (error) console.error("Error booking appointment", error);
       else if (data) {
           if (details.attachment) { /* ... */ }
           if (profile) {
               await supabase.from('notifications').insert({ user_id: data.doctor_id, message: `New appointment with ${profile.full_name}.` });
               fetchAllData(profile);
           }
           setActivePage('Appointments');
       }
    };
  
    const handleSendMessage = async (newMessage: Omit<Message, 'id' | 'created_at'>) => {
        if (!session?.user?.id) return;
        const { data, error } = await supabase.from('messages').insert({ ...newMessage, sender_id: session.user.id }).select().single();
        if (error) console.error("Error sending message", error);
        else if (data) setMessages(prev => [...prev, data]);
    };

    const handlePrescribe = async (prescriptionData: any, appointment: Appointment) => {
        if (!appointment.patientId || !appointment.doctorId) return;
        const { data, error } = await supabase.from('prescriptions').insert({ ...prescriptionData, patient_id: appointment.patientId, doctor_id: appointment.doctorId, appointment_id: appointment.id, status: 'Active', date_issued: new Date().toISOString() }).select().single();
        if (error) console.error('Error prescribing:', error);
        else if (data) setPrescriptions(prev => [...prev, { ...(data as Prescription), doctorName: appointment.doctorName, patientName: appointment.patientName }]);
    };

    const handleOrderLab = async (labOrderData: any, appointment: Appointment) => {
        if (!appointment.patientId || !appointment.doctorId) return;
        const { data, error } = await supabase.from('lab_orders').insert({ ...labOrderData, patient_id: appointment.patientId, doctor_id: appointment.doctorId, appointment_id: appointment.id, status: 'Ordered', date_ordered: new Date().toISOString() }).select().single();
        if (error) console.error('Error ordering lab:', error);
        else if (data) setLabOrders(prev => [...prev, { ...(data as LabOrder), doctorName: appointment.doctorName, patientName: appointment.patientName }]);
    };
    
    const handleRequestLabTest = async (data: { testName: string; reason: string; }) => {
        if (!profile) return;
        const { error } = await supabase.from('lab_orders').insert({ test_name: data.testName, reason: data.reason, patient_id: profile.id, status: 'Ordered' });
        if (error) console.error('Error requesting lab test:', error);
        else fetchAllData(profile);
    };

    const handleSelectAppointment = (appointmentId: number) => {
        setSelectedAppointmentId(appointmentId);
        setActivePage('Appointment Details');
    };

    const handleBackToAppointments = () => {
        setSelectedAppointmentId(null);
        setActivePage('Appointments');
    }

    const handleMarkNotificationsAsRead = async () => {
        const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
        if (unreadIds.length === 0) return;
        const { error } = await supabase.from('notifications').update({ is_read: true }).in('id', unreadIds);
        if (error) console.error("Error marking notifications as read", error);
        else setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    };

    const handleStartCall = async (appointment: Appointment) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setLocalStream(stream);
            setActiveCallAppointment(appointment);

            peerConnectionRef.current = new RTCPeerConnection(STUN_SERVERS);
            stream.getTracks().forEach(track => peerConnectionRef.current?.addTrack(track, stream));

            peerConnectionRef.current.onicecandidate = event => {
                if (event.candidate && channelRef.current) {
                    channelRef.current.send({ type: 'broadcast', event: 'webrtc-ice-candidate', payload: { targetId: appointment.patientId, candidate: event.candidate } });
                }
            };
            peerConnectionRef.current.ontrack = event => setRemoteStream(event.streams[0]);

            const offer = await peerConnectionRef.current.createOffer();
            await peerConnectionRef.current.setLocalDescription(offer);

            if (profile?.role === 'doctor' && channelRef.current) {
                await channelRef.current.send({ type: 'broadcast', event: 'video-call', payload: { appointmentId: appointment.id, patientId: appointment.patientId, doctorId: profile.id, doctorName: appointment.doctorName, specialty: appointment.specialty } });
                await channelRef.current.send({ type: 'broadcast', event: 'webrtc-offer', payload: { patientId: appointment.patientId, doctorId: profile.id, offer } });
            }
            setCallState('active');
        } catch (error) {
            console.error("Error accessing media devices:", error);
            alert("Could not start video call. Please grant camera/mic permissions.");
        }
    };
    
    const handleAcceptCall = async () => {
        if (!incomingCallFrom || !incomingCallFrom.offer || !profile) return;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setLocalStream(stream);
            
            peerConnectionRef.current = new RTCPeerConnection(STUN_SERVERS);
            stream.getTracks().forEach(track => peerConnectionRef.current?.addTrack(track, stream));
            
            peerConnectionRef.current.onicecandidate = event => {
                if (event.candidate && channelRef.current) {
                    channelRef.current.send({ type: 'broadcast', event: 'webrtc-ice-candidate', payload: { targetId: incomingCallFrom.doctorId, candidate: event.candidate } });
                }
            };
            peerConnectionRef.current.ontrack = event => setRemoteStream(event.streams[0]);
            
            await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(incomingCallFrom.offer));
            const answer = await peerConnectionRef.current.createAnswer();
            await peerConnectionRef.current.setLocalDescription(answer);
            
            if (channelRef.current) {
                await channelRef.current.send({ type: 'broadcast', event: 'webrtc-answer', payload: { doctorId: incomingCallFrom.doctorId, patientId: profile.id, answer } });
            }

            setActiveCallAppointment(incomingCallFrom);
            setCallState('active');
            setIncomingCallFrom(null);
        } catch (error) {
            console.error("Error accepting call:", error);
            alert("Could not start video call. Please grant camera/mic permissions.");
            setCallState('idle');
            setIncomingCallFrom(null);
        }
    };
    
    const handleDeclineCall = () => {
        setCallState('idle');
        setIncomingCallFrom(null);
    };

    const handleEndCall = async (broadcast = true) => {
        if (broadcast && channelRef.current && activeCallAppointment) {
            await channelRef.current.send({ type: 'broadcast', event: 'end-call', payload: { appointmentId: activeCallAppointment.id } });
        }
        peerConnectionRef.current?.close();
        peerConnectionRef.current = null;
        localStream?.getTracks().forEach(track => track.stop());
        setLocalStream(null);
        setRemoteStream(null);
        setCallState('idle');
        setIncomingCallFrom(null);
        setActiveCallAppointment(null);
    };

    const handleSaveCallNotes = async (notes: string) => {
        if (!activeCallAppointment) return;
        const { error } = await supabase.from('appointments').update({ notes }).eq('id', activeCallAppointment.id);
        if (error) {
            console.error("Error saving notes:", error);
            alert("Failed to save notes.");
        } else {
            alert("Notes saved successfully!");
            setAppointments(prev => prev.map(app => app.id === activeCallAppointment.id ? { ...app, notes } : app));
        }
    };

  const renderPage = () => {
    switch (activePage) {
      case 'Dashboard':
        return profile?.role === 'patient' 
            ? <DashboardPage appointment={appointments.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0]} vitals={vitals} activities={recentActivities} setActivePage={setActivePage} onStartCall={handleStartCall}/> 
            : <DoctorDashboardPage appointments={appointments} onSelectAppointment={handleSelectAppointment} />;
      case 'Appointments':
        return <AppointmentsPage appointments={appointments} userRole={profile?.role} setActivePage={setActivePage} onSelectAppointment={handleSelectAppointment} />;
      case 'Book Appointment':
        return <BookAppointmentPage doctors={doctors} onBookAppointment={handleBookAppointment} />;
      case 'Messages':
        return <MessagesPage appointments={appointments} messages={messages} onSendMessage={handleSendMessage} />;
      case 'Laboratory':
        return <LaboratoryPage labOrders={labOrders} onRequestTest={handleRequestLabTest} />;
      case 'Prescription':
        return <PrescriptionPage prescriptions={prescriptions} />;
      case 'Medical Records':
        return <MedicalRecordsPage prescriptions={prescriptions} labOrders={labOrders} />;
      case 'Appointment Details':
          const selectedAppointment = appointments.find(app => app.id === selectedAppointmentId);
          if (!selectedAppointment) {
              setActivePage('Appointments');
              return null;
          }
          if (profile?.role === 'doctor') {
              return <DoctorAppointmentDetailsPage
                  appointment={selectedAppointment}
                  messages={messages.filter(msg => msg.appointment_id === selectedAppointmentId)}
                  prescriptions={prescriptions.filter(p => p.appointment_id === selectedAppointmentId)}
                  labOrders={labOrders.filter(l => l.appointment_id === selectedAppointmentId)}
                  onSendMessage={handleSendMessage}
                  onBack={handleBackToAppointments}
                  onStartCall={handleStartCall}
                  onPrescribe={(data) => handlePrescribe(data, selectedAppointment)}
                  onOrderLab={(data) => handleOrderLab(data, selectedAppointment)}
              />
          }
           if (profile?.role === 'patient') {
              return <PatientAppointmentDetailsPage
                  appointment={selectedAppointment}
                  messages={messages.filter(msg => msg.appointment_id === selectedAppointmentId)}
                  prescriptions={prescriptions.filter(p => p.appointment_id === selectedAppointmentId)}
                  labOrders={labOrders.filter(l => l.appointment_id === selectedAppointmentId)}
                  onSendMessage={handleSendMessage}
                  onBack={handleBackToAppointments}
              />
          }
          return null;
      default:
        return <PlaceholderPage title={activePage} icon={<SettingsIcon />} />;
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-gray-100 text-gray-700">Loading Application...</div>;
  }
  
  if (!session || !profile) {
    return <AuthPage />;
  }

  return (
    <>
      <div className="flex h-screen bg-gray-100 text-gray-800">
        <Sidebar activePage={activePage} setActivePage={setActivePage} userRole={profile.role} onLogout={handleLogout} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            patientName={profile.full_name || ''} 
            notifications={notifications}
            onMarkNotificationsAsRead={handleMarkNotificationsAsRead}
          />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6 md:p-8">
            <div className="container mx-auto max-w-7xl h-full">
              {activePage !== 'Messages' && activePage !== 'Appointment Details' && (
                <h2 className="text-2xl font-semibold text-gray-700 mb-6">
                  {activePage === 'Dashboard' ? `Your ${activePage}` : activePage}
                </h2>
              )}
              {renderPage()}
            </div>
          </main>
        </div>
      </div>
      {callState === 'active' && localStream && activeCallAppointment && (
        <VideoCallView 
            localStream={localStream}
            remoteStream={remoteStream}
            onEndCall={() => handleEndCall(true)}
            userRole={profile.role}
            appointment={activeCallAppointment}
            onSaveNotes={handleSaveCallNotes}
        />
      )}
      {callState === 'incoming' && incomingCallFrom && (
        <IncomingCallModal 
            caller={{ name: incomingCallFrom.doctorName, specialty: incomingCallFrom.specialty }}
            onAccept={handleAcceptCall}
            onDecline={handleDeclineCall}
        />
      )}
    </>
  );
};

export default App;
