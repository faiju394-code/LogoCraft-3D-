import React from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
  enabled: boolean;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children, enabled }) => {
  if (!enabled) {
    return <div className="w-full h-full flex flex-col">{children}</div>;
  }

  // Format current local time (e.g. 10:20)
  const currentTime = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return (
    <div className="w-full h-full flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80">
      {/* Android Device Shell */}
      <div className="relative w-full max-w-[420px] h-[860px] max-h-[92vh] bg-slate-950 rounded-[44px] p-3 shadow-2xl border-[6px] border-slate-800 ring-1 ring-white/10 flex flex-col overflow-hidden">
        {/* Device Rim Glare */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

        {/* Android Status Bar */}
        <div className="w-full px-5 pt-1.5 pb-1 flex items-center justify-between text-[11px] text-slate-300 font-medium select-none shrink-0 z-20">
          <span>{currentTime}</span>

          {/* Centered Android Punch-Hole Camera */}
          <div className="w-3.5 h-3.5 rounded-full bg-black ring-1 ring-slate-800 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-900 border border-slate-700/50" />
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <Signal className="w-3 h-3 text-slate-300" />
            <Wifi className="w-3 h-3 text-slate-300" />
            <BatteryMedium className="w-3.5 h-3.5 text-slate-300" />
          </div>
        </div>

        {/* Inner Mobile Screen Content */}
        <div className="flex-1 w-full rounded-[32px] overflow-hidden flex flex-col bg-slate-950 relative">
          {children}
        </div>

        {/* Android Gesture Navigation Bar Pill */}
        <div className="w-full py-2 flex items-center justify-center shrink-0 z-20 select-none">
          <div className="w-32 h-1 bg-slate-600 rounded-full" />
        </div>
      </div>
    </div>
  );
};
