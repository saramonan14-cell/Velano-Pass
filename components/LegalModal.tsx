
import React, { useEffect, useRef } from 'react';
import { X, Shield } from 'lucide-react';
import { useTranslation } from '../services/i18n';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, onAccept }) => {
  const { t } = useTranslation();
  const contentRef = useRef<HTMLDivElement>(null);

  // Reset scroll to top when opening
  useEffect(() => {
    if (isOpen && contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-dark-900 w-full max-w-4xl rounded-2xl border border-slate-700 shadow-2xl flex flex-col h-[85vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/90 backdrop-blur rounded-t-2xl shrink-0 z-10">
           <div className="flex items-center gap-3">
             <div className="bg-brand-500/10 p-2 rounded-lg text-brand-500">
                <Shield size={24} />
             </div>
             <div>
                <h2 className="text-xl font-bold text-white leading-tight">
                    {t('termsTitle')}
                </h2>
                <p className="text-xs text-slate-400">
                    {t('lastUpdated')}
                </p>
             </div>
           </div>
           <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-full">
               <X size={24} />
           </button>
        </div>

        {/* Content - Long Form Legal Text */}
        <div 
            ref={contentRef}
            className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-dark-950/30"
        >
            <div className="max-w-3xl mx-auto">
                <div className="prose prose-invert prose-sm md:prose-base max-w-none text-slate-300">
                    {/* whitespace-pre-wrap ensures newlines from the massive text block are respected */}
                    <div className="whitespace-pre-wrap leading-relaxed font-light text-justify">
                        {t('legal_full_content')}
                    </div>
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-800 bg-slate-900/90 backdrop-blur rounded-b-2xl flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0 z-10">
            <div className="text-xs text-slate-500 text-center sm:text-left hidden sm:block max-w-md">
                {t('legal_footer_note')}
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
                <button 
                    onClick={onClose} 
                    className="flex-1 sm:flex-none px-6 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg font-medium transition-colors"
                >
                    {t('close')}
                </button>
                {onAccept && (
                    <button 
                        onClick={() => {
                            onAccept();
                        }} 
                        className="flex-1 sm:flex-none px-8 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-bold shadow-lg shadow-brand-900/20 transition-all flex items-center justify-center gap-2"
                    >
                        {t('acceptButton')}
                    </button>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
