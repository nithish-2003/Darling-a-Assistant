
import React, { useState } from 'react';
import { Brief, HistoryEntry } from '../types';
import { DEMO_HISTORY } from '../constants';
import { AlertTriangle, Clock, Target, Lightbulb, TrendingUp, History, Filter, Database, Archive, Calendar } from 'lucide-react';
import ActionCard from './ActionCard';

interface DailyBriefProps {
  brief: Brief | null;
  onApprove: (id: string) => void;
  onSkip: (id: string) => void;
}

const DailyBrief: React.FC<DailyBriefProps> = ({ brief, onApprove, onSkip }) => {
  const [historyFilter, setHistoryFilter] = useState<'all' | 'completed' | 'negotiated' | 'cancelled'>('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  if (!brief) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-10 opacity-50">
        <Target className="w-24 h-24 text-slate-300 mb-4 animate-pulse" />
        <h2 className="text-2xl font-bold text-slate-400">AWAITING INTELLIGENCE</h2>
        <p className="text-slate-500 mt-2">Use microphone or load demo data to generate brief.</p>
      </div>
    );
  }

  // Filter history logic
  const filteredHistory = DEMO_HISTORY.filter(h => {
      const statusMatch = historyFilter === 'all' || h.status === historyFilter;
      const startMatch = !dateRange.start || h.date >= dateRange.start;
      const endMatch = !dateRange.end || h.date <= dateRange.end;
      return statusMatch && startMatch && endMatch;
  });

  return (
    <div className="space-y-6 pb-20">
      
      {/* 1. TODAY AT A GLANCE */}
      <section className="glass-panel p-6 rounded-2xl animate-[fadeIn_0.5s_ease-out] bg-white/40 border border-white/60">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4 tracking-tight">
          <span className="text-2xl">📌</span> TODAY AT A GLANCE
        </h2>
        <ul className="space-y-3">
          {brief.glance.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 text-slate-600 font-medium">
              <span className="text-blue-500 mt-2 w-1.5 h-1.5 rounded-full bg-blue-500 block shadow-sm"></span>
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 2. RISKS */}
      <section className="glass-panel p-6 rounded-2xl border-l-4 border-l-red-500 animate-[fadeIn_0.7s_ease-out] bg-white/40 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4 tracking-tight">
          <AlertTriangle className="text-red-500 fill-red-100" /> RISKS & ATTENTION
        </h2>
        <div className="space-y-4">
          {brief.risks.map(risk => (
            <div key={risk.id} className="bg-white/60 p-5 rounded-xl border border-white/60 shadow-sm transition-transform hover:scale-[1.01]">
              <div className="flex justify-between items-center mb-2">
                 <h3 className="font-bold text-red-600 text-sm uppercase tracking-wider flex items-center gap-2">
                    {risk.title}
                 </h3>
                 <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-full">{risk.type.toUpperCase()}</span>
              </div>
              <p className="text-slate-700 text-sm mb-3 font-medium">{risk.impact}</p>
              <div className="flex items-center gap-2 text-xs text-amber-600 font-mono bg-amber-50 p-2 rounded-lg border border-amber-100">
                <span className="font-bold">ACTION:</span>
                {risk.action}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. PROPOSED PLAN */}
      <section className="glass-panel p-6 rounded-2xl animate-[fadeIn_0.9s_ease-out] bg-white/40 border border-white/60">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6 tracking-tight">
          <Clock className="text-emerald-500" /> PROPOSED DAILY PLAN
        </h2>
        <div className="relative border-l-2 border-slate-200 ml-3 space-y-8">
          {brief.plan.map((block) => (
            <div key={block.id} className="relative pl-8">
              {/* Timeline Dot */}
              <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 border-white shadow-sm
                ${block.type === 'focus' ? 'bg-blue-500' : 
                  block.type === 'meeting' ? 'bg-purple-500' : 'bg-slate-400'}`}>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-3 mb-1">
                <span className="text-xs font-mono text-slate-500 font-bold min-w-[80px] bg-white/50 px-2 py-0.5 rounded">{block.timeRange}</span>
                <h3 className="text-sm font-bold text-slate-800">{block.activity}</h3>
                {block.alert && (
                  <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full animate-pulse border border-red-200">
                    {block.alert}
                  </span>
                )}
              </div>
              
              {block.notes && block.notes.length > 0 && (
                <ul className="mt-2 space-y-1.5 bg-white/40 p-3 rounded-lg border border-white/40">
                  {block.notes.map((note, idx) => (
                    <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                       <span className="w-1 h-1 rounded-full bg-slate-400 mt-1.5"></span> {note}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 4. QUICK ACTIONS */}
      <section className="space-y-4 animate-[fadeIn_1.1s_ease-out]">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 px-2 tracking-tight">
          <Target className="text-blue-600" /> QUICK ACTIONS
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {brief.actions.map(action => (
            <ActionCard 
              key={action.id} 
              action={action} 
              onApprove={onApprove} 
              onSkip={onSkip} 
            />
          ))}
        </div>
      </section>

      {/* NEW SECTION: PROCUREMENT HISTORY LOG */}
      <section className="glass-panel p-6 rounded-2xl bg-white/40 border border-white/60 animate-[fadeIn_1.2s_ease-out]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 tracking-tight">
                <Archive className="text-slate-500" /> PROCUREMENT LOG
            </h2>
            
            <div className="flex flex-wrap items-center gap-3">
                 {/* Date Filter */}
                 <div className="flex items-center gap-2 bg-white/60 p-1.5 rounded-xl border border-white/50 shadow-sm">
                    <Calendar size={14} className="text-slate-400 ml-1" />
                    <input 
                        type="date" 
                        className="bg-transparent text-[10px] font-mono text-slate-600 focus:outline-none w-20"
                        value={dateRange.start}
                        onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                    />
                    <span className="text-slate-300 text-[10px]">-</span>
                    <input 
                        type="date" 
                        className="bg-transparent text-[10px] font-mono text-slate-600 focus:outline-none w-20"
                        value={dateRange.end}
                        onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                    />
                 </div>

                 {/* Status Filter */}
                 <div className="flex gap-1 bg-slate-100/80 p-1 rounded-lg">
                    <button 
                    onClick={() => setHistoryFilter('all')}
                    className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${historyFilter === 'all' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                    >ALL</button>
                    <button 
                    onClick={() => setHistoryFilter('completed')}
                    className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${historyFilter === 'completed' ? 'bg-white shadow text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >DONE</button>
                    <button 
                    onClick={() => setHistoryFilter('negotiated')}
                    className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${historyFilter === 'negotiated' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >NEGO</button>
                    <button 
                    onClick={() => setHistoryFilter('cancelled')}
                    className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${historyFilter === 'cancelled' ? 'bg-white shadow text-red-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >CANCEL</button>
                </div>
            </div>
        </div>
        
        <div className="space-y-3">
             {/* Header Row */}
             <div className="grid grid-cols-12 text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3">
                 <div className="col-span-2">Date</div>
                 <div className="col-span-3">Vendor</div>
                 <div className="col-span-3">Product</div>
                 <div className="col-span-2 text-right">Price</div>
                 <div className="col-span-2 text-right">Status</div>
             </div>

             {filteredHistory.length > 0 ? (
                 filteredHistory.map((entry) => (
                     <div key={entry.id} className="grid grid-cols-12 items-center bg-white/50 hover:bg-white/80 transition-colors p-3 rounded-xl border border-white/40 shadow-sm text-sm">
                         <div className="col-span-2 text-slate-500 font-mono text-xs">{entry.date}</div>
                         <div className="col-span-3 font-bold text-slate-800 truncate" title={entry.vendor}>{entry.vendor}</div>
                         <div className="col-span-3 text-slate-600 truncate" title={entry.product}>{entry.product}</div>
                         <div className="col-span-2 text-right font-mono text-slate-700">{entry.price}</div>
                         <div className="col-span-2 text-right flex justify-end">
                             <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border
                                ${entry.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                  entry.status === 'negotiated' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                                  'bg-red-50 text-red-600 border-red-100'}
                             `}>
                                 {entry.status}
                             </span>
                         </div>
                     </div>
                 ))
             ) : (
                 <div className="p-8 text-center text-slate-400 text-sm italic">
                    No history records found for this period.
                 </div>
             )}
        </div>
        <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
             <div className="flex items-center gap-2 text-xs text-slate-500">
                 <Database size={14} />
                 <span>Team Database Synced: Today 09:00 AM</span>
             </div>
             <button className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                 VIEW FULL REPORT <ArrowUpRightMini />
             </button>
        </div>
      </section>

      {/* 5. REASONING */}
      <section className="glass-panel p-6 rounded-2xl border-t-2 border-blue-100 bg-gradient-to-b from-white/60 to-blue-50/30 animate-[fadeIn_1.3s_ease-out]">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4 tracking-tight">
          <Lightbulb className="text-amber-500 fill-amber-100" /> AI REASONING
        </h2>
        <div className="space-y-3">
          {brief.reasoning.map((text, idx) => (
            <div key={idx} className="flex gap-3 text-sm text-slate-600">
              <TrendingUp size={18} className="text-blue-400 min-w-[18px] mt-0.5" />
              <p className="leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// Helper for the icon
const ArrowUpRightMini = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <line x1="7" y1="17" x2="17" y2="7"></line>
        <polyline points="7 7 17 7 17 17"></polyline>
    </svg>
);

export default DailyBrief;
