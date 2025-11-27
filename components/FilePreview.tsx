
import React from 'react';
import type { Attachment } from '../types';
import { FileTextIcon, DownloadIcon } from './Icons';

interface FilePreviewProps {
  file: Attachment;
}

export const FilePreview: React.FC<FilePreviewProps> = ({ file }) => {
  const handleDownload = () => {
    // In a real app, this would trigger a download from a URL.
    alert(`Simulating download for: ${file.name}`);
  };

  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-6 text-center">
        Document Details
      </h3>
      <div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg p-10 min-h-[300px]">
        <FileTextIcon className="w-24 h-24 text-gray-400 mb-4" />
        <p className="text-base font-semibold text-gray-900 break-all text-center">
          {file.name}
        </p>
        <p className="text-sm text-gray-500">{file.size}</p>
        <p className="text-xs text-gray-400 mt-4 text-center">
            PDF/Image preview is not available in this demo.
        </p>
      </div>
      <div className="mt-6 text-center">
        <button 
          onClick={handleDownload}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300"
        >
          <DownloadIcon className="w-5 h-5" />
          Download File
        </button>
      </div>
    </div>
  );
};
