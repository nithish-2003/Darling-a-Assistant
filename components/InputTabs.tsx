import React, { useState } from 'react';
import { Email, CalendarEvent, Task, Quote } from '../types';
import { Mail, Calendar, CheckSquare, AlertTriangle, Clock, Truck, FileText, XCircle, CheckCircle, HelpCircle } from 'lucide-react';

interface InputTabsProps {
  emails: Email[];
  calendar: CalendarEvent[];
  tasks: Task[];
  quotes: Quote[];
}

const InputTabs: React.FC<InputTabsProps> = ({ emails, calendar, tasks, quotes }) => {
  const [activeTab, setActiveTab] = useState<'quotes' | 'emails' | 'calendar' | 'tasks'>('quotes');

  const tabs = [
    { id: 'quotes', label: 'VENDORS', icon: Truck, count: quotes.length },
    { id: 'emails', label: 'INBOX', icon: Mail, count: emails.length },
    { id: 'calendar', label: 'CAL', icon: Calendar, count: calendar.length },
    { id: 'tasks', label: 'TASKS', icon: CheckSquare, count: tasks.length },
  ];

  return (
    <div className="bg-white/40 backdrop-blur-md rounded-2xl p-1 flex flex-col h-full overflow-hidden border border-white/50 shadow-sm">
      {/* Tabs Header */}
      <div className="flex bg-slate-100/50 rounded-xl p-1 mb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`
              flex-1 py-2 flex flex-col items-center justify-center gap-0.5 transition-all rounded-lg
              ${activeTab === tab.id 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'}
            `}
          >
            <div className="flex items-center gap-1.5">
              <tab.icon size={14} />
              <span className="font-bold text-[10px] tracking-wider">{tab.label}</span>
            </div>
            {/* Dot indicator for count */}
            {tab.count > 0 && activeTab !== tab.id && (
                <div className="w-1 h-1 bg-slate-400 rounded-full mt-0.5"></div>
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        
        {/* QUOTES / VENDORS TAB */}
        {activeTab === 'quotes' && (
            <div className="space-y-2">
                <div className="px-2 pb-2 border-b border-slate-200/50 flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>Vendor</span>
                    <span>Status</span>
                </div>
                {quotes.map(quote => (
                    <div key={quote.id} className="p-3 rounded-xl bg-white/60 border border-white/50 shadow-sm hover:bg-white/80 transition-colors">
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-sm font-bold text-slate-800">{quote.vendorName}</span>
                            {quote.status === 'received' && <span className="flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold uppercase"><CheckCircle size={10}/> Received</span>}
                            {quote.status === 'declined' && <span className="flex items-center gap-1 text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold uppercase"><XCircle size={10}/> Declined</span>}
                            {quote.status === 'pending' && <span className="flex items-center gap-1 text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold uppercase"><Clock size={10}/> Pending</span>}
                            {quote.status === 'negotiating' && <span className="flex items-center gap-1 text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold uppercase"><HelpCircle size={10}/> Nego</span>}
                        </div>
                        <div className="flex justify-between items-end">
                            <div>
                                <div className="text-xs text-slate-600 font-medium">{quote.itemName}</div>
                                <div className="text-[10px] text-slate-400 mt-0.5">Updated: {quote.lastUpdate}</div>
                            </div>
                            {quote.value && <div className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">{quote.value}</div>}
                        </div>
                    </div>
                ))}
                
                {/* Simple Stats Visualization */}
                <div className="mt-4 p-3 bg-slate-50/50 rounded-xl border border-white/50">
                     <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Response Rate</div>
                     <div className="flex h-2 rounded-full overflow-hidden w-full bg-slate-200">
                         <div className="bg-emerald-400 w-[25%]"></div>
                         <div className="bg-blue-400 w-[25%]"></div>
                         <div className="bg-amber-400 w-[25%]"></div>
                         <div className="bg-red-400 w-[25%]"></div>
                     </div>
                     <div className="flex justify-between text-[9px] text-slate-400 mt-1 font-mono">
                         <span>REC</span>
                         <span>NEGO</span>
                         <span>WAIT</span>
                         <span>NO</span>
                     </div>
                </div>
            </div>
        )}

        {/* EMAILS TAB */}
        {activeTab === 'emails' && emails.map(email => (
          <div key={email.id} className="p-3 rounded-xl bg-white/60 border border-white/50 hover:border-blue-200 transition-colors group shadow-sm">
            <div className="flex justify-between items-start mb-1">
              <span className="text-xs font-bold text-slate-700">{email.sender}</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase
                ${email.category === 'URGENT' ? 'bg-red-100 text-red-600' : 
                  email.category === 'ACTION' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                {email.category}
              </span>
            </div>
            <h4 className="text-sm font-semibold text-slate-900 mb-0.5 line-clamp-1">{email.subject}</h4>
            <p className="text-xs text-slate-500 line-clamp-2">{email.content}</p>
          </div>
        ))}

        {/* CALENDAR TAB */}
        {activeTab === 'calendar' && calendar.map(event => (
          <div key={event.id} className="flex gap-3 p-3 rounded-xl bg-white/60 border border-white/50 shadow-sm">
            <div className="flex flex-col items-center justify-center w-10 border-r border-slate-200 pr-2">
               <span className="text-xs font-mono text-slate-900 font-bold">{event.start}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                 <h4 className="text-sm font-semibold text-slate-900">{event.title}</h4>
                 {!event.hasAgenda && <AlertTriangle size={12} className="text-amber-500" />}
              </div>
            </div>
          </div>
        ))}

        {/* TASKS TAB */}
        {activeTab === 'tasks' && tasks.map(task => (
          <div key={task.id} className="p-3 rounded-xl bg-white/60 border border-white/50 shadow-sm">
            <div className="flex justify-between items-start mb-2">
               <h4 className="text-sm font-semibold text-slate-900">{task.name}</h4>
               <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase
                 ${task.priority === 'critical' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
                 {task.priority}
               </span>
            </div>
            <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
               <div 
                 className={`h-full ${task.percentComplete < 50 ? 'bg-amber-400' : 'bg-green-500'}`} 
                 style={{ width: `${task.percentComplete}%` }}
               ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InputTabs;