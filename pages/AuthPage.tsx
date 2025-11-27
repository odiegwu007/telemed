
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { HeartPulseIcon } from '../components/Icons';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
            avatar_url: `https://xsgames.co/randomusers/assets/avatars/${role === 'patient' ? 'female' : 'male'}/46.jpg` // Default avatar
          }
        }
      });
      if (error) {
        setError(error.message);
      } else {
        setIsLogin(true);
        setMessage("Account created successfully. Please sign in.");
      }
    }
    setLoading(false);
  };

  const inputStyles = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg">
        <div className="text-center">
            <div className="flex items-center justify-center mb-4">
                <HeartPulseIcon className="w-12 h-12 text-blue-600" />
                <h1 className="text-4xl font-bold ml-2 text-gray-800">TeleHealth</h1>
            </div>
            <h2 className="text-2xl font-semibold text-gray-600">{isLogin ? 'Welcome Back' : 'Create Your Account'}</h2>
        </div>
        
        <form className="space-y-6" onSubmit={handleAuth}>
          {!isLogin && (
            <>
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required className={inputStyles} />
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-700">I am a...</label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <button type="button" onClick={() => setRole('patient')} className={`px-4 py-2 border rounded-l-md w-1/2 ${role === 'patient' ? 'bg-blue-600 text-white' : 'bg-white'}`}>Patient</button>
                  <button type="button" onClick={() => setRole('doctor')} className={`px-4 py-2 border rounded-r-md w-1/2 ${role === 'doctor' ? 'bg-blue-600 text-white' : 'bg-white'}`}>Doctor</button>
                </div>
              </div>
            </>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputStyles} />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={inputStyles} />
          </div>

          {message && <p className="text-sm text-green-600 text-center">{message}</p>}
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          
          <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300">
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div className="text-center">
            <button onClick={() => { setIsLogin(!isLogin); setError(null); setMessage(null); }} className="text-sm font-medium text-blue-600 hover:text-blue-500">
                {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
            </button>
        </div>
      </div>
    </div>
  );
};
