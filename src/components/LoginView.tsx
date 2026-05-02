import React, { useState } from 'react';
import { useLang } from '../context/LanguageContext';

interface LoginViewProps {
  onLogin: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const { t } = useLang();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const OWNER_PIN = '1234'; // Simple default PIN

  const handleNumberClick = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 4) {
        if (newPin === OWNER_PIN) {
          onLogin();
        } else {
          setError(true);
          setTimeout(() => {
            setPin('');
            setError(false);
          }, 1000);
        }
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full p-8 bg-slate-900 text-white">
      <div className="mb-12 text-center">
        <div className="w-20 h-20 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/20">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">न्यू हॉटेल विजय</h1>
        <p className="text-slate-400 mt-2">{t('मालक प्रवेश', 'Owner Access Only')}</p>
      </div>

      <div className="flex gap-4 mb-12">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
              pin.length > i ? 'bg-orange-500 border-orange-500 scale-110' : 'border-slate-700'
            } ${error ? 'bg-red-500 border-red-500 animate-bounce' : ''}`}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6 w-full max-w-[280px]">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
          <button
            key={num}
            onClick={() => handleNumberClick(num)}
            className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-2xl font-medium hover:bg-slate-700 active:scale-95 transition-all"
          >
            {num}
          </button>
        ))}
        <div />
        <button
          onClick={() => handleNumberClick('0')}
          className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-2xl font-medium hover:bg-slate-700 active:scale-95 transition-all"
        >
          0
        </button>
        <button
          onClick={handleDelete}
          className="w-16 h-16 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
          </svg>
        </button>
      </div>

      <p className="mt-12 text-slate-500 text-sm">
        Default PIN: 1234
      </p>
    </div>
  );
};

export default LoginView;
