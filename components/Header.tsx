import React from 'react';
import { Settings, HelpCircle, Activity } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
  approvalCount: number;
  totalActions: number;
}

const Header: React.FC<HeaderProps> = ({ onOpenSettings, approvalCount, totalActions }) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-lg bg-background/80 border-b border-gray-800 h-16 px-4 md:px-8 flex items-center justify-between">
      
      {/* Logo Area */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_15px_rgba(0,217,255,0.4)]">
          <Activity className="text-white w-5 h-5" />
        </div>
        <div>
          <h1 className="font-bold text-white tracking-wider text-sm md:text-base">PERSONAL COO</h1>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
            <span className="text-[10px] text-primary font-mono tracking-widest">SYSTEM ONLINE</span>
          </div>
        </div>
      </div>

      {/* Progress & Actions */}
      <div className="flex items-center gap-4 md:gap-6">
        {totalActions > 0 && (
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] text-gray-400 font-mono uppercase">Approvals</span>
            <div className="flex items-center gap-2">
               <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                 <div 
                   className="h-full bg-success transition-all duration-500" 
                   style={{ width: `${(approvalCount / totalActions) * 100}%` }}
                 ></div>
               </div>
               <span className="text-xs font-bold text-white font-mono">{approvalCount}/{totalActions}</span>
            </div>
          </div>
        )}

        <button className="text-gray-400 hover:text-white transition-colors">
          <HelpCircle size={20} />
        </button>
        <button 
          onClick={onOpenSettings}
          className="text-gray-400 hover:text-primary transition-colors p-2 hover:bg-white/5 rounded-full"
        >
          <Settings size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;