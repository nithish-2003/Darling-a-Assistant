
import React, { useState } from 'react';
import MicrophonePanel from './components/MicrophonePanel';
import InputTabs from './components/InputTabs';
import SettingsModal from './components/SettingsModal';
import DailyBrief from './components/DailyBrief';
import Header from './components/Header';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { useDataProcessor } from './hooks/useDataProcessor';
import { Home, Calendar, Layers, Settings, Activity, Command, Briefcase } from 'lucide-react';
import { DEMO_BRIEF } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'calendar' | 'tasks' | 'skills'>('home');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const { 
    isListening, 
    transcript, 
    interimTranscript, 
    confidence, 
    startListening, 
    stopListening, 
    clearError,
    audioData, 
    error: micError 
  } = useSpeechRecognition();

  const {
    isProcessing,
    processData,
    emails,
    calendar,
    tasks,
    quotes,
    brief,
    aiResponse,
    apiKey,
    setApiKey,
    validateKey,
    updateActionStatus,
    approvalStats
  } = useDataProcessor();

  // Toggle Mic Logic
  const handleMicToggle = () => {
    if (isListening) {
      stopListening();
      if (transcript.trim().length > 0) {
        processData('transcript', transcript);
      }
    } else {
      startListening();
    }
  };

  const handleManualInput = (text: string) => {
    processData('transcript', text);
    if (micError) clearError();
  };

  const getProcessingState = () => {
    if (isProcessing) return 'processing';
    if (brief) return 'done';
    if (isListening) return 'listening';
    return 'idle';
  };

  // --- COMPONENT: Timeline (Shared) ---
  const TimelineView = ({ isDesktop = false }) => (
    <div className="space-y-0 relative pl-2">
      {/* Timeline Vertical Line */}
      <div className={`absolute left-[19px] top-6 bottom-0 w-[2px] ${isDesktop ? 'bg-slate-300/30' : 'bg-slate-200/60'}`}></div>

      {(brief?.plan.length ? brief.plan : DEMO_BRIEF.plan).slice(0, 6).map((block, index) => (
        <div key={index} className="relative flex items-center mb-6 last:mb-0 group animate-[fadeIn_0.5s_ease-out]">
          {/* Dot */}
          <div className={`
            z-10 w-3 h-3 rounded-full border-2 border-white shadow-sm mr-6 transition-all duration-300
            ${index === 0 ? 'bg-blue-500 scale-125 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : isDesktop ? 'bg-slate-300 group-hover:bg-blue-300' : 'bg-slate-300 group-hover:bg-blue-300'}
          `}></div>
          
          {/* Card/Pill */}
          <div className={`
            flex-1 py-4 px-6 rounded-2xl transition-all duration-300
            ${index === 0 
              ? isDesktop 
                ? 'bg-white/80 shadow-md border border-white/60 backdrop-blur-md' 
                : 'bg-white/90 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-white/60 backdrop-blur-md'
              : isDesktop
                ? 'bg-white/30 border border-white/30 hover:bg-white/50'
                : 'bg-white/40 border border-white/20 hover:bg-white/60'}
          `}>
            <div className="flex justify-between items-center mb-1">
              <span className={`text-xs font-bold tracking-wide ${index === 0 ? (isDesktop ? 'text-blue-600' : 'text-blue-600') : (isDesktop ? 'text-slate-500' : 'text-slate-500')}`}>
                {block.timeRange.split('-')[0]}
              </span>
              {index === 0 && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${isDesktop ? 'bg-blue-50 text-blue-500 border-blue-200' : 'bg-blue-50 text-blue-500 border-blue-100'}`}>CURRENT</span>}
            </div>
            <div className={`font-semibold text-base ${isDesktop ? 'text-slate-800' : 'text-slate-800'}`}>
              {block.activity}
            </div>
            {block.notes && (
               <div className={`text-xs mt-1 flex gap-2 ${isDesktop ? 'text-slate-500' : 'text-slate-500'}`}>
                 {block.notes.map((n, i) => <span key={i}>• {n}</span>)}
               </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  // --- RENDER: Mobile/Tablet Layout (Single Column) ---
  const renderMobileLayout = () => (
    <div className="lg:hidden w-full max-w-[480px] h-[100dvh] lg:h-[800px] glass-card lg:rounded-[40px] flex flex-col relative overflow-hidden shadow-2xl ring-1 ring-white/40 mx-auto bg-gradient-to-br from-slate-50/50 to-blue-50/50">
        {/* Header */}
        <header className="pt-6 pb-2 px-6 flex justify-between items-center z-20">
          <button className="p-2 text-slate-500 hover:text-slate-800 transition-colors">
            <Briefcase size={20} className="text-blue-600" />
          </button>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Darling Assistant</h1>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </header>

        {/* Orb Area */}
        <div className="shrink-0">
          <MicrophonePanel 
            isListening={isListening}
            onToggle={handleMicToggle}
            onInputSubmit={handleManualInput}
            transcript={transcript}
            interimTranscript={interimTranscript}
            audioData={audioData}
            confidence={confidence}
            error={micError}
            processingState={getProcessingState()}
            aiResponse={aiResponse}
            isDesktop={false}
          />
        </div>

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col relative">
           {activeTab === 'home' && (
              <div className="flex-1 overflow-hidden flex flex-col">
                <div className="px-6 pb-2">
                  <h2 className="text-2xl font-bold text-slate-800 leading-tight">
                    Good morning, Engineer.<br />
                    3 Urgent RFQs today.
                  </h2>
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  <TimelineView />
                </div>
              </div>
           )}
           
           {activeTab === 'calendar' && (
             <div className="flex-1 overflow-y-auto px-4 pb-4 animate-[fadeIn_0.3s_ease-out]">
               <h2 className="text-lg font-bold text-slate-700 mb-4 px-2">Data Streams</h2>
               <InputTabs emails={emails} calendar={calendar} tasks={tasks} quotes={quotes} />
             </div>
           )}

           {activeTab === 'tasks' && (
             <div className="flex-1 overflow-y-auto px-4 pb-4 animate-[fadeIn_0.3s_ease-out]">
                {/* Re-using input tabs logic but focusing on vendors */}
               <InputTabs emails={emails} calendar={calendar} tasks={tasks} quotes={quotes} />
             </div>
           )}
        </div>

        {/* Bottom Navigation */}
        <nav className="h-20 bg-white/40 backdrop-blur-md border-t border-white/40 flex items-center justify-around px-2 z-30 shrink-0">
          <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={Home} label="Home" />
          <NavButton active={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} icon={Calendar} label="Timeline" />
          <NavButton active={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} icon={Layers} label="Data" />
        </nav>
    </div>
  );

  // --- RENDER: Desktop Layout (Unified Light/Glass Design) ---
  const renderDesktopLayout = () => (
    <div className="hidden lg:flex w-full h-screen p-8 gap-8 overflow-hidden relative font-sans">
       {/* Background Ambience (Subtle & Professional) */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          {/* We rely on the body's sunrise gradient, just adding subtle accent blobs */}
          <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/10 blur-[100px]"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-400/10 blur-[100px]"></div>
       </div>

       {/* Left Column: Input Data Streams */}
       <div className="w-[350px] shrink-0 glass-panel bg-white/40 border border-white/40 rounded-[32px] flex flex-col p-6 z-10 backdrop-blur-xl shadow-lg">
          <div className="flex items-center gap-3 mb-8 px-2">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
               <Briefcase className="text-white w-5 h-5" />
             </div>
             <div>
               <h1 className="text-xl font-bold text-slate-800 tracking-wide">DARLING <span className="text-blue-600 text-xs font-mono align-top opacity-80">PROCURE</span></h1>
               <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
                  <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">Connected</span>
               </div>
             </div>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col">
             <div className="flex items-center justify-between mb-4 px-2">
               <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                 <Command size={14} /> Vendor Streams
               </h3>
               <span className="text-[10px] bg-white/50 text-slate-600 px-2 py-0.5 rounded-full font-mono border border-white/50">LIVE</span>
             </div>
             <div className="flex-1 overflow-hidden relative">
               <InputTabs emails={emails} calendar={calendar} tasks={tasks} quotes={quotes} />
             </div>
          </div>
       </div>

       {/* Center Column: Procurement Dashboard (Brief) */}
       <div className="flex-1 glass-panel bg-white/20 border border-white/30 rounded-[32px] flex flex-col p-8 z-10 backdrop-blur-md shadow-xl relative overflow-hidden min-w-[400px]">
          <div className="flex justify-between items-end mb-6">
             <div>
               <h2 className="text-3xl font-bold text-slate-800 mb-2 tracking-tight">Good morning, Engineer.</h2>
               <p className="text-slate-600 text-lg">
                 Attention required on <span className="text-blue-700 font-bold border-b-2 border-blue-500/30">Declined RFQs</span>.
               </p>
             </div>
             <div className="text-right hidden xl:block">
                <div className="text-3xl font-mono text-slate-700 font-light tracking-widest">
                  {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
                <div className="text-sm text-slate-500 font-medium uppercase tracking-widest mt-1">
                  {new Date().toLocaleDateString([], {weekday: 'long', month: 'long', day: 'numeric'})}
                </div>
             </div>
          </div>

          {/* Visualization / Brief Area */}
          <div className="flex-1 overflow-y-auto pr-2 relative custom-scrollbar">
             {/* Using the DailyBrief component but it will now render nicely on light mode due to transparent/glass styling adjustments in that component or here */}
             <DailyBrief 
                brief={brief} 
                onApprove={(id) => updateActionStatus(id, 'approved')} 
                onSkip={(id) => updateActionStatus(id, 'skipped')} 
             />
          </div>
       </div>

       {/* Right Column: Assistant & Interaction */}
       <div className="w-[360px] shrink-0 glass-panel bg-white/40 border border-white/40 rounded-[32px] flex flex-col z-10 backdrop-blur-xl overflow-hidden shadow-lg">
          {/* Header */}
          <div className="p-6 border-b border-white/20 flex justify-between items-center bg-white/10">
             <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Voice Interface</span>
             <button 
               onClick={() => setIsSettingsOpen(true)}
               className="p-2 hover:bg-white/20 rounded-full transition-colors text-slate-400 hover:text-blue-600"
             >
               <Settings size={18} />
             </button>
          </div>

          {/* The Orb Container */}
          <div className="flex-1 flex flex-col items-center justify-center relative p-6">
             <div className="absolute inset-0 bg-gradient-to-b from-blue-100/30 to-transparent pointer-events-none"></div>
             
             <MicrophonePanel 
                isListening={isListening}
                onToggle={handleMicToggle}
                onInputSubmit={handleManualInput}
                transcript={transcript}
                interimTranscript={interimTranscript}
                audioData={audioData}
                confidence={confidence}
                error={micError}
                processingState={getProcessingState()}
                aiResponse={aiResponse}
                isDesktop={true}
             />
          </div>
          
          {/* Footer/Stats */}
          <div className="p-6 bg-white/20 border-t border-white/20">
             <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                <span>PROCUREMENT MODULE V3.0</span>
                <span className="flex items-center gap-1.5">
                   API <span className="text-emerald-500 font-bold">ACTIVE</span>
                </span>
             </div>
          </div>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center lg:block bg-gradient-to-br from-slate-50 to-blue-50 lg:bg-none">
       <SettingsModal 
         isOpen={isSettingsOpen} 
         onClose={() => setIsSettingsOpen(false)} 
         apiKey={apiKey}
         onApiKeyChange={setApiKey}
         onValidateKey={validateKey}
       />
       {renderMobileLayout()}
       {renderDesktopLayout()}
    </div>
  );
};

const NavButton = ({ active, onClick, icon: Icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 p-2 w-16 transition-all duration-300 ${active ? 'text-blue-600 scale-105' : 'text-slate-400 hover:text-slate-600'}`}
  >
    <Icon className={`w-6 h-6 ${active ? 'fill-current opacity-20' : ''}`} strokeWidth={active ? 2.5 : 2} />
    <span className="text-[10px] font-medium tracking-wide">{label}</span>
  </button>
);

export default App;
