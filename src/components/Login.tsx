import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, Phone, Lock, ChevronRight } from 'lucide-react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [phoneNumber, setPhoneNumber] = useState('+998 ');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [name, setName] = useState('');

  const formatPhoneNumber = (value: string) => {
    // Basic formatting for +998 (XX) XXX-XX-XX
    const clean = value.replace(/\D/g, '');
    if (clean.length === 0) return '+998 ';
    
    let formatted = '+998 ';
    const numbers = clean.startsWith('998') ? clean.slice(3) : clean;
    
    if (numbers.length > 0) {
      formatted += '(' + numbers.substring(0, 2);
    }
    if (numbers.length > 2) {
      formatted += ') ' + numbers.substring(2, 5);
    }
    if (numbers.length > 5) {
      formatted += '-' + numbers.substring(5, 7);
    }
    if (numbers.length > 7) {
      formatted += '-' + numbers.substring(7, 9);
    }
    return formatted;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length < 5) return; // Keep +998
    setPhoneNumber(formatPhoneNumber(value));
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length >= 10) {
      setStep('code');
    }
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length === 6 && name.trim()) {
      onLogin({
        id: Math.random().toString(36).substr(2, 9),
        phoneNumber,
        name: name.trim()
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0f0f0f] relative overflow-hidden">
      {/* Background radial gradient overlay for subtle texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }}></div>
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[400px] bg-[#1a1a1a] p-10 rounded-[40px] border border-white/5 shadow-2xl relative z-10"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-blue-500 rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-blue-500/30">
             <Send className="text-white w-10 h-10 -mr-1" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#f5f5f5]">Mx Gramm</h1>
          <p className="text-gray-500 text-sm mt-2">Secure like Telegram.</p>
        </div>

        {step === 'phone' ? (
          <form onSubmit={handlePhoneSubmit} className="space-y-6">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-3 block px-1">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-16 flex items-center pointer-events-none">
                  <span className="hidden">Placeholder</span>
                </div>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white font-medium">
                  +998
                </div>
                <input
                  type="text"
                  value={phoneNumber.replace('+998 ', '')}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPhoneNumber(formatPhoneNumber(val));
                  }}
                  className="w-full bg-[#262626] border border-white/5 rounded-2xl py-4 pl-16 pr-4 text-lg font-medium text-white outline-none focus:border-blue-500/50 transition-colors"
                  placeholder="(90) 123-45-67"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center group"
            >
              Continue
              <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform w-5 h-5" />
            </button>
            <p className="text-center text-[11px] text-gray-600 px-6">
              By tapping Continue, Mx Gramm will send an SMS to your number.
            </p>
          </form>
        ) : (
          <form onSubmit={handleCodeSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-3 block px-1">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#262626] border border-white/5 rounded-2xl py-4 px-4 text-white outline-none focus:border-blue-500/50 transition-colors mb-6"
                placeholder="Sherzod..."
                autoFocus
              />

              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-3 block px-1">
                Verification Code
              </label>
              <input
                type="text"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-[#262626] border border-white/5 rounded-2xl py-4 px-4 text-2xl font-mono tracking-[0.5em] text-center text-white outline-none focus:border-blue-500/50 transition-colors"
                placeholder="000000"
              />
            </motion.div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-2xl transition-all"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={code.length !== 6 || !name.trim()}
                className="flex-[2] bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/20 transition-all"
              >
                Enter Chat
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
