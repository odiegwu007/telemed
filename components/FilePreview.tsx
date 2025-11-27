
import React from 'react';
import type { Attachment } from '../types';
import { FileTextIcon } from './Icons';

interface FilePreviewProps {
  file: Attachment;
}

export const FilePreview: React.FC<FilePreviewProps> = ({ file }) => {
  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-6 text-center">
        File Preview
      </h3>
      <div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg p-10 min-h-[300px]">
        <FileTextIcon className="w-24 h-24 text-gray-400 mb-4" />
        <p className="text-base font-semibold text-gray-900 break-all text-center">
          {file.name}
        </p>
        <p className="text-sm text-gray-500">{file.size}</p>
      </div>
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-400">
            This is a simulated preview. In a real application, the document would be rendered here.
        </p>
      </div>
    </div>
  );
};
