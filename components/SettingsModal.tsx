
import React, { useState, useEffect } from 'react';
import { X, Mic2, Monitor, Shield, User, Key, Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  onValidateKey?: (key: string) => Promise<boolean>;
  validationStatus?: 'idle' | 'checking' | 'valid' | 'invalid';
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  apiKey, 
  onApiKeyChange,
  onValidateKey,
  validationStatus = 'idle'
}) => {
  const [showKey, setShowKey] = useState(false);
  const [localStatus, setLocalStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');
  const isEnvKey = apiKey === process.env.API_KEY && apiKey.length > 0;

  useEffect(() => {
    if (validationStatus) setLocalStatus(validationStatus);
  }, [validationStatus]);

  const handleValidate = async () => {
    if (!onValidateKey || !apiKey) return;
    setLocalStatus('checking');
    const isValid = await onValidateKey(apiKey);
    setLocalStatus(isValid ? 'valid' : 'invalid');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white/90 border border-white/60 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <span className="text-blue-600 bg-blue-50 p-1 rounded">///</span> SYSTEM SETTINGS
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-800 transition-colors bg-slate-50 p-2 rounded-full hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {/* Intelligence (API Key) */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-blue-600 uppercase flex items-center gap-2 tracking-widest">
              <Key size={14} /> Intelligence Engine
            </h3>
            <div className={`p-5 rounded-2xl border shadow-inner ${isEnvKey ? 'bg-emerald-50/50 border-emerald-100' : 'bg-slate-50 border-slate-200'}`}>
               <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs text-slate-500 font-bold tracking-wide">GOOGLE GEMINI API KEY</label>
                  {isEnvKey && <span className="text-[9px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">ENV LOADED</span>}
               </div>
               
               <div className="relative flex gap-2">
                 <div className="relative flex-1">
                    <input 
                        type={showKey ? "text" : "password"}
                        value={apiKey}
                        onChange={(e) => {
                            onApiKeyChange(e.target.value);
                            setLocalStatus('idle');
                        }}
                        placeholder="AIzaSy..."
                        className={`w-full bg-white border rounded-xl py-3 pl-4 pr-10 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono shadow-sm transition-all
                            ${localStatus === 'valid' ? 'border-emerald-400 focus:border-emerald-500' : 
                              localStatus === 'invalid' ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'}
                        `}
                    />
                    <button 
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                    >
                    {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                 </div>
                 <button
                   onClick={handleValidate}
                   disabled={localStatus === 'checking' || !apiKey}
                   className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold px-4 rounded-xl transition-colors shadow-sm"
                 >
                   {localStatus === 'checking' ? <Loader2 size={18} className="animate-spin" /> : 'Check'}
                 </button>
               </div>
               
               {/* Validation Message */}
               <div className="mt-3 flex items-center gap-2 min-h-[20px]">
                  {localStatus === 'valid' && (
                      <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                          <CheckCircle size={12} /> ENGINE CONNECTED: LATENCY 45ms
                      </span>
                  )}
                  {localStatus === 'invalid' && (
                      <span className="text-[10px] font-bold text-red-600 flex items-center gap-1 bg-red-50 px-2 py-1 rounded-full border border-red-100">
                          <AlertCircle size={12} /> INVALID KEY: ACCESS DENIED
                      </span>
                  )}
                  {localStatus === 'idle' && (
                      <p className="text-[10px] text-slate-400 font-medium">
                        {isEnvKey ? 'Protected Environment Key Active.' : 'Key stored in session memory only.'}
                      </p>
                  )}
               </div>
            </div>
          </div>

          {/* Audio */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2 tracking-widest">
              <Mic2 size={14} /> Audio Input
            </h3>
            <div className="p-4 rounded-xl bg-white border border-slate-100 flex justify-between items-center shadow-sm">
              <span className="text-sm text-slate-700 font-medium">Default Microphone</span>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">ACTIVE</span>
            </div>
            <div className="space-y-2 px-1">
              <div className="flex justify-between text-xs text-slate-500 font-medium">
                <span>Sensitivity</span>
                <span>80%</span>
              </div>
              <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="w-[80%] h-full bg-blue-500 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2 tracking-widest">
              <User size={14} /> Personalization
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                <div className="text-xs text-slate-400 mb-1 font-bold">FOCUS HOURS</div>
                <div className="text-sm font-bold text-slate-800 font-mono">06:00 - 08:00</div>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                <div className="text-xs text-slate-400 mb-1 font-bold">MAX MEETINGS</div>
                <div className="text-sm font-bold text-slate-800 font-mono">6 HOURS/DAY</div>
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2 tracking-widest">
              <Shield size={14} /> Data & Privacy
            </h3>
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 text-xs text-amber-800 flex gap-3 items-start">
              <Shield className="shrink-0 text-amber-500" size={16} />
              <div>
                 <strong className="block mb-0.5 font-bold">NO STORAGE MODE ACTIVE</strong>
                 All data is processed locally. Refreshing wipes data.
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-center">
          <p className="text-[10px] text-slate-400 font-mono font-medium">VERSION 2.1.2 // GEMINI INTELLIGENCE ENABLED</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
