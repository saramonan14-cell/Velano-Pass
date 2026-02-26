
import React, { useState, useEffect } from 'react';
import { X, Copy, RefreshCw, CheckCircle, ShieldCheck, Dna, FileType, Check } from 'lucide-react';
import { useTranslation } from '../services/i18n';

interface QuickGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickGeneratorModal: React.FC<QuickGeneratorModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'random' | 'memorable'>('random');
  const [password, setPassword] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  
  // Random Mode State
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });

  // Memorable Mode State
  const [wordCount, setWordCount] = useState(4);
  const [separator, setSeparator] = useState('-');
  const [capitalize, setCapitalize] = useState(true);

  // Simple dictionary for "Memorable" (In a real app, import a larger list)
  const WORDS = [
    "correct", "horse", "battery", "staple", "blue", "sky", "mountain", "river", 
    "coffee", "pixel", "rocket", "lunar", "solar", "orbit", "galaxy", "comet",
    "furious", "calm", "gentle", "brave", "silent", "ancient", "future", "neon",
    "cyber", "secure", "vault", "crypto", "block", "chain", "token", "access",
    "forest", "ocean", "desert", "arctic", "jungle", "safari", "travel", "guide",
    "boggle", "clerk", "unhearing", "reprise", "configure", "history", "visual"
  ];

  const generate = () => {
    if (mode === 'random') {
        const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lower = 'abcdefghijklmnopqrstuvwxyz';
        const nums = '0123456789';
        const syms = '!@#$%^&*()_+-=[]{}|;:,.<>?';

        let chars = '';
        if (options.uppercase) chars += upper;
        if (options.lowercase) chars += lower;
        if (options.numbers) chars += nums;
        if (options.symbols) chars += syms;

        if (chars === '') {
            setPassword('');
            return;
        }

        let generated = '';
        const array = new Uint32Array(length);
        window.crypto.getRandomValues(array);

        for (let i = 0; i < length; i++) {
            generated += chars[array[i] % chars.length];
        }
        setPassword(generated);
    } else {
        // Memorable
        const selectedWords = [];
        const array = new Uint32Array(wordCount);
        window.crypto.getRandomValues(array);
        
        for(let i=0; i<wordCount; i++) {
            let word = WORDS[array[i] % WORDS.length];
            if (capitalize) {
                word = word.charAt(0).toUpperCase() + word.slice(1);
            }
            // Add a random number to one of the words to make it stronger
            if (i === wordCount - 1) {
                word += Math.floor(Math.random() * 9);
            }
            selectedWords.push(word);
        }
        setPassword(selectedWords.join(separator));
    }
  };

  useEffect(() => {
    if (isOpen) generate();
  }, [isOpen, length, options, wordCount, separator, capitalize, mode]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-dark-800 w-full max-w-md rounded-2xl border border-slate-700 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-700 flex justify-between items-center bg-slate-900">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="text-brand-500" size={20} />
            {t('generator')}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
            
            {/* Output Area */}
            <div className="relative mb-6 group">
                <div 
                    onClick={copyToClipboard}
                    className="w-full bg-slate-950 p-6 rounded-xl border border-slate-700 font-mono text-xl text-center text-brand-100 break-all min-h-[80px] flex items-center justify-center cursor-pointer hover:border-brand-500/50 transition-colors relative overflow-hidden"
                >
                    {password}
                    {isCopied && (
                         <div className="absolute inset-0 bg-brand-900/90 flex items-center justify-center text-white font-bold animate-in fade-in duration-200">
                             <span className="flex items-center gap-2"><Check size={20}/> {t('copied')}</span>
                         </div>
                    )}
                </div>
                <div className="absolute top-2 right-2 flex gap-1">
                    <button onClick={generate} className="p-2 text-slate-500 hover:text-white bg-slate-900/50 rounded-lg hover:bg-slate-800">
                        <RefreshCw size={16} />
                    </button>
                    <button onClick={copyToClipboard} className="p-2 text-brand-500 hover:text-brand-400 bg-brand-500/10 rounded-lg hover:bg-brand-500/20">
                        <Copy size={16} />
                    </button>
                </div>
                <div className="text-center mt-2">
                    <span className="text-xs font-medium text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">{t('veryStrong')}</span>
                </div>
            </div>

            {/* Mode Toggle */}
            <div className="flex bg-slate-900 p-1 rounded-lg mb-6">
                <button 
                    onClick={() => setMode('random')}
                    className={`flex-1 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-all ${mode === 'random' ? 'bg-brand-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                >
                    <Dna size={16} /> {t('randomChars')}
                </button>
                <button 
                    onClick={() => setMode('memorable')}
                    className={`flex-1 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-all ${mode === 'memorable' ? 'bg-brand-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                >
                    <FileType size={16} /> {t('memorableWords')}
                </button>
            </div>

            {/* Controls */}
            <div className="space-y-4">
                
                {mode === 'random' ? (
                    <>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-slate-400">
                                <span>{t('length')}</span>
                                <span>{length}</span>
                            </div>
                            <input 
                                type="range" min="8" max="64" value={length} 
                                onChange={(e) => setLength(Number(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                             {['uppercase', 'lowercase', 'numbers', 'symbols'].map((k) => (
                                 <label key={k} className="flex items-center space-x-2 cursor-pointer select-none bg-slate-900/50 p-2 rounded-lg border border-slate-800">
                                     <input 
                                        type="checkbox" 
                                        checked={options[k as keyof typeof options]}
                                        onChange={() => setOptions(prev => ({ ...prev, [k]: !prev[k as keyof typeof options] }))}
                                        className="w-4 h-4 rounded border-slate-600 text-brand-500 focus:ring-brand-500 bg-slate-900"
                                     />
                                     <span className="text-slate-300 text-xs capitalize">{t(k)}</span>
                                 </label>
                             ))}
                        </div>
                    </>
                ) : (
                    <>
                         <div className="space-y-2">
                            <div className="flex justify-between text-sm text-slate-400">
                                <span>{t('wordCount')}</span>
                                <span>{wordCount}</span>
                            </div>
                            <input 
                                type="range" min="3" max="8" value={wordCount} 
                                onChange={(e) => setWordCount(Number(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
                            />
                        </div>
                         <div className="flex gap-3">
                            <label className="flex-1 flex items-center space-x-2 cursor-pointer select-none bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                                <input 
                                type="checkbox" 
                                checked={capitalize}
                                onChange={() => setCapitalize(!capitalize)}
                                className="w-4 h-4 rounded border-slate-600 text-brand-500 focus:ring-brand-500 bg-slate-900"
                                />
                                <span className="text-slate-300 text-xs">{t('capitalize')}</span>
                            </label>
                         </div>
                    </>
                )}
            </div>

            <button onClick={onClose} className="w-full mt-6 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-medium transition-colors">
                {t('done')}
            </button>
        </div>
      </div>
    </div>
  );
};
