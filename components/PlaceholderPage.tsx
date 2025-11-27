
import React from 'react';

interface PlaceholderPageProps {
  title: string;
  icon: React.ReactNode;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, icon }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center bg-white rounded-2xl shadow-md p-8 min-h-[400px]">
        <div className="bg-gray-100 p-4 rounded-full mb-4">
            {icon}
        </div>
        <h2 className="text-2xl font-bold text-gray-700">{title}</h2>
        <p className="mt-2 text-gray-500">This feature is currently under development. Check back soon!</p>
    </div>
  );
};
