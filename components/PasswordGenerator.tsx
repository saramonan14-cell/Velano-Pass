import React, { useState, useEffect } from 'react';
import { Copy, RefreshCw, ShieldCheck } from 'lucide-react';
import { useTranslation } from '../services/i18n';

export const PasswordGenerator: React.FC = () => {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });

  const generate = () => {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const nums = '0123456789';
    const syms = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let chars = '';
    if (options.uppercase) chars += upper;
    if (options.lowercase) chars += lower;
    if (options.numbers) chars += nums;
    if (options.symbols) chars += syms;

    if (chars === '') return;

    let generated = '';
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
      generated += chars[array[i] % chars.length];
    }
    setPassword(generated);
  };

  useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [length, options]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
  };

  // Calculate simulated strength
  const strength = Math.min(100, length * 4 + (options.symbols ? 15 : 0) + (options.numbers ? 10 : 0));

  return (
    <div className="bg-dark-800 p-6 rounded-xl border border-slate-700 shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck className="w-5 h-5 text-brand-500" />
        <h3 className="text-lg font-semibold text-white">{t('generator')}</h3>
      </div>

      <div className="relative mb-6 group">
        <div className="w-full bg-slate-900 p-4 rounded-lg border border-slate-700 font-mono text-xl text-center text-brand-100 break-all min-h-[64px] flex items-center justify-center">
          {password}
        </div>
        <button 
          onClick={copyToClipboard}
          className="absolute right-2 top-2 p-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-700 rounded transition-colors"
          title={t('copy')}
        >
          <Copy size={16} />
        </button>
      </div>

      <div className="space-y-4">
        <div>
            <div className="flex justify-between mb-2 text-sm text-slate-400">
                <span>{t('length')}: {length}</span>
                <span className={strength > 80 ? 'text-green-400' : 'text-yellow-400'}>
                    {strength > 80 ? t('veryStrong') : t('good')}
                </span>
            </div>
            <input 
                type="range" 
                min="8" 
                max="64" 
                value={length} 
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
        </div>

        <div className="grid grid-cols-2 gap-3">
             {[
                 { k: 'uppercase', l: 'A-Z' },
                 { k: 'lowercase', l: 'a-z' },
                 { k: 'numbers', l: '0-9' },
                 { k: 'symbols', l: '!@#' }
             ].map((opt) => (
                 <label key={opt.k} className="flex items-center space-x-2 cursor-pointer select-none">
                     <input 
                        type="checkbox" 
                        checked={options[opt.k as keyof typeof options]}
                        onChange={() => setOptions(prev => ({ ...prev, [opt.k]: !prev[opt.k as keyof typeof options] }))}
                        className="w-4 h-4 rounded border-slate-600 text-brand-500 focus:ring-brand-500 bg-slate-900"
                     />
                     <span className="text-slate-300 text-sm">{opt.l}</span>
                 </label>
             ))}
        </div>

        <button 
            onClick={generate}
            className="w-full mt-4 flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg transition-all"
        >
            <RefreshCw size={16} /> {t('regenerate')}
        </button>
      </div>
    </div>
  );
};
