
import React from 'react';
import type { Message } from '../types';
import { FileTextIcon } from './Icons';

interface MessageBubbleProps {
  message: Message;
  senderId: string;
}

const formatTimestamp = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, senderId }) => {
  const isSender = message.sender_id === senderId;

  return (
    <div className={`flex gap-3 ${isSender ? 'justify-end' : 'justify-start'}`}>
      <div className={`w-3/4 flex flex-col ${isSender ? 'items-end' : 'items-start'}`}>
        <div
          className={`p-3 rounded-2xl ${
            isSender ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'
          }`}
        >
          {message.text && <p>{message.text}</p>}
          {message.attachment_name && (
            <div className={`flex items-center gap-2 mt-2 p-2 rounded-lg ${isSender ? 'bg-blue-500' : 'bg-gray-300'}`}>
              <FileTextIcon className="w-5 h-5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-semibold">{message.attachment_name}</p>
                {message.attachment_size && <p className={isSender ? 'text-blue-100' : 'text-gray-600'}>{message.attachment_size}</p>}
              </div>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-1 px-1">{formatTimestamp(message.created_at)}</p>
      </div>
    </div>
  );
};
