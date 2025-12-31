import React from 'react';
import { Action } from '../types';
import { Mail, CalendarClock, Search, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

interface ActionCardProps {
  action: Action;
  onApprove: (id: string) => void;
  onSkip: (id: string) => void;
}

const ActionCard: React.FC<ActionCardProps> = ({ action, onApprove, onSkip }) => {
  // Logic to determine icon based on action type
  const getIcon = () => {
    switch (action.type) {
      case 'reply': return <Mail className="text-white" />;
      case 'reschedule': return <CalendarClock className="text-white" />;
      case 'find-info': return <Search className="text-white" />;
      default: return <CheckCircle className="text-white" />;
    }
  };

  const getIconBg = () => {
      switch (action.type) {
        case 'reply': return 'bg-blue-500 shadow-blue-200';
        case 'reschedule': return 'bg-red-500 shadow-red-200';
        case 'find-info': return 'bg-amber-500 shadow-amber-200';
        default: return 'bg-slate-400';
      }
  };

  const isPending = action.status === 'pending';

  return (
    <div className={`
      relative overflow-hidden rounded-2xl p-5 transition-all duration-300 border
      ${action.status === 'approved' ? 'bg-emerald-50 border-emerald-200 opacity-80' : 
        action.status === 'skipped' ? 'bg-slate-50 border-slate-200 opacity-60' : 
        'bg-white/80 border-white/60 shadow-sm hover:shadow-md hover:border-blue-200 backdrop-blur-sm'}
    `}>
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className={`p-3 rounded-xl shadow-lg ${getIconBg()} flex items-center justify-center shrink-0`}>
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-bold text-slate-800 text-lg tracking-tight truncate">{action.title}</h3>
            {action.confidence === 'high' && (
              <span className="shrink-0 text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                HIGH CONFIDENCE
              </span>
            )}
            {action.confidence === 'medium' && (
              <span className="shrink-0 text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">
                CHECK
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-bold">
            {action.type.replace('-', ' ')}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mb-5 pl-[68px]">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-2 shadow-inner">
          <p className="text-sm text-slate-700 font-mono leading-relaxed">{action.draftOrDetail}</p>
        </div>
        <div className="flex gap-2 items-center text-xs text-blue-600 font-medium">
          <ArrowRight size={12} />
          <span className="italic">Why: {action.reason}</span>
        </div>
      </div>

      {/* Actions */}
      {isPending ? (
        <div className="flex gap-3 pl-[68px]">
          <button
            onClick={() => onApprove(action.id)}
            className="flex-1 bg-blue-600 text-white font-bold py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-200 flex items-center justify-center gap-2 group active:scale-95"
          >
            APPROVE
            <CheckCircle size={16} className="group-hover:scale-110 transition-transform" />
          </button>
          <button
            onClick={() => onSkip(action.id)}
            className="flex-1 bg-white border border-slate-200 text-slate-500 font-bold py-2.5 rounded-xl hover:bg-slate-50 hover:text-slate-700 transition-colors flex items-center justify-center gap-2 shadow-sm active:scale-95"
          >
            SKIP
            <XCircle size={16} />
          </button>
        </div>
      ) : (
        <div className="pl-[68px] flex items-center gap-2">
            {action.status === 'approved' ? (
                <span className="text-emerald-600 font-bold flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100"><CheckCircle size={16}/> APPROVED</span>
            ) : (
                <span className="text-slate-500 font-bold flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200"><XCircle size={16}/> SKIPPED</span>
            )}
        </div>
      )}
    </div>
  );
};

export default ActionCard;