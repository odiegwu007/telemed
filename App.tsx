
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

  useEffect(() => {
    if (!session?.user?.id) return;

    const channels = supabase
      .channel('realtime-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${session.user.id}` }, payload => {
        setNotifications(prev => {
          const newNotification = payload.new as Notification;
          return [newNotification, ...prev.filter(n => n.id !== newNotification.id)];
        });
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, async (payload) => {
        const newMessage = payload.new as any;
        const { data } = await supabase.from('appointments').select('id').or(`patient_id.eq.${session.user.id},doctor_id.eq.${session.user.id}`);
        const userAppointmentIds = data?.map(a => a.id) || [];
        if (userAppointmentIds.includes(newMessage.appointment_id)) {
            setMessages(prev => [...prev, newMessage]);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channels);
    };
  }, [session]);

  const fetchProfileAndData = async () => {
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
  };

  const fetchAllData = async (currentProfile: Profile) => {
      if (!currentProfile) return;
      const isPatient = currentProfile.role === 'patient';
      
      const appointmentQuery = supabase.from('appointments').select(`
        id, date, reason,
        doctor:doctor_id ( id, full_name, specialty, avatar_url ),
        patient:patient_id ( id, full_name, avatar_url )
      `);
      const { data: appointmentData, error: appointmentError } = await (isPatient 
        ? appointmentQuery.eq('patient_id', currentProfile.id)
        : appointmentQuery.eq('doctor_id', currentProfile.id));

      if (appointmentError) console.error('Error fetching appointments:', appointmentError);
      else if (appointmentData) {
        setAppointments(appointmentData.map((a: any) => ({
          id: a.id,
          doctorName: a.doctor.full_name,
          patientName: a.patient.full_name,
          specialty: a.doctor.specialty,
          avatarUrl: isPatient ? a.doctor.avatar_url : a.patient.avatar_url,
          date: a.date,
          reason: a.reason,
          patientId: a.patient.id,
          doctorId: a.doctor.id
        })));

        const appointmentIds = appointmentData.map(a => a.id);
        if (appointmentIds.length > 0) {
            const { data: messagesData } = await supabase.from('messages').select('*').in('appointment_id', appointmentIds);
            setMessages((messagesData as Message[]) || []);
        }
      }
      
      const presQueryCol = isPatient ? 'patient_id' : 'doctor_id';
      const { data: prescriptionsData } = await supabase.from('prescriptions').select(`*, doctor:doctor_id(full_name), patient:patient_id(full_name)`).eq(presQueryCol, currentProfile.id);
      setPrescriptions(prescriptionsData?.map((p: any) => ({...p, doctorName: p.doctor.full_name, patientName: p.patient.full_name})) || []);
      
      const labQueryCol = isPatient ? 'patient_id' : 'doctor_id';
      const { data: labOrdersData } = await supabase.from('lab_orders').select(`*, doctor:doctor_id(full_name), patient:patient_id(full_name)`).eq(labQueryCol, currentProfile.id);
      setLabOrders(labOrdersData?.map((l: any) => ({...l, doctorName: l.doctor?.full_name || 'Pending Review', patientName: l.patient.full_name})) || []);
      
      const { data: notificationsData } = await supabase.from('notifications').select('*').eq('user_id', currentProfile.id).order('created_at', { ascending: false });
      setNotifications((notificationsData as Notification[]) || []);

      if (isPatient) {
        const { data: doctorsData, error: doctorsError } = await supabase.from('profiles').select('*').eq('role', 'doctor');
        if (doctorsError) console.error('Error fetching doctors:', doctorsError);
        else setDoctors(doctorsData || []);
      }
  };
  
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

       if (error) {
            console.error("Error booking appointment", error);
       } else {
           if (details.attachment && data) {
               await supabase.from('messages').insert({
                   sender_id: profile.id,
                   appointment_id: data.id,
                   text: "Please find the attached document for my upcoming appointment.",
                   attachment_name: details.attachment.name,
                   attachment_size: details.attachment.size,
               });
           }
           fetchProfileAndData();
           setActivePage('Appointments');
       }
    };
  
    const handleSendMessage = async (newMessage: Omit<Message, 'id' | 'created_at'>) => {
        const { error } = await supabase.from('messages').insert({ ...newMessage, sender_id: session?.user.id });
        if(error) console.error("Error sending message", error);
    };

    const handlePrescribe = async (prescriptionData: any, patientId: string, doctorId: string, appointmentId: number) => {
        const { error } = await supabase.from('prescriptions').insert({
            ...prescriptionData,
            patient_id: patientId,
            doctor_id: doctorId,
            appointment_id: appointmentId,
            status: 'Active',
        });
        if (error) console.error('Error prescribing:', error);
        else fetchProfileAndData();
    };

    const handleOrderLab = async (labOrderData: any, patientId: string, doctorId: string, appointmentId: number) => {
        const { error } = await supabase.from('lab_orders').insert({
            ...labOrderData,
            patient_id: patientId,
            doctor_id: doctorId,
            appointment_id: appointmentId,
            status: 'Ordered',
        });
        if (error) console.error('Error ordering lab:', error);
        else fetchProfileAndData();
    };
    
    const handleRequestLabTest = async (data: { testName: string; reason: string; }) => {
        if (!profile) return;
        const { error } = await supabase.from('lab_orders').insert({
            test_name: data.testName,
            reason: data.reason,
            patient_id: profile.id,
            status: 'Ordered',
        });
        if (error) console.error('Error requesting lab test:', error);
        else fetchProfileAndData();
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
            // In a real app, you'd use a signaling server. For this demo, we simulate
            // the remote stream with the local one to demonstrate the UI.
            setRemoteStream(stream);
            setCallState('active');
        } catch (error) {
            console.error("Error accessing media devices:", error);
            alert("Could not start video call. Please ensure you have granted camera and microphone permissions.");
        }
    };

    const handleEndCall = () => {
        localStream?.getTracks().forEach(track => track.stop());
        setLocalStream(null);
        setRemoteStream(null);
        setCallState('idle');
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
                  onPrescribe={(data) => handlePrescribe(data, selectedAppointment.patientId!, selectedAppointment.doctorId!, selectedAppointment.id)}
                  onOrderLab={(data) => handleOrderLab(data, selectedAppointment.patientId!, selectedAppointment.doctorId!, selectedAppointment.id)}
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
      {callState === 'active' && localStream && (
        <VideoCallView 
            localStream={localStream}
            remoteStream={remoteStream}
            onEndCall={handleEndCall}
        />
      )}
    </>
  );
};

export default App;
