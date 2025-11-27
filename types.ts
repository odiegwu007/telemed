
import React from 'react';

export interface Appointment {
  id: number;
  doctorName: string;
  patientName: string;
  specialty: string;
  avatarUrl: string;
  date: string;
  reason: string;
  patientId?: string;
  doctorId?: string;
  notes?: string;
  offer?: RTCSessionDescriptionInit;
}

export interface NewAppointmentDetails {
  doctorId: string;
  date: string;
  reason: string;
}

export interface Vital {
  name: string;
  value: string;
  unit: string;
  icon: React.ReactNode;
}

export interface Activity {
  description: string;
  timestamp: string;
  type: 'prescription' | 'message' | 'result';
}

export interface Attachment {
    name: string;
    size: string;
}

export interface Message {
    id: number;
    appointment_id: number;
    sender_id: string;
    text: string;
    created_at: string;
    attachment_name?: string;
    attachment_size?: string;
}

export interface DoctorContact {
    id: number;
    name: string;
    specialty: string;
    avatarUrl: string;
}

export type PrescriptionStatus = 'Active' | 'Filled' | 'Expired';

export interface Prescription {
  id: number;
  patient_id: string;
  doctor_id: string;
  medication: string;
  dosage: string;
  frequency: string;
  date_issued: string;
  status: PrescriptionStatus;
  appointment_id?: number;
  doctorName?: string;
  patientName?: string;
}

export type LabOrderStatus = 'Ordered' | 'Completed' | 'Results In';

export interface LabOrder {
  id: number;
  patient_id: string;
  doctor_id: string;
  test_name: string;
  date_ordered: string;
  status: LabOrderStatus;
  reason?: string;
  results?: string;
  appointment_id?: number;
  doctorName?: string;
  patientName?: string;
}

export interface AvailableLabTest {
    name: string;
    instructions: string;
}

export interface Notification {
  id: number;
  message: string;
  created_at: string;
  is_read: boolean;
  user_id: string;
}


export type Page = 'Dashboard' | 'Appointments' | 'Messages' | 'Laboratory' | 'Prescription' | 'Medical Records' | 'Settings' | 'Book Appointment' | 'Appointment Details';

export type UserRole = 'patient' | 'doctor' | null;

export type CallState = 'idle' | 'incoming' | 'active';
