
'use client';

import React, { useState } from 'react';
import { X, Calendar, Clock, ShieldCheck, CreditCard, ChevronRight, Zap } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  providerName: string;
  pricePerHour: number;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, providerName, pricePerHour }) => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  if (!isOpen) return null;

  const dates = [
    { day: 'Mon', date: '18', full: '2024-03-18' },
    { day: 'Tue', date: '19', full: '2024-03-19' },
    { day: 'Wed', date: '20', full: '2024-03-20' },
    { day: 'Thu', date: '21', full: '2024-03-21' },
    { day: 'Fri', date: '22', full: '2024-03-22' },
  ];

  const slots = ['08:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM', '06:00 PM'];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-xl bg-white dark:bg-gray-800 rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-8 border-b dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-900/50">
          <div>
            <h3 className="text-2xl font-black dark:text-white tracking-tight">Book {providerName}</h3>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-1">Step {step} of 2</p>
          </div>
          <button onClick={onClose} className="p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:text-red-600 transition-all border dark:border-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 md:p-10">
          {step === 1 ? (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
              {/* Date Selection */}
              <div className="space-y-4">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center space-x-2">
                  <Calendar size={14} />
                  <span>Select Date</span>
                </label>
                <div className="flex justify-between gap-3">
                  {dates.map((d) => (
                    <button
                      key={d.full}
                      onClick={() => setSelectedDate(d.full)}
                      className={`flex-1 flex flex-col items-center py-4 rounded-2xl border-2 transition-all ${
                        selectedDate === d.full 
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-600' 
                        : 'border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:text-gray-400'
                      }`}
                    >
                      <span className="text-[10px] font-black uppercase mb-1">{d.day}</span>
                      <span className="text-xl font-black">{d.date}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Slot Selection */}
              <div className="space-y-4">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center space-x-2">
                  <Clock size={14} />
                  <span>Arrival Window</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {slots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-3 rounded-xl border transition-all text-xs font-bold ${
                        selectedSlot === slot 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg' 
                        : 'bg-gray-50 dark:bg-gray-900 border-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <button
                disabled={!selectedDate || !selectedSlot}
                onClick={() => setStep(2)}
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-500/20 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center space-x-3 group"
              >
                <span>Review & Pay</span>
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              {/* Summary */}
              <div className="bg-gray-50 dark:bg-gray-900/50 p-8 rounded-[2rem] border dark:border-gray-700 space-y-6">
                 <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-bold">Service Category</span>
                    <span className="dark:text-white font-black">Cleaning</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-bold">Scheduled Arrival</span>
                    <span className="dark:text-white font-black">{selectedDate} at {selectedSlot}</span>
                 </div>
                 <div className="pt-6 border-t dark:border-gray-700 flex justify-between items-center">
                    <span className="text-xl font-black dark:text-white">Estimated Total</span>
                    <span className="text-3xl font-black text-blue-600">${pricePerHour * 2}</span>
                 </div>
              </div>

              {/* Escrow Badge */}
              <div className="bg-blue-600 p-8 rounded-[2rem] text-white flex items-start space-x-6 relative overflow-hidden shadow-2xl">
                 <div className="shrink-0 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <ShieldCheck size={28} />
                 </div>
                 <div className="relative z-10">
                    <h4 className="font-black text-lg leading-tight">100% Escrow Protected</h4>
                    <p className="text-xs text-blue-100 mt-2 font-medium leading-relaxed">
                      Your funds are held safely by All4Home. We only release payment to {providerName} after you confirm the job is finished.
                    </p>
                 </div>
                 <Zap size={120} className="absolute -right-8 -bottom-8 text-white/10 rotate-12" />
              </div>

              <button className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-black transition-all flex items-center justify-center space-x-3">
                 <CreditCard size={20} />
                 <span>Confirm & Pay Deposit</span>
              </button>
              
              <button onClick={() => setStep(1)} className="w-full text-xs font-black text-gray-400 uppercase tracking-widest hover:underline text-center">
                Go back and change time
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
