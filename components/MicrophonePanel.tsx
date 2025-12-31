
import React, { useState, useRef, useEffect } from 'react';
import { Loader2, MicOff, Send, Keyboard, Mic, Sparkles, MessageSquare, Terminal, AlertTriangle } from 'lucide-react';

interface MicrophonePanelProps {
  isListening: boolean;
  onToggle: () => void;
  onInputSubmit: (text: string) => void;
  transcript: string;
  interimTranscript: string;
  audioData: Uint8Array;
  confidence: number;
  error: string | null;
  processingState: 'idle' | 'listening' | 'processing' | 'done';
  aiResponse: string | null;
  isDesktop?: boolean;
}

const MicrophonePanel: React.FC<MicrophonePanelProps> = ({
  isListening,
  onToggle,
  onInputSubmit,
  transcript,
  interimTranscript,
  processingState,
  error,
  aiResponse,
  isDesktop = false
}) => {
  const [inputText, setInputText] = useState('');
  const [showInput, setShowInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input if error occurs or manually toggled
  useEffect(() => {
    if ((error || showInput) && isDesktop) {
        setShowInput(true);
    }
    if (showInput || error) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [error, showInput, isDesktop]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onInputSubmit(inputText);
      setInputText('');
    }
  };

  const getOrbSize = () => isDesktop ? 'w-40 h-40' : 'w-32 h-32';
  const getIconSize = () => isDesktop ? 'w-12 h-12' : 'w-10 h-10';

  // Determine Mode
  const isTextMode = !!error;
  const isPermissionDenied = error && (error.toLowerCase().includes('denied') || error.toLowerCase().includes('not-allowed'));

  return (
    <div className={`flex flex-col items-center justify-center w-full relative z-10 ${isDesktop ? 'h-full py-0' : 'py-6'}`}>
      
      {/* AI STATUS / RESPONSE AREA */}
      <div className={`w-full px-6 flex flex-col items-center justify-center text-center transition-all duration-500 ${isDesktop ? 'mb-10 min-h-[100px]' : 'mb-4 min-h-[60px]'}`}>
        {aiResponse ? (
          <div className="animate-[fadeIn_0.5s_ease-out]">
            <p className={`${isDesktop ? 'text-slate-700 text-xl font-light' : 'text-slate-800 text-lg font-medium'} leading-relaxed drop-shadow-sm`}>
              {aiResponse}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 animate-[fadeIn_0.3s_ease-out]">
            {isPermissionDenied ? (
               <div className="flex flex-col items-center gap-2">
                 <p className={`${isDesktop ? 'text-red-500' : 'text-red-600'} text-sm font-bold tracking-tight flex items-center gap-2`}>
                   <AlertTriangle size={14} /> Microphone access required
                 </p>
                 <button 
                   onClick={onToggle}
                   className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm mt-1
                     ${isDesktop 
                       ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' 
                       : 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'}
                   `}
                 >
                   <MicOff size={14} /> Enable Microphone
                 </button>
                 <span className={`${isDesktop ? 'text-slate-500' : 'text-slate-400'} text-[10px]`}>
                   Using text-only mode
                 </span>
               </div>
            ) : (
              <>
                <p className={`${isDesktop ? 'text-slate-500' : 'text-slate-500'} text-sm font-medium opacity-80 tracking-wide`}>
                  {isListening 
                    ? "Listening..." 
                    : processingState === 'processing' 
                      ? "Processing..." 
                      : isTextMode 
                        ? "Text Mode Active" 
                        : isDesktop ? "Awaiting command..." : "Tap orb to interact"}
                </p>
                {isTextMode && (
                  <span className={`text-[10px] uppercase tracking-widest ${isDesktop ? 'text-blue-500' : 'text-blue-500'}`}>
                    Microphone Unavailable
                  </span>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* The Orb (Assistant Avatar) */}
      <div className="relative group cursor-pointer" onClick={isPermissionDenied ? onToggle : (isTextMode ? () => inputRef.current?.focus() : onToggle)}>
        {/* Glow Effects */}
        {(isListening || isTextMode) && (
          <>
            <div className={`absolute inset-0 rounded-full ${isPermissionDenied ? 'bg-red-500/20' : isTextMode ? 'bg-indigo-500/20' : 'bg-blue-500/30'} animate-ping scale-150 duration-1000`}></div>
            <div className={`absolute inset-0 rounded-full ${isPermissionDenied ? 'bg-orange-400/10' : isTextMode ? 'bg-purple-400/10' : 'bg-cyan-400/20'} animate-pulse scale-125 duration-2000`}></div>
          </>
        )}
        
        {/* Core Sphere */}
        <div className={`
          ${getOrbSize()} rounded-full transition-all duration-500 transform flex items-center justify-center backdrop-blur-sm
          ${isPermissionDenied 
            ? 'bg-gradient-to-br from-red-50 to-red-100/50 border-2 border-red-200 shadow-[0_0_40px_rgba(239,68,68,0.3)]'
            : isTextMode
              ? 'bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 shadow-[0_0_40px_rgba(99,102,241,0.3)]' 
              : 'orb-gradient shadow-[0_0_50px_rgba(59,130,246,0.4)] animate-float hover:scale-105'
          }
          ${isListening ? 'scale-110 shadow-[0_0_80px_rgba(0,217,255,0.5)]' : ''}
          ${processingState === 'processing' ? 'scale-90 animate-pulse' : ''}
        `}>
          {processingState === 'processing' ? (
            <Loader2 className={`${getIconSize()} text-blue-500 animate-spin opacity-90`} />
          ) : isPermissionDenied ? (
            <div className="relative">
               <MicOff className={`${getIconSize()} text-red-500 opacity-90`} />
               <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
          ) : isTextMode ? (
            <div className="relative">
               <Keyboard className={`${getIconSize()} text-indigo-400 opacity-90`} />
               <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-indigo-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
          ) : (
            <div className="relative">
               <Mic className={`${isDesktop ? 'w-10 h-10' : 'w-8 h-8'} text-white transition-opacity ${isListening ? 'opacity-100' : 'opacity-60'}`} />
               {!isListening && <Sparkles className="w-5 h-5 text-cyan-200 absolute -top-2 -right-3 animate-pulse" />}
            </div>
          )}
        </div>
      </div>

      {/* LIVE TRANSCRIPT (What user is saying) */}
      <div className={`mt-8 px-4 w-full text-center ${isDesktop ? 'min-h-[40px]' : 'min-h-[30px]'}`}>
        {(transcript || interimTranscript) && !isTextMode && (
          <div className={`${isDesktop ? 'bg-white/60 text-slate-800' : 'bg-black/5 text-slate-800'} backdrop-blur-md rounded-xl px-4 py-2 border border-white/50 shadow-sm inline-block max-w-full animate-[fadeIn_0.2s_ease-out]`}>
            <p className="font-mono text-sm leading-relaxed">
              {interimTranscript || transcript}
            </p>
          </div>
        )}
      </div>

      {/* MANUAL INPUT */}
      <div className={`w-full px-6 ${isDesktop ? 'mt-auto pb-4' : 'mt-6'} relative z-20`}>
        {!showInput && !isTextMode && !isDesktop ? (
           <button 
             onClick={() => setShowInput(true)} 
             className="w-full flex items-center justify-center gap-2 text-xs text-slate-400 hover:text-blue-500 transition-colors py-2 group"
           >
             <Keyboard size={14} className="group-hover:-translate-y-0.5 transition-transform" />
             <span>Type a request</span>
           </button>
        ) : (
          <form onSubmit={handleSubmit} className="relative group animate-[slideUp_0.3s_ease-out]">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isPermissionDenied ? "Microphone unavailable. Type here..." : isTextMode ? "Type here..." : "Ask Darling..."}
              className={`w-full ${isDesktop 
                ? 'bg-white/60 border-white/40 text-slate-800 placeholder:text-slate-500 focus:bg-white/80 focus:border-blue-500/50' 
                : 'bg-white/70 border-white/60 text-slate-800 placeholder:text-slate-400 focus:bg-white/90 focus:border-indigo-300'
              } backdrop-blur-xl border rounded-2xl py-4 pl-5 pr-14 focus:outline-none focus:ring-0 transition-all shadow-lg font-mono text-sm ${isPermissionDenied ? 'border-red-200 focus:border-red-400' : ''}`}
            />
            <button 
              type="submit"
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-xl transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${
                isDesktop 
                  ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                  : isPermissionDenied ? 'bg-red-500 hover:bg-red-600 text-white' : isTextMode ? 'bg-indigo-500 hover:bg-indigo-600 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
              disabled={!inputText.trim()}
            >
              <Send size={16} />
            </button>
          </form>
        )}
      </div>

    </div>
  );
};

export default MicrophonePanel;
    