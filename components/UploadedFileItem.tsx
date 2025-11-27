
import React from 'react';
import type { Attachment } from '../types';
import { FileTextIcon, EyeIcon } from './Icons';

interface UploadedFileItemProps {
  file: Attachment & { id: number };
  onViewDetails: () => void;
}

export const UploadedFileItem: React.FC<UploadedFileItemProps> = ({ file, onViewDetails }) => {
  return (
    <li>
      <button 
        onClick={onViewDetails}
        className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
      >
          <div className="flex items-center gap-3 text-left">
              <FileTextIcon className="w-6 h-6 text-gray-500 flex-shrink-0" />
              <div>
                  <p className="text-sm font-medium text-gray-800">{file.name}</p>
                  <p className="text-xs text-gray-500">{file.size}</p>
              </div>
          </div>
          <div className="p-2 text-gray-500 flex items-center gap-1 text-xs font-semibold">
              <EyeIcon className="w-5 h-5" />
              <span>View</span>
          </div>
      </button>
    </li>
  );
};
