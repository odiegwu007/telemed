
import React, { useState, useRef, useEffect } from 'react';
import type { Appointment, Message, Attachment } from '../types';
import { MessageBubble } from './MessageBubble';
import { PaperclipIcon } from './Icons';

interface ConversationViewProps {
  appointment: Appointment;
  messages: Message[];
  sender: 'patient' | 'doctor';
  onSendMessage: (newMessage: Omit<Message, 'id' | 'created_at'>) => void;
}

export const ConversationView: React.FC<ConversationViewProps> = ({ appointment, messages, sender, onSendMessage }) => {
    const [text, setText] = useState('');
    const [attachment, setAttachment] = useState<Attachment | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [messages]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setAttachment({
                name: file.name,
                size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
            });
        }
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim() && !attachment) return;

        onSendMessage({
            appointment_id: appointment.id,
            sender_id: '', // This will be set by the backend/App.tsx
            text: text,
            attachment_name: attachment?.name,
            attachment_size: attachment?.size
        });

        setText('');
        setAttachment(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };
    
    const contactName = sender === 'patient' ? appointment.doctorName : appointment.patientName;
    const contactDetail = sender === 'patient' ? appointment.specialty : 'Patient';
    const placeholderText = sender === 'patient' ? "Describe your symptoms..." : "Type your message...";

    return (
    <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center gap-3">
            <img src={appointment.avatarUrl} alt={contactName} className="w-10 h-10 rounded-full object-cover" />
            <div>
                <p className="font-bold text-gray-800">{contactName}</p>
                <p className="text-sm text-gray-500">{contactDetail}</p>
            </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
            <div className="space-y-4">
                {messages.map(msg => (
                    <MessageBubble key={msg.id} message={msg} senderId={sender === 'patient' ? appointment.patientId! : appointment.doctorId!} />
                ))}
                <div ref={messagesEndRef} />
            </div>
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-gray-200">
            {attachment && (
                <div className="mb-2 p-2 bg-gray-100 rounded-md text-sm text-gray-700 flex justify-between items-center">
                    <span>Attached: {attachment.name} ({attachment.size})</span>
                    <button onClick={() => setAttachment(null)} className="font-bold text-red-500">&times;</button>
                </div>
            )}
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                />
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Attach file"
                >
                    <PaperclipIcon className="w-6 h-6" />
                </button>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={placeholderText}
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={1}
                />
                <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                    disabled={!text.trim() && !attachment}
                >
                    Send
                </button>
            </form>
        </div>
    </div>
  );
};
