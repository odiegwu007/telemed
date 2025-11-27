
import React, { useState } from 'react';
import { setSupabaseCredentials } from '../supabaseClient';
import { HeartPulseIcon } from './Icons';

interface SupabaseSetupProps {
  onConfigured: () => void;
}

export const SupabaseSetup: React.FC<SupabaseSetupProps> = ({ onConfigured }) => {
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!url.trim() || !anonKey.trim()) {
      setError('Both URL and Anon Key are required.');
      return;
    }
    if (!url.startsWith('https://')) {
        setError('The URL must start with "https://".');
        return;
    }

    setSupabaseCredentials(url, anonKey);
    onConfigured();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-8 space-y-8 bg-white rounded-2xl shadow-lg">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <HeartPulseIcon className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl font-bold ml-2 text-gray-800">TeleHealth</h1>
          </div>
          <h2 className="text-2xl font-semibold text-gray-600">Backend Configuration</h2>
          <p className="mt-2 text-sm text-gray-500">Please enter your Supabase project details to connect the application.</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="supabaseUrl" className="block text-sm font-medium text-gray-700">Supabase Project URL</label>
            <input 
              id="supabaseUrl" 
              type="text" 
              value={url} 
              onChange={(e) => setUrl(e.target.value)} 
              required 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="https://your-project-ref.supabase.co" 
            />
          </div>
          <div>
            <label htmlFor="anonKey" className="block text-sm font-medium text-gray-700">Supabase Anon (Public) Key</label>
            <textarea 
              id="anonKey" 
              value={anonKey} 
              onChange={(e) => setAnonKey(e.target.value)} 
              required 
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            />
          </div>
          
          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-md">
            You can find these values in your Supabase project dashboard under <span className="font-semibold">Project Settings &gt; API</span>.
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          
          <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Save and Connect
          </button>
        </form>
      </div>
    </div>
  );
};
